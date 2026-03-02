/**
 * 파일 크기를 KB/MB 단위로 포맷팅
 *
 * @param bytes - 파일 크기 (바이트)
 * @returns "1.2KB", "3.5MB" 형식 문자열
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)}KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

/**
 * 재생 시간을 MM:SS 형식으로 포맷팅
 *
 * @param seconds - 재생 시간 (초)
 * @returns "01:23" 형식 문자열
 */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
