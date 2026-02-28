'use client';

import { useRef } from 'react';
import Image from 'next/image';
import CommitOutlineIcon from '@/assets/icons/CommitOutlineIcon.svg';
import HelpCircleOutlineIcon from '@/assets/icons/HelpCircleOutlineIcon.svg';
import { Button } from '@/components/Button';
import { EvidenceContent } from './EvidenceContent';
import type { EvidenceType } from '@/types/evidence';
import { EVIDENCE_CONFIG } from './constants';
import { filterValidFiles } from './validate';
import { useEvidencePreviews, useUploadEvidence, useDeleteEvidence } from '../../hooks/useEvidence';

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
export function EvidenceCard({ type, complaintId, className }: EvidenceCardProps) {
  const config = EVIDENCE_CONFIG[type];
  const inputRef = useRef<HTMLInputElement>(null);

  // React Query 훅
  const { data } = useEvidencePreviews(complaintId, type);
  const upload = useUploadEvidence(complaintId, type);
  const remove = useDeleteEvidence(complaintId, type);

  const items = data?.items ?? [];
  const totalCount = data?.totalCount ?? 0;

  /** 파일 추가 — 프론트 검증 후 업로드 mutation 호출 */
  const handleFilesAdd = async (newFiles: File[]) => {
    const valid = await filterValidFiles(newFiles, config, totalCount);
    if (valid.length > 0) upload.mutate(valid);
  };

  /** 증거 삭제 */
  const handleRemove = (id: string) => {
    remove.mutate([id]);
  };

  /** hidden input 트리거 */
  const openFilePicker = () => inputRef.current?.click();

  return (
    <div
      className={`flex min-h-40 flex-col gap-6 rounded-2xl border border-gray-200 px-7 py-6 shadow-[0px_20px_50px_-5px_#4040400D] ${items.length === 0 ? 'flex-1' : ''} ${className ?? ''}`}
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
        onClickUpload={openFilePicker}
        isUploading={upload.isPending}
      />

      {/* Footer */}
      <div className="typo-btn-2text-gray-700 flex items-center justify-between">
        <span className="rounded-full bg-gray-100 px-3 py-1">
          {totalCount}/{config.maxFiles}개
        </span>
        <Button color="secondary" size="lg" onClick={openFilePicker}>
          <span className="flex items-center gap-2">
            <CommitOutlineIcon className="h-6 w-6" />
            증거 업로드
          </span>
        </Button>
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
    </div>
  );
}
