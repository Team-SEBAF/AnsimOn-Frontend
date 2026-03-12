/**
 * ISO 날짜 문자열을 한국어 날짜로 포맷 (예: "2026. 3. 12.")
 *
 * @param isoString - ISO 8601 날짜 문자열 (예: "2026-03-12T10:32:21Z")
 */
export function formatDateKo(isoString: string): string {
  return new Date(isoString).toLocaleDateString('ko-KR');
}

/**
 * 오늘 날짜를 YYYY-MM-DD 형식으로 반환 (로컬 시간 기준)
 */
export function getTodayString(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * YYYY-MM-DD 문자열을 Date 객체로 파싱 (캘린더용)
 * @returns 유효하지 않으면 undefined
 */
export function parseBirthdate(value: string | undefined): Date | undefined {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return undefined;
  return new Date(year, month - 1, day);
}

/**
 * 숫자 입력을 YYYY-MM-DD 형식으로 자동 포맷
 */
export function formatBirthdateInput(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 4) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`;
}
