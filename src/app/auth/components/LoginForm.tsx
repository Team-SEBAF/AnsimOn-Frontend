'use client';

import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { useLoginForm } from '../hooks/useLoginForm';
import { GoogleLoginButton } from './googleLoginButton';
/**
 * 로그인 폼 컴포넌트
 *
 * 이메일과 비밀번호 입력 필드, 제출 버튼, 구글 로그인 버튼, 회원가입 링크로 구성된 폼.
 * useLoginForm 훅을 사용하여 폼 상태 및 제출 로직을 관리.
 *
 * @flow
 * 1. 사용자 입력 → Zod 스키마 검증
 * 2. 폼 제출 → 로그인 API 호출 → 인증 토큰 저장 및 리다이렉트
 *
 * @todo
 * 에러 메시지 UI 협의 후 개선 (alert 형태로 수정)
 * 하단 링크 페이지 경로 수정
 *
 */
export function LoginForm() {
  const { form, submit, showPassword, togglePassword } = useLoginForm();

  return (
    <form onSubmit={form.handleSubmit(submit)} className="space-y-6">
      <div className="space-y-3">
        {/* 이메일 */}
        <Input
          label="이메일"
          required
          hideRequiredLabel
          type="email"
          placeholder="이메일을 입력해주세요"
          error={form.formState.errors.email?.message}
          {...form.register('email')}
        />

        {/* 비밀번호 */}
        <Input
          label="비밀번호"
          required
          hideRequiredLabel
          type={showPassword ? 'text' : 'password'}
          placeholder="비밀번호를 입력해주세요"
          error={form.formState.errors.password?.message}
          icon={showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
          onIconClick={togglePassword}
          {...form.register('password')}
        />

        {/* 전체 에러 메시지 (root 에러) */}
        {form.formState.errors.root && (
          <p className="text-error text-[12px] leading-4.5 font-medium">
            {form.formState.errors.root.message}
          </p>
        )}
      </div>

      <div className="space-y-3">
        {/* 제출 버튼 */}
        <Button type="submit" size="xl" className="typo-btn-1 w-full">
          로그인
        </Button>

        {/* 구글 로그인 버튼 */}
        <GoogleLoginButton />
      </div>

      {/* 하단 링크 */}
      <div className="flex items-center justify-center gap-4">
        <Link href="/" className="typo-btn-2 text-gray-500 hover:underline">
          아이디 찾기
        </Link>
        <span className="h-3.5 w-px bg-gray-200" />
        <Link href="/" className="typo-btn-2 text-gray-500 hover:underline">
          비밀번호 찾기
        </Link>
        <span className="h-3.5 w-px bg-gray-200" />
        <Link href="/auth/signup" className="typo-btn-2 text-gray-500 hover:underline">
          회원가입
        </Link>
      </div>
    </form>
  );
}
