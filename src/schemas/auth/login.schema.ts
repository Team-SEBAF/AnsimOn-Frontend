import { z } from 'zod';

// 로그인 폼 유효성 검사 스키마
export const loginSchema = z.object({
  email: z.string().email('이메일 형식이 올바르지 않습니다'),
  password: z.string().min(1, '비밀번호를 입력해주세요'),
});

// 로그인 폼 타입 (스키마에서 추론)
export type LoginFormValues = z.infer<typeof loginSchema>;
