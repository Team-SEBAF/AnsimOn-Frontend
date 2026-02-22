import { axiosInstance } from '../axiosInstance';

// 로그인 요청 페이로드
export type LoginPayload = {
  email: string;
  password: string;
};

// 로그인 성공 응답 (백엔드 스펙에 맞춤)
export type LoginResponse = {
  access_token: string;
  id_token: string;
  expires_in: number;
  token_type: string;
  refresh_token: string;
};

// 이메일 로그인 API
export async function loginEmail(payload: LoginPayload): Promise<LoginResponse> {
  const res = await axiosInstance.post<LoginResponse>('/api/v1/users/login/email', payload);
  return res.data;
}

// 리프레시 토큰 요청 페이로드
export type RefreshPayload = {
  idToken: string;
  refreshToken: string;
};

// 리프레시 토큰 응답
export type RefreshResponse = {
  access_token: string;
  id_token: string;
  expires_in: number;
  token_type: string;
};

// 토큰 갱신 API
export async function refreshTokens(payload: RefreshPayload): Promise<RefreshResponse> {
  const res = await axiosInstance.post<RefreshResponse>('/api/v1/users/token/refresh', payload);
  return res.data;
}

// 로그아웃 API
export async function logoutApi(): Promise<void> {
  await axiosInstance.post('/api/v1/users/logout');
}
