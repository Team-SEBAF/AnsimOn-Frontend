import { authCookies } from '@/utils/auth';
import { axiosInstance } from '@/api/axiosInstance';
import { create } from 'zustand';

export interface User {
  user_sub: string;
  email: string;
  email_verified: boolean;
  name: string;
  birthdate: string;
  created_at: string;
  complaint_id: string;
}

interface AuthState {
  isLoggedIn: boolean;
  isAuthInitialized: boolean;
  user: User | null;

  login: (accessToken: string, refreshToken: string, idToken: string) => void;
  logout: () => void;
  initAuth: () => void;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  isAuthInitialized: false,
  user: null,

  login: (accessToken, refreshToken, idToken) => {
    authCookies.setTokens(accessToken, refreshToken, idToken);
    set({ isLoggedIn: true });
  },

  logout: () => {
    authCookies.clearTokens();
    set({ isLoggedIn: false, user: null });
  },

  initAuth: () => {
    set({
      isLoggedIn: authCookies.isLoggedIn(),
      isAuthInitialized: true,
    });
  },

  fetchUser: async () => {
    try {
      console.log('[AuthStore] fetchUser 호출');
      const res = await axiosInstance.get<User>('/api/v1/users/me');
      console.log('[AuthStore] fetchUser 응답:', res.data);
      set({ user: res.data });
    } catch (err) {
      console.error('[AuthStore] fetchUser 실패:', err);
      set({ user: null });
    }
  },
}));
