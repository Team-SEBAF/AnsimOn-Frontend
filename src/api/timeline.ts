import { axiosInstance } from './axiosInstance';
import type {
  TimelineResponse,
  TimelineEvidenceDetail,
  TimelineFormDataRequest,
  TimelineFormDataResponse,
  ManualReferencedEvidencePresignedUrlRequest,
  ManualReferencedEvidencePresignedUrlResponse,
  ManualReferencedEvidenceRegisterRequest,
  ManualReferencedEvidenceRegisterResponse,
  DeleteTimelineEvidencesRequest,
  DeleteManualReferencedEvidencesRequest,
  TimelineDownloadResponse,
} from '@/types/timeline';

// ─── 타임라인 조회 ────────────────────────────────────────

/** 날짜 > 시각 > 증거 계층 구조의 타임라인 조회 */
export async function getTimeline(complaintId: string, generateDummy?: boolean) {
  const res = await axiosInstance.get<TimelineResponse>(`/api/v1/${complaintId}/timeline`, {
    params: generateDummy ? { generate_dummy: true } : undefined,
  });
  return res.data;
}

// ─── 타임라인 증거 상세 ───────────────────────────────────

/** 증거 메타데이터(날짜, 시각, 제목, 설명, 태그)와 참조 증거 목록 조회 */
export async function getTimelineEvidenceDetail(complaintId: string, timelineEvidenceId: string) {
  const res = await axiosInstance.get<TimelineEvidenceDetail>(
    `/api/v1/${complaintId}/timeline/evidences/${timelineEvidenceId}`,
  );
  return res.data;
}

// ─── 타임라인 증거 수정 ───────────────────────────────────

/** 타임라인 증거의 폼 데이터(날짜, 시각, 제목, 설명, 태그) 수정 */
export async function updateTimelineEvidenceFormData(
  complaintId: string,
  timelineEvidenceId: string,
  payload: TimelineFormDataRequest,
) {
  const res = await axiosInstance.patch<TimelineFormDataResponse>(
    `/api/v1/${complaintId}/timeline/evidences/${timelineEvidenceId}/form-data`,
    payload,
  );
  return res.data;
}

// ─── 타임라인 증거 삭제 ───────────────────────────────────

/** 타임라인 증거 복수 삭제 */
export async function deleteTimelineEvidences(
  complaintId: string,
  payload: DeleteTimelineEvidencesRequest,
) {
  await axiosInstance.delete(`/api/v1/${complaintId}/timeline/evidences`, {
    data: payload,
  });
}

// ─── 직접 추가 증거 ───────────────────────────────────────

/** 직접 추가 증거의 폼 데이터 업로드 */
export async function createManualTimelineEvidence(
  complaintId: string,
  payload: TimelineFormDataRequest,
) {
  const res = await axiosInstance.post<TimelineFormDataResponse>(
    `/api/v1/${complaintId}/timeline/evidences/manual/form-data`,
    payload,
  );
  return res.data;
}

// ─── 직접 추가 증거 — 참조 증거 ──────────────────────────

/** 참조 증거 Presigned URL 발급 (복수 지원) */
export async function getManualReferencedEvidencePresignedUrls(
  complaintId: string,
  timelineEvidenceId: string,
  payload: ManualReferencedEvidencePresignedUrlRequest,
) {
  const res = await axiosInstance.post<ManualReferencedEvidencePresignedUrlResponse>(
    `/api/v1/${complaintId}/timeline/evidences/${timelineEvidenceId}/manual/referenced-evidences/presigned-url`,
    payload,
  );
  return res.data;
}

/** S3 업로드 완료 후 참조 증거 등록 (복수 지원) */
export async function registerManualReferencedEvidences(
  complaintId: string,
  timelineEvidenceId: string,
  payload: ManualReferencedEvidenceRegisterRequest,
) {
  const res = await axiosInstance.post<ManualReferencedEvidenceRegisterResponse>(
    `/api/v1/${complaintId}/timeline/evidences/${timelineEvidenceId}/manual/referenced-evidences/register`,
    payload,
  );
  return res.data;
}

/** 참조 증거 삭제 (복수 지원) */
export async function deleteManualReferencedEvidences(
  complaintId: string,
  timelineEvidenceId: string,
  payload: DeleteManualReferencedEvidencesRequest,
) {
  await axiosInstance.delete(
    `/api/v1/${complaintId}/timeline/evidences/${timelineEvidenceId}/manual/referenced-evidences`,
    { data: payload },
  );
}

// ─── 다운로드 ────────────────────────────────────────────

/** ZIP 다운로드용 presigned URL 발급 */
export async function downloadTimelineZip(complaintId: string) {
  const res = await axiosInstance.post<TimelineDownloadResponse>(
    `/api/v1/${complaintId}/timeline/download/zip`,
  );
  return res.data;
}
