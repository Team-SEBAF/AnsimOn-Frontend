'use client';

import { Controller } from 'react-hook-form';
import type { Control, UseFormWatch } from 'react-hook-form';
import { SectionBlock } from './SectionBlock';
import { ContentBlock } from './ContentBlock';
import { RadioBtn } from '@/components/RadioBtn';
import type { DocumentFormValues } from '@/types/document';

interface Props {
  control: Control<DocumentFormValues>;
  watch: UseFormWatch<DocumentFormValues>;
}

export function EvidenceSection({ control, watch }: Props) {
  const hasEvidence = watch('section_6_evidence.has_evidence_beyond_statement');

  return (
    <SectionBlock title="6. 증거자료">
      <div className="flex flex-col gap-3">
        <Controller
          control={control}
          name="section_6_evidence.has_evidence_beyond_statement"
          render={({ field }) => (
            <div className="flex flex-col gap-3">
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-4 py-4">
                <RadioBtn checked={!field.value} onChange={() => field.onChange(false)} />
                <span className="typo-body-7 text-gray-700">
                  고소인은 고소장의 진술 외에 제출할 증거가 없습니다.
                </span>
              </label>
              <div className="flex flex-col gap-1 rounded-lg border border-gray-200 px-4 py-4">
                <label className="flex cursor-pointer items-center gap-2">
                  <RadioBtn checked={field.value} onChange={() => field.onChange(true)} />
                  <span className="typo-body-7 text-gray-700">
                    고소인은 고소장의 진술 외에 제출할 증거가 있습니다.
                  </span>
                </label>
                {field.value && (
                  <p className="typo-body-8 ml-6 text-gray-400">
                    ※ 제출할 증거의 세부내역은 별지로 작성하여 첨부합니다.
                  </p>
                )}
              </div>
            </div>
          )}
        />

        {hasEvidence && (
          <ContentBlock title="제출 예정 증거 목록">
            <Controller
              control={control}
              name="section_6_evidence.evidence_list_text"
              render={({ field }) => (
                <textarea
                  rows={4}
                  placeholder="증거 내용을 입력하세요"
                  value={field.value.join('\n')}
                  onChange={(e) => field.onChange(e.target.value.split('\n'))}
                  className="typo-body-7 focus:border-primary w-full resize-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-700 outline-none placeholder:text-gray-300"
                />
              )}
            />
          </ContentBlock>
        )}
      </div>
    </SectionBlock>
  );
}
