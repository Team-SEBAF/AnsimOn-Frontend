// ─── 태그 ────────────────────────────────────────────────

export type TimelineTag = 'REPEAT' | 'PHYSICAL_HARM' | 'THREAT' | 'SEXUAL_INSULT' | 'REFUSAL';

export const TAG_LABEL_MAP: Record<TimelineTag, string> = {
  REPEAT: '반복',
  PHYSICAL_HARM: '신체피해',
  THREAT: '위협·강압',
  SEXUAL_INSULT: '성적·모욕',
  REFUSAL: '거절 의사',
};

export const TAG_COLOR_MAP: Record<TimelineTag, { bg: string; text: string }> = {
  REPEAT: { bg: 'bg-warning/10', text: 'text-warning' },
  PHYSICAL_HARM: { bg: 'bg-error/10', text: 'text-error' },
  THREAT: { bg: 'bg-error/10', text: 'text-error' },
  SEXUAL_INSULT: { bg: 'bg-warning/10', text: 'text-warning' },
  REFUSAL: { bg: 'bg-info/10', text: 'text-info' },
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
