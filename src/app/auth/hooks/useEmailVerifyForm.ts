'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { VerifyEmailFormValues, verifyEmailSchema } from '@/schemas/auth/verify-email.schema';
import { verifyEmail, resendVerificationEmail } from '@/api/auth/signup';
import type { ApiError } from '@/types/api';
import { showAlert } from '@/utils/alert';

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
      showAlert.success({
        title: '인증 메일 재전송 완료',
        description: '메일로 인증번호를 다시 전송드렸습니다',
      });
    } catch {
      showAlert.error({ title: '인증 메일 재전송에 실패했습니다' });
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
