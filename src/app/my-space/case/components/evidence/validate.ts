import { FILE_CATEGORY_CONFIG } from './constants';
import type { EVIDENCE_CONFIG, FileCategoryKey, EvidenceType } from './constants';

type EvidenceConfig = (typeof EVIDENCE_CONFIG)[EvidenceType];

/**
 * 파일이 속한 카테고리 설정을 반환
 * MIME type으로 먼저 찾고, 빈 문자열(.hwp 등)이면 확장자로 폴백
 * 어느 카테고리에도 해당하지 않으면 null이 반환
 */
export function getCategoryForFile(
  file: File,
  categories: FileCategoryKey[],
): (typeof FILE_CATEGORY_CONFIG)[FileCategoryKey] | null {
  for (const key of categories) {
    const categoryConfig = FILE_CATEGORY_CONFIG[key];

    const matchesMimeType = file.type && categoryConfig.mimeTypes.includes(file.type);
    if (matchesMimeType) return categoryConfig;

    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    const matchesExtension = categoryConfig.accept.split(',').includes(fileExtension);
    if (matchesExtension) return categoryConfig;
  }
  return null;
}

/** 영상/음성 파일의 재생 길이(초)가 반환됨. 메타데이터만 로드되므로 전체 파일을 읽지 않음 */
export const getMediaDuration = (file: File): Promise<number> => {
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

export type FilterResult = {
  valid: File[];
  rejected: File[];
};

/** 새 파일 목록에서 유효한 파일만 필터링
 * 1. 카테고리별 타입·크기
 * 2. 영상/음성 길이
 * 3. 개수
 */
export const filterValidFiles = async (
  newFiles: File[],
  config: EvidenceConfig,
  currentCount: number,
): Promise<FilterResult> => {
  const remaining = config.maxFiles - currentCount;
  if (remaining <= 0) return { valid: [], rejected: newFiles };

  // 1단계: 카테고리 판별 + 크기 검증 (동기)
  const [typeAndSizeValid, typeAndSizeRejected] = newFiles.reduce<[File[], File[]]>(
    ([valid, rejected], file) => {
      const categoryConfig = getCategoryForFile(file, config.categories);
      const isValidType = categoryConfig !== null;
      const isWithinSizeLimit = isValidType && file.size <= categoryConfig.maxSize;
      if (isWithinSizeLimit) return [[...valid, file], rejected];
      return [valid, [...rejected, file]];
    },
    [[], []],
  );

  // 2단계: 영상/음성 길이 검증 (비동기)
  // maxDuration이 없는 카테고리(이미지, 문서)는 true가 반환되어 자동 통과됨
  const durationChecks = await Promise.all(
    typeAndSizeValid.map(async (file) => {
      const categoryConfig = getCategoryForFile(file, config.categories);
      const hasDurationLimit = categoryConfig?.maxDuration != null;
      if (!hasDurationLimit) return true;
      try {
        const duration = await getMediaDuration(file);
        const isWithinDurationLimit = duration <= categoryConfig!.maxDuration!;
        return isWithinDurationLimit;
      } catch {
        return false;
      }
    }),
  );

  const [durationValid, durationRejected] = typeAndSizeValid.reduce<[File[], File[]]>(
    ([valid, rejected], file, i) => {
      const passedDurationCheck = durationChecks[i];
      if (passedDurationCheck) return [[...valid, file], rejected];
      return [valid, [...rejected, file]];
    },
    [[], []],
  );

  // 3단계: 개수 초과 처리
  const valid = durationValid.slice(0, remaining);
  const countRejected = durationValid.slice(remaining);

  return {
    valid,
    rejected: [...typeAndSizeRejected, ...durationRejected, ...countRejected],
  };
};
