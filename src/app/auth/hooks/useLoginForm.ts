'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormValues } from '@/schemas/auth/login.schema';
import { loginEmail } from '@/api/auth/login';
import type { ApiError } from '@/types/api';
import { useAuthStore } from '@/stores/authStore';
import { showAlert } from '@/utils/alert';

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
      login(access_token, refresh_token, id_token, 'email');

      // 3. redirect 파라미터가 있으면 해당 경로로, 없으면 /my-space로 이동
      const redirect = searchParams.get('redirect') || '/my-space/case';
      router.replace(redirect);
    } catch (err) {
      const data = err as ApiError;

      if (data?.code === 'USER_NOT_FOUND') {
        showAlert.error({
          title: '가입된 계정을 찾을 수 없습니다',
          description:
            '입력하신 이메일로 가입된 계정이 없습니다.\n이메일 주소를 다시 확인하시거나 회원가입을 진행해 주세요.',
        });
      } else if (data?.code === 'INVALID_CREDENTIALS') {
        sessionStorage.setItem('loginEmail', values.email);
        showAlert.error({
          title: '로그인 정보를 확인해 주세요',
          description: '이메일 또는 비밀번호가 올바르지 않습니다.\n입력 내용을 다시 확인해 주세요.',
        });
      } else if (data?.code === 'USER_NOT_CONFIRMED') {
        sessionStorage.setItem('loginEmail', values.email);
        showAlert.error({
          title: '이메일 인증이 필요합니다',
          description:
            '아직 이메일 인증이 완료되지 않았습니다.\n이메일을 확인하신 후 인증을 완료해 주세요.',
        });
      } else {
        showAlert.error({ title: '로그인에 실패했습니다' });
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
