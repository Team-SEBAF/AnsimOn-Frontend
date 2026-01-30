import { z } from 'zod';

export const signupSchema = z
  .object({
    email: z.string().email('이메일 형식이 올바르지 않습니다'),

    password: z
      .string()
      .min(8, '비밀번호는 8자 이상이어야 합니다')
      .regex(/[a-z]/, '소문자를 포함해야 합니다')
      .regex(/[0-9]/, '숫자를 포함해야 합니다')
      .regex(/[^a-zA-Z0-9]/, '특수문자를 포함해야 합니다'),

    passwordConfirm: z.string().min(1, '비밀번호 확인을 입력해주세요'),

    name: z.string().min(1, '이름을 입력해주세요'),

    birthdate: z.string().regex(/^\d{8}$/, '생년월일은 YYYYMMDD 형식으로 입력해주세요'),

    agreeAge: z.boolean().refine((val) => val === true, '만 14세 이상이어야 합니다'),
    agreeTerms: z.boolean().refine((val) => val === true, '이용약관에 동의해주세요'),
    agreePrivacy: z.boolean().refine((val) => val === true, '개인정보 수집 및 이용에 동의해주세요'),
    agreeMarketing: z.boolean().optional(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['passwordConfirm'],
  });

export type SignupFormValues = z.infer<typeof signupSchema>;
