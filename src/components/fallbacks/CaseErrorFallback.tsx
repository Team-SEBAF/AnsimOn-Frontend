import type { FallbackProps } from 'react-error-boundary';

export function CaseErrorFallback({ resetErrorBoundary }: FallbackProps) {
  return (
    <div className="flex flex-col items-center gap-3 p-6">
      <p className="typo-body-8 text-gray-500">사건 정보를 불러오지 못했어요.</p>
      <button onClick={resetErrorBoundary} className="typo-btn-2 text-blue-500 underline">
        다시 시도
      </button>
    </div>
  );
}
