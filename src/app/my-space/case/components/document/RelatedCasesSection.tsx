'use client';

import { Controller } from 'react-hook-form';
import type { Control } from 'react-hook-form';
import { SectionBlock } from './SectionBlock';
import { ContentBlock } from './ContentBlock';
import { RadioBtn } from '@/components/RadioBtn';
import type { DocumentFormValues } from '@/types/document';

type BooleanField =
  | 'is_duplicate_complaint'
  | 'has_related_criminal_investigation'
  | 'has_related_civil_lawsuit';

type RowDef = {
  title: string;
  field: BooleanField;
  trueText: string;
  falseText: string;
  trueError: string;
};

const ROWS: RowDef[] = [
  {
    title: '① 중복 고소 여부',
    field: 'is_duplicate_complaint',
    trueText:
      '본 고소장과 같은 내용의 고소장을 다른 경찰서 또는 검찰청에 제출하거나 제출하였던 사실이 있습니다.',
    falseText: '없습니다.',
    trueError: '중복 고소가 있는 경우 고소 진행이 제한됩니다',
  },
  {
    title: '② 관련 형사사건 수사 여부',
    field: 'has_related_criminal_investigation',
    trueText:
      '본 고소장에 기재한 범죄사실과 관련된 사건 또는 공범에 대하여 검찰청이나 경찰서에서 수사 중에 있습니다.',
    falseText: '수사 중에 있지 않습니다.',
    trueError: '관련 형사사건 수사 중인 경우 고소 진행이 제한됩니다',
  },
  {
    title: '③ 관련 민사소송 유무',
    field: 'has_related_civil_lawsuit',
    trueText: '본 고소장에 기재한 범죄사실과 관련된 사건에 대하여 법원에서 민사소송 중에 있습니다.',
    falseText: '민사소송 중에 있지 않습니다.',
    trueError: '관련 민사소송 진행 중인 경우 고소 진행이 제한됩니다',
  },
];

interface Props {
  control: Control<DocumentFormValues>;
}

export function RelatedCasesSection({ control }: Props) {
  return (
    <SectionBlock title="7. 관련 사건의 수사 및 재판 여부" required>
      <div className="flex flex-col gap-4">
        <div className="overflow-hidden rounded-lg border border-gray-200">
          {ROWS.map((row, i) => (
            <Controller
              key={row.field}
              control={control}
              name={`section_7_related_cases.${row.field}`}
              rules={{
                validate: (v) => {
                  if (v === null) return '선택해주세요';
                  if (v === true) return row.trueError;
                  return true;
                },
              }}
              render={({ field, fieldState }) => (
                <div
                  className={`grid grid-cols-[240px_1fr] ${i < ROWS.length - 1 ? 'border-b border-gray-200' : ''}`}
                >
                  <div className="flex flex-col justify-center gap-0.5 border-r border-gray-200 bg-gray-50 px-4 py-3">
                    <span className="typo-heading-5 text-gray-500">{row.title}</span>
                  </div>
                  <div className="flex flex-col gap-3 px-4 py-6">
                    <label className="flex cursor-pointer items-start gap-2">
                      <RadioBtn
                        checked={field.value === true}
                        onChange={() => field.onChange(true)}
                        className="mt-0.5"
                      />
                      <span className="typo-body-7 text-gray-700">{row.trueText}</span>
                    </label>
                    <label className="flex cursor-pointer items-center gap-2">
                      <RadioBtn
                        checked={field.value === false}
                        onChange={() => field.onChange(false)}
                      />
                      <span className="typo-body-7 text-gray-700">{row.falseText}</span>
                    </label>
                    {fieldState.error?.message && (
                      <p className="typo-body-8 text-error">{fieldState.error.message}</p>
                    )}
                  </div>
                </div>
              )}
            />
          ))}
        </div>

        <ContentBlock
          title="기타사항"
          note="※  ①, ②번은 반드시 표시하여야 하며, 만일 본 고소내용을 동일한 사건 또는 관련 형사사건이 수사·재판 중이거나 이는 검찰에서 재판 중이거나 이는 법원에서 기타사항 난에 기재하여야 합니다"
        />
      </div>
    </SectionBlock>
  );
}
