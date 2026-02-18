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

/** step 값에 따라 렌더링할 컴포넌트 매핑 */
const STEP_COMPONENTS: Record<Step, () => React.JSX.Element> = {
  1: StepCollect,
  2: StepTimeline,
  3: StepDocument,
  4: StepComplete,
};

/** step 범위(1~4) 클램핑 */
const clampStep = (n: number): Step => {
  if (n <= MIN_STEP) return MIN_STEP;
  if (n >= MAX_STEP) return MAX_STEP;
  return n as Step;
};

export default function CasePage() {
  // TODO: React Query로 전환
  // - useQuery로 GET /api/v1/complaints/my-complaint 조회 (title, step, updatedAt)
  // - useMutation으로 PATCH /api/v1/complaints/my-complaint (title, step 저장)
  // - useState 제거 후 서버 데이터로 대체
  const [title, setTitle] = useState('사건 제목');
  const [step, setStep] = useState<Step>(1);

  const goNext = () => setStep((prev) => clampStep(prev + 1));
  const goPrev = () => setStep((prev) => clampStep(prev - 1));

  const StepContent = STEP_COMPONENTS[step];

  return (
    <div>
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
      <CaseProgress currentStep={step} />
      <StepContent />
    </div>
  );
}
