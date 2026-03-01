'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import TrashOutlineIcon from '@/assets/icons/TrashOutlineIcon.svg';
import imageFallback from '@/assets/image-fallback.png';

type PreviewSize = 'sm' | 'md' | 'lg' | 'fill';

const sizeStyles: Record<PreviewSize, string> = {
  sm: 'h-25 w-25',
  md: 'h-30 w-30',
  lg: 'h-38 w-38',
  fill: 'aspect-square w-full',
};

interface ImagePreviewProps {
  /** 로컬 파일 객체 (blob URL 생성) */
  file?: File;
  /** 서버 이미지 URL (file과 둘 중 하나 필수) */
  src?: string;
  /** 썸네일 크기 (sm: 100px, md: 120px, lg: 152px) */
  size?: PreviewSize;
  /** 삭제 콜백. 전달 시 hover 삭제 버튼 표시 */
  onRemove?: () => void;
  /** true면 hover 시 하단에 파일명 표시 */
  showFileName?: boolean;
  /** 전달 시 우하단에 개수 뱃지 표시 (예: "3") */
  showFileCount?: string;
  /** 전달 시 우하단에 영상 길이 표시 (예: "01:23") */
  duration?: string;
  /** 이미지 alt 텍스트 (src 사용 시) */
  alt?: string;
}

/**
 * 이미지/영상 파일 썸네일 미리보기 컴포넌트
 *
 * - File 객체를 받아 blob URL로 썸네일 표시
 * - 옵션에 따라 삭제 버튼, 파일명, 개수, 영상 길이 오버레이 표시
 */
export function ImagePreview({
  file,
  src: serverSrc,
  size = 'md',
  onRemove,
  showFileName,
  showFileCount,
  duration,
  alt,
}: ImagePreviewProps) {
  /** File → blob URL 변환. file이 바뀌면 이전 URL을 해제(revokeObjectURL)하고 새로 생성 */
  const [blobSrc, setBlobSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setBlobSrc(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setBlobSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  /** blob URL(로컬) → 서버 URL → fallback 순으로 폴백 */
  const imgSrc = blobSrc ?? serverSrc ?? imageFallback;
  const imgAlt = file?.name ?? alt ?? '';
  /** 이미지 로드 실패 시 fallback 이미지 표시용 */
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className={`group relative shrink-0 overflow-hidden rounded-lg border border-white bg-gray-100 ${sizeStyles[size]}`}
    >
      <Image
        src={hasError ? imageFallback : imgSrc}
        alt={imgAlt}
        fill
        sizes="(max-width: 768px) 25vw, 152px"
        className="object-cover"
        onError={() => {
          if (!hasError) setHasError(true);
        }}
        unoptimized={!!blobSrc}
      />

      {/* hover 시 삭제 버튼 */}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-xs bg-black/20 text-white opacity-0 transition group-hover:opacity-100"
          aria-label={`${imgAlt} 삭제`}
        >
          <TrashOutlineIcon className="h-4 w-4" />
        </button>
      )}

      {/* hover 시 파일명 */}
      {showFileName && (
        <div className="typo-body-8 absolute inset-x-0 bottom-0 truncate bg-linear-to-t from-black/60 to-transparent px-2 py-2 text-gray-50 opacity-0 backdrop-blur-md transition group-hover:opacity-100">
          {imgAlt}
        </div>
      )}

      {/* 우하단 뱃지 (파일 개수 또는 영상 길이) */}
      {(showFileCount || duration) && (
        <span className="typo-body-8 absolute right-2 bottom-2 rounded-xs bg-gray-900/40 px-1.5 py-px text-white transition group-hover:opacity-0">
          {showFileCount ?? duration}
        </span>
      )}
    </div>
  );
}
