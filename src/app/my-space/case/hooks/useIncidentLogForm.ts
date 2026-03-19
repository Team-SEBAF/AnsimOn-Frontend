import { useEffect, useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  uploadToS3,
  getIncidentLogAttachmentPresignedUrls,
  registerIncidentLogAttachments,
  deleteIncidentLogAttachments,
} from '@/api/evidence';
import type {
  IncidentLogAttachment,
  IncidentLogFormDataResponse,
  EvidencePreviewItem,
} from '@/types/evidence';
import { EVIDENCE_CONFIG } from '../components/evidence/constants';
import { filterValidFiles, buildPresignedUrlItems } from '../components/evidence/validate';
import { useUploadIncidentLogFormData, useUpdateIncidentLogFormData } from './useEvidence';
import { getTodayString } from '@/utils/date';

// ─── 검증 ────────────────────────────────────────────────

export const incidentLogSchema = z.object({
  filename: z.string().min(1, '제목을 입력해주세요'),
  date: z.string().min(1, '날짜를 선택해주세요'),
  time: z.string().min(1, '시간을 입력해주세요'),
  location: z.string().min(1, '장소를 입력해주세요'),
  description: z.string().min(1, '상황을 입력해주세요'),
});

export type IncidentLogFormValues = z.infer<typeof incidentLogSchema>;

/** 로컬 파일에 안정적인 임시 ID를 부여해 삭제 시 인덱스 충돌을 방지함 */
type LocalFile = { id: string; file: File };

const config = EVIDENCE_CONFIG.INCIDENT_LOG;

/** presigned URL 발급 → S3 업로드 → 서버 등록 */
async function uploadAttachments(
  complaintId: string,
  incidentLogId: string,
  localFiles: { id: string; file: File }[],
) {
  const files = localFiles.map((f) => f.file);
  const presignedUrlItems = await buildPresignedUrlItems(files, config.categories);

  const { items: presignedItems } = await getIncidentLogAttachmentPresignedUrls(
    complaintId,
    incidentLogId,
    { items: presignedUrlItems },
  );

  await Promise.all(presignedItems.map((p, i) => uploadToS3(p.url, files[i])));

  await registerIncidentLogAttachments(complaintId, incidentLogId, {
    items: presignedItems.map((p) => ({
      attachmentId: p.attachment_id,
      filename: p.filename,
    })),
  });
}

// ─── 기능 ────────────────────────────────────────────────

interface UseIncidentLogFormParams {
  open: boolean;
  onClose: () => void;
  complaintId: string | undefined;
  initialData?: IncidentLogFormDataResponse;
}

/**
 * 사건일지 작성 모달 로직 훅
 *
 * - 폼 상태 관리 (react-hook-form)
 * - 첨부파일 추가/제거 (로컬 + 서버)
 * - 제출 시 폼 데이터 업로드 → 첨부파일 일괄 삭제 → 신규 파일 업로드
 */
export function useIncidentLogForm({
  open,
  onClose,
  complaintId,
  initialData,
}: UseIncidentLogFormParams) {
  const today = getTodayString();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [localFiles, setLocalFiles] = useState<LocalFile[]>([]);
  const [serverAttachments, setServerAttachments] = useState<IncidentLogAttachment[]>([]);
  const [pendingDeleteIds, setPendingDeleteIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<IncidentLogFormValues>({
    resolver: zodResolver(incidentLogSchema),
    mode: 'onChange',
    defaultValues: {
      filename: `${today} 사건일지`,
      date: today,
      time: '00:00',
      location: '',
      description: '',
    },
  });

  const descriptionLength = useWatch({ control: form.control, name: 'description' }).length;
  const uploadFormData = useUploadIncidentLogFormData(complaintId);
  const updateFormData = useUpdateIncidentLogFormData(complaintId);

  const isEditMode = !!initialData;
  const isChanged = form.formState.isDirty || localFiles.length > 0 || pendingDeleteIds.length > 0;

  /** 모달 열릴 때마다 상태 초기화 (수정 모드면 기존 데이터로 채움) */
  useEffect(() => {
    if (!open) return;
    setServerAttachments(initialData?.attachments ?? []);
    setPendingDeleteIds([]);
    setLocalFiles([]);
    form.reset({
      filename: initialData?.filename ?? `${today} 사건일지`,
      date: initialData?.date ?? today,
      time: initialData?.time ?? '00:00',
      location: initialData?.location ?? '',
      description: initialData?.description ?? '',
    });
    // open이 true로 바뀔 때만 초기화하면 되므로 의도적으로 의존성 생략
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  /** 새 파일 추가 — 카테고리별 크기·길이 검증 후 임시 ID 부여 */
  const handleFilesAdd = async (files: File[]) => {
    const { valid } = await filterValidFiles(
      files,
      { ...config, maxFiles: 10 },
      localFiles.length + serverAttachments.length,
    );
    setLocalFiles((prev) => [...prev, ...valid.map((file) => ({ id: crypto.randomUUID(), file }))]);
  };

  /** 파일 제거 — 로컬이면 상태에서 삭제, 서버면 삭제 예정 목록에 추가 */
  const handleAttachmentRemove = (id: string) => {
    if (localFiles.some((f) => f.id === id)) {
      setLocalFiles((prev) => prev.filter((f) => f.id !== id));
    } else {
      setPendingDeleteIds((prev) => [...prev, id]);
      setServerAttachments((prev) => prev.filter((a) => a.attachment_id !== id));
    }
  };

  /** 서버 첨부파일 + 로컬 파일을 EvidenceContent용 통일 형식으로 변환 */
  const attachmentItems: EvidencePreviewItem[] = [
    ...serverAttachments.map((a) => ({
      id: a.attachment_id,
      filename: a.filename,
      sizeBytes: a.size_bytes,
    })),
    ...localFiles.map(({ id, file }) => ({
      id,
      filename: file.name,
      sizeBytes: file.size,
    })),
  ];

  const onSubmit = async (values: IncidentLogFormValues) => {
    setIsSubmitting(true);
    try {
      const { incident_log_id } = isEditMode
        ? await updateFormData.mutateAsync({
            incidentLogId: initialData.incident_log_id,
            payload: values,
          })
        : await uploadFormData.mutateAsync(values);

      if (complaintId) {
        // 삭제 예정 첨부파일 일괄 삭제
        if (pendingDeleteIds.length > 0) {
          await deleteIncidentLogAttachments(incident_log_id, {
            attachmentIds: pendingDeleteIds,
          });
        }

        // 신규 첨부파일 업로드 (presigned URL → S3 → register)
        if (localFiles.length > 0) {
          await uploadAttachments(complaintId, incident_log_id, localFiles);
        }
      }

      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    // Refs
    fileInputRef,

    // 폼
    form,
    descriptionLength,

    // 첨부파일
    attachmentItems,
    config,

    // 상태
    isEditMode,
    isChanged,
    isSubmitting,

    // 핸들러
    handleFilesAdd,
    handleAttachmentRemove,
    onSubmit,
  };
}
