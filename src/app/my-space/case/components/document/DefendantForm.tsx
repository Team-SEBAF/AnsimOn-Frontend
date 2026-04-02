'use client';

import { useForm } from 'react-hook-form';
import { FormTable } from './FormTable';
import type { DefendantFormValues, RowConfig } from '@/types/document';

const ROWS: RowConfig[] = [
  {
    cells: [
      { type: 'label', text: '성 명' },
      { name: 'name', placeholder: '피고소인 성명을 입력하세요' },
      { type: 'label', text: '주민등록번호' },
      { name: 'idNumber', placeholder: '0000000-0000000' },
    ],
  },
  {
    cells: [
      { type: 'label', text: '주 소' },
      { name: 'address', placeholder: '(현 거주지) 주소를 입력해주세요' },
    ],
  },
  {
    cells: [
      { type: 'label', text: '직업' },
      { name: 'job', placeholder: '현 직업을 입력해주세요' },
      { type: 'label', text: '사무실 주소' },
      { name: 'officeAddress', placeholder: '현 사무실 주소를 입력해주세요' },
    ],
  },
  {
    cells: [
      { type: 'label', text: '전화' },
      { name: 'phoneMobile', placeholder: '010-0000-0000', prefix: '휴대폰' },
      { name: 'phoneHome', placeholder: '02-0000-0000', prefix: '자택' },
      { name: 'phoneOffice', placeholder: '02-0000-0000', prefix: '사무실' },
    ],
  },
  {
    cells: [
      { type: 'label', text: '이메일' },
      { name: 'email', placeholder: 'ansimon@gmail.com' },
    ],
  },
  {
    cells: [
      { type: 'label', text: '기타사항' },
      { name: 'notes', placeholder: '특징 기재' },
    ],
  },
];

export function DefendantForm() {
  const { register, watch, control } = useForm<DefendantFormValues>({
    defaultValues: {
      name: '',
      idNumber: '',
      address: '',
      job: '',
      officeAddress: '',
      phoneMobile: '',
      phoneHome: '',
      phoneOffice: '',
      email: '',
      notes: '',
    },
  });

  return (
    <section>
      <h3 className="typo-heading-3 mb-3 text-gray-900">
        2. 피고소인 <span className="typo-body-8 text-error ml-1">필수</span>
      </h3>
      <FormTable rows={ROWS} register={register} watch={watch} control={control} />
    </section>
  );
}
