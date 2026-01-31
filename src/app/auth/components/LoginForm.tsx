'use client';

import Link from 'next/link';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { useLoginForm } from '@/hooks/useLoginForm';
import { useGoogle } from '@/hooks/useGoogle';

export function LoginForm() {
  const { form, submit, showPassword, togglePassword } = useLoginForm();
  const { loginWithGoogle, googleLoading: googleLoginLoading } = useGoogle();

  return (
    <form onSubmit={form.handleSubmit(submit)} className="space-y-2">
      {/* 이메일 */}
      <Input
        label="이메일"
        required
        type="email"
        placeholder="이메일을 입력해주세요"
        error={form.formState.errors.email?.message}
        {...form.register('email')}
      />

      {/* 비밀번호 */}
      <Input
        label="비밀번호"
        required
        type={showPassword ? 'text' : 'password'}
        placeholder="비밀번호를 입력해주세요"
        error={form.formState.errors.password?.message}
        icon={showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
        onIconClick={togglePassword}
        {...form.register('password')}
      />

      {/* 전체 에러 메시지 (root 에러) */}
      {form.formState.errors.root && (
        <p className="text-sm text-red-500">{form.formState.errors.root.message}</p>
      )}

      {/* 제출 버튼 */}
      <div className="pt-8">
        <Button type="submit" className="h-14 w-full text-base font-semibold">
          로그인 →
        </Button>
      </div>

      {/* 구글 로그인 버튼 */}
      <div className="pt-4">
        <Button
          type="button"
          variant="outline"
          color="secondary"
          className="h-14 w-full border-gray-400 font-semibold text-gray-400"
          onClick={loginWithGoogle}
          disabled={googleLoginLoading}
        >
          <div className="flex items-center justify-center gap-2">
            구글 로그인
            {googleLoginLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          </div>
        </Button>
      </div>

      {/* 회원가입 링크 */}
      <div className="pt-4 text-center">
        <span className="text-sm text-gray-500">아직 계정이 없으신가요? </span>
        <Link href="/auth/signup" className="text-primary text-sm font-medium underline">
          회원가입
        </Link>
      </div>
    </form>
  );
}
