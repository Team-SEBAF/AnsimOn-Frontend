'use client';

import { Eye, EyeOff, Calendar } from 'lucide-react';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Checkbox } from '@/components/ui/checkbox';
import { useSignupAgreements } from '@/hooks/useSignupAgreements';
import { useSignupForm } from '@/hooks/useSignupForm';

/* TODO
 * 약관보기 모달/페이지 연결
 * 이메일 확인 모달 연결
 * 생일 입력 캘린더 연결 (shadcn)
 */

const AGREEMENT_ITEMS = [
  { id: 'agreeAge', label: '필수: 본인은 만 14세 이상입니다', showLink: false },
  { id: 'agreeTerms', label: '필수: 이용약관 동의', showLink: true },
  { id: 'agreePrivacy', label: '필수: 개인정보 수집 및 이용 동의', showLink: true },
  { id: 'agreeMarketing', label: '마케팅 정보 수신 동의', showLink: true },
] as const;

export function SignupForm() {
  const { form, submit, showPassword, togglePassword, showPasswordConfirm, togglePasswordConfirm } =
    useSignupForm();

  const { isAllChecked, handleAgreeAll } = useSignupAgreements(form);

  return (
    <form onSubmit={form.handleSubmit(submit)} className="space-y-2">
      {/* 이메일 */}
      <Input
        label="이메일"
        required
        type="email"
        placeholder="이메일을 입력해주세요"
        error={form.formState.errors.email?.message}
        {...form.register('email')}
      />

      {/* 비밀번호 */}
      <Input
        label="비밀번호"
        required
        type={showPassword ? 'text' : 'password'}
        placeholder="비밀번호를 입력해주세요"
        error={form.formState.errors.password?.message}
        icon={showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
        onIconClick={togglePassword}
        {...form.register('password')}
      />

      {/* 비밀번호 확인 */}
      <Input
        label="비밀번호 확인"
        required
        type={showPasswordConfirm ? 'text' : 'password'}
        placeholder="비밀번호를 다시한번 입력해주세요"
        error={form.formState.errors.passwordConfirm?.message}
        icon={showPasswordConfirm ? <Eye size={16} /> : <EyeOff size={16} />}
        onIconClick={togglePasswordConfirm}
        {...form.register('passwordConfirm')}
      />

      {/* 이름 */}
      <Input
        label="이름"
        required
        type="text"
        placeholder="본인 이름을 입력해주세요"
        error={form.formState.errors.name?.message}
        {...form.register('name')}
      />

      {/* 생년월일 */}
      <Input
        label="생년월일"
        required
        type="text"
        inputMode="numeric"
        placeholder="YYYYMMDD"
        maxLength={8}
        error={form.formState.errors.birthdate?.message}
        icon={<Calendar size={16} />}
        {...form.register('birthdate', {
          onChange: (e) => {
            const onlyNumber = e.target.value.replace(/[^0-9]/g, '');
            form.setValue('birthdate', onlyNumber);
          },
        })}
      />

      {/* 동의 항목 */}
      <section className="space-y-3 pt-4" aria-label="약관 동의">
        {/* 전체 동의 */}
        <label className="flex cursor-pointer items-center gap-2">
          <Checkbox
            id="agreeAll"
            checked={isAllChecked}
            onCheckedChange={(checked) => handleAgreeAll(checked === true)}
          />
          <span className="text-sm font-medium text-gray-900">전체동의</span>
        </label>

        <div className="h-px bg-gray-200" />

        {AGREEMENT_ITEMS.map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-2">
            <label className="flex cursor-pointer items-center gap-2">
              <Checkbox
                variant="ghost"
                id={item.id}
                checked={form.watch(item.id)}
                onCheckedChange={(checked) => form.setValue(item.id, checked === true)}
              />
              <span className="text-sm text-gray-600">{item.label}</span>
            </label>

            {item.showLink && (
              <button
                type="button"
                className="text-xs text-gray-400 underline hover:text-gray-600"
                onClick={() => {
                  // TODO: 약관 보기 모달/페이지 연결
                }}
              >
                약관보기
              </button>
            )}
          </div>
        ))}
      </section>

      {/* 제출 버튼 */}
      <div className="pt-8">
        <Button type="submit" className="h-14 w-full text-base font-semibold">
          회원가입 →
        </Button>
      </div>
    </form>
  );
}
