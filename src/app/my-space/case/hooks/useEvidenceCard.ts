import { useRef, useState } from 'react';
import { EVIDENCE_CONFIG } from '../components/evidence/constants';
import { filterValidFiles } from '../components/evidence/validate';
import { useEvidencePreviews, useUploadEvidence, useDeleteEvidence } from './useEvidence';
import type { EvidenceType } from '@/types/evidence';

/**
 * 증거 카드 로직 훅
 *
 * - React Query 호출 및 상태 관리
 * - 파일 업로드/삭제 핸들러
 * - 삭제 확인 모달 상태
 */
export function useEvidenceCard(complaintId: string | undefined, type: EvidenceType) {
  const config = EVIDENCE_CONFIG[type];
  const inputRef = useRef<HTMLInputElement>(null);

  // 삭제 확인 모달 상태
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // React Query 훅
  const { data } = useEvidencePreviews(complaintId, type);
  const upload = useUploadEvidence(complaintId, type);
  const remove = useDeleteEvidence(complaintId, type);

  const items = data?.items ?? [];
  const totalCount = data?.totalCount ?? 0;
  const isFull = totalCount >= config.maxFiles;

  /** 파일 추가 — 프론트 검증 후 업로드 mutation 호출 */
  const handleFilesAdd = async (newFiles: File[]) => {
    if (isFull) return; // 개수 초과 시 업로드 차단
    const valid = await filterValidFiles(newFiles, config, totalCount);
    if (valid.length > 0) upload.mutate(valid);
  };

  /** 증거 삭제 - 모달 열기 */
  const handleRemove = (id: string) => {
    setDeleteTargetId(id);
    setDeleteModalOpen(true);
  };

  /** 삭제 확인 */
  const confirmDelete = () => {
    if (deleteTargetId) {
      remove.mutate([deleteTargetId]);
    }
    setDeleteModalOpen(false);
    setDeleteTargetId(null);
  };

  /** 삭제 취소 */
  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setDeleteTargetId(null);
  };

  /** hidden input 트리거 */
  const openFilePicker = () => inputRef.current?.click();

  return {
    // Refs
    inputRef,

    // 상태
    config,
    items,
    totalCount,
    isFull,
    isUploading: upload.isPending,

    // 모달 상태
    deleteModalOpen,
    setDeleteModalOpen,

    // 핸들러
    handleFilesAdd,
    handleRemove,
    confirmDelete,
    cancelDelete,
    openFilePicker,
  };
}
