interface CaseProgressProps {
  currentStep: 1 | 2 | 3 | 4;
}

/** Case 4단계 스텝 정의 */
const STEPS = [
  { step: 1, label: '증거 업로드' },
  { step: 2, label: '타임라인 정리' },
  { step: 3, label: '고소장 작성' },
  { step: 4, label: '마무리' },
] as const;

/**
 * Case 진행도 프로세스 바
 * - currentStep에 해당하는 스텝을 하이라이트 표시
 * - 스텝 사이에 4px dash 연결선 표시
 */
export function CaseProgress({ currentStep }: CaseProgressProps) {
  return (
    <div className="flex items-center gap-6 px-12 py-3">
      {STEPS.map((item, index) => {
        const isActive = currentStep === item.step;

        return (
          <>
            {/* 스텝 사이 dash 연결선 (첫 번째 제외) */}
            {index > 0 && (
              <div
                className="h-px flex-1"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(to right, var(--app-gray-200) 0, var(--app-gray-200) 4px, transparent 4px, transparent 8px)',
                }}
              />
            )}

            {/* 스텝 아이템 */}
            <div key={item.step} className="flex w-30 flex-col items-center">
              <span
                className={`typo-heading-6 transition-colors duration-300 ${isActive ? 'text-primary' : 'text-(--app-gray-200)'}`}
              >
                STEP 0{item.step}
              </span>
              <span
                className={`typo-heading-2 transition-colors duration-300 ${isActive ? 'text-(--app-gray-800)' : 'text-(--app-gray-300)'}`}
              >
                {item.label}
              </span>
            </div>
          </>
        );
      })}
    </div>
  );
}
