import { useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDocument, patchDocument } from '@/api/document';
import type { PatchDocumentPayload } from '@/types/document';

export function useGetDocument(complaintId: string) {
  return useSuspenseQuery({
    queryKey: ['document', complaintId],
    queryFn: () => getDocument(complaintId),
    staleTime: 1000 * 60 * 5,
  });
}

export function usePatchDocument(complaintId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PatchDocumentPayload) => patchDocument(complaintId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document', complaintId] });
      queryClient.invalidateQueries({ queryKey: ['complaint', complaintId] });
    },
  });
}
