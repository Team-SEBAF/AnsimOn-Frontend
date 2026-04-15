// ─── 공통 ───────────────────────────────────────────────

export type EvidenceType = 'MESSAGE' | 'VOICE' | 'VICTIM' | 'REPORT_RECORD' | 'INCIDENT_LOG';

// ─── Presigned URL (모든 타입 공통) ─────────────────────

export type PresignedUrlItemRequest = {
  index: number;
  filename: string;
  contentType: string;
  sizeBytes: number;
  durationSeconds?: number; // VOICE, TRACKING만 사용
};

export type PresignedUrlItemResponse = {
  index: number;
  filename: string;
  url: string;
  evidence_id: string; // 타입별 ID (message_id, voice_id 등)
};

export type EvidencePresignedUrlRequest = {
  type: EvidenceType;
  items: PresignedUrlItemRequest[];
};

export type EvidencePresignedUrlResponse = {
  items: PresignedUrlItemResponse[];
};

// ─── 삭제 (공통) ────────────────────────────────────────

export type DeleteEvidenceRequest = {
  type: EvidenceType;
  evidenceIds: string[];
};

// ─── 파일명 수정 (공통) ─────────────────────────────────

export type UpdateEvidenceFilenameRequest = {
  type: EvidenceType;
  filename: string;
};

export type UpdateEvidenceFilenameResponse = {
  evidence_id: string;
  filename: string;
  updated_at: string;
};

// ─── MESSAGE ────────────────────────────────────────────

export type MessageRegisterItem = {
  messageId: string;
  filename: string;
  fileCreatedAt: string; // ISO 8601 — file.lastModified 변환값
};

export type MessageRegisterRequest = {
  items: MessageRegisterItem[];
};

export type MessageRegisterItemResponse = {
  message_id: string;
  filename: string;
  content_type: string;
  width?: number;
  height?: number;
  size_bytes: number;
};

export type MessageRegisterListResponse = {
  items: MessageRegisterItemResponse[];
};

export type MessagePreview = {
  message_id: string;
  thumbnail_url: string;
};

export type MessagePreviewListResponse = {
  previews: MessagePreview[];
  total_count: number;
};

export type MessageDetail = {
  message_id: string;
  filename: string;
  size_bytes: number;
  created_at: string;
  updated_at: string;
  thumbnail_url: string;
};

export type MessageDetailListResponse = {
  details: MessageDetail[];
  total_count: number;
};

export type MessageOriginal = {
  message_id: string;
  filename: string;
  content_type: string;
  size_bytes: number;
  width?: number;
  height?: number;
  url: string;
  created_at: string;
  updated_at: string;
};

// ─── VOICE ──────────────────────────────────────────────

export type VoiceRegisterItem = {
  voiceId: string;
  filename: string;
  fileCreatedAt: string;
};

export type VoiceRegisterRequest = {
  items: VoiceRegisterItem[];
};

export type VoiceRegisterItemResponse = {
  voice_id: string;
  filename: string;
  content_type: string;
  duration_seconds: number;
  size_bytes: number;
};

export type VoiceRegisterListResponse = {
  items: VoiceRegisterItemResponse[];
};

export type VoicePreview = {
  voice_id: string;
  filename: string;
  duration_seconds: number;
};

export type VoicePreviewListResponse = {
  previews: VoicePreview[];
  total_count: number;
};

export type VoiceDetail = {
  voice_id: string;
  filename: string;
  duration_seconds: number;
  size_bytes: number;
  created_at: string;
  updated_at: string;
};

export type VoiceDetailListResponse = {
  details: VoiceDetail[];
  total_count: number;
};

export type VoiceOriginal = {
  voice_id: string;
  filename: string;
  content_type: string;
  size_bytes: number;
  duration_seconds: number;
  url: string;
  created_at: string;
  updated_at: string;
};

// ─── VICTIM (피해 사진/영상) ─────────────────────────────

export type VictimRegisterItem = {
  victimId: string;
  filename: string;
  fileCreatedAt: string;
};

export type VictimRegisterRequest = {
  items: VictimRegisterItem[];
};

export type VictimRegisterItemResponse = {
  victim_id: string;
  filename: string;
  content_type: string;
  duration_seconds: number;
  size_bytes: number;
};

export type VictimRegisterListResponse = {
  items: VictimRegisterItemResponse[];
};

export type VictimPreview = {
  victim_id: string;
  duration_seconds: number;
  thumbnail_url: string;
};

export type VictimPreviewListResponse = {
  previews: VictimPreview[];
  total_count: number;
};

export type VictimDetail = {
  victim_id: string;
  filename: string;
  duration_seconds: number;
  size_bytes: number;
  created_at: string;
  updated_at: string;
  thumbnail_url: string;
};

export type VictimDetailListResponse = {
  details: VictimDetail[];
  total_count: number;
};

export type VictimOriginal = {
  victim_id: string;
  filename: string;
  content_type: string;
  size_bytes: number;
  duration_seconds: number;
  url: string;
  created_at: string;
  updated_at: string;
};

// ─── REPORT_RECORD ──────────────────────────────────────

export type ReportRecordRegisterItem = {
  reportRecordId: string;
  filename: string;
  fileCreatedAt: string;
};

export type ReportRecordRegisterRequest = {
  items: ReportRecordRegisterItem[];
};

export type ReportRecordRegisterItemResponse = {
  report_record_id: string;
  filename: string;
  content_type: string;
  size_bytes: number;
};

