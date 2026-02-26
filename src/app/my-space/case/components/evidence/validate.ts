import type { EVIDENCE_CONFIG } from './constants';

type EvidenceConfig = (typeof EVIDENCE_CONFIG)[string];

/** MIME type 또는 확장자로 파일 형식 검증 (드래그앤드롭은 input accept를 우회하므로 JS에서 재검증) */
const isValidType = (file: File, config: EvidenceConfig): boolean => {
  // 1차: MIME type 매칭
  if (file.type && config.mimeTypes?.includes(file.type)) return true;
  // 2차: MIME이 빈 문자열인 경우(.hwp 등) 확장자로 폴백
  const ext = '.' + file.name.split('.').pop()?.toLowerCase();
  return config.accept.split(',').includes(ext);
};

/** 새 파일 목록에서 유효한 파일만 필터링 (개수 → 타입 → 크기 순으로 검증) */
export const filterValidFiles = (
  newFiles: File[],
  config: EvidenceConfig,
  currentCount: number,
): File[] => {
  const remaining = config.maxFiles - currentCount;
  if (remaining <= 0) return [];

  return newFiles
    .filter((file) => isValidType(file, config) && file.size <= config.maxSize)
    .slice(0, remaining); // 유효한 파일 중 남은 개수만큼만
};
