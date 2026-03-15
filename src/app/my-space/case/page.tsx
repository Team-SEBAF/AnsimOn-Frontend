'use client';

import { useAuthStore } from '@/stores/authStore';
import { useComplaint, useUpdateComplaint } from './hooks/useComplaint';
import { STEP_MAP, STEP_REVERSE_MAP, type Step } from '@/types/complaint';
import {
  CaseHeader,
  CaseProgress,
  StepCollect,
  StepTimeline,
  StepDocument,
  StepComplete,
} from './components';

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
  const user = useAuthStore((s) => s.user);
  const { data: complaint, isLoading } = useComplaint(user?.complaint_id);
  const { mutate: save, isPending: isSaving } = useUpdateComplaint(user?.complaint_id);

  // 서버 데이터 → 프론트 step 변환
  const step: Step = complaint ? STEP_MAP[complaint.step] : 1;
  const title = complaint?.name ?? '사건 제목';

  /** 다음 스텝으로 이동 + 서버 저장 */
  const goNext = () => {
    const nextStep = clampStep(step + 1);
    save({ step: STEP_REVERSE_MAP[nextStep] });
  };

  /** 이전 스텝으로 이동 + 서버 저장 */
  const goPrev = () => {
    const prevStep = clampStep(step - 1);
    save({ step: STEP_REVERSE_MAP[prevStep] });
  };

  /** 제목 변경 + 서버 저장 */
  const handleTitleChange = (newTitle: string) => {
    save({ name: newTitle });
  };

  /** 저장 버튼 클릭 */
  const handleSave = () => {
    save({ name: title, step: STEP_REVERSE_MAP[step] });
  };

  if (isLoading) return <div className="p-6">로딩 중...</div>;

  return (
    <div>
      {/* 상단 헤더: 제목 편집 + 저장 + 이전/다음 버튼 */}
      <CaseHeader
        title={title}
        onTitleChange={handleTitleChange}
        onSave={handleSave}
        isSaving={isSaving}
        isSaveDisabled={step === 1}
        onPrev={goPrev}
        onNext={goNext}
        hasPrev={step > MIN_STEP}
        hasNext={step < MAX_STEP}
        updatedAt={complaint?.updated_at ?? ''}
      />
      <div className="space-y-6 p-6">
        {/* 4단계 프로그레스 바 */}
        <CaseProgress currentStep={step} />
        {/* 스텝별 컨텐츠 조건부 렌더링 */}
        {step === 1 && <StepCollect complaintId={user?.complaint_id} />}
        {step === 2 && <StepTimeline />}
        {step === 3 && <StepDocument />}
        {step === 4 && <StepComplete />}
      </div>
    </div>
  );
}
