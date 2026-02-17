'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormValues } from '@/schemas/auth/login.schema';
import { loginEmail, LoginErrorResponse } from '@/app/api/auth/login';
import { useAuthStore } from '@/stores/authStore';

export function useLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useAuthStore((state) => state.login);
  const [showPassword, setShowPassword] = useState(false);

  // React Hook Form 설정
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // 로그인 제출 핸들러
  const submit = async (values: LoginFormValues) => {
    try {
      // 1. 로그인 API 호출 (백엔드는 snake_case 사용)
      const { access_token, refresh_token, id_token } = await loginEmail(values);

      // 2. 쿠키 저장 + Zustand 상태 업데이트
      login(access_token, refresh_token, id_token);

      // 3. redirect 파라미터가 있으면 해당 경로로, 없으면 /my-space로 이동
      const redirect = searchParams.get('redirect') || '/my-space/case/collect';
      router.replace(redirect);
    } catch (err) {
      const data = err as LoginErrorResponse;

      // 에러 코드에 따른 처리
      if (data?.code === 'USER_NOT_FOUND') {
        form.setError('email', { message: '존재하지 않는 이메일입니다' });
      } else if (data?.code === 'INVALID_CREDENTIALS') {
        // 이메일 인증 페이지에서 사용할 수 있도록 세션에 저장
        sessionStorage.setItem('loginEmail', values.email);
        form.setError('password', { message: '이메일 또는 비밀번호가 올바르지 않습니다' });
      } else if (data?.code === 'USER_NOT_CONFIRMED') {
        // TODO: 이메일 인증 페이지로 리다이렉트 모달 추가
        sessionStorage.setItem('loginEmail', values.email);
        form.setError('root', { message: '이메일 인증이 완료되지 않았습니다' });
      } else {
        // 기타 에러
        form.setError('root', { message: data?.message || '로그인에 실패했습니다' });
      }
    }
  };

  return {
    form,
    submit,
    showPassword,
    togglePassword: () => setShowPassword((prev) => !prev),
  };
}
