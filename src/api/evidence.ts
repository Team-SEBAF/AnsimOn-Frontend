import { axiosInstance } from './axiosInstance';
import type {
  EvidencePresignedUrlRequest,
  EvidencePresignedUrlResponse,
  DeleteEvidenceRequest,
  UpdateEvidenceFilenameRequest,
  UpdateEvidenceFilenameResponse,
  // MESSAGE
  MessageRegisterRequest,
  MessageRegisterListResponse,
  MessagePreviewListResponse,
  MessageDetailListResponse,
  MessageOriginal,
  // VOICE
  VoiceRegisterRequest,
  VoiceRegisterListResponse,
  VoicePreviewListResponse,
  VoiceDetailListResponse,
  VoiceOriginal,
  // TRACKING
  TrackingRegisterRequest,
  TrackingRegisterListResponse,
  TrackingPreviewListResponse,
  TrackingDetailListResponse,
  TrackingOriginal,
  // REPORT_RECORD
  ReportRecordRegisterRequest,
  ReportRecordRegisterListResponse,
  ReportRecordPreviewListResponse,
  ReportRecordDetailListResponse,
  ReportRecordOriginal,
  // INCIDENT_LOG
  IncidentLogFileRegisterRequest,
  IncidentLogFileRegisterListResponse,
  IncidentLogPreviewListResponse,
  IncidentLogDetailListResponse,
  IncidentLogFileOriginal,
  IncidentLogFormDataUploadRequest,
  IncidentLogFormDataResponse,
  IncidentLogFormDataUpdateRequest,
} from '@/types/evidence';

// ─── 공통 ───────────────────────────────────────────────

/** Presigned URL 발급 — 모든 타입 공통, S3 업로드 URL을 받음 */
export async function getPresignedUrls(complaintId: string, payload: EvidencePresignedUrlRequest) {
  const res = await axiosInstance.post<EvidencePresignedUrlResponse>(
    `/api/v1/evidences/${complaintId}/presigned-url`,
    payload,
  );
  return res.data;
}

/** S3 직접 업로드 — presigned URL 사용, 인증 토큰 불필요 (fetch) */
export async function uploadToS3(presignedUrl: string, file: File) {
  await fetch(presignedUrl, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': file.type },
  });
}

/** 증거 삭제 — 모든 타입 공통, ID 배열로 일괄 삭제 */
export async function deleteEvidences(payload: DeleteEvidenceRequest) {
  await axiosInstance.delete('/api/v1/evidences', { data: payload });
}

/** 파일명 수정 — 모든 타입 공통 */
export async function updateEvidenceFilename(
  evidenceId: string,
  payload: UpdateEvidenceFilenameRequest,
) {
  const res = await axiosInstance.patch<UpdateEvidenceFilenameResponse>(
    `/api/v1/evidences/${evidenceId}/filename`,
    payload,
  );
  return res.data;
}

// ─── MESSAGE (메신저/문자/DM) ───────────────────────────

/** S3 업로드 완료 후 서버에 등록 */
export async function registerMessages(complaintId: string, payload: MessageRegisterRequest) {
  const res = await axiosInstance.post<MessageRegisterListResponse>(
    `/api/v1/${complaintId}/evidences/messages/register`,
    payload,
  );
  return res.data;
}

/** 프리뷰 목록 (thumbnail_url만 포함) */
export async function getMessagePreviews(complaintId: string, limit?: number) {
  const res = await axiosInstance.get<MessagePreviewListResponse>(
    `/api/v1/${complaintId}/evidences/messages/previews`,
    { params: { limit } },
  );
  return res.data;
}

/** 상세 목록 (filename, size_bytes 등 포함) */
export async function getMessageDetails(complaintId: string, limit?: number) {
  const res = await axiosInstance.get<MessageDetailListResponse>(
    `/api/v1/${complaintId}/evidences/messages/details`,
    { params: { limit } },
  );
  return res.data;
}

/** 원본 파일 정보 + 다운로드 URL */
export async function getMessageOriginal(messageId: string) {
  const res = await axiosInstance.get<MessageOriginal>(
    `/api/v1/evidence/message/${messageId}/original`,
  );
  return res.data;
}

// ─── VOICE (통화/음성) ──────────────────────────────────

/** S3 업로드 완료 후 서버에 등록 */
export async function registerVoices(complaintId: string, payload: VoiceRegisterRequest) {
  const res = await axiosInstance.post<VoiceRegisterListResponse>(
    `/api/v1/${complaintId}/evidences/voices/register`,
    payload,
  );
  return res.data;
}

/** 프리뷰 목록 (filename, duration_seconds 포함) */
export async function getVoicePreviews(complaintId: string, limit?: number) {
  const res = await axiosInstance.get<VoicePreviewListResponse>(
    `/api/v1/${complaintId}/evidences/voices/previews`,
    { params: { limit } },
  );
  return res.data;
}

/** 상세 목록 */
export async function getVoiceDetails(complaintId: string, limit?: number) {
  const res = await axiosInstance.get<VoiceDetailListResponse>(
    `/api/v1/${complaintId}/evidences/voices/details`,
    { params: { limit } },
  );
  return res.data;
}

/** 원본 파일 정보 + 다운로드 URL */
export async function getVoiceOriginal(voiceId: string) {
  const res = await axiosInstance.get<VoiceOriginal>(`/api/v1/evidence/voice/${voiceId}/original`);
  return res.data;
}

