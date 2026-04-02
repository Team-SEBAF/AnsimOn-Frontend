'use client';

import { useForm } from 'react-hook-form';
import { FormTable } from './FormTable';
import type { ComplainantFormValues, RowConfig } from '@/types/document';

const ROWS: RowConfig[] = [
  {
    cells: [
      { type: 'label', text: '성 명', subText: '( 상호·대표자 )' },
      { name: 'name', placeholder: '고소인의 성명을 입력하세요' },
      { type: 'label', text: '주민등록번호', subText: '( 법인등록번호 )' },
      { name: 'idNumber', placeholder: '0000000-0000000' },
    ],
  },
  {
    cells: [
      { type: 'label', text: '주 소', subText: '( 주사무소 소재지 )' },
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
      { type: 'label', text: '대리인에\n의한 고소' },
      {
        type: 'checkbox-group',
        items: [
          {
            checkboxName: 'legalRep',
            label: '법정 대리인',
            fields: [
              { label: '( 성명 :', name: 'legalRepName' },
              { label: ', 연락처 :', name: 'legalRepContact' },
            ],
          },
          {
            checkboxName: 'lawyerRep',
            label: '고소 대리인',
            fields: [
              { label: '( 성명 : 변호사', name: 'lawyerRepName' },
              { label: ', 연락처 :', name: 'lawyerRepContact' },
            ],
          },
        ],
      },
    ],
  },
];

export function ComplainantForm() {
  const { register, watch, control } = useForm<ComplainantFormValues>({
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
      legalRep: false,
      legalRepName: '',
      legalRepContact: '',
      lawyerRep: false,
      lawyerRepName: '',
      lawyerRepContact: '',
    },
  });

  return (
    <section>
      <h3 className="typo-heading-3 mb-3 text-gray-900">
        1. 고소인 <span className="typo-body-8 text-error ml-1">필수</span>
      </h3>
      <FormTable rows={ROWS} register={register} watch={watch} control={control} />
    </section>
  );
}
