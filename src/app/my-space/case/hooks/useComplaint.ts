import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getComplaint, updateComplaint } from '@/api/complaint';
import type { UpdateComplaintPayload } from '@/types/complaint';

/**
 * 고소장 조회 훅
 *
 * - complaintId가 있을 때만 요청 (enabled)
 * - staleTime: 5분
 * - 수정 성공 시 useUpdateComplaint의 invalidateQueries로 갱신
 *
 * @param complaintId - 고소장 ID (undefined이면 요청하지 않음)
 */
export function useComplaint(complaintId: string | undefined) {
  return useQuery({
    queryKey: ['complaint', complaintId],
    queryFn: () => getComplaint(complaintId!),
    enabled: !!complaintId,
    staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
  });
}

/**
 * 고소장 수정 훅
 *
 * - 성공 시 고소장 조회 캐시 자동 갱신 (invalidateQueries)
 *
 * @param complaintId - 고소장 ID
 * @returns useMutation — mutate(payload: UpdateComplaintPayload)로 호출
 */
export function useUpdateComplaint(complaintId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateComplaintPayload) => updateComplaint(complaintId!, payload),
    onSuccess: () => {
      // 수정 성공 시 조회 캐시 갱신
      queryClient.invalidateQueries({ queryKey: ['complaint', complaintId] });
    },
  });
}
