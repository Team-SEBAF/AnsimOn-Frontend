import type { TimelineProgressData } from '@/types/timeline';

interface TimelineGeneratingViewProps {
  progressData: TimelineProgressData | null;
}

/** 각 스테이지의 라벨과 바 너비 정의 */
const STAGE_CONFIGS = [
  { label: '준비', barWidth: 48 },
  { label: '처리 중', barWidth: 160 },
  { label: '마무리', barWidth: 48 },
] as const;

type Stage = 1 | 2 | 3;

/** SSE status → UI 단계 변환 */
function getStage(status: TimelineProgressData['status']): Stage {
  if (status === 'PROCESSING') return 2;
  if (status === 'DONE') return 3;
  return 1;
}

/** 각 스테이지 바의 채움 비율 계산 */
function getBarFill(
  stageNum: Stage,
  currentStage: Stage,
  processed: number,
  total: number,
): number {
  if (currentStage < stageNum) return 0;
  if (currentStage > stageNum) return 100;
  // currentStage === stageNum (현재 진행 중인 스테이지)
  if (stageNum === 1) return 30; // 준비 중 — 고정 초기값
  if (stageNum === 2) return total > 0 ? (processed / total) * 100 : 0;
  return 100;
}

const STAGE_MESSAGE: Record<Stage, string> = {
  1: '타임라인이 준비중이에요',
  2: '',
  3: '타임라인을 정리하고 있어요',
};

const STAGE_TIME: Record<Stage, string> = {
  1: '20분',
  2: '15분',
  3: '2분',
};

/**
 * AI 타임라인 생성 중 진행률 UI
 *
 * 각 스테이지는 [라벨 → 도트 → 프로그레스 바] 세로 구조로 이루어짐
 * - 준비(PENDING) / 처리 중(PROCESSING) / 마무리(DONE) 3단계로 표시
 * - 처리 중 단계에서 processed/total 기반으로 바 채움
 */
export function TimelineGeneratingView({ progressData }: TimelineGeneratingViewProps) {
  const stage = getStage(progressData?.status ?? null);
  const processed = progressData?.processed ?? 0;
  const total = progressData?.total ?? 0;

  const message =
    stage === 2 ? `타임라인이 처리중이에요 (${processed}/${total})` : STAGE_MESSAGE[stage];

  return (
    <div className="flex flex-col items-center gap-12 bg-white px-7 py-6">
      {/* 3단계 진행 표시 */}
      <div className="items-star flex gap-1.5">
        {STAGE_CONFIGS.map((config, i) => {
          const stageNum = (i + 1) as Stage;
          const isActive = stage === stageNum;
          const isFuture = stage < stageNum;
          const barFill = getBarFill(stageNum, stage, processed, total);

          return (
            <div
              key={config.label}
              className="flex flex-col items-center gap-2"
              style={{ width: config.barWidth }}
            >
              {/* 라벨 */}
              <span
                className={`text-center text-xs transition-colors duration-300 ${
                  isActive ? 'font-bold text-gray-800' : 'font-normal text-gray-300'
                }`}
              >
                {config.label}
              </span>

              {/* 도트 */}
              <div
                className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
                  isFuture ? 'bg-gray-200' : 'bg-primary'
                }`}
              />

              {/* 프로그레스 바 */}
              <div
                className={`relative h-2 w-full overflow-hidden rounded-full transition-colors duration-300 ${
                  isFuture ? 'bg-gray-200' : 'bg-primary-light'
                }`}
              >
                <div
                  className="bg-primary absolute inset-y-0 left-0 transition-all duration-500"
                  style={{ width: `${barFill}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* 상태 텍스트 */}
      <div className="flex flex-col items-center gap-2">
        <p className="typo-heading-3 text-gray-500">{message}</p>
        <p className="typo-body-7 text-gray-500">예상 남은 시간 : {STAGE_TIME[stage]}</p>
      </div>
    </div>
  );
}
