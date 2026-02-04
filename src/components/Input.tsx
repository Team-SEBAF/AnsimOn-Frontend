import * as React from 'react';
import { Input as ShadcnInput } from '@/components/ui/input';
import { cn } from '@/lib/utils';

/**
 * Input 컴포넌트의 Props
 *
 * @property label - 라벨 텍스트
 * @property required - 필수 입력 여부
 * @property error - 에러 메시지 (하단에 빨간색으로 표시)
 * @property icon - 인풋 우측에 표시할 아이콘
 * @property onIconClick - 아이콘 클릭 핸들러 (제공시 아이콘이 클릭 가능해짐)
 * @property placeholder - placeholder 텍스트
 * @property disabled - 비활성화 여부
 * @property numericOnly - 숫자만 입력 가능 여부
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  required?: boolean;
  error?: string;
  icon?: React.ReactNode;
  onIconClick?: () => void;
  placeholder?: string;
  disabled?: boolean;
  numericOnly?: boolean;
}

const INPUT_BASE_STYLES =
  'typo-body-8 placeholder:typo-placeholder border-gray-200 placeholder:text-gray-400 focus:border-gray-400 shadow-none focus-visible:ring-0 bg-white text-gray-900';
const INPUT_ERROR_STYLES = 'border-error focus:border-error';
const INPUT_DISABLED_STYLES = 'cursor-not-allowed bg-gray-300 text-gray-400 border-gray-300';

/**
 * Input 컴포넌트
 *
 * shadcn Input을 기반으로 라벨, 필수 표시, 에러 메시지, 아이콘을 추가한 컴포넌트
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      required,
      error,
      icon,
      onIconClick,
      placeholder,
      disabled,
      numericOnly,
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
      <div className="space-y-2">
        {/* 라벨 + 필수 표시 */}
        {label && (
          <label className="typo-label mb-2 block text-gray-700">
            {label}
            {required && <span className="text-primary ml-2">필수</span>}
          </label>
        )}

        {/* 인풋 + 아이콘 */}
        <div className="relative">
          <ShadcnInput
            ref={ref}
            placeholder={placeholder}
            disabled={disabled}
            onChange={handleChange}
            className={cn(
              INPUT_BASE_STYLES,
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
        {error && <p className="typo-caption text-error">{error}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';