export type ReportRecordRegisterListResponse = {
  items: ReportRecordRegisterItemResponse[];
};

export type ReportRecordPreview = {
  report_record_id: string;
  filename: string;
  size_bytes: number;
};

export type ReportRecordPreviewListResponse = {
  previews: ReportRecordPreview[];
  total_count: number;
};

export type ReportRecordDetail = {
  report_record_id: string;
  filename: string;
  size_bytes: number;
  content_type: string;
  created_at: string;
  updated_at: string;
};

export type ReportRecordDetailListResponse = {
  details: ReportRecordDetail[];
  total_count: number;
};

export type ReportRecordOriginal = {
  report_record_id: string;
  filename: string;
  content_type: string;
  size_bytes: number;
  url: string;
  created_at: string;
  updated_at: string;
};

// ─── INCIDENT_LOG ───────────────────────────────────────

export type IncidentLogType = 'FILE' | 'FORM_DATA';

/** 파일 업로드 방식 등록 */
export type IncidentLogFileRegisterItem = {
  incidentLogId: string;
  filename: string;
  fileCreatedAt: string;
};

export type IncidentLogFileRegisterRequest = {
  items: IncidentLogFileRegisterItem[];
};

export type IncidentLogFileRegisterItemResponse = {
  incident_log_id: string;
  filename: string;
  content_type: string;
  size_bytes: number;
};

export type IncidentLogFileRegisterListResponse = {
  items: IncidentLogFileRegisterItemResponse[];
};

/** 폼 데이터 방식 */
export type IncidentLogFormDataUploadRequest = {
  filename: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  location: string;
  description: string;
};

export type IncidentLogFormDataUpdateRequest = Partial<IncidentLogFormDataUploadRequest>;

export type IncidentLogAttachment = {
  attachment_id: string;
  type: string;
  filename: string;
  content_type: string;
  size_bytes: number;
  duration_seconds: number | null;
  created_at: string;
};

export type IncidentLogFormDataResponse = {
  incident_log_id: string;
  filename: string;
  date: string;
  time: string;
  location: string;
  description: string;
  attachments: IncidentLogAttachment[];
  created_at: string;
  updated_at: string;
};

// ─── INCIDENT_LOG 첨부자료 ───────────────────────────────

export type IncidentLogAttachmentPresignedUrlRequest = {
  items: PresignedUrlItemRequest[];
};

export type IncidentLogAttachmentPresignedUrlItemResponse = {
  index: number;
  filename: string;
  url: string;
  attachment_id: string;
};

export type IncidentLogAttachmentPresignedUrlResponse = {
  items: IncidentLogAttachmentPresignedUrlItemResponse[];
};

export type IncidentLogAttachmentRegisterItem = {
  attachmentId: string;
  filename: string;
};

export type IncidentLogAttachmentRegisterRequest = {
  items: IncidentLogAttachmentRegisterItem[];
};

export type IncidentLogAttachmentRegisterItemResponse = {
  attachment_id: string;
  type: string;
  filename: string;
  content_type: string;
  size_bytes: number;
  duration_seconds: number | null;
};

export type IncidentLogAttachmentRegisterResponse = {
  items: IncidentLogAttachmentRegisterItemResponse[];
};

export type DeleteIncidentLogAttachmentsRequest = {
  attachmentIds: string[];
};

/** 프리뷰 / 상세 (FILE + FORM_DATA 혼합) */
export type IncidentLogPreview = {
  incident_log_id: string;
  type: IncidentLogType;
  filename: string;
  size_bytes?: number | null; // 폼데이터면 null
};

export type IncidentLogPreviewListResponse = {
  previews: IncidentLogPreview[];
  total_count: number;
};

export type IncidentLogDetail = {
  incident_log_id: string;
  type: IncidentLogType;
  filename: string;
  size_bytes?: number | null;
  content_type?: string | null;
  created_at: string;
  updated_at: string;
};

export type IncidentLogDetailListResponse = {
  details: IncidentLogDetail[];
  total_count: number;
};

export type IncidentLogFileOriginal = {
  incident_log_id: string;
  filename: string;
  content_type: string;
  size_bytes: number;
  url: string;
  created_at: string;
  updated_at: string;
};

// ─── 통일 프리뷰 아이템 (EvidenceContent용) ────────────

/** 타입별 서버 프리뷰 데이터를 통일한 형태 */
export type EvidencePreviewItem = {
  id: string;
  filename?: string;
  thumbnailUrl?: string;
  sizeBytes?: number;
  durationSeconds?: number;
  /** 수정 가능한 아이템 여부 (INCIDENT_LOG FORM_DATA 타입만 true) */
  isEditable?: boolean;
};

// ─── 에러 응답 ──────────────────────────────────────────

export type EvidencePresignedValidationError = {
  code: 'EVIDENCE_PRESIGNED_VALIDATION_FAILED';
  message: string;
  debug_message?: string;
  is_total_count_valid: boolean;
  content_type_failed_index_list: number[];
  size_bytes_failed_index_list: number[];
  duration_seconds_failed_index_list?: number[];
};

export type RegisterEvidenceError = {
  code: string;
  message: string;
  debug_message?: string;
  failed_evidence_ids?: string[];
  content_type_failed_evidence_ids?: string[];
  size_bytes_failed_evidence_ids?: string[];
  duration_seconds_failed_evidence_ids?: string[];
};
