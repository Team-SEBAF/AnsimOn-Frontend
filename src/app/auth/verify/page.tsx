'use client';

import { useState, useEffect, startTransition } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/Button';
import { EmailVerifyForm } from '../components/EmailVerifyForm';

/**
 * 이메일 인증 페이지
 *
 * - sessionStorage에서 이메일 정보를 읽어와 인증 폼에 전달
 * - 이메일 정보가 없으면 회원가입 페이지로 유도
 * - 하이드레이션 문제 방지를 위해 클라이언트에서만 sessionStorage 접근
 *
 */
export default function VerifyPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 클라이언트에서만 sessionStorage 접근 (마운트 시 1회 실행)
  useEffect(() => {
    const storedEmail =
      sessionStorage.getItem('signupEmail') || sessionStorage.getItem('loginEmail');
    startTransition(() => {
      setEmail(storedEmail);
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="pb-24">
      <div className="mb-8">
        <h1 className="typo-display-2 mb-2 text-black">이메일 인증</h1>
        <p className="typo-body-4 text-gray-500">인증번호를 입력하고 인증을 완료해주세요.</p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center gap-4 pt-4 text-gray-400">
          <Loader2 size={40} className="animate-spin" />
          <span className="typo-body-7">이메일 정보를 확인하고 있어요...</span>
        </div>
      ) : !email ? (
        <div className="space-y-6 pt-4">
          <p className="typo-body-3 text-error h-25">
            회원가입 정보가 확인되지 않습니다.
            <br />
            회원가입 페이지에서 다시 진행해주세요.
          </p>
          <Button asChild size="xl" className="w-full">
            <Link href="/auth/signup">회원가입으로 이동</Link>
          </Button>
        </div>
      ) : (
        <EmailVerifyForm email={email} />
      )}
    </div>
  );
}
