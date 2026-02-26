import FileIcon from '@/assets/icons/FileIcon.svg';
import TrashOutlineIcon from '@/assets/icons/TrashOutlineIcon.svg';

interface FilePreviewProps {
  /** 파일명 */
  name: string;
  /** 파일 크기 (바이트) */
  size: number;
  /** 삭제 콜백 */
  onRemove?: () => void;
}

/**
 * 파일(PDF 등) 미리보기 컴포넌트
 *
 * - 파일 아이콘 + 파일명 + 크기 + 삭제 버튼
 * - 이미지가 아닌 파일(PDF, 문서 등)용
 */
export function FilePreview({ name, size, onRemove }: FilePreviewProps) {
  const formattedSize =
    size < 1024 * 1024 ? `${(size / 1024).toFixed(1)}KB` : `${(size / (1024 * 1024)).toFixed(1)}MB`;

  return (
    <div className="bg-bg-2 flex w-full items-center gap-2 rounded-sm border border-gray-200 px-2 py-3">
      <FileIcon className="h-4 w-4 shrink-0" />
      <p className="typo-heading-6 min-w-0 flex-1 truncate text-gray-900">
        {name} <span className="typo-body-8 ml-1 text-gray-400">{formattedSize}</span>
      </p>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="shrink-0 text-gray-300 hover:text-gray-600"
          aria-label={`${name} 삭제`}
        >
          <TrashOutlineIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
