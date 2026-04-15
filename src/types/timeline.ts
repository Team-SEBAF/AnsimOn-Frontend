// ─── 태그 ────────────────────────────────────────────────

export type TimelineTag =
  | 'REPEAT'
  | 'PHYSICAL_HARM'
  | 'THREAT_COERCION'
  | 'SEXUAL_INSULT'
  | 'REFUSAL_INTENT';

export const TAG_LABEL_MAP: Record<TimelineTag, string> = {
  REPEAT: '반복',
  PHYSICAL_HARM: '신체피해',
  THREAT_COERCION: '위협·강압',
  SEXUAL_INSULT: '성적·모욕',
  REFUSAL_INTENT: '거절 의사',
};

export const TAG_COLOR_MAP: Record<TimelineTag, { bg: string; text: string }> = {
  REPEAT: { bg: 'bg-warning/10', text: 'text-warning' },
  PHYSICAL_HARM: { bg: 'bg-error/10', text: 'text-error' },
  THREAT_COERCION: { bg: 'bg-error/10', text: 'text-error' },
  SEXUAL_INSULT: { bg: 'bg-warning/10', text: 'text-warning' },
  REFUSAL_INTENT: { bg: 'bg-info/10', text: 'text-info' },
};

// ─── API 응답 타입 ────────────────────────────────────────

export type TimelineEvidence = {
  timeline_evidence_id: string;
  index: number;
  title: string;
  description: string;
  tags: TimelineTag[];
  referenced_evidence_count: number;
  has_thumbnail: boolean;
  thumbnail_url: string;
  duration_seconds: number;
  is_ai_original: boolean;
};

export type TimelineEvent = {
  time: string; // e.g. "AM 11:30"
  evidences: TimelineEvidence[];
};

export type TimelineDateGroup = {
  date: string; // e.g. "2026-02-12"
  events: TimelineEvent[];
};

export type TimelineResponse = {
  items: TimelineDateGroup[];
};

// ─── 타임라인 증거 상세 조회 ──────────────────────────────

export type TimelineReferencedEvidence = {
  referenced_id: string;
  filename: string;
  size_bytes: number;
  thumbnail_url: string;
  duration_seconds: number;
  evidence_type: string;
  file_type: string;
};

export type TimelineEvidenceDetail = {
  timeline_evidence_id: string;
  index: number;
  date: string;
  time: string;
  title: string;
  description: string;
  tags: TimelineTag[];
  referenced_evidence_count: number;
  is_ai_original: boolean;
  evidences: TimelineReferencedEvidence[];
};

// ─── 폼 데이터 요청/응답 ──────────────────────────────────

export type TimelineFormDataRequest = {
  date: string; // e.g. "2026-02-12"
  time: string; // e.g. "11:30"
  title: string;
  description: string;
  tags: TimelineTag[];
};

export type TimelineFormDataResponse = {
  timeline_evidence_id: string;
  index: number;
  date: string;
  time: string;
  title: string;
  description: string;
  tags: TimelineTag[];
};

// ─── 직접 추가 증거 — 참조 증거 presigned URL ────────────

export type ManualReferencedEvidencePresignedUrlItem = {
  index: number;
  filename: string;
  contentType: string;
  sizeBytes: number;
  durationSeconds?: number; // 영상/음성만 사용
};

export type ManualReferencedEvidencePresignedUrlRequest = {
  items: ManualReferencedEvidencePresignedUrlItem[];
};

export type ManualReferencedEvidencePresignedUrlResponseItem = {
  index: number;
  filename: string;
  url: string;
  referenced_manual_evidence_id: string;
};

export type ManualReferencedEvidencePresignedUrlResponse = {
  items: ManualReferencedEvidencePresignedUrlResponseItem[];
};

// ─── 직접 추가 증거 — 참조 증거 등록 ────────────────────

export type ManualReferencedEvidenceRegisterItem = {
  referencedManualEvidenceId: string;
  filename: string;
};

export type ManualReferencedEvidenceRegisterRequest = {
  items: ManualReferencedEvidenceRegisterItem[];
};

export type ManualReferencedEvidenceRegisterResponseItem = {
  referenced_manual_evidence_id: string;
  file_type: string;
  filename: string;
  content_type: string;
  size_bytes: number;
  duration_seconds: number;
};

export type ManualReferencedEvidenceRegisterResponse = {
  items: ManualReferencedEvidenceRegisterResponseItem[];
};

// ─── 삭제 요청 ───────────────────────────────────────────

export type DeleteTimelineEvidencesRequest = {
  timelineEvidenceIds: string[];
};

export type DeleteManualReferencedEvidencesRequest = {
  referencedManualEvidenceIds: string[];
};

// ─── 다운로드 ────────────────────────────────────────────

export type TimelineDownloadResponse = {
  download_url: string;
};

// ─── AI 생성 phase ───────────────────────────────────────

export type TimelinePhase = 'idle' | 'starting' | 'restoring' | 'generating' | 'error';

// ─── AI 생성 ─────────────────────────────────────────────

export type NeedToGenerateResponse = {
  need_to_generate: boolean;
};

export type RequestGenerateResponse = {
  task_id: string;
};

export type CurrentTaskIdResponse = {
  task_id: string;
};

export type SseServerUrlResponse = {
  base_url: string;
};

export type TimelineProgressEvent = 'task_preparing' | 'progress' | 'done';

export type TimelineProgressData = {
  status: 'PENDING' | 'PROCESSING' | 'DONE' | null;
  processed: number | null;
  total: number | null;
};
