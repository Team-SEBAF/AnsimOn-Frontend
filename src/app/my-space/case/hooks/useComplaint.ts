import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getComplaint, updateComplaint } from '@/api/complaint';
import type { UpdateComplaintPayload } from '@/types/complaint';

// 고소장 조회 훅
export function useComplaint(complaintId: string | undefined) {
  return useQuery({
    queryKey: ['complaint', complaintId],
    queryFn: () => getComplaint(complaintId!),
    enabled: !!complaintId,
    staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
  });
}

// 고소장 수정 훅
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
