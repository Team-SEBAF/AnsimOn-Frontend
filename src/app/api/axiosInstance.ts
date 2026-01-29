import axios, { AxiosError } from 'axios';

export type ApiError = {
  code?: string;
  message?: string;
};

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});

/**
 * 공통 에러 처리:
 * - 백엔드가 내려주는 { code, message } 형태면 그대로 throw
 * - 응답이 없으면(네트워크/타임아웃) 표준 에러로 throw
 */
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
