'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { VerifyEmailFormValues, verifyEmailSchema } from '@/schemas/auth/verify-email.schema';
import { ErrorMessage } from './ErrorMessage';
import { useRouter } from 'next/navigation';

type EmailVerifyFormProps = {
  email: string;
};

type VerifyErrorResponse = {
  code?: string;
  message?: string;
};

export function EmailVerifyForm({ email }: EmailVerifyFormProps) {
  const router = useRouter();

  const form = useForm<VerifyEmailFormValues>({
    resolver: zodResolver(verifyEmailSchema),
    mode: 'onBlur',
    defaultValues: {
      email,
      code: '',
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (values: VerifyEmailFormValues) => {
    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data: VerifyErrorResponse = await res.json();

      if (!res.ok) {
        if (data.code === 'INVALID_CODE') {
          form.setError('code', {
            message: '인증 코드가 올바르지 않습니다.',
          });
        } else if (data.code === 'EXPIRED_CODE') {
          form.setError('code', {
            message: '인증 코드가 만료되었습니다.',
          });
          // TODO: 재전송 로직 등
        } else {
          console.error('이메일 인증 실패:', data);
        }
        return;
      }

      // 인증 성공
      sessionStorage.removeItem('signupEmail');
      console.log('이메일 인증 성공');
      router.replace('/auth/my-space');
    } catch (error) {
      console.error('인증 에러:', error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
      {/* 이메일 (읽기 전용) */}
      <label htmlFor="email">Email</label>
      <Input id="email" value={email} readOnly />

      {/* 인증 코드 입력 */}
      <label htmlFor="code">Verification Code</label>
      <Input
        id="code"
        {...form.register('code')}
        placeholder="인증 코드 6자리"
        inputMode="numeric"
      />
      <ErrorMessage error={form.formState.errors.code} />

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? '인증 중...' : '인증하기'}
      </button>
    </form>
  );
}
