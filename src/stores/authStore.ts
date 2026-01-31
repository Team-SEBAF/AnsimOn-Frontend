import { authCookies } from '@/utils/auth';
import { create } from 'zustand';

interface AuthState {
  isLoggedIn: boolean;

  // 액션
  login: (accessToken: string, refreshToken: string, idToken: string) => void;
  logout: () => void;
  checkAuth: () => void; // 페이지 새로고침 시 쿠키에서 상태 복원
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,

  login: (accessToken, refreshToken, idToken) => {
    authCookies.setTokens(accessToken, refreshToken, idToken);
    set({ isLoggedIn: true });
  },

  logout: () => {
    authCookies.clearTokens();
    set({ isLoggedIn: false });
  },

  checkAuth: () => {
    set({ isLoggedIn: authCookies.isLoggedIn() });
  },
}));
