'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * 앱 시작 시 인증 상태를 초기화하는 Provider
 *
 * 쿠키에서 토큰을 확인하여 Zustand store의 isLoggedIn 상태를 설정
 * RootLayout에서 감싸서 앱 전체에서 인증 상태를 사용할 수 있게 함
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const initAuth = useAuthStore((state) => state.initAuth);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const fetchUser = useAuthStore((state) => state.fetchUser);
  const fetchSseServerUrl = useAuthStore((state) => state.fetchSseServerUrl);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    if (isLoggedIn) {
      console.log('[AuthProvider] isLoggedIn=true → fetchUser 호출');
      fetchUser();
      fetchSseServerUrl();
    }
  }, [isLoggedIn, fetchUser, fetchSseServerUrl]);

  return <>{children}</>;
}
