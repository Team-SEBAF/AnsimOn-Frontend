import * as React from 'react';
import { cn } from '@/lib/utils';

type InputSize = 'sm' | 'md' | 'lg';

/**
 * Input 컴포넌트의 Props
 *
 * 커스텀 Props:
 * @property label - 라벨 텍스트
 * @property hideRequiredLabel - true면 "필수" 라벨 숨김 (required 속성은 유지)
 * @property error - 에러 메시지 (하단에 빨간색으로 표시)
 * @property icon - 인풋 우측에 표시할 아이콘
 * @property onIconClick - 아이콘 클릭 핸들러 (제공시 아이콘이 클릭 가능해짐)
 * @property numericOnly - 숫자만 입력 가능 여부
 * @property size - 인풋 높이 (sm: 32px, md: 40px, lg: 48px, 기본값: lg)
 *
 * HTML 기본 속성 (HTMLInputAttributes 상속):
 * - required: 필수 입력 여부 (true면 "필수" 라벨 표시)
 * - disabled: 비활성화 여부 (비활성화 스타일 적용)
 * - placeholder, type, maxLength, value, onChange 등
 */
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  hideRequiredLabel?: boolean;
  error?: string;
  icon?: React.ReactNode;
  onIconClick?: () => void;
  numericOnly?: boolean;
  size?: InputSize;
}

const INPUT_BASE_STYLES =
  'w-full rounded-md border px-3 py-1 transition-colors focus-visible:outline-none typo-body-7 placeholder:typo-placeholder border-(--app-gray-200) placeholder:text-(--app-gray-400) focus:border-(--app-gray-400) bg-white text-(--app-gray-900)';
const INPUT_ERROR_STYLES = 'border-error border-[1.5px] focus:border-error';
const INPUT_DISABLED_STYLES =
  'cursor-not-allowed bg-(--app-gray-300) text-(--app-gray-500) border-(--app-gray-300)';
const INPUT_SIZE_STYLES: Record<InputSize, string> = {
  sm: 'h-8', // 32px
  md: 'h-10', // 40px
  lg: 'h-12', // 48px
};

/**
 * Input 컴포넌트
 *
 * 라벨, 필수 표시, 에러 메시지, 아이콘을 지원하는 커스텀 인풋
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      required,
      hideRequiredLabel,
      error,
      icon,
      onIconClick,
      disabled,
      numericOnly,
      size = 'lg',
      className,
      onChange,
      ...props
    },
    ref,
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (numericOnly) {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
      }
      onChange?.(e);
    };

    return (
      <div>
        {/* 라벨 + 필수 표시 */}
        {label && (
          <label className="typo-label mb-2 block text-(--app-gray-700)">
            {label}
            {required && !hideRequiredLabel && <span className="text-primary ml-2">필수</span>}
          </label>
        )}

        {/* 인풋 + 아이콘 */}
        <div className="relative">
          <input
            ref={ref}
            disabled={disabled}
            onChange={handleChange}
            className={cn(
              INPUT_BASE_STYLES,
              INPUT_SIZE_STYLES[size],
              icon && 'pr-10',
              error && INPUT_ERROR_STYLES,
              disabled && INPUT_DISABLED_STYLES,
              className,
            )}
            {...props}
          />
          {icon &&
            (onIconClick ? (
              <button
                type="button"
                onClick={onIconClick}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
              >
                {icon}
              </button>
            ) : (
              <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-neutral-500">
                {icon}
              </div>
            ))}
        </div>

        {/* 에러 메시지 */}
        {error && <p className="text-error text-[12px] leading-4.5 font-medium">{error}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';
