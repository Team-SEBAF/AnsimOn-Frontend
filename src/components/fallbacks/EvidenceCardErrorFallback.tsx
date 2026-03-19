import type { FallbackProps } from 'react-error-boundary';

export function EvidenceCardErrorFallback({ resetErrorBoundary }: FallbackProps) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center gap-3 rounded-2xl border border-gray-200 px-7 py-6 shadow-[0px_20px_50px_-5px_#4040400D]">
      <p className="typo-body-8 text-gray-500">증거 데이터를 불러오지 못했어요.</p>
      <button onClick={resetErrorBoundary} className="typo-btn-2 text-blue-500 underline">
        다시 시도
      </button>
    </div>
  );
}
