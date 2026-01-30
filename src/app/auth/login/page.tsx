'use client';

import { LoginForm } from '../components/LoginForm';

export default function LoginPage() {
  return (
    <div className="pb-24">
      {/* 제목 */}
      <div className="mb-8">
        <h1 className="typo-display-2 mb-2 text-black">로그인</h1>
        <p className="typo-body-4 text-app-gray-500">안심온에 오신 것을 환영합니다</p>
      </div>

      {/* 폼 */}
      <LoginForm />
    </div>
  );
}
