import axios, { AxiosError } from 'axios';
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

// 요청 인터셉터: 토큰 자동 첨부
axiosInstance.interceptors.request.use((config) => {
  const token = authCookies.getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 응답 인터셉터: 공통 에러 처리
axiosInstance.interceptors.response.use(
  (res) => res,
  (error: AxiosError<ApiError>) => {
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
