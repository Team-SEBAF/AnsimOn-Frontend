import { useRef, useState } from 'react';
import { EVIDENCE_CONFIG } from '../components/evidence/constants';
import { filterValidFiles } from '../components/evidence/validate';
import { useEvidencePreviews, useUploadEvidence, useDeleteEvidence } from './useEvidence';
import { showAlert } from '@/utils/alert';
import type { EvidenceType } from '@/types/evidence';

/**
 * 증거 카드 로직 훅
 *
 * - React Query 호출 및 상태 관리
 * - 파일 업로드/삭제 핸들러
 * - 삭제 확인 모달 상태
 */
export function useEvidenceCard(complaintId: string, type: EvidenceType) {
  const config = EVIDENCE_CONFIG[type];
  const inputRef = useRef<HTMLInputElement>(null);

  // 삭제 확인 모달 상태
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // 업로드 실패 모달 상태
  const [uploadErrorFiles, setUploadErrorFiles] = useState<File[]>([]);

  // React Query 훅
  const { data } = useEvidencePreviews(complaintId, type);
  const upload = useUploadEvidence(complaintId, type);
  const remove = useDeleteEvidence(complaintId, type);

  const items = data.items;
  const totalCount = data.totalCount;
  const isFull = totalCount >= config.maxFiles;

  /** 파일 추가 — 중복 검사 → 프론트 검증 → 업로드 mutation 호출 */
  const handleFilesAdd = async (newFiles: File[]) => {
    if (isFull) return;

    // 파일명 중복 검사 (서버 목록 + 배치 내 중복)
    const newNames = newFiles.map((f) => f.name);
    const hasBatchDuplicate = newNames.length !== new Set(newNames).size;
    const hasServerDuplicate = newFiles.some((f) => items.some((item) => item.filename === f.name));
    if (hasBatchDuplicate || hasServerDuplicate) {
      showAlert.error({
        title: '이미 업로드 된 파일입니다.',
        description: '같은 파일명의 파일이 존재합니다. 파일명 확인 후 재업로드해주세요',
      });
      return;
    }

    const { valid, rejected } = await filterValidFiles(newFiles, config, totalCount);
    if (rejected.length > 0) setUploadErrorFiles(rejected);
    if (valid.length > 0) {
      upload.mutate(valid, {
        onError: () => {
          showAlert.error({
            title: '파일 업로드에 실패했습니다',
            description:
              '다시한번 진행해주시길 바라며, 문제가 반복되는 경우 왼쪽 하단 문의하기를 통해 전달해주시길 바랍니다.',
          });
        },
      });
    }
  };

  /** 증거 삭제 - 모달 열기 */
  const handleRemove = (id: string) => {
    setDeleteTargetId(id);
    setDeleteModalOpen(true);
  };

  /** 삭제 확인 */
  const confirmDelete = () => {
    if (deleteTargetId) {
      remove.mutate([deleteTargetId], {
        onError: () => {
          showAlert.error({
            title: '증거 삭제에 실패했습니다',
            description: '잠시 후 다시 시도해주세요.',
          });
        },
      });
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
    uploadErrorFiles,
    setUploadErrorFiles,

    // 핸들러
    handleFilesAdd,
    handleRemove,
    confirmDelete,
    cancelDelete,
    openFilePicker,
  };
}
