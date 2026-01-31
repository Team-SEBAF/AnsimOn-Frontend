'use client';

import { SignupForm } from '../components/SignupForm';

export default function SignupPage() {
  return (
    <div className="pb-24">
      {/* 제목 */}
      <div className="mb-8">
        <h1 className="typo-display-2 mb-2 text-black">회원가입</h1>
        <p className="typo-body-4 text-app-gray-500">새로운 계정을 만들어보세요</p>
      </div>

      {/* 폼 */}
      <SignupForm />
    </div>
  );
}
