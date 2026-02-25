'use client';

import { useState } from 'react';
import { Spinner } from '@/components/Spinner';
import { ImagePreview } from './ImagePreview';
import { FilePreview } from './FilePreview';

/** 프리뷰 표시 방식 */
type PreviewType = 'image' | 'file';

interface EvidenceContentProps {
  /** 프리뷰 표시 방식 (image: 썸네일, file: 파일명+크기) */
  previewType?: PreviewType;
  /** 현재 선택된 파일 목록 */
  files: File[];
  /** 파일 추가 시 콜백 (드래그앤드롭) */
  onFilesAdd: (files: File[]) => void;
  /** 파일 삭제 시 콜백 */
  onFileRemove: (index: number) => void;
  /** 빈 상태 클릭 시 파일 선택 창을 여는 콜백 (EvidenceCard의 hidden input 트리거) */
  onClickUpload: () => void;
  /** 업로드 중 상태 */
  isUploading?: boolean;
}

/**
 * 증거 파일 콘텐츠 영역
 *
 * - 빈 상태: 드래그앤드롭 / 클릭으로 업로드 유도
 * - 로딩 상태: 스피너 표시
 * - 파일 있음: previewType에 따라 ImagePreview 또는 FilePreview 표시
 *
 * 파일 제한(accept, maxFiles, maxSize 등)은 증거 타입별로 다르므로
 * 상위 컴포넌트(EvidenceCard)에서 EVIDENCE_CONFIG 상수를 통해 주입받습니다.
 * 파일 선택 input도 EvidenceCard에서 관리하며, 빈 상태 클릭 시 onClickUpload로 트리거합니다.
 * @see {@link ../constants.ts} EVIDENCE_CONFIG
 */
export function EvidenceContent({
  previewType = 'file',
  files,
  onFilesAdd,
  onFileRemove,
  onClickUpload,
  isUploading = false,
}: EvidenceContentProps) {
  /** 드래그 오버 상태 — true면 테두리/배경 강조 */
  const [isDragOver, setIsDragOver] = useState(false);

  /** 드롭 시 파일 처리 + 드래그 상태 해제 */
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) onFilesAdd(droppedFiles);
  };

  /** 드래그 오버 시 기본 동작 방지 + 강조 표시 */
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  /** 드래그 영역 벗어나면 강조 해제 */
  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const hasFiles = files.length > 0;

  return (
    <div className={hasFiles ? '' : 'flex-1'}>
      {/* 빈 상태 — 드래그앤드롭/클릭 영역 */}
      {!hasFiles && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={onClickUpload}
          className={`bg-bg-2 flex h-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-[1.5px] border-dashed px-6 py-9 transition ${
            isDragOver ? 'border-primary bg-primary/5' : 'border-gray-200'
          }`}
        >
          {isUploading ? (
            <Spinner size="lg" label="파일 업로드 중" />
          ) : (
            <div className="flex flex-col items-center">
              <p className="typo-heading-4 text-gray-400">증거업로드</p>
              <p className="typo-heading-6 text-gray-400">
                클릭하거나 드래그앤드롭으로 자료를 업로드해주세요.
              </p>
            </div>
          )}
        </div>
      )}

      {/* 파일 있음 — 프리뷰 표시 */}
      {hasFiles && (
        <div className={previewType === 'image' ? 'grid grid-cols-4 gap-2' : 'flex flex-col gap-2'}>
          {files.map((file, index) =>
            previewType === 'image' ? (
              // TODO: API 연결 후 file prop 대신 src(서버 URL)로 전환
              <ImagePreview
                key={`${file.name}-${index}`}
                file={file}
                size="fill"
                showFileName
                onRemove={() => onFileRemove(index)}
              />
            ) : (
              <FilePreview
                key={`${file.name}-${index}`}
                name={file.name}
                size={file.size}
                onRemove={() => onFileRemove(index)}
              />
            ),
          )}
        </div>
      )}
    </div>
  );
}
