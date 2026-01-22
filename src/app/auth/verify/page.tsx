'use client';

import Link from 'next/link';
import { EmailVerifyForm } from '../components/EmailVerifyForm';

export default function VerifyPage() {
  const email = typeof window !== 'undefined' ? sessionStorage.getItem('signupEmail') : null;

  // email이 없는 경우
  if (!email) {
    return (
      <main className="flex flex-col items-center justify-center p-4">
        <h1>이메일 인증</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          회원가입 정보가 확인되지 않습니다.
          <br />
          회원가입 페이지에서 다시 진행해주세요.
        </p>
        <Link href="/auth/signup" className="mt-4 underline">
          회원가입으로 이동
        </Link>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center p-4">
      <h1>이메일 인증</h1>
      <div className="mt-4 w-full max-w-md">
        <EmailVerifyForm email={email} />
      </div>
    </main>
  );
}
