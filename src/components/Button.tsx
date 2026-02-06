import clsx from 'clsx';
import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { Spinner } from './Spinner';

/**
 * Button의 시각적 스타일 유형
 * - default: 기본 채움 버튼
 * - outline: 외곽선 버튼
 * - ghost: 배경 없는 버튼
 */
type ButtonVariant = 'default' | 'outline' | 'ghost';

/**
 * Button의 색상
 */
type ButtonColor = 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'contrast';

/**
 * Button의 높이 / 패딩 / 타이포 스케일
 */
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

/**
 * Button의 모서리 라운드 형태
 * - lg: 기본 버튼
 * - full: 원형 / pill
 */
type ButtonRounded = 'lg' | 'full';

/**
 * Button 컴포넌트 Props
 *
 * + variant / color / size / rounded: 버튼 스타일 제어
 * + loading: 로딩 상태 (스피너 표시, 버튼 비활성화)
 * + asChild: true면 자식 요소를 버튼으로 렌더링 (Link 등과 함께 사용)
 * + onClick, disabled, aria-* 등 기본 button 속성은 그대로 전달됨
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  color?: ButtonColor;
  size?: ButtonSize;
  rounded?: ButtonRounded;
  loading?: boolean;
  asChild?: boolean;
}

/* Style maps */

/**
 * 텍스트 버튼용 사이즈 스타일
 * - height / padding / gap / font-size 포함
 */
const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-6 px-2 gap-1 text-btn-3',
  md: 'h-8 px-3 gap-1.5 text-btn-2',
  lg: 'h-10 px-4 gap-2 text-btn-2',
  xl: 'h-12 px-6 gap-2 text-btn-1',
};

/**
 * 버튼 모서리 라운드 스타일
 */
const roundedStyles: Record<ButtonRounded, string> = {
  lg: 'rounded-lg',
  full: 'rounded-full',
};

/**
 * 색상 + variant 조합 스타일
 */
const colorStyles: Record<ButtonColor, Record<ButtonVariant, string>> = {
  primary: {
    default: 'bg-primary text-white hover:bg-btn-hover',
    outline: 'bg-primary/10 border border-primary-dark text-primary hover:text-btn-hover',
    ghost: 'text-primary hover:text-primary-400',
  },
  secondary: {
    default: 'bg-bg-1 text-gray-700 hover:bg-bg-2',
    outline: 'border border-gray-200 text-gray-200',
    ghost: 'text-gray-200',
  },
  danger: {
    default: 'bg-error text-white hover:bg-error-hover',
    outline: 'border border-error bg-error/10 text-error hover:text-error-hover',
    ghost: 'text-error hover:text-error-hover',
  },
  success: {
    default: 'bg-success text-white hover:bg-success-hover',
    outline: 'border border-success bg-success/10 text-success hover:text-success-hover',
    ghost: 'text-success hover:bg-success-50',
  },
  warning: {
    default: 'bg-warning text-white hover:bg-warning-hover',
    outline: 'border border-warning bg-warning/10 text-warning hover:text-warning-hover',
    ghost: 'text-warning hover:text-warning-hover',
  },
  contrast: {
    default: 'bg-sub-btn text-white hover:bg-sub-btn-hover',
    outline: 'border border-sub-btn bg-sub-btn/10 text-sub-btn hover:text-sub-btn-hover',
    ghost: 'text-sub-btn hover:text-sub-btn-hover',
  },
};

/**
 * 모든 버튼에 공통으로 적용되는 기본 스타일
 */
const baseStyles =
  'inline-flex items-center justify-center font-medium ' +
  'transition-colors ' +
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ' +
  'disabled:pointer-events-none disabled:opacity-50';

/* Component */

/**
 * 공용 Button 컴포넌트
 * - 다양한 시각적 스타일 옵션 제공
 * - loading: 로딩 상태에서 스피너 표시
 * - asChild: Link 등 다른 요소를 버튼 스타일로 렌더링
 */
export function Button({
  variant = 'default',
  color = 'primary',
  size = 'md',
  rounded = 'lg',
  loading = false,
  disabled,
  children,
  className,
  asChild = false,
  ...props
}: ButtonProps) {
  const buttonClassName = clsx(
    baseStyles,
    sizeStyles[size],
    roundedStyles[rounded],
    colorStyles[color][variant],
    className,
  );

  if (asChild) {
    return (
      <Slot {...props} className={buttonClassName}>
        {children}
      </Slot>
    );
  }

  return (
    <button {...props} disabled={disabled || loading} className={buttonClassName}>
      {loading ? <Spinner size={size === 'sm' ? 'sm' : size === 'xl' ? 'lg' : 'md'} /> : children}
    </button>
  );
}
