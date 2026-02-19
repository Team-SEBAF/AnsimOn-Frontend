'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { VerifyEmailFormValues, verifyEmailSchema } from '@/schemas/auth/verify-email.schema';
import { verifyEmail, resendVerificationEmail } from '@/app/api/auth/signup';
import type { ApiError } from '@/types/api';

export function useEmailVerifyForm(email: string) {
  const router = useRouter();
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // React Hook Form 설정
  const form = useForm<VerifyEmailFormValues>({
    resolver: zodResolver(verifyEmailSchema),
    mode: 'onBlur',
    defaultValues: {
      email,
      code: '',
    },
  });

  // 인증번호 재전송 핸들러
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

  // 인증번호 확인 핸들러
  const handleVerify = async () => {
    const isValid = await form.trigger('code');
    if (!isValid) return;

    setIsVerifying(true);
    try {
      const values = form.getValues();
      await verifyEmail(values);

      sessionStorage.removeItem('signupEmail');
      router.replace('/auth/login');
    } catch (err) {
      const data = err as ApiError;

      if (data.code === 'EXPIRED_CODE') {
        form.setError('code', { message: data.message });
      } else {
        form.setError('code', { message: data?.message ?? '인증에 실패했습니다' });
      }
    } finally {
      setIsVerifying(false);
    }
  };

  return {
    form,
    handleResend,
    handleVerify,
    isResending,
    isVerifying,
  };
}
