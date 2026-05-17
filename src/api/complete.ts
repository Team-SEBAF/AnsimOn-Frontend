import { axiosInstance } from './axiosInstance';
import type { TimelineDownloadResponse } from '@/types/timeline';

/** 고소장·진술서 ZIP 다운로드용 presigned URL 발급 */
export async function downloadDocumentZip(complaintId: string) {
  const res = await axiosInstance.post<TimelineDownloadResponse>(
    `/api/v1/${complaintId}/document/download/zip`,
  );
  return res.data;
}

/** 통합 ZIP(타임라인·고소장·진술서) presigned URL 발급 */
export async function downloadAllZip(complaintId: string) {
  const res = await axiosInstance.post<TimelineDownloadResponse>(
    `/api/v1/${complaintId}/all/download/zip`,
  );
  return res.data;
}
