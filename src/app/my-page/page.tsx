'use client';

import { Button } from '@/components/Button';
import { useGoogle } from '@/hooks/useGoogle';

export default function MyPage() {
  const { logoutWithGoogle } = useGoogle();

  return (
    <main>
      <h1>My Page</h1>

      {/* TODO: 구글 회원 로그아웃 테스트 버튼 (이후에 지우기) */}
      <Button
        type="button"
        className="h-14 w-60 text-base font-semibold"
        onClick={logoutWithGoogle}
      >
        구글 회원 로그아웃 테스트
      </Button>
    </main>
  );
}
