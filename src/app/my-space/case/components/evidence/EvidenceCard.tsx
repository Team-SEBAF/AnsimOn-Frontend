'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import CommitOutlineIcon from '@/assets/icons/CommitOutlineIcon.svg';
import HelpCircleOutlineIcon from '@/assets/icons/HelpCircleOutlineIcon.svg';
import { Button } from '@/components/Button';
import { EvidenceContent } from './EvidenceContent';
import type { EvidenceType } from './constants';
import { EVIDENCE_CONFIG } from './constants';
import { filterValidFiles } from './validate';

interface EvidenceCardProps {
  /** 증거 타입 (MESSAGE, VOICE 등) */
  type: EvidenceType;
  /** 외부에서 전달하는 추가 스타일 */
  className?: string;
}

/**
 * 증거 타입별 업로드 카드
 *
 * - Header: 아이콘 + 타이틀 + 설명
 * - Contents: EvidenceContent (드래그앤드롭/클릭/프리뷰)
 * - Footer: 개수 뱃지 + 업로드 버튼
 *
 * 파일 선택 input을 하나만 소유하며,
 * 빈 상태 클릭(EvidenceContent)과 푸터 버튼 모두 같은 input을 트리거합니다.
 */
export function EvidenceCard({ type, className }: EvidenceCardProps) {
  const config = EVIDENCE_CONFIG[type];
  // TODO: API 연결 시 로컬 state → React Query(useEvidence 훅)로 교체
  // - files: useQuery로 서버 증거 목록 조회
  // - handleFilesAdd: useMutation(presigned URL → S3 PUT → register)
  // - handleFileRemove: useMutation(DELETE /evidences/:id)
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  /** 파일 추가 — 개수·타입·크기 제한 적용 후 state에 추가 */
  const handleFilesAdd = (newFiles: File[]) => {
    setFiles((prev) => {
      const valid = filterValidFiles(newFiles, config, prev.length);
      return valid.length > 0 ? [...prev, ...valid] : prev;
    });
  };

  /** 파일 삭제 */
  const handleFileRemove = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  /** hidden input 트리거 — 빈 상태 클릭, 푸터 버튼 모두 이 함수를 사용 */
  const openFilePicker = () => inputRef.current?.click();

  return (
    <div
      className={`flex min-h-40 flex-col gap-6 rounded-2xl border border-gray-200 px-7 py-6 shadow-[0px_20px_50px_-5px_#4040400D] ${files.length === 0 ? 'flex-1' : ''} ${className ?? ''}`}
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
        files={files}
        onFilesAdd={handleFilesAdd}
        onFileRemove={handleFileRemove}
        onClickUpload={openFilePicker}
      />

      {/* Footer */}
      <div className="typo-btn-2text-gray-700 flex items-center justify-between">
        <span className="rounded-full bg-gray-100 px-3 py-1">
          {files.length}/{config.maxFiles}개
        </span>
        <Button color="secondary" size="lg" onClick={openFilePicker}>
          <span className="flex items-center gap-2">
            <CommitOutlineIcon className="h-6 w-6" />
            증거 업로드
          </span>
        </Button>
      </div>

      {/* 파일 선택 input — 카드 내 input. 빈 상태 클릭 + 푸터 버튼 모두 이 input을 트리거 */}
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
