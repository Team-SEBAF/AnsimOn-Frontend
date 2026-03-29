import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { getTimelineEvidenceDetail } from '@/api/timeline';
import type { TimelineEvidence, TimelineReferencedEvidence } from '@/types/timeline';
import type { EvidencePreviewItem } from '@/types/evidence';
import { filterValidFiles } from '../components/evidence/validate';
import type { FileCategoryKey } from '../components/evidence/constants';
import { useComplaintId } from './useComplaintId';

// ─── 공유 타입 / 상수 ─────────────────────────────────────

/** useTimelineSubmit에서도 import해서 씀 */
export type LocalFile = { id: string; file: File };

/** 타입 제한 없음 (API 스펙 참고) */
export const TIMELINE_ATTACHMENT_CONFIG = {
  maxFiles: 10,
  categories: ['IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT'] as FileCategoryKey[],
};

// ─── 기능 ────────────────────────────────────────────────

interface UseTimelineFilesParams {
  open: boolean;
  isEditMode: boolean;
  /** is_ai_original=true면 false — 파일 편집 불가 */
  canEditFiles: boolean;
  evidence?: TimelineEvidence;
}

/**
 * 타임라인 파일 상태 관리 훅
 *
 * - 수정 모드에서 서버 파일 목록 조회 (useQuery)
 * - 파일 추가 / 제거 (로컬 / 서버 분기)
 * - 제출 시 필요한 uploadFiles / deleteIds 제공
 */
export function useTimelineFiles({
  open,
  isEditMode,
  canEditFiles,
  evidence,
}: UseTimelineFilesParams) {
  const complaintId = useComplaintId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [localFiles, setLocalFiles] = useState<LocalFile[]>([]);
  const [serverFiles, setServerFiles] = useState<TimelineReferencedEvidence[]>([]);
  const [pendingDeleteIds, setPendingDeleteIds] = useState<string[]>([]);

  // 수정 모드 + 직접 추가 증거일 때만 기존 참조 증거 조회
  const { data: detailData, isLoading: isLoadingDetail } = useQuery({
    queryKey: ['timeline-evidence-detail', complaintId, evidence?.timeline_evidence_id],
    queryFn: () => getTimelineEvidenceDetail(complaintId, evidence!.timeline_evidence_id),
    enabled: open && isEditMode && canEditFiles && !!evidence,
  });

  /** 모달 열릴 때마다 로컬 파일 / 삭제 예정 목록 초기화 */
  useEffect(() => {
    if (!open) return;
    setLocalFiles([]);
    setPendingDeleteIds([]);
  }, [open]);

  /** 서버 파일 목록 — detailData 로드 완료 시 세팅 */
  useEffect(() => {
    if (!open || !detailData) return;
    setServerFiles(detailData.evidences);
  }, [open, detailData]);

  /** 파일 추가 — 타입·크기·길이·개수 검증 후 임시 ID 부여 */
  const addFiles = async (files: File[]) => {
    const { valid, rejected } = await filterValidFiles(
      files,
      TIMELINE_ATTACHMENT_CONFIG,
      localFiles.length + serverFiles.length,
    );
    if (rejected.length > 0) {
      toast.error(`${rejected.length}개 파일은 업로드할 수 없습니다.`);
    }
    setLocalFiles((prev) => [...prev, ...valid.map((file) => ({ id: crypto.randomUUID(), file }))]);
  };

  /** 파일 제거 — 로컬이면 즉시 삭제, 서버면 삭제 예약 + 낙관적 UI 제거 */
  const removeFile = (id: string) => {
    if (localFiles.some((f) => f.id === id)) {
      setLocalFiles((prev) => prev.filter((f) => f.id !== id));
    } else {
      setPendingDeleteIds((prev) => [...prev, id]);
      setServerFiles((prev) => prev.filter((f) => f.referenced_id !== id));
    }
  };

  /** EvidenceContent용 통일 형식 — 서버 파일 + 로컬 파일 합산 */
  const attachmentItems: EvidencePreviewItem[] = [
    ...serverFiles.map((f) => ({
      id: f.referenced_id,
      filename: f.filename,
      sizeBytes: f.size_bytes,
    })),
    ...localFiles.map(({ id, file }) => ({ id, filename: file.name, sizeBytes: file.size })),
  ];

  return {
    fileInputRef,
    attachmentItems,
    isLoadingDetail,
    addFiles,
    removeFile,
    /** 제출 시 업로드할 신규 파일 */
    getUploadFiles: () => localFiles,
    /** 제출 시 삭제할 서버 파일 ID 목록 */
    getDeleteIds: () => pendingDeleteIds,
  };
}
