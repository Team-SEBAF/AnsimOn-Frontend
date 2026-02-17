'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { LoginRequiredModal } from '@/components/modals';

/**
 * 인증이 필요한 페이지를 감싸는 보호 컴포넌트
 *
 * - 인증 초기화 전: 아무것도 렌더링하지 않음 (flicker 방지)
 * - 인증됨: children 렌더링
 * - 미인증: 로그인 필요 모달 표시
 *
 * @note AuthProvider에서 initAuth()를 호출하므로 여기서는 상태만 확인
 *
 * @example
 * // layout.tsx
 * export default function MyLayout({ children }) {
 *   return <ProtectedRoute>{children}</ProtectedRoute>;
 * }
 */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoggedIn, isAuthInitialized } = useAuthStore();

  /** 모달 닫기: 뒤로가기 시도, 불가능하면 홈으로 */
  const handleClose = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  // 인증 초기화 전에는 렌더링하지 않음 (flicker 방지)
  if (!isAuthInitialized) {
    return null;
  }

  if (!isLoggedIn) {
    return (
      <LoginRequiredModal
        open={true}
        onConfirm={() => router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`)}
        onOpenChange={handleClose}
      />
    );
  }

  return <>{children}</>;
}
