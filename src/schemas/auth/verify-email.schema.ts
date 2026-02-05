import { z } from 'zod';

export const verifyEmailSchema = z.object({
  email: z.string().email(),
  code: z.string().min(6, '인증번호를 입력해주세요').max(6, '인증번호는 6자리입니다'),
});

export type VerifyEmailFormValues = z.infer<typeof verifyEmailSchema>;
