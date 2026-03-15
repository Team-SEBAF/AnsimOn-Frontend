import FileIcon from '@/assets/icons/FileIcon.svg';
import ImageFileIcon from '@/assets/icons/ImageFileIcon.svg';
import VoiceFileIcon from '@/assets/icons/VoiceFileIcon.svg';
import FileDownloadIcon from '@/assets/icons/FileDownloadIcon.svg';
import TrashOutlineIcon from '@/assets/icons/TrashOutlineIcon.svg';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { formatFileSize } from '@/utils/format';

type FileCategory = 'image' | 'voice' | 'document';

type RightAction =
  | { type: 'remove'; onRemove: () => void }
  | { type: 'download'; onDownload: () => void }
  | { type: 'checkbox'; checked: boolean; onChange: (checked: boolean) => void };

interface FilePreviewProps {
  /** 파일명 */
  name: string;
  /** 파일 크기 (바이트) */
  size: number;
  /** 우측 액션. 없으면 아무것도 렌더링되지 않음 */
  action?: RightAction;
}

const LEFT_ICON: Record<FileCategory, React.FC<React.SVGProps<SVGSVGElement>>> = {
  document: FileIcon,
  image: ImageFileIcon,
  voice: VoiceFileIcon,
};

/** 파일명 확장자로 카테고리 판별 */
function getCategoryFromFilename(name: string): FileCategory {
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  if (['jpg', 'jpeg', 'png', 'heic', 'mp4', 'mov'].includes(ext)) return 'image';
  if (['m4a', 'mp3', 'wav'].includes(ext)) return 'voice';
  return 'document';
}

function RightActionSlot({ action, name }: { action: RightAction; name: string }) {
  if (action.type === 'remove') {
    return (
      <button
        type="button"
        onClick={action.onRemove}
        className="shrink-0 text-gray-300 hover:text-gray-600"
        aria-label={`${name} 삭제`}
      >
        <TrashOutlineIcon className="h-4 w-4" />
      </button>
    );
  }

  if (action.type === 'download') {
    return (
      <button
        type="button"
        onClick={action.onDownload}
        className="shrink-0 text-gray-300 hover:text-gray-600"
        aria-label={`${name} 다운로드`}
      >
        <FileDownloadIcon className="h-4 w-4" />
      </button>
    );
  }

  return (
    <Checkbox
      checked={action.checked}
      onCheckedChange={(checked) => action.onChange(checked === true)}
      aria-label={`${name} 선택`}
    />
  );
}

/**
 * 파일 미리보기 컴포넌트
 *
 * - 왼쪽: 파일명 확장자로 카테고리를 판별해 문서/이미지/음성 아이콘 표시
 * - 오른쪽: action prop에 따라 삭제 버튼 / 다운로드 버튼 / 체크박스 표시 (없으면 생략)
 */
export function FilePreview({ name, size, action }: FilePreviewProps) {
  const category = getCategoryFromFilename(name);
  const LeftIcon = LEFT_ICON[category];
  const formattedSize = formatFileSize(size);

  return (
    <div
      className={cn(
        'bg-bg-2 flex w-full items-center gap-2 rounded-sm border border-gray-200 px-2 py-3',
        action && 'cursor-pointer',
      )}
    >
      <LeftIcon className="h-4 w-4 shrink-0" />
      <div className="flex min-w-0 flex-1 items-baseline gap-1">
        <span className="typo-heading-6 truncate text-gray-900">{name}</span>
        <span className="typo-body-8 shrink-0 text-gray-400">{formattedSize}</span>
      </div>
      {action && <RightActionSlot action={action} name={name} />}
    </div>
  );
}
