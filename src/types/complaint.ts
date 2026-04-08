/** 백엔드 step 값 */
export type ComplaintStep =
  | 'EVIDENCE'
  | 'TIMELINE_GENERATING'
  | 'TIMELINE'
  | 'DOCUMENT'
  | 'COMPLETE';

/** 프론트 step 값 (1~4) */
export type Step = 1 | 2 | 3 | 4;

/** GET/PATCH 응답 */
export type Complaint = {
  complaint_id: string;
  user_sub: string;
  name: string;
  step: ComplaintStep;
  created_at: string;
  updated_at: string;
};

/** PATCH 요청 body */
export type UpdateComplaintPayload = {
  name?: string;
  step?: ComplaintStep;
};

/** step 변환 맵 — TIMELINE_GENERATING은 프론트에서 step 1로 표시 (생성 중 UI) */
export const STEP_MAP: Record<ComplaintStep, Step> = {
  EVIDENCE: 1,
  TIMELINE_GENERATING: 1,
  TIMELINE: 2,
  DOCUMENT: 3,
  COMPLETE: 4,
};

export const STEP_REVERSE_MAP: Record<Step, ComplaintStep> = {
  1: 'EVIDENCE',
  2: 'TIMELINE',
  3: 'DOCUMENT',
  4: 'COMPLETE',
};
