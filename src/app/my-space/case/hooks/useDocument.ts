import { useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDocument, patchDocument, getStatement, patchStatement } from '@/api/document';
import type { PatchDocumentPayload, StatementFormValues } from '@/types/document';

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

export function useGetStatement(complaintId: string) {
  return useSuspenseQuery({
    queryKey: ['statement', complaintId],
    queryFn: () => getStatement(complaintId),
    staleTime: 1000 * 60 * 5,
  });
}

export function usePatchStatement(complaintId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<StatementFormValues>) => patchStatement(complaintId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['statement', complaintId] });
    },
  });
}
