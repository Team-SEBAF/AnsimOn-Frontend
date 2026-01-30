import { axiosInstance } from '../axiosInstance';

export type SignupEmailPayload = {
  email: string;
  password: string;
  name: string;
  birthdate: string; // YYYY-MM-DD
};

export type VerifyEmailPayload = {
  email: string;
  code: string;
};

export type SignupErrorResponse = {
  code?: string;
  message?: string;
};

export async function signupEmail(payload: SignupEmailPayload): Promise<void> {
  await axiosInstance.post('/api/v1/users/signup/email', payload);
}

export async function verifyEmail(payload: VerifyEmailPayload): Promise<void> {
  await axiosInstance.post('/api/v1/users/verify-email', payload);
}

export async function resendVerificationEmail(email: string): Promise<void> {
  await axiosInstance.post('/api/v1/users/resend-email-verification', { email });
}
