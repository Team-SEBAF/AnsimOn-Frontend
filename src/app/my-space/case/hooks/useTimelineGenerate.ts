import { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import type { TimelineProgressData } from '@/types/timeline';

interface UseTimelineGenerateParams {
  taskId: string | null;
  onDone: () => void;
}

interface UseTimelineGenerateResult {
  progressData: TimelineProgressData | null;
}

/**
 * 타임라인 AI 생성 진행률 SSE 훅
 *
 * - task_preparing: AI Worker 준비 중 (status: null | PENDING)
 * - progress: 증거 처리 진행 중 (status: PROCESSING | DONE)
 * - done: 완료 → onDone 콜백 호출
 */
export function useTimelineGenerate({
  taskId,
  onDone,
}: UseTimelineGenerateParams): UseTimelineGenerateResult {
  const sseBaseUrl = useAuthStore((s) => s.sseBaseUrl);
  const onDoneRef = useRef(onDone);
  const [progressData, setProgressData] = useState<TimelineProgressData | null>(null);
  const [sseError, setSseError] = useState<Error | null>(null);

  // SSE 에러를 렌더 타임에 throw → ErrorBoundary가 잡음
  if (sseError) throw sseError;

  useEffect(() => {
    onDoneRef.current = onDone;
  });

  useEffect(() => {
    if (!taskId) return;
    if (!sseBaseUrl) {
      setSseError(new Error('SSE_URL_NOT_FOUND'));
      return;
    }

    const url = `${sseBaseUrl.replace(/\/$/, '')}/api/v1/timeline/${taskId}/progress`;
    const es = new EventSource(url);

    es.addEventListener('task_preparing', (e) => {
      setProgressData(JSON.parse((e as MessageEvent).data));
    });

    es.addEventListener('progress', (e) => {
      setProgressData(JSON.parse((e as MessageEvent).data));
    });

    es.addEventListener('done', () => {
      es.close();
      onDoneRef.current();
    });

    es.addEventListener('error', () => {
      es.close();
      setSseError(new Error('SSE_ERROR'));
    });

    return () => {
      es.close();
      setProgressData(null);
    };
  }, [taskId, sseBaseUrl]);

  return { progressData };
}
