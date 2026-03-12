'use client';

import { SignupForm } from '../components/SignupForm';

/** 이메일 회원가입 페이지 */
export default function SignupPage() {
  return (
    <div>
      {/* 제목 */}
      <div className="mb-8">
        <h1 className="typo-display-2 mb-2 text-black">회원가입</h1>
        <p className="typo-body-4 text-gray-500">새로운 계정을 만들어보세요</p>
      </div>

      {/* 폼 */}
      <SignupForm />
    </div>
  );
}
