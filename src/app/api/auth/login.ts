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

// 로그인 실패 응답
// USER_NOT_CONFIRMED: 이메일 인증 미완료
// INVALID_CREDENTIALS: 이메일 또는 비밀번호 오류
// USER_NOT_FOUND: 사용자 없음
export type LoginErrorResponse = {
  code?: string;
  message?: string;
};

// 이메일 로그인 API
export async function loginEmail(payload: LoginPayload): Promise<LoginResponse> {
  const res = await axiosInstance.post<LoginResponse>('/api/v1/users/login/email', payload);
  return res.data;
}
