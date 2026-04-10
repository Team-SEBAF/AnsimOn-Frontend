import type { FallbackProps } from 'react-error-boundary';
import { Button } from '@/components/ui/button';

export function TimelineErrorFallback({ resetErrorBoundary }: FallbackProps) {
  return (
    <div className="flex flex-col items-center gap-2 py-20">
      <p className="typo-heading-3 text-gray-800">타임라인 생성에 실패했습니다</p>
      <p className="typo-body-7 mb-6 text-gray-500">아래 버튼을 통해 다시 시도해주세요</p>
      <Button onClick={resetErrorBoundary} size="lg" className="text-white">
        다시 실행하기
      </Button>
    </div>
  );
}
