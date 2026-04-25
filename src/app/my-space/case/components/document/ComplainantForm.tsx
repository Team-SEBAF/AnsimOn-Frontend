'use client';

import { FormTable } from './FormTable';
import { SectionBlock } from './SectionBlock';
import type { DocumentFormValues, FormTableProps, RowConfig } from '@/types/document';

const ROWS: RowConfig[] = [
  {
    cells: [
      { type: 'label', text: '성 명', subText: '( 상호·대표자 )' },
      { name: 'section_1_complainant.name_or_company', placeholder: '고소인의 성명을 입력하세요' },
      { type: 'label', text: '주민등록번호', subText: '( 법인등록번호 )' },
      {
        name: 'section_1_complainant.resident_or_corp_registration_number',
        placeholder: '0000000-0000000',
      },
    ],
  },
  {
    cells: [
      { type: 'label', text: '주 소', subText: '( 주사무소 소재지 )' },
      { name: 'section_1_complainant.address', placeholder: '(현 거주지) 주소를 입력해주세요' },
    ],
  },
  {
    cells: [
      { type: 'label', text: '직업' },
      {
        name: 'section_1_complainant.occupation',
        placeholder: "직업 혹은 '무직'을 입력해주세요",
      },
      { type: 'label', text: '사무실 주소' },
      {
        name: 'section_1_complainant.office_address',
        placeholder: "현 사무실 주소 혹은 '없음'을 입력해주세요",
      },
    ],
  },
  {
    cells: [
      { type: 'label', text: '전화' },
      {
        name: 'section_1_complainant.contact.mobile',
        placeholder: '010-0000-0000',
        prefix: '휴대폰',
      },
      { name: 'section_1_complainant.contact.home', placeholder: '02-0000-0000', prefix: '자택' },
      {
        name: 'section_1_complainant.contact.office',
        placeholder: '02-0000-0000',
        prefix: '사무실',
      },
    ],
  },
  {
    cells: [
      { type: 'label', text: '이메일' },
      { name: 'section_1_complainant.email', placeholder: 'ansimon@gmail.com' },
    ],
  },
  {
    cells: [
      { type: 'label', text: '대리인에\n의한 고소' },
      {
        type: 'checkbox-group',
        items: [
          {
            checkboxName: 'section_1_complainant.representative.is_legal_representative',
            label: '법정 대리인',
            fields: [
              { label: '성명 :', name: 'section_1_complainant.representative.name' },
              { label: '연락처 :', name: 'section_1_complainant.representative.contact' },
            ],
          },
          {
            checkboxName: 'section_1_complainant.representative.is_lawyer',
            label: '고소 대리인',
            fields: [
              {
                label: '성명 :',
                name: 'section_1_complainant.representative.name',
                prefix: '변호사',
              },
              { label: '연락처 :', name: 'section_1_complainant.representative.contact' },
            ],
          },
        ],
      },
    ],
  },
];

type Props = Pick<FormTableProps<DocumentFormValues>, 'register' | 'watch' | 'control'>;

export function ComplainantForm({ register, watch, control }: Props) {
  return (
    <SectionBlock title="1. 고소인" required>
      <div className="flex flex-col gap-2">
        <FormTable rows={ROWS} register={register} watch={watch} control={control} />
        <p className="typo-body-7 text-gray-400">
          ※ 고소인이 법인 또는 단체인 경우에는 상호 또는 단체명, 대표자, 법인등록번호(또는
          사업자등록번호), 주된 사무소의 소재지, 전화 등 연락처를 기재하여야 한다. 법인의 경우에는
          법인등록부 등본이 첨부 되어야 한다.
        </p>
        <p className="typo-body-7 text-gray-400">
          ※ 미성년자의 친권자 등 법정대리인이 고소하는 경우 및 변호사에 의한 고소대리의 경우
          법정대리인 관계, 변호사 선임을 증명할 수 있는 서류를 첨부하시기 바랍니다.
        </p>
      </div>
    </SectionBlock>
  );
}
