import { useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getTimeline,
  updateTimelineEvidenceFormData,
  deleteTimelineEvidences,
  createManualTimelineEvidence,
  downloadTimelineZip,
} from '@/api/timeline';
import type { TimelineFormDataRequest, DeleteTimelineEvidencesRequest } from '@/types/timeline';
import { useComplaintId } from './useComplaintId';

// ─── query key ──────────────────────────────────────────

const timelineKeys = {
  detail: (complaintId: string) => ['timeline', complaintId] as const,
};

// ─── 조회 ────────────────────────────────────────────────

export function useTimeline() {
  const complaintId = useComplaintId();

  const { data } = useSuspenseQuery({
    queryKey: timelineKeys.detail(complaintId),
    queryFn: () => getTimeline(complaintId),
  });

  const groups = data.items;
  const allDates = groups.map((g) => g.date);
  const allTags = [
    ...new Set(
      groups.flatMap((g) => g.events.flatMap((e) => e.evidences.flatMap((ev) => ev.tags))),
    ),
  ];

  return { groups, allDates, allTags };
}

// ─── mutations ───────────────────────────────────────────

/** 직접 추가 증거 생성 (폼 데이터만) — invalidation은 호출부에서 처리 */
export function useCreateTimelineEvidence() {
  const complaintId = useComplaintId();

  return useMutation({
    mutationFn: (payload: TimelineFormDataRequest) =>
      createManualTimelineEvidence(complaintId, payload),
  });
}

/** AI 원본 또는 직접 추가 증거의 폼 데이터 수정 — invalidation은 호출부에서 처리 */
export function useUpdateTimelineEvidence() {
  const complaintId = useComplaintId();

  return useMutation({
    mutationFn: ({
      timelineEvidenceId,
      payload,
    }: {
      timelineEvidenceId: string;
      payload: TimelineFormDataRequest;
    }) => updateTimelineEvidenceFormData(complaintId, timelineEvidenceId, payload),
  });
}

/** 타임라인 쿼리 무효화 헬퍼 */
export function useInvalidateTimeline() {
  const complaintId = useComplaintId();
  const queryClient = useQueryClient();

  return () => queryClient.invalidateQueries({ queryKey: timelineKeys.detail(complaintId) });
}

/** 타임라인 증거 복수 삭제 */
export function useDeleteTimelineEvidences() {
  const complaintId = useComplaintId();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: DeleteTimelineEvidencesRequest) =>
      deleteTimelineEvidences(complaintId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: timelineKeys.detail(complaintId) });
    },
  });
}

/** ZIP 다운로드 presigned URL 발급 */
export function useDownloadTimeline() {
  const complaintId = useComplaintId();

  return useMutation({
    mutationFn: () => downloadTimelineZip(complaintId),
  });
}
