import Image from 'next/image';
import { X } from 'lucide-react';
import AlertCircleIcon from '@/assets/icons/AlertCircleIcon.png';
import CheckCircleIcon from '@/assets/icons/CheckCircleIcon.png';

type AlertVariant = 'error' | 'success';

interface AlertCardProps {
  variant: AlertVariant;
  title: string;
  description?: string;
  onClose?: () => void;
}

/**
 * Alert 카드 컴포넌트
 *
 * - react-toastify의 커스텀 토스트 콘텐츠로 사용
 * - variant: error(부정) | success(긍정)
 */
export function AlertCard({ variant, title, description, onClose }: AlertCardProps) {
  const icon = variant === 'error' ? AlertCircleIcon : CheckCircleIcon;

  return (
    <div className="flex w-96 items-start gap-3 rounded-xl border border-gray-100 bg-white px-4 py-4 shadow-lg">
      <Image src={icon} alt="" width={20} height={20} className="mt-0.5 shrink-0" />
      <div className="flex-1 space-y-0.5">
        <p className="typo-heading-6 text-gray-900">{title}</p>
        {description && <p className="typo-body-8 text-gray-500">{description}</p>}
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 opacity-70 transition-opacity hover:opacity-100"
          aria-label="닫기"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
      )}
    </div>
  );
}
