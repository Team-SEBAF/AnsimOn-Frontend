'use client';

import { Button } from '@/components/Button';
import { useGoogleAuth } from '@/hooks/useGoogle';

export default function MyPage() {
  const { logoutWithGoogle } = useGoogleAuth();

  return (
    <main>
      <h1>My Page</h1>

      {/* TODO: 구글 회원 테스트 버튼 (이후에 지우기) */}
      <Button
        type="button"
        className="h-14 w-80 text-base font-semibold"
        onClick={logoutWithGoogle}
      >
        구글 회원 로그아웃 테스트
      </Button>
    </main>
  );
}
