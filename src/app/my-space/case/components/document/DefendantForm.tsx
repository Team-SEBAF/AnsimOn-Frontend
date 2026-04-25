'use client';

import { FormTable } from './FormTable';
import { SectionBlock } from './SectionBlock';
import type { DocumentFormValues, FormTableProps, RowConfig } from '@/types/document';

const ROWS: RowConfig[] = [
  {
    cells: [
      { type: 'label', text: '성 명' },
      { name: 'section_2_accused.name', placeholder: '피고소인 성명을 입력하세요' },
      { type: 'label', text: '주민등록번호' },
      { name: 'section_2_accused.resident_registration_number', placeholder: '0000000-0000000' },
    ],
  },
  {
    cells: [
      { type: 'label', text: '주 소' },
      { name: 'section_2_accused.address', placeholder: '(현 거주지) 주소를 입력해주세요' },
    ],
  },
  {
    cells: [
      { type: 'label', text: '직업' },
      {
        name: 'section_2_accused.occupation',
        placeholder: "직업 혹은 '무직'을 입력해주세요",
      },
      { type: 'label', text: '사무실 주소' },
      {
        name: 'section_2_accused.office_address',
        placeholder: "현 사무실 주소 혹은 '없음'을 입력해주세요",
      },
    ],
  },
  {
    cells: [
      { type: 'label', text: '전화' },
      { name: 'section_2_accused.contact.mobile', placeholder: '010-0000-0000', prefix: '휴대폰' },
      { name: 'section_2_accused.contact.home', placeholder: '02-0000-0000', prefix: '자택' },
      { name: 'section_2_accused.contact.office', placeholder: '02-0000-0000', prefix: '사무실' },
    ],
  },
  {
    cells: [
      { type: 'label', text: '이메일' },
      { name: 'section_2_accused.email', placeholder: 'ansimon@gmail.com' },
    ],
  },
  {
    cells: [
      { type: 'label', text: '기타사항' },
      { name: 'section_2_accused.other_details', placeholder: '특징 기재' },
    ],
  },
];

type Props = Pick<FormTableProps<DocumentFormValues>, 'register' | 'watch' | 'control'>;

export function DefendantForm({ register, watch, control }: Props) {
  return (
    <SectionBlock title="2. 피고소인" required>
      <div className="flex flex-col gap-2">
        <FormTable rows={ROWS} register={register} watch={watch} control={control} />
        <p className="typo-body-7 text-gray-400">
          ※ 기타사항에는 고소인의 관계 및 피고소인의 인적사항과 연락처를 정확히 알 수 없을 경우
          피고소인의 성별, 특징적 외모, 인상착의 등으로 기재하시기 바랍니다.
        </p>
      </div>
    </SectionBlock>
  );
}
