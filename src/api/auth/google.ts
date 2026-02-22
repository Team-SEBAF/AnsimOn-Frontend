import { axiosInstance } from '../axiosInstance';
import { LoginResponse } from './login';

// 구글 로그인 코드로 토큰 교환 API
export async function getGoogleToken(code: string): Promise<LoginResponse> {
  const res = await axiosInstance.post<LoginResponse>('/api/v1/users/google/callback', { code });
  return res.data;
}
