import galleryIcon from '@/assets/icons/gallery.png';
import talkIcon from '@/assets/icons/talk.png';
import locationIcon from '@/assets/icons/location.png';
import messageIcon from '@/assets/icons/message.png';
import pencilIcon from '@/assets/icons/pencil.png';
import type { StaticImageData } from 'next/image';

// ─── 파일 카테고리별 제한 ────────────────────────────────

export type FileCategoryKey = 'IMAGE' | 'VIDEO' | 'AUDIO' | 'DOCUMENT';

export const FILE_CATEGORY_CONFIG: Record<
  FileCategoryKey,
  {
    accept: string;
    mimeTypes: string[];
    maxSize: number;
    maxDuration?: number; // 초 단위, VIDEO·AUDIO만
  }
> = {
  IMAGE: {
    accept: '.jpg,.jpeg,.png,.heic',
    mimeTypes: ['image/jpeg', 'image/png', 'image/heic'],
    maxSize: 10 * 1024 * 1024, // 10MB
  },
  VIDEO: {
    accept: '.mp4,.mov',
    mimeTypes: ['video/mp4', 'video/quicktime'],
    maxSize: 500 * 1024 * 1024, // 500MB
    maxDuration: 300, // 5분
  },
  AUDIO: {
    accept: '.m4a,.mp3,.wav',
    mimeTypes: ['audio/mp4', 'audio/mpeg', 'audio/wav'],
    maxSize: 20 * 1024 * 1024, // 20MB
    maxDuration: 300, // 5분
  },
  DOCUMENT: {
    accept: '.pdf,.hwp,.docx,.txt',
    mimeTypes: [
      'application/pdf',
      'application/vnd.hancom.hwp', // 브라우저가 인식 못해 file.type이 "" → 확장자 폴백으로 처리
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ],
    maxSize: 10 * 1024 * 1024, // 10MB
  },
};

// ─── 증거 타입별 설정 ────────────────────────────────────

type EvidenceConfigBase = {
  maxFiles: number;
  categories: FileCategoryKey[];
  previewType: 'image' | 'file';
  title: string;
  description: string;
  icon: StaticImageData;
};

/**
 * categories 배열에서 input[accept] 문자열을 자동으로 도출해
 * 각 설정 객체에 추가함. categories만 수정하면 accept는 자동으로 동기화됨.
 */
function withAccept<T extends Record<string, EvidenceConfigBase>>(
  config: T,
): Record<keyof T, EvidenceConfigBase & { accept: string }> {
  return Object.fromEntries(
    Object.entries(config).map(([key, val]) => [
      key,
      {
        ...val,
        accept: [
          ...new Set(val.categories.flatMap((k) => FILE_CATEGORY_CONFIG[k].accept.split(','))),
        ].join(','),
      },
    ]),
  ) as Record<keyof T, EvidenceConfigBase & { accept: string }>;
}

/** 증거 타입별 업로드 설정. accept는 categories에서 자동으로 파생됨 */
export const EVIDENCE_CONFIG = withAccept({
  MESSAGE: {
    maxFiles: 10,
    categories: ['IMAGE'] as FileCategoryKey[],
    previewType: 'image' as const,
    title: '메신저 / 문자 / DM',
    description: '대화 캡처(스크린샷), 대화내역 저장(내보내기), 차단 전후 메시지',
    icon: galleryIcon,
  },
  VOICE: {
    maxFiles: 5,
    categories: ['AUDIO', 'IMAGE'] as FileCategoryKey[],
    previewType: 'file' as const,
    title: '통화 · 음성',
    description: '통화 기록(부재중 포함), 통화 내용 녹음(당사자 녹음), 통화 기록 캡처',
    icon: talkIcon,
  },
  VICTIM: {
    maxFiles: 3,
    categories: ['VIDEO', 'IMAGE'] as FileCategoryKey[],
    previewType: 'image' as const,
    title: '피해 사진/영상',
    description: '신체적 피해, 차량 블랙박스, CCTV 사진 및 영상',
    icon: locationIcon,
  },
  REPORT_RECORD: {
    maxFiles: 3,
    categories: ['DOCUMENT'] as FileCategoryKey[],
    previewType: 'file' as const,
    title: '신고 · 상담기록',
    description: '경찰 신고 내역, 상담기관 기록, 피해 진단서 (정신적/신체적 등)',
    icon: messageIcon,
  },
  INCIDENT_LOG: {
    maxFiles: 3,
    categories: ['IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT'] as FileCategoryKey[],
    previewType: 'file' as const,
    title: '사건 일지',
    description: '일어난 사건에 대한 내용을 작성한 기록',
    icon: pencilIcon,
  },
});

export type EvidenceType = keyof typeof EVIDENCE_CONFIG;
