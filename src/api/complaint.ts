import { axiosInstance } from './axiosInstance';
import type { Complaint, UpdateComplaintPayload } from '@/types/complaint';

// 고소장 조회
export async function getComplaint(complaintId: string): Promise<Complaint> {
  const res = await axiosInstance.get<Complaint>('/api/v1/complaints/my-complaint', {
    params: { complaint_id: complaintId },
  });
  return res.data;
}

// 고소장 수정
export async function updateComplaint(
  complaintId: string,
  payload: UpdateComplaintPayload,
): Promise<Complaint> {
  const res = await axiosInstance.patch<Complaint>('/api/v1/complaints/my-complaint', payload, {
    params: { complaint_id: complaintId },
  });
  return res.data;
}
