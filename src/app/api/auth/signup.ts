import { axiosInstance } from '../axiosInstance';

export type SignupEmailPayload = {
  email: string;
  password: string;
  name: string;
  birthdate: string; // YYYY-MM-DD
};

export type SignupErrorResponse = {
  code: string;
  message: string;
};

// 필요하면 성공 응답 타입을 구체화
export async function signupEmail(payload: SignupEmailPayload): Promise<void> {
  await axiosInstance.post('/api/v1/users/signup/email', payload);
}
