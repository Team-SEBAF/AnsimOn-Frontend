import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type SpinnerSize = 'sm' | 'md' | 'lg';

interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
  /** 스크린 리더용 로딩 메시지 (기본값: "로딩 중") */
  label?: string;
}

const sizeStyles: Record<SpinnerSize, string> = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

/**
 * 로딩 스피너 컴포넌트
 * - 접근성: sr-only 텍스트로 스크린 리더 지원
 */
export function Spinner({ size = 'md', className, label = '로딩 중' }: SpinnerProps) {
  return (
    <>
      <Loader2 className={cn('animate-spin', sizeStyles[size], className)} aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </>
  );
}
