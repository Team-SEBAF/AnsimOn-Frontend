'use client';

import { Suspense, useState, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useAuthStore } from '@/stores/authStore';
import { useComplaint, useUpdateComplaint } from './hooks/useComplaint';
import { needToGenerateTimeline, requestGenerateTimeline, getCurrentTaskId } from '@/api/timeline';
import { STEP_MAP, STEP_REVERSE_MAP, type Step } from '@/types/complaint';
import type { TimelinePhase } from '@/types/timeline';
import {
  CaseHeader,
  CaseProgress,
  StepCollect,
  StepTimeline,
  StepDocument,
  StepComplete,
  TimelineGeneratingView,
} from './components';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { CaseErrorFallback } from '@/components/fallbacks/CaseErrorFallback';
import { TimelineErrorFallback } from '@/components/fallbacks/TimelineErrorFallback';
import { CasePageSkeleton } from '@/components/skeletons/CasePageSkeleton';
import { Spinner } from '@/components/Spinner';
import { showAlert } from '@/utils/alert';

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
 * - ErrorBoundary + Suspense로 로딩/에러 처리
 */
export default function CasePage() {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary FallbackComponent={CaseErrorFallback} onReset={reset}>
          <Suspense fallback={<CasePageSkeleton />}>
            <CasePageGuard />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

/** complaintId 존재 확인 후 CasePageContent 렌더 */
function CasePageGuard() {
  const user = useAuthStore((s) => s.user);
  if (!user?.complaint_id) return null;
  return <CasePageContent complaintId={user.complaint_id} />;
}

/**
 * Case 퍼널 컨텐츠
 * - 하나의 페이지에서 step 상태로 4단계를 전환하는 퍼널 패턴
 * - 헤더(제목·저장·이전/다음) + 프로그레스 바 + 스텝별 컨텐츠로 구성
 * - 이전/다음 버튼 → step 변경 → 헤더·프로그레스·컨텐츠 동기화
 */
function CasePageContent({ complaintId }: { complaintId: string }) {
  const { data: complaint } = useComplaint(complaintId);
  const { mutate: save, isPending: isSaving } = useUpdateComplaint(complaintId);
  const [phase, setPhase] = useState<TimelinePhase>(
    complaint.step === 'TIMELINE_GENERATING' ? 'restoring' : 'idle',
  );
  const [taskId, setTaskId] = useState<string | null>(null);

  // 서버 데이터 → 프론트 step 변환 — 생성 플로우 진입 중에는 step 2로 표시
  const step: Step = phase !== 'idle' ? 2 : STEP_MAP[complaint.step];
  const title = complaint.name;

  // TIMELINE_GENERATING 재진입 처리 — task_id 조회 후 SSE 연결
  useEffect(() => {
    if (phase !== 'restoring') return;
    getCurrentTaskId(complaintId)
      .then(({ task_id }) => {
        setTaskId(task_id);
        setPhase('generating');
      })
      .catch(() => {
        setPhase('idle');
        showAlert.error({
          title: '타임라인 생성 정보를 불러오는 중 오류가 발생했어요.\n다시 시도해주세요.',
        });
      });
  }, [phase, complaintId]);

  const handleGenerateDone = () => {
    setPhase('idle');
    setTaskId(null);
    save({ step: 'TIMELINE' });
  };

  /** 타임라인 생성 재시도 — 새 task_id로 SSE 재연결 */
  const handleGenerateRetry = async () => {
    try {
      setPhase('starting');
      const { task_id } = await requestGenerateTimeline(complaintId, 'openAI');
      setTaskId(task_id);
      setPhase('generating');
    } catch {
      setPhase('error');
    }
  };

  /** 다음 스텝으로 이동 + 서버 저장 */
  const goNext = async () => {
    try {
      if (step === 1) {
        const { need_to_generate } = await needToGenerateTimeline(complaintId);
        if (need_to_generate) {
          const { task_id } = await requestGenerateTimeline(complaintId, 'openAI');
          setTaskId(task_id);
          setPhase('generating');
          return;
        }
      }
      const nextStep = clampStep(step + 1);
      save({ step: STEP_REVERSE_MAP[nextStep] });
    } catch {
      showAlert.error({
        title: '다음 단계로 이동하는 중 오류가 발생했어요.\n다시 시도해주세요.',
      });
    }
  };

  /** 이전 스텝으로 이동 + 서버 저장 */
  const goPrev = () => {
    setPhase('idle');
    setTaskId(null);
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

  return (
    <div>
      {/* 상단 헤더: 제목 편집 + 저장 + 이전/다음 버튼 */}
      <CaseHeader
        title={title}
        onTitleChange={handleTitleChange}
        onSave={handleSave}
        isSaving={isSaving}
        isSaveDisabled={step === 1 || phase !== 'idle'}
        onPrev={goPrev}
        onNext={goNext}
        hasPrev={step > MIN_STEP && (phase === 'idle' || phase === 'error')}
        hasNext={step < MAX_STEP && phase === 'idle'}
        updatedAt={complaint.updated_at}
      />
      <div className="space-y-6 p-6">
        {/* 4단계 프로그레스 바 */}
        <CaseProgress currentStep={step} />
        {/* 스텝별 컨텐츠 조건부 렌더링 */}
        <QueryErrorResetBoundary>
          {({ reset }) => (
            <ErrorBoundary FallbackComponent={CaseErrorFallback} onReset={reset}>
              {step === 1 && <StepCollect complaintId={complaintId} />}
              {step === 2 &&
                (phase !== 'idle' ? (
                  // 생성 플로우 — phase !== 'idle'인 동안 ErrorBoundary 유지
                  <ErrorBoundary
                    FallbackComponent={TimelineErrorFallback}
                    onError={() => setPhase('error')}
                    onReset={() => {
                      handleGenerateRetry();
                    }}
                  >
                    {phase === 'generating' ? (
                      <TimelineGeneratingView taskId={taskId!} onDone={handleGenerateDone} />
                    ) : (
                      // starting / restoring: taskId 미확보 — 스피너 표시
                      <Spinner size="lg" className="text-primary mx-auto my-20" />
                    )}
                  </ErrorBoundary>
                ) : (
                  <StepTimeline />
                ))}
              {step === 3 && <StepDocument />}
              {step === 4 && <StepComplete />}
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>
      </div>
    </div>
  );
}