// ─── TRACKING (접근/추적 흔적) ──────────────────────────

/** S3 업로드 완료 후 서버에 등록 */
export async function registerTrackings(complaintId: string, payload: TrackingRegisterRequest) {
  const res = await axiosInstance.post<TrackingRegisterListResponse>(
    `/api/v1/${complaintId}/evidences/trackings/register`,
    payload,
  );
  return res.data;
}

/** 프리뷰 목록 (thumbnail_url, duration_seconds 포함) */
export async function getTrackingPreviews(complaintId: string, limit?: number) {
  const res = await axiosInstance.get<TrackingPreviewListResponse>(
    `/api/v1/${complaintId}/evidences/trackings/previews`,
    { params: { limit } },
  );
  return res.data;
}

/** 상세 목록 */
export async function getTrackingDetails(complaintId: string, limit?: number) {
  const res = await axiosInstance.get<TrackingDetailListResponse>(
    `/api/v1/${complaintId}/evidences/trackings/details`,
    { params: { limit } },
  );
  return res.data;
}

/** 원본 파일 정보 + 다운로드 URL */
export async function getTrackingOriginal(trackingId: string) {
  const res = await axiosInstance.get<TrackingOriginal>(
    `/api/v1/evidence/tracking/${trackingId}/original`,
  );
  return res.data;
}

// ─── REPORT_RECORD (신고/상담기록) ──────────────────────

/** S3 업로드 완료 후 서버에 등록 */
export async function registerReportRecords(
  complaintId: string,
  payload: ReportRecordRegisterRequest,
) {
  const res = await axiosInstance.post<ReportRecordRegisterListResponse>(
    `/api/v1/${complaintId}/evidences/report-records/register`,
    payload,
  );
  return res.data;
}

/** 프리뷰 목록 (filename, size_bytes 포함) */
export async function getReportRecordPreviews(complaintId: string, limit?: number) {
  const res = await axiosInstance.get<ReportRecordPreviewListResponse>(
    `/api/v1/${complaintId}/evidences/report-records/previews`,
    { params: { limit } },
  );
  return res.data;
}

/** 상세 목록 */
export async function getReportRecordDetails(complaintId: string, limit?: number) {
  const res = await axiosInstance.get<ReportRecordDetailListResponse>(
    `/api/v1/${complaintId}/evidences/report-records/details`,
    { params: { limit } },
  );
  return res.data;
}

/** 원본 파일 정보 + 다운로드 URL */
export async function getReportRecordOriginal(reportRecordId: string) {
  const res = await axiosInstance.get<ReportRecordOriginal>(
    `/api/v1/evidence/report-record/${reportRecordId}/original`,
  );
  return res.data;
}

// ─── INCIDENT_LOG (사건일지) ────────────────────────────

/** 파일 업로드 방식 — S3 업로드 완료 후 서버에 등록 */
export async function registerIncidentLogFiles(
  complaintId: string,
  payload: IncidentLogFileRegisterRequest,
) {
  const res = await axiosInstance.post<IncidentLogFileRegisterListResponse>(
    `/api/v1/${complaintId}/evidences/incident-logs/file/register`,
    payload,
  );
  return res.data;
}

/** 폼 데이터 방식 — 날짜, 장소, 상황 등 직접 입력 */
export async function uploadIncidentLogFormData(
  complaintId: string,
  payload: IncidentLogFormDataUploadRequest,
) {
  const res = await axiosInstance.post<IncidentLogFormDataResponse>(
    `/api/v1/${complaintId}/evidences/incident-logs/form-data`,
    payload,
  );
  return res.data;
}

/** 폼 데이터 조회 */
export async function getIncidentLogFormData(incidentLogId: string) {
  const res = await axiosInstance.get<IncidentLogFormDataResponse>(
    `/api/v1/evidence/incident-log-form-data/${incidentLogId}`,
  );
  return res.data;
}

/** 폼 데이터 수정 (Partial 업데이트) */
export async function updateIncidentLogFormData(
  incidentLogId: string,
  payload: IncidentLogFormDataUpdateRequest,
) {
  const res = await axiosInstance.patch<IncidentLogFormDataResponse>(
    `/api/v1/evidences/incident-logs/form-data/${incidentLogId}`,
    payload,
  );
  return res.data;
}

/** 프리뷰 목록 (FILE + FORM_DATA 혼합) */
export async function getIncidentLogPreviews(complaintId: string, limit?: number) {
  const res = await axiosInstance.get<IncidentLogPreviewListResponse>(
    `/api/v1/${complaintId}/evidences/incident-logs/previews`,
    { params: { limit } },
  );
  return res.data;
}

/** 상세 목록 */
export async function getIncidentLogDetails(complaintId: string, limit?: number) {
  const res = await axiosInstance.get<IncidentLogDetailListResponse>(
    `/api/v1/${complaintId}/evidences/incident-logs/details`,
    { params: { limit } },
  );
  return res.data;
}

/** 원본 파일 정보 + 다운로드 URL (파일 업로드 방식만) */
export async function getIncidentLogFileOriginal(incidentLogId: string) {
  const res = await axiosInstance.get<IncidentLogFileOriginal>(
    `/api/v1/evidence/incident-log-file/${incidentLogId}/original`,
  );
  return res.data;
}
