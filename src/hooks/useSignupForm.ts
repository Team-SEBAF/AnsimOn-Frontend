'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, type SignupFormValues } from '@/schemas/auth/signup.schema';
import { signupEmail, SignupEmailPayload, SignupErrorResponse } from '@/app/api/auth/signup';

export function useSignupForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
      passwordConfirm: '',
      name: '',
      birthdate: '',
      agreeAge: false,
      agreeTerms: false,
      agreePrivacy: false,
      agreeMarketing: false,
    },
  });

  const submit = async (values: SignupFormValues) => {
    const payload: SignupEmailPayload = {
      email: values.email,
      password: values.password,
      name: values.name,
      birthdate: values.birthdate,
    };

    try {
      await signupEmail(payload);
      sessionStorage.setItem('signupEmail', values.email);
      router.push('/auth/verify');
    } catch (err) {
      const data = err as SignupErrorResponse;

      if (data?.code === 'EMAIL_ALREADY_EXISTS') {
        form.setError('email', { message: '이미 가입된 이메일입니다' });
      } else {
        console.error('회원가입 실패:', data);
      }

      sessionStorage.removeItem('signupEmail');
    }
  };

  return {
    form,
    submit,

    showPassword,
    togglePassword: () => setShowPassword((pw) => !pw),

    showPasswordConfirm,
    togglePasswordConfirm: () => setShowPasswordConfirm((pw) => !pw),
  };
}
