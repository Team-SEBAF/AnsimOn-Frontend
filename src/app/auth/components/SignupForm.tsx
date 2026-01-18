'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, SignupFormValues } from '@/schemas/auth/signup.schema';
import { Input } from '@/components/ui/input';
import { ErrorMessage } from './ErrorMessage';

type SignupErrorResponse = {
  code: string;
  message: string;
};

export function SignupForm() {
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
      name: '',
      birthdate: '',
      isLegalRepresentative: false,
    },
  });

  const onSubmit = async (values: SignupFormValues) => {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });

    const data: SignupErrorResponse = await res.json();

    if (!res.ok) {
      if (data.code === 'EMAIL_ALREADY_EXISTS') {
        form.setError('email', {
          message: '이미 가입된 이메일입니다',
        });
      } else {
        console.error('회원가입 실패:', data);
      }
      return;
    }

    // 성공 → 이메일 인증 화면 이동
    console.log('이메일 인증 화면으로 이동');
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
      <label htmlFor="email">이메일</label>
      <Input id="email" {...form.register('email')} placeholder="이메일을 입력하세요" />
      <ErrorMessage error={form.formState.errors.email} />

      <label htmlFor="password">비밀번호</label>
      <Input
        id="password"
        type="password"
        {...form.register('password')}
        placeholder="비밀번호를 입력하세요"
      />
      <ErrorMessage error={form.formState.errors.password} />

      <label htmlFor="name">이름</label>
      <Input id="name" {...form.register('name')} placeholder="이름을 입력하세요" />
      <ErrorMessage error={form.formState.errors.name} />

      <label htmlFor="birthdate">생년월일</label>
      <Input id="birthdate" type="date" {...form.register('birthdate')} />
      <ErrorMessage error={form.formState.errors.birthdate} />

      <label htmlFor="isLegalRepresentative">법정대리인 여부</label>
      <input
        id="isLegalRepresentative"
        type="checkbox"
        {...form.register('isLegalRepresentative')}
      />

      <button type="submit">Sign Up</button>
    </form>
  );
}
