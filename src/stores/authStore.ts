import { authCookies } from '@/utils/auth';
import { create } from 'zustand';

interface AuthState {
  isLoggedIn: boolean;
  isAuthInitialized: boolean; // 인증 상태 초기화 완료 여부

  // 액션
  login: (accessToken: string, refreshToken: string, idToken: string) => void;
  logout: () => void;
  initAuth: () => void; // 앱 시작 시 쿠키에서 인증 상태 복원
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  isAuthInitialized: false,

  login: (accessToken, refreshToken, idToken) => {
    authCookies.setTokens(accessToken, refreshToken, idToken);
    set({ isLoggedIn: true });
  },

  logout: () => {
    authCookies.clearTokens();
    set({ isLoggedIn: false });
  },

  initAuth: () => {
    set({
      isLoggedIn: authCookies.isLoggedIn(),
      isAuthInitialized: true,
    });
  },
}));
