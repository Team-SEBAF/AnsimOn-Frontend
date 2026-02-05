'use client';

import { useState } from 'react';
import { useWatch } from 'react-hook-form';
import { Eye, EyeOff, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverAnchor, PopoverContent } from '@/components/ui/popover';
import { EmailConfirmModal } from '@/components/modals';
import { useSignupAgreements } from '@/hooks/useSignupAgreements';
import { useSignupForm } from '@/hooks/useSignupForm';
import { parseBirthdate, formatBirthdateInput } from '@/utils/date';

/**
 * 약관 동의 항목 목록
 * @property id - 폼 필드명 (agreeAge, agreeTerms, agreePrivacy, agreeMarketing)
 * @property label - 체크박스 라벨
 * @property showLink - 약관보기 링크 표시 여부
 */
const AGREEMENT_ITEMS = [
  { id: 'agreeAge', label: '필수: 본인은 만 14세 이상입니다', showLink: false },
  { id: 'agreeTerms', label: '필수: 이용약관 동의', showLink: true },
  { id: 'agreePrivacy', label: '필수: 개인정보 수집 및 이용 동의', showLink: true },
  { id: 'agreeMarketing', label: '마케팅 정보 수신 동의', showLink: true },
] as const;

/**
 * 이메일 회원가입 폼
 *
 * @description
 * 이메일, 비밀번호, 이름, 생년월일, 약관 동의를 입력받는 회원가입 폼.
 * 폼 제출 시 이메일 확인 모달을 표시하고, 확인 후 회원가입 API를 호출한다.
 *
 * @flow
 * 1. 사용자 입력 → Zod 스키마 검증
 * 2. 폼 제출 → 이메일 확인 모달 표시
 * 3. 모달 확인 → 회원가입 API 호출 → /auth/verify 페이지로 이동
 *
 * @todo 약관보기 모달/페이지 연결
 */
export function SignupForm() {
  const { form, submit, showPassword, togglePassword, showPasswordConfirm, togglePasswordConfirm } =
    useSignupForm();
  const { isAllChecked, handleAgreeAll } = useSignupAgreements(form);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);

  /** 필요한 필드만 구독하여 불필요한 리렌더 방지 */
  const birthdate = useWatch({ control: form.control, name: 'birthdate' });
  const email = useWatch({ control: form.control, name: 'email' });
  const [agreeAge, agreeTerms, agreePrivacy, agreeMarketing] = useWatch({
    control: form.control,
    name: ['agreeAge', 'agreeTerms', 'agreePrivacy', 'agreeMarketing'],
  });
  const agreementValues = { agreeAge, agreeTerms, agreePrivacy, agreeMarketing };

  /** 캘린더에서 날짜 선택 시 폼에 YYYY-MM-DD 형식으로 저장 */
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      form.setValue('birthdate', format(date, 'yyyy-MM-dd'));
      setCalendarOpen(false);
    }
  };

  /** 생년월일 입력 시 자동 하이픈 포맷팅 (YYYYMMDD → YYYY-MM-DD) */
  const handleBirthdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatBirthdateInput(e.target.value);
    form.setValue('birthdate', formatted);
  };

  /** 폼 제출 핸들러: 검증 통과 시 이메일 확인 모달 표시 */
  const handleFormSubmit = () => {
    setEmailModalOpen(true);
  };

  /** 이메일 확인 모달 확인 버튼: 회원가입 API 호출 */
  const handleEmailConfirm = () => {
    setEmailModalOpen(false);
    submit(form.getValues());
  };

  return (
    <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-2">
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
      <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
        <PopoverAnchor asChild>
          <div>
            <Input
              label="생년월일"
              required
              inputMode="numeric"
              placeholder="YYYY-MM-DD"
              maxLength={10}
              value={birthdate}
              onChange={handleBirthdateChange}
              error={form.formState.errors.birthdate?.message}
              icon={<CalendarIcon size={16} />}
              onIconClick={() => setCalendarOpen(true)}
            />
          </div>
        </PopoverAnchor>
        <PopoverContent
          className="w-auto overflow-hidden bg-white p-0"
          align="start"
          sideOffset={8}
        >
          <Calendar
            mode="single"
            selected={parseBirthdate(birthdate)}
            onSelect={handleDateSelect}
            defaultMonth={new Date()}
            startMonth={new Date(1900, 0)}
            endMonth={new Date(new Date().getFullYear(), 11)}
          />
        </PopoverContent>
      </Popover>

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
                checked={agreementValues[item.id]}
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
          이메일 인증
        </Button>
      </div>

      <EmailConfirmModal
        open={emailModalOpen}
        email={email}
        onConfirm={handleEmailConfirm}
        onOpenChange={setEmailModalOpen}
      />
    </form>
  );
}
