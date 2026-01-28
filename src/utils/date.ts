/**
 * YYYYMMDD → YYYY-MM-DD
 */
export function normalizeBirthdate(input: string): string {
  if (!/^\d{8}$/.test(input)) {
    throw new Error('Invalid birthdate format');
  }

  const yyyy = input.slice(0, 4);
  const mm = input.slice(4, 6);
  const dd = input.slice(6, 8);

  const date = new Date(`${yyyy}-${mm}-${dd}`);
  if (Number.isNaN(date.getTime())) {
    throw new Error('Invalid date');
  }

  return `${yyyy}-${mm}-${dd}`;
}
