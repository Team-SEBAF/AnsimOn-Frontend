'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { VerifyEmailFormValues, verifyEmailSchema } from '@/schemas/auth/verify-email.schema';
import { useRouter } from 'next/navigation';
import { SignupErrorResponse, verifyEmail, resendVerificationEmail } from '@/app/api/auth/signup';
import { ActionInput } from '@/components/ActionInput';

type EmailVerifyFormProps = {
  email: string;
};

export function EmailVerifyForm({ email }: EmailVerifyFormProps) {
  const router = useRouter();
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const form = useForm<VerifyEmailFormValues>({
    resolver: zodResolver(verifyEmailSchema),
    mode: 'onBlur',
    defaultValues: {
      email,
      code: '',
    },
  });

  const handleResend = async () => {
    setIsResending(true);
    try {
      await resendVerificationEmail(email);
      // TODO: 성공 토스트 메시지
    } catch (err) {
      console.error('이메일 재전송 실패:', err);
      // TODO: 실패 토스트 메시지
    } finally {
      setIsResending(false);
    }
  };

  const handleVerify = async () => {
    const isValid = await form.trigger('code');
    if (!isValid) return;

    setIsVerifying(true);
    try {
      const values = form.getValues();
      await verifyEmail(values);

      sessionStorage.removeItem('signupEmail');
      router.replace('/auth/my-space');
    } catch (err) {
      const data = err as SignupErrorResponse;

      if (data.code === 'INVALID_CODE') {
        form.setError('code', { message: '인증 코드가 올바르지 않습니다.' });
      } else if (data.code === 'EXPIRED_CODE') {
        form.setError('code', { message: '인증 코드가 만료되었습니다.' });
      } else {
        console.error('이메일 인증 실패:', data);
      }
    } finally {
      setIsVerifying(false);
    }
  };

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
