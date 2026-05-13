import { useEffect, useRef } from 'react';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { CombinedDocumentFormValues } from '@/types/document';

const GUIDE_ITEMS = [
  '진술서는 피해 사실을 본인의 언어로 자유롭게 작성하는 문서입니다.',
  '시간 순서대로 구체적인 사실을 기재하되, 감정이나 느낌도 함께 서술하시면 좋습니다.',
  '피해로 인한 정신적·신체적 고통, 일상생활의 어려움 등도 상세히 기록해주세요.',
];

interface Props {
  register: UseFormRegister<CombinedDocumentFormValues>;
  errors?: FieldErrors<CombinedDocumentFormValues>;
  policeStation?: string | null;
}

export function StatementContent({ register, errors, policeStation }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const { ref: registerRef, ...statementRest } = register('statement.damage_facts_statement', {
    required: '피해 사실 진술을 입력해주세요',
    validate: (v: string) => !!v?.trim() || '피해 사실 진술을 입력해주세요',
  });

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  });

  return (
    <div className="min-w-292 rounded-xl bg-white py-6 shadow-[0px_20px_50px_-5px_#4040400D]">
      {/* 문서 헤더 */}
      <div className="border-b border-gray-200 px-6 py-12 text-center">
        <h2 className="typo-heading-1 text-gray-900">진술서</h2>
        <p className="typo-body-4 mt-2 text-gray-400">스토킹 피해 사실에 관한 진술서</p>
      </div>

      <div className="flex flex-col gap-6 px-6 py-12">
        {/* 작성 안내 */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <p className="typo-heading-5 mb-2">진술서 작성 안내</p>
          <ul className="flex flex-col gap-2">
            {GUIDE_ITEMS.map((item) => (
              <li key={item} className="typo-body-6 flex gap-1.5 text-gray-500">
                <span className="shrink-0">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 피해 사실 진술 */}
        <div className="flex flex-col gap-2">
          <h3 className="typo-body-2 text-gray-700">
            피해 사실 진술<span className="typo-label text-primary ml-1">필수</span>
          </h3>
          <textarea
            {...statementRest}
            ref={(el) => {
              registerRef(el);
              textareaRef.current = el;
            }}
            style={{ minHeight: '336px' }}
            placeholder="피해 사실을 입력해주세요"
            aria-invalid={!!errors?.statement?.damage_facts_statement}
            className="typo-body-7 focus:border-primary w-full resize-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none placeholder:text-gray-300"
          />
          {errors?.statement?.damage_facts_statement && (
            <p className="typo-body-8 text-error">
              {errors.statement.damage_facts_statement.message}
            </p>
          )}
        </div>

        {/* 하단 서명 영역 */}
        <div className="flex flex-col items-center gap-6 pt-4">
          <p className="typo-body-7 text-center text-black">
            위 진술 내용은 사실과 다름없음을 확인합니다
          </p>

          {/* 날짜 */}
          <div className="typo-body-3 flex items-end justify-center gap-2 text-black">
            <span>20</span>
            <span className="w-16 border-b px-0.5" />
            <span>년</span>
            <span className="w-16 border-b px-0.5" />
            <span>월</span>
            <span className="w-16 border-b px-0.5" />
            <span>일</span>
          </div>

          {/* 진술인 */}
          <div className="flex flex-col items-center gap-1">
            <div className="typo-body-3 flex items-end gap-2 text-black">
              <span>진술인</span>
              <input
                {...register('statement.declarant_name', {
                  required: '진술인 이름을 입력해주세요',
                })}
                className="w-40 border-b bg-transparent px-0.5 text-center outline-none focus:border-gray-500"
              />
              <span>(인)</span>
            </div>
            {errors?.statement?.declarant_name && (
              <p className="typo-body-8 text-red-500">{errors.statement.declarant_name.message}</p>
            )}
          </div>

          {/* 경찰청 귀중 */}
          <div className="flex items-end justify-center gap-2 pt-6">
            <div className="flex w-40 flex-col items-center">
              <span className="typo-body-4 text-gray-900">{policeStation ?? ''}</span>
              <span className="w-full border-b" />
            </div>
            <span className="typo-heading-1 shrink-0 text-gray-900">귀중</span>
          </div>

          <p className="typo-body-8 -mt-4 text-center text-gray-300">
            ※ 고소장 기재 시 가까운 경찰서에 제출해주세요
          </p>
        </div>
      </div>
    </div>
  );
}
