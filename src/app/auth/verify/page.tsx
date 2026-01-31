'use client';

import Link from 'next/link';
import { EmailVerifyForm } from '../components/EmailVerifyForm';

export default function VerifyPage() {
  // 회원가입 또는 로그인에서 넘어온 이메일 확인
  const email =
    typeof window !== 'undefined'
      ? sessionStorage.getItem('signupEmail') || sessionStorage.getItem('loginEmail')
      : null;

  if (!email) {
    return (
      <div className="pb-24">
        <div className="mb-8">
          <h1 className="typo-display-2 mb-2 text-black">이메일 인증</h1>
          <p className="typo-body-4 text-app-gray-500">
            회원가입 정보가 확인되지 않습니다.
            <br />
            회원가입 페이지에서 다시 진행해주세요.
          </p>
        </div>
        <Link href="/auth/signup" className="text-primary underline">
          회원가입으로 이동
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-24">
      <div className="mb-8">
        <h1 className="typo-display-2 mb-2 text-black">이메일 인증</h1>
        <p className="typo-body-4 text-app-gray-500">입력하신 이메일로 인증번호를 발송했습니다</p>
      </div>
      <EmailVerifyForm email={email} />
    </div>
  );
}
