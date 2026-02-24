'use client';

import { useEmailVerifyForm } from '../hooks/useEmailVerifyForm';
import { ActionInput } from '@/components/ActionInput';

type EmailVerifyFormProps = {
  email: string;
};

/** 이메일 인증 폼 컴포넌트 */
export function EmailVerifyForm({ email }: EmailVerifyFormProps) {
  const { form, handleResend, handleVerify, isResending, isVerifying } = useEmailVerifyForm(email);

  return (
    <div className="flex flex-col gap-2">
      {/* 이메일 + 재전송 버튼 */}
      <ActionInput
        label="인증번호"
        value={email}
        disabled
        buttonLabel="재전송"
        onButtonClick={handleResend}
        buttonLoading={isResending}
      />

      {/* 인증번호 + 인증 버튼 */}
      <ActionInput
        {...form.register('code')}
        placeholder="인증번호를 입력해주세요"
        inputMode="numeric"
        error={form.formState.errors.code?.message}
        buttonLabel="인증"
        onButtonClick={handleVerify}
        buttonLoading={isVerifying}
        buttonColor="primary"
      />
    </div>
  );
}
