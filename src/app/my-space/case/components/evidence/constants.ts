import galleryIcon from '@/assets/icons/gallery.png';
import talkIcon from '@/assets/icons/talk.png';
import locationIcon from '@/assets/icons/location.png';
import messageIcon from '@/assets/icons/message.png';
import pencilIcon from '@/assets/icons/pencil.png';
import type { StaticImageData } from 'next/image';

/** 증거 타입별 업로드 설정 */
export const EVIDENCE_CONFIG: Record<
  string,
  {
    maxFiles: number;
    maxSize: number;
    accept: string;
    mimeTypes?: string[];
    previewType: 'image' | 'file';
    title: string;
    description: string;
    icon: StaticImageData;
  }
> = {
  MESSAGE: {
    maxFiles: 10,
    maxSize: 10 * 1024 * 1024, // 10MB
    accept: '.jpg,.jpeg,.png,.heic',
    mimeTypes: ['image/jpeg', 'image/png', 'image/heic'],
    previewType: 'image',
    title: '메신저 / 문자 / DM',
    description: '대화 캡처(스크린샷), 대화내역 저장(내보내기), 차단 전후 메시지',
    icon: galleryIcon,
  },
  VOICE: {
    maxFiles: 5,
    maxSize: 20 * 1024 * 1024, // 20MB
    accept: '.m4a,.mp3,.wav',
    mimeTypes: ['audio/mp4', 'audio/mpeg', 'audio/wav'],
    previewType: 'file',
    title: '통화 · 음성',
    description: '통화 기록(부재중 포함), 음성사서함, 통화 내용 녹음(당사자 녹음)',
    icon: talkIcon,
  },
  TRACKING: {
    maxFiles: 3,
    maxSize: 500 * 1024 * 1024, // 500MB
    accept: '.mp4,.mov',
    mimeTypes: ['video/mp4', 'video/quicktime'],
    previewType: 'image',
    title: '접근/추적 흔적',
    description: '찾아옴/대기/미행 장면 사진·영상, 차량 블랙박스, CCTV',
    icon: locationIcon,
  },
  REPORT_RECORD: {
    maxFiles: 3,
    maxSize: 10 * 1024 * 1024, // 10MB
    accept: '.pdf,.hwp,.docx,.txt',
    mimeTypes: [
      'application/pdf',
      'application/vnd.hancom.hwp', // 브라우저가 인식 못해 file.type이 "" → 확장자 폴백으로 처리
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ],
    previewType: 'file',
    title: '신고 · 상담기록',
    description: '경찰 신고 내역, 상담기관 기록, 피해 진단서 (정신적/신체적 등)',
    icon: messageIcon,
  },
  INCIDENT_LOG: {
    maxFiles: 3,
    maxSize: 10 * 1024 * 1024, // 10MB
    accept: '.pdf,.hwp,.docx,.txt',
    mimeTypes: [
      'application/pdf',
      'application/vnd.hancom.hwp', // 브라우저가 인식 못해 file.type이 "" → 확장자 폴백으로 처리
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ],
    previewType: 'file',
    title: '사건 일지',
    description: '일어난 사건에 대한 내용을 작성한 기록',
    icon: pencilIcon,
  },
};

export type EvidenceType = keyof typeof EVIDENCE_CONFIG;
