import * as React from 'react';
import { Input, InputProps } from './Input';
import { Button } from './Button';
import { cn } from '@/lib/utils';

type ButtonVariant = 'default' | 'outline' | 'ghost';
type ButtonColor = 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'contrast';

/**
 * ActionInput 컴포넌트의 Props
 *
 * @property buttonLabel - 버튼 텍스트
 * @property onButtonClick - 버튼 클릭 핸들러
 * @property buttonDisabled - 버튼 비활성화 여부
 * @property buttonLoading - 버튼 로딩 상태
 * @property buttonVariant - 버튼 스타일 (default | outline | ghost)
 * @property buttonColor - 버튼 색상 (primary | secondary | danger | success | warning | contrast)
 */
export interface ActionInputProps extends InputProps {
  buttonLabel: string;
  onButtonClick: () => void;
  buttonDisabled?: boolean;
  buttonLoading?: boolean;
  buttonVariant?: ButtonVariant;
  buttonColor?: ButtonColor;
}

/**
 * ActionInput 컴포넌트
 *
 * Input과 Button을 조합한 컴포넌트 (이메일 인증 등)
 */
export const ActionInput = React.forwardRef<HTMLInputElement, ActionInputProps>(
  (
    {
      buttonLabel,
      onButtonClick,
      buttonDisabled,
      buttonLoading,
      buttonVariant = 'default',
      buttonColor = 'contrast',
      ...inputProps
    },
    ref,
  ) => {
    return (
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <Input ref={ref} {...inputProps} />
        </div>
        <Button
          type="button"
          size="lg"
          variant={buttonVariant}
          color={buttonColor}
          onClick={onButtonClick}
          disabled={buttonDisabled || buttonLoading}
          className={cn('h-12 w-22.5 shrink-0', inputProps.label && 'mt-6')}
        >
          {buttonLoading ? '처리중...' : buttonLabel}
        </Button>
      </div>
    );
  },
);

ActionInput.displayName = 'ActionInput';
