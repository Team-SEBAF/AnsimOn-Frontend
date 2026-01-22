import { z } from 'zod';

export const verifyEmailSchema = z.object({
  email: z.string().email(),
  code: z.string().min(6, '인증 코드를 입력해주세요').max(6, '인증 코드는 6자리입니다'),
});

export type VerifyEmailFormValues = z.infer<typeof verifyEmailSchema>;
