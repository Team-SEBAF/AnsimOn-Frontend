import clsx from 'clsx';
import React from 'react';

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
 * - md: 살짝 둥근 사각형
 * - lg: 기본 버튼
 * - full: 원형 / pill
 */
type ButtonRounded = 'lg' | 'full';

/**
 * Button 컴포넌트 Props
 *
 * + as: 'button' | 'a' 에 따라 렌더링될 HTML 태그
 * + href: as="a" 일 때 이동할 링크
 * + variant: 버튼의 시각적 스타일 유형
 * + color: 버튼의 색상
 * + size: 버튼의 크기
 * + rounded: 버튼의 모서리 라운드 형태
 * + disabled: 버튼의 비활성화 여부
 * + leftIcon / rightIcon: 버튼 좌우에 아이콘을 추가
 * + children: 버튼 텍스트
 * + ariaLabel: 아이콘만 있는 버튼에서 스크린 리더 접근성 제공
 * + className: 추가적인 CSS 클래스
 */
interface ButtonProps {
  as?: 'button' | 'a';
  href?: string;
  variant?: ButtonVariant;
  color?: ButtonColor;
  size?: ButtonSize;
  rounded?: ButtonRounded;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
  ariaLabel?: string;
  className?: string;
}

/* Style maps */
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
 * 아이콘 전용 버튼 사이즈
 * - padding 없음
 * - width === height
 */
const iconSizeStyles: Record<ButtonSize, string> = {
  sm: 'h-6 w-6',
  md: 'h-8 w-8',
  lg: 'h-10 w-10',
  xl: 'h-12 w-12',
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
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary' +
  'disabled:pointer-events-none disabled:opacity-50';

/* Component */
/* Component */

/**
 * 공용 Button 컴포넌트
 * - 다양한 시각적 스타일 옵션 제공
 * - as="button" / as="a" 모두 지원
 * - 텍스트 버튼 / 아이콘 버튼 모두 지원
 * - 아이콘 전용 버튼에서 aria-label 필수
 */
export function Button({
  as = 'button',
  href,
  variant = 'default',
  color = 'primary',
  size = 'md',
  rounded = 'lg',
  disabled = false,
  leftIcon,
  rightIcon,
  children,
  ariaLabel,
  className,
}: ButtonProps) {
  const Component = as;

  const isIconOnly = !children && (leftIcon || rightIcon);

  return (
    <Component
      href={as === 'a' ? href : undefined}
      disabled={as === 'button' ? disabled : undefined}
      aria-disabled={disabled}
      aria-label={ariaLabel}
      className={clsx(
        baseStyles,
        isIconOnly ? iconSizeStyles[size] : sizeStyles[size],
        roundedStyles[rounded],
        colorStyles[color][variant],
        className,
      )}
    >
      {leftIcon && <span aria-hidden>{leftIcon}</span>}
      {children && <span>{children}</span>}
      {rightIcon && <span aria-hidden>{rightIcon}</span>}
    </Component>
  );
}
