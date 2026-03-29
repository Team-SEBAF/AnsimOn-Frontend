import { useState } from 'react';
import { uploadToS3 } from '@/api/evidence';
import {
  getManualReferencedEvidencePresignedUrls,
  registerManualReferencedEvidences,
  deleteManualReferencedEvidences,
} from '@/api/timeline';
import { buildPresignedUrlItems } from '../components/evidence/validate';
import type { TimelineEvidence, TimelineTag } from '@/types/timeline';
import type { TimelineFormValues } from './useTimelineForm';
import { type LocalFile, TIMELINE_ATTACHMENT_CONFIG } from './useTimelineFiles';
import { useCreateTimelineEvidence, useUpdateTimelineEvidence } from './useTimeline';
import { useComplaintId } from './useComplaintId';

// ─── 타입 ────────────────────────────────────────────────

export interface SubmitParams {
  formValues: TimelineFormValues;
  tags: TimelineTag[];
  uploadFiles: LocalFile[];
  deleteIds: string[];
}

interface UseTimelineSubmitParams {
  mode: 'add' | 'edit';
  canEditFiles: boolean;
  evidence?: TimelineEvidence;
  onClose: () => void;
}

// ─── 기능 ────────────────────────────────────────────────

/**
 * 타임라인 제출 흐름 훅
 *
 * 추가: create → 파일 업로드
 * 수정: update → 파일 삭제 → 파일 업로드
 *
 * - 파일 업로드는 presigned URL → S3 PUT → register 3단계
 * - canEditFiles=false(AI 원본)면 파일 관련 API 전부 건너뜀
 */
export function useTimelineSubmit({
  mode,
  canEditFiles,
  evidence,
  onClose,
}: UseTimelineSubmitParams) {
  const complaintId = useComplaintId();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createEvidence = useCreateTimelineEvidence();
  const updateEvidence = useUpdateTimelineEvidence();

  const submit = async ({ formValues, tags, uploadFiles, deleteIds }: SubmitParams) => {
    setIsSubmitting(true);
    try {
      const payload = { ...formValues, tags };

      // 1단계: 폼 데이터 저장 → timeline_evidence_id 획득
      const { timeline_evidence_id } =
        mode === 'edit'
          ? await updateEvidence.mutateAsync({
              timelineEvidenceId: evidence!.timeline_evidence_id,
              payload,
            })
          : await createEvidence.mutateAsync(payload);

      if (canEditFiles) {
        // 2단계: 삭제 예정 참조 증거 일괄 삭제
        if (deleteIds.length > 0) {
          await deleteManualReferencedEvidences(complaintId, timeline_evidence_id, {
            referencedManualEvidenceIds: deleteIds,
          });
        }

        // 3단계: 신규 파일 업로드 (presigned URL → S3 → register)
        if (uploadFiles.length > 0) {
          const files = uploadFiles.map((f) => f.file);
          const presignedUrlItems = await buildPresignedUrlItems(
            files,
            TIMELINE_ATTACHMENT_CONFIG.categories,
          );

          const { items: presignedItems } = await getManualReferencedEvidencePresignedUrls(
            complaintId,
            timeline_evidence_id,
            { items: presignedUrlItems },
          );

          await Promise.all(presignedItems.map((p, i) => uploadToS3(p.url, files[i])));

          await registerManualReferencedEvidences(complaintId, timeline_evidence_id, {
            items: presignedItems.map((p) => ({
              referencedManualEvidenceId: p.referenced_manual_evidence_id,
              filename: p.filename,
            })),
          });
        }
      }

      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submit, isSubmitting };
}
