import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { authCookies } from '@/utils/auth';

export type ApiError = {
  code?: string;
  message?: string;
};

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});

// 토큰 갱신 중복 방지 플래그
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// 대기 중인 요청들에게 새 토큰 전달
const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

// 토큰 갱신 대기열에 추가
const addRefreshSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

// 요청 인터셉터: 토큰 자동 첨부
axiosInstance.interceptors.request.use((config) => {
  const token = authCookies.getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 응답 인터셉터: 401 에러 시 토큰 갱신 + 공통 에러 처리
axiosInstance.interceptors.response.use(
  (res) => res,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // 401 에러이고, 재시도하지 않은 요청인 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      // 토큰 갱신 API 자체에서 401이 발생한 경우 → 로그인 페이지로
      if (originalRequest.url?.includes('/token/refresh')) {
        authCookies.clearTokens();
        if (typeof window !== 'undefined') {
          const redirect = encodeURIComponent(window.location.pathname);
          window.location.href = `/auth/login?redirect=${redirect}`;
        }
        return Promise.reject(error);
      }

      // 이미 갱신 중이면 대기
      if (isRefreshing) {
        return new Promise((resolve) => {
          addRefreshSubscriber((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(axiosInstance(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const idToken = authCookies.getIdToken();
        const refreshToken = authCookies.getRefreshToken();

        if (!idToken || !refreshToken) {
          throw new Error('No tokens');
        }

        // 토큰 갱신 API 호출
        const res = await axiosInstance.post('/api/v1/users/token/refresh', {
          idToken,
          refreshToken,
        });

        const { access_token, id_token } = res.data;

        // 새 토큰 저장
        authCookies.updateTokens(access_token, id_token);

        // 대기 중인 요청들에게 새 토큰 전달
        onRefreshed(access_token);

        // 원래 요청 재시도
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return axiosInstance(originalRequest);
      } catch {
        // 갱신 실패 → 로그아웃 처리
        authCookies.clearTokens();
        if (typeof window !== 'undefined') {
          const redirect = encodeURIComponent(window.location.pathname);
          window.location.href = `/auth/login?redirect=${redirect}`;
        }
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    // 그 외 에러 처리
    const data = error.response?.data;

    if (data) {
      return Promise.reject(data);
    }

    return Promise.reject({
      code: 'NETWORK_ERROR',
      message: '네트워크 오류가 발생했습니다.',
    } satisfies ApiError);
  },
);
