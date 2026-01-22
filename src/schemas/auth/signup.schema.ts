import { z } from 'zod';

export const signupSchema = z.object({
  email: z.string().email('이메일 형식이 올바르지 않습니다'),

  password: z
    .string()
    .min(8, '비밀번호는 8자 이상이어야 합니다')
    .regex(/[a-z]/, '소문자를 포함해야 합니다')
    .regex(/[0-9]/, '숫자를 포함해야 합니다')
    .regex(/[^a-zA-Z0-9]/, '특수문자를 포함해야 합니다'),

  name: z.string().min(1, '이름을 입력해주세요'),

  birthdate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD 형식이어야 합니다'),

  isLegalRepresentative: z.boolean(),
});

export type SignupFormValues = z.infer<typeof signupSchema>;
