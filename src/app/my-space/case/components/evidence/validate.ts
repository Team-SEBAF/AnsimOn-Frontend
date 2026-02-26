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

/** 영상/음성 파일의 재생 길이(초)를 반환. 메타데이터만 로드하므로 전체 파일을 읽지 않음 */
const getMediaDuration = (file: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src);
      resolve(video.duration);
    };
    video.onerror = () => {
      URL.revokeObjectURL(video.src);
      reject(new Error('영상 메타데이터 로드 실패'));
    };
    video.src = URL.createObjectURL(file);
  });
};

/** 새 파일 목록에서 유효한 파일만 필터링 (타입 → 크기 → 영상 길이 → 개수 순으로 검증) */
export const filterValidFiles = async (
  newFiles: File[],
  config: EvidenceConfig,
  currentCount: number,
): Promise<File[]> => {
  const remaining = config.maxFiles - currentCount;
  if (remaining <= 0) return [];

  // 타입 + 크기 검증 (동기)
  const typeAndSizeValid = newFiles.filter(
    (file) => isValidType(file, config) && file.size <= config.maxSize,
  );

  // 영상 길이 검증 (비동기, maxDuration이 있는 타입만)
  let result = typeAndSizeValid;
  if (config.maxDuration) {
    const checks = await Promise.all(
      typeAndSizeValid.map(async (file) => {
        try {
          const duration = await getMediaDuration(file);
          return duration <= config.maxDuration!;
        } catch {
          return false; // 메타데이터 로드 실패 시 제외
        }
      }),
    );
    result = typeAndSizeValid.filter((_, i) => checks[i]);
  }

  return result.slice(0, remaining); // 유효한 파일 중 남은 개수만큼만
};
