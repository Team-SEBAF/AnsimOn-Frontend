'use client';

import { useState } from 'react';
import Image from 'next/image';
import HelpCircleOutlineIcon from '@/assets/icons/HelpCircleOutlineIcon.svg';
import QuoteOutlineIcon from '@/assets/icons/QuoteOutlineIcon.svg';
import UploadIcon from '@/assets/icons/UploadIcon.svg';
import { Button } from '@/components/Button';
import { Modal } from '@/components/modals/Modal';
import { UploadErrorModal } from './UploadErrorModal';
import { IncidentLogFormModal } from './IncidentLogFormModal';
import { EvidenceContent } from './EvidenceContent';
import type { EvidenceType, IncidentLogFormDataResponse } from '@/types/evidence';
import { useEvidenceCard } from '../../hooks/useEvidenceCard';
import { getIncidentLogFormData } from '@/api/evidence';

interface EvidenceCardProps {
  /** 증거 타입 (MESSAGE, VOICE 등) */
  type: EvidenceType;
  /** 고소장 ID (React Query 훅에 전달) */
  complaintId: string | undefined;
  /** 외부에서 전달하는 추가 스타일 */
  className?: string;
}

/**
 * 증거 타입별 업로드 카드
 *
 * - Header: 아이콘 + 타이틀 + 설명
 * - Contents: EvidenceContent (드래그앤드롭/클릭/프리뷰)
 * - Footer: 개수 뱃지 + 업로드 버튼
 */
type FormModalState = { open: false } | { open: true; initialData?: IncidentLogFormDataResponse };

export function EvidenceCard({ type, complaintId, className }: EvidenceCardProps) {
  const [formModal, setFormModal] = useState<FormModalState>({ open: false });

  const handleEdit = async (id: string) => {
    const data = await getIncidentLogFormData(id);
    setFormModal({ open: true, initialData: data });
  };
  const {
    inputRef,
    config,
    items,
    totalCount,
    isFull,
    isUploading,
    deleteModalOpen,
    setDeleteModalOpen,
    uploadErrorFiles,
    setUploadErrorFiles,
    handleFilesAdd,
    handleRemove,
    confirmDelete,
    cancelDelete,
    openFilePicker,
  } = useEvidenceCard(complaintId, type);

  return (
    <div
      className={`flex min-h-40 flex-col gap-6 rounded-2xl border border-gray-200 px-7 py-6 shadow-[0px_20px_50px_-5px_#4040400D] transition-all duration-300 ${items.length === 0 ? 'flex-1' : ''} ${className ?? ''}`}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <Image src={config.icon} alt={config.title} width={40} height={40} />
        <div className="space-y-1">
          <span className="flex items-center gap-1">
            <h3 className="typo-heading- text-gray-800">{config.title}</h3>
            <Button variant="ghost" color="contrast" size="sm" rounded="full">
              <HelpCircleOutlineIcon className="h-6 w-6" />
            </Button>
          </span>
          <p className="typo-body-8 text-gray-400">{config.description}</p>
        </div>
      </div>

      {/* Contents */}
      <EvidenceContent
        previewType={config.previewType}
        items={items}
        onFilesAdd={handleFilesAdd}
        onRemove={handleRemove}
        onEdit={type === 'INCIDENT_LOG' ? handleEdit : undefined}
        onClickUpload={openFilePicker}
        isUploading={isUploading}
      />

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className="typo-btn-2 rounded-full bg-gray-100 px-3 py-1 text-gray-700">
          {totalCount}/{config.maxFiles}개
        </span>
        <div className="flex items-center gap-2">
          {type === 'INCIDENT_LOG' && (
            <Button color="contrast" size="lg" onClick={() => setFormModal({ open: true })}>
              <span className="flex items-center gap-2">
                <QuoteOutlineIcon className="h-6 w-6" />
                직접 작성
              </span>
            </Button>
          )}
          <Button
            color="secondary"
            size="lg"
            onClick={openFilePicker}
            disabled={isFull || isUploading}
          >
            <span className="flex items-center gap-2">
              <UploadIcon className="h-4 w-4" />
              증거 업로드
            </span>
          </Button>
        </div>
      </div>

      {/* 파일 선택 input */}
      <input
        ref={inputRef}
        type="file"
        accept={config.accept}
        multiple
        onChange={(e) => {
          if (e.target.files) handleFilesAdd(Array.from(e.target.files));
          e.target.value = '';
        }}
        className="hidden"
      />

      {/* 사건일지 직접 작성 모달 */}
      {type === 'INCIDENT_LOG' && (
        <IncidentLogFormModal
          open={formModal.open}
          onClose={() => setFormModal({ open: false })}
          complaintId={complaintId}
          initialData={formModal.open ? formModal.initialData : undefined}
        />
      )}

      {/* 업로드 실패 모달 */}
      <UploadErrorModal
        open={uploadErrorFiles.length > 0}
        onClose={() => setUploadErrorFiles([])}
        files={uploadErrorFiles}
      />

      {/* 삭제 확인 모달 */}
      <Modal.Root open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <Modal.Header
          title="증거 삭제"
          subTitle={
            <>
              삭제된 증거는 다시 되돌릴 수 없어요.
              <br />
              정말 삭제하시겠어요?
            </>
          }
        />
        <Modal.Footer direction="row" full>
          <Button color="secondary" size="xl" onClick={cancelDelete}>
            취소하기
          </Button>
          <Button color="danger" size="xl" onClick={confirmDelete}>
            삭제하기
          </Button>
        </Modal.Footer>
      </Modal.Root>
    </div>
  );
}
