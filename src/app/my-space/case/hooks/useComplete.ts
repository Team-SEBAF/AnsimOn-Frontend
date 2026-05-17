import { useMutation } from '@tanstack/react-query';
import { downloadDocumentZip, downloadAllZip } from '@/api/complete';
import { useComplaintId } from './useComplaintId';

export function useDownloadDocument() {
  const complaintId = useComplaintId();
  return useMutation({
    mutationFn: () => downloadDocumentZip(complaintId),
  });
}

export function useDownloadAll() {
  const complaintId = useComplaintId();
  return useMutation({
    mutationFn: () => downloadAllZip(complaintId),
  });
}
