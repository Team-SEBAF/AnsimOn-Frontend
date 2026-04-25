import { axiosInstance } from './axiosInstance';
import type {
  DocumentFormValues,
  NeedToGenerateDocumentResponse,
  PatchDocumentPayload,
  RequestGenerateDocumentResponse,
} from '@/types/document';

// ─── AI 생성 ─────────────────────────────────────────────

/** 고소장 생성 필요 여부 확인 */
export async function needToGenerateDocument(complaintId: string) {
  const res = await axiosInstance.get<NeedToGenerateDocumentResponse>(
    `/api/v1/${complaintId}/ai/document/need-to-generate`,
  );
  return res.data;
}

/** AI 고소장 생성 요청 */
export async function requestGenerateDocument(
  complaintId: string,
  llmType: 'mock' | 'openAI' = 'mock',
) {
  const res = await axiosInstance.post<RequestGenerateDocumentResponse>(
    `/api/v1/${complaintId}/ai/document/request/generate`,
    {},
    { params: { llm_type: llmType } },
  );
  return res.data;
}

// ─── 고소장 조회 / 수정 ───────────────────────────────────

/** 고소장 폼 데이터 조회 */
export async function getDocument(complaintId: string) {
  const res = await axiosInstance.get<DocumentFormValues>(
    `/api/v1/${complaintId}/document/complaint-form-data`,
  );
  return res.data;
}

/** 고소장 폼 데이터 부분 수정 */
export async function patchDocument(complaintId: string, payload: PatchDocumentPayload) {
  const res = await axiosInstance.patch<DocumentFormValues>(
    `/api/v1/${complaintId}/document/complaint-form-data`,
    payload,
  );
  return res.data;
}
