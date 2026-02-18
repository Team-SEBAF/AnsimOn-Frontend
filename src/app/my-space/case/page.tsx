'use client';

import { useState } from 'react';
import {
  CaseHeader,
  CaseProgress,
  StepCollect,
  StepTimeline,
  StepDocument,
  StepComplete,
} from './components';

type Step = 1 | 2 | 3 | 4;

const MIN_STEP: Step = 1;
const MAX_STEP: Step = 4;

/** step 범위(1~4) 클램핑 */
const clampStep = (n: number): Step => {
  if (n <= MIN_STEP) return MIN_STEP;
  if (n >= MAX_STEP) return MAX_STEP;
  return n as Step;
};

/**
 * Case 퍼널 진입점
 * - 하나의 페이지에서 step 상태로 4단계를 전환하는 퍼널 패턴
 * - 헤더(제목·저장·이전/다음) + 프로그레스 바 + 스텝별 컨텐츠로 구성
 * - 이전/다음 버튼 → step 변경 → 헤더·프로그레스·컨텐츠 동기화
 */
export default function CasePage() {
  // TODO: React Query로 전환
  // - useQuery로 GET /api/v1/complaints/my-complaint 조회 (title, step, updatedAt)
  // - useMutation으로 PATCH /api/v1/complaints/my-complaint (title, step 저장)
  // - useState 제거 후 서버 데이터로 대체
  const [title, setTitle] = useState('사건 제목');
  const [step, setStep] = useState<Step>(1);

  /** 다음 스텝으로 이동 (최대 4) */
  const goNext = () => setStep((prev) => clampStep(prev + 1));
  /** 이전 스텝으로 이동 (최소 1) */
  const goPrev = () => setStep((prev) => clampStep(prev - 1));

  return (
    <div>
      {/* 상단 헤더: 제목 편집 + 저장 + 이전/다음 버튼 */}
      <CaseHeader
        title={title}
        onTitleChange={setTitle}
        onSave={() => {}}
        onPrev={goPrev}
        onNext={goNext}
        hasPrev={step > MIN_STEP}
        hasNext={step < MAX_STEP}
        updatedAt="2021.02.22"
      />
      <div className="p-6">
        {/* 4단계 프로그레스 바 */}
        <CaseProgress currentStep={step} />
        {/* 스텝별 컨텐츠 조건부 렌더링 */}
        {step === 1 && <StepCollect />}
        {step === 2 && <StepTimeline />}
        {step === 3 && <StepDocument />}
        {step === 4 && <StepComplete />}
      </div>
    </div>
  );
}
