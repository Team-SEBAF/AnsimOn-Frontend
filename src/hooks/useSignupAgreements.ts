'use client';

import type { UseFormReturn } from 'react-hook-form';
import type { SignupFormValues } from '@/schemas/auth/signup.schema';

export function useSignupAgreements(form: UseFormReturn<SignupFormValues>) {
  const agreeAge = form.watch('agreeAge');
  const agreeTerms = form.watch('agreeTerms');
  const agreePrivacy = form.watch('agreePrivacy');
  const agreeMarketing = form.watch('agreeMarketing');

  const isAllChecked = agreeAge && agreeTerms && agreePrivacy && agreeMarketing;

  const handleAgreeAll = (checked: boolean) => {
    form.setValue('agreeAge', checked);
    form.setValue('agreeTerms', checked);
    form.setValue('agreePrivacy', checked);
    form.setValue('agreeMarketing', checked);
  };

  return {
    agreeAge,
    agreeTerms,
    agreePrivacy,
    agreeMarketing,
    isAllChecked,
    handleAgreeAll,
  };
}
