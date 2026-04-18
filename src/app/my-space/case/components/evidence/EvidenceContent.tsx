'use client';

import { useState } from 'react';
import { Spinner } from '@/components/Spinner';
import { ImagePreview } from './ImagePreview';
import { FilePreview } from './FilePreview';
import type { EvidencePreviewItem } from '@/types/evidence';
import { formatDuration } from '@/utils/format';
import { getCategoryKeyFromFilename } from './constants';

/** 프리뷰 표시 방식 */
type PreviewType = 'image' | 'file' | 'mixed';

interface EvidenceContentProps {
  /** 프리뷰 표시 방식 (image: 썸네일, file: 파일명+크기, mixed: 확장자 기준 자동 분기) */
  previewType?: PreviewType;
  /** mixed 모드에서 로컬 파일 blob URL 썸네일 참조용 */
  localFileMap?: Record<string, File>;
  /** 서버에서 가져온 프리뷰 아이템 목록 */
  items: EvidencePreviewItem[];
  /** 파일 추가 시 콜백 (드래그앤드롭) */
  onFilesAdd: (files: File[]) => void;
  /** 증거 삭제 시 콜백 */
  onRemove: (id: string) => void;
  /** 수정 버튼 클릭 시 콜백. isEditable 아이템에서만 hover 시 표시 */
  onEdit?: (id: string) => void;
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
 */
export function EvidenceContent({
  previewType = 'file',
  items,
  localFileMap = {},
  onFilesAdd,
  onRemove,
  onEdit,
  onClickUpload,
  isUploading = false,
}: EvidenceContentProps) {
  /** 드래그 오버 상태 — true면 테두리/배경 강조 */
  const [isDragOver, setIsDragOver] = useState(false);
  const canUpload = !isUploading;

  /** 드롭 시 파일 처리 + 드래그 상태 해제 */
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (canUpload && e.dataTransfer.files.length > 0) onFilesAdd(Array.from(e.dataTransfer.files));
  };

  /** 드래그 오버 시 기본 동작 방지 + 강조 표시 */
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(canUpload);
  };

  /** 드래그 영역 벗어나면 강조 해제 */
  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const hasItems = items.length > 0;

  return (
    <div className={hasItems ? '' : 'flex-1'}>
      {/* 빈 상태 — 드래그앤드롭/클릭 영역 */}
      {!hasItems && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={canUpload ? onClickUpload : undefined}
          className={`bg-bg-2 flex h-full flex-col items-center justify-center gap-2 rounded-lg border-[1.5px] border-dashed px-6 py-9 transition ${
            canUpload ? 'cursor-pointer' : 'cursor-default'
          } ${isDragOver ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
        >
          {isUploading ? (
            <Spinner size="lg" className="text-gray-400" label="파일 업로드 중" />
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

      {/* 프리뷰 표시 */}
      {hasItems && previewType !== 'mixed' && (
        <div className={previewType === 'image' ? 'grid grid-cols-4 gap-2' : 'flex flex-col gap-2'}>
          {items.map((item, index) =>
            previewType === 'image' ? (
              <ImagePreview
                key={item.id}
                src={item.thumbnailUrl}
                alt={item.filename ?? `이미지 ${index + 1}`}
                size="fill"
                showFileName
                duration={item.durationSeconds ? formatDuration(item.durationSeconds) : undefined}
                onRemove={() => onRemove(item.id)}
              />
            ) : (
              <FilePreview
                key={item.id}
                name={item.filename ?? '파일'}
                size={item.sizeBytes ?? 0}
                action={{ type: 'remove', onRemove: () => onRemove(item.id) }}
                onEdit={item.isEditable && onEdit ? () => onEdit(item.id) : undefined}
              />
            ),
          )}
        </div>
      )}

      {/* mixed 프리뷰 — IMAGE/VIDEO는 상단 그리드, 나머지는 하단 리스트 */}
      {hasItems &&
        previewType === 'mixed' &&
        (() => {
          const imageItems = items.filter((item) => {
            const cat = getCategoryKeyFromFilename(item.filename ?? '');
            return cat === 'IMAGE' || cat === 'VIDEO';
          });
          const fileItems = items.filter((item) => {
            const cat = getCategoryKeyFromFilename(item.filename ?? '');
            return cat !== 'IMAGE' && cat !== 'VIDEO';
          });
          return (
            <div className="flex flex-col gap-2">
              {imageItems.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {imageItems.map((item, index) => (
                    <ImagePreview
                      key={item.id}
                      file={localFileMap[item.id]}
                      src={item.thumbnailUrl}
                      alt={item.filename ?? `이미지 ${index + 1}`}
                      size="fill"
                      showFileName
                      duration={
                        item.durationSeconds ? formatDuration(item.durationSeconds) : undefined
                      }
                      onRemove={() => onRemove(item.id)}
                    />
                  ))}
                </div>
              )}
              {fileItems.length > 0 && (
                <div className="flex flex-col gap-2">
                  {fileItems.map((item) => (
                    <FilePreview
                      key={item.id}
                      name={item.filename ?? '파일'}
                      size={item.sizeBytes ?? 0}
                      action={{ type: 'remove', onRemove: () => onRemove(item.id) }}
                      onEdit={item.isEditable && onEdit ? () => onEdit(item.id) : undefined}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })()}
    </div>
  );
}
