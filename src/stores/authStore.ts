import { authCookies } from '@/utils/auth';
import { axiosInstance } from '@/api/axiosInstance';
import { getSseServerUrl } from '@/api/timeline';
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
  sseBaseUrl: string | null;
  loginMethod: 'google' | 'email' | null;

  login: (
    accessToken: string,
    refreshToken: string,
    idToken: string,
    method: 'google' | 'email',
  ) => void;
  logout: () => void;
  initAuth: () => void;
  fetchUser: () => Promise<void>;
  fetchSseServerUrl: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  isAuthInitialized: false,
  user: null,
  sseBaseUrl: null,
  loginMethod: null,

  login: (accessToken, refreshToken, idToken, method) => {
    authCookies.setTokens(accessToken, refreshToken, idToken);
    set({ isLoggedIn: true, loginMethod: method });
  },

  logout: () => {
    authCookies.clearTokens();
    set({ isLoggedIn: false, user: null, sseBaseUrl: null, loginMethod: null });
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

  fetchSseServerUrl: async () => {
    try {
      const { base_url } = await getSseServerUrl();
      set({ sseBaseUrl: base_url });
    } catch (err) {
      console.error('[AuthStore] fetchSseServerUrl 실패:', err);
    }
  },
}));
