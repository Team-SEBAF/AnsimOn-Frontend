'use client';

import { LoginForm } from '../components/LoginForm';

/** 로그인 페이지 */
export default function LoginPage() {
  return (
    <div>
      {/* 제목 */}
      <div className="mb-13.5">
        <h1 className="typo-display-2 mb-4 text-black">
          For Safe World
          <br />
          For you <span className="text-primary">AnsimON</span>
        </h1>
        <p className="typo-body-4 text-(--app-gray-400)">
          No personal credit checks or founder guarantee.
        </p>
      </div>

      {/* 폼 */}
      <LoginForm />
    </div>
  );
}
