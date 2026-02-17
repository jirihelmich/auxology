export interface BirthDate {
  year: number;
  month: number;
  day: number;
}

export function dateFromBirthNumber(birthNumber: string): BirthDate | null {
  const regex = /^\s*(\d\d)(\d\d)(\d\d)[ /]*(\d\d\d)(\d?)\s*$/;
  const match = regex.exec(birthNumber);

  if (!match) return null;

  const yearString = match[1];
  let year = parseInt(yearString);
  let month = parseInt(match[2]);
  const day = parseInt(match[3]);
  const ext = match[4];
  const c = match[5];

  if (c === '') {
    year += (year + 1900) <= new Date().getFullYear() ? 1900 : 1800;
  } else {
    let mod = parseInt(yearString + match[2] + match[3] + ext) % 11;
    if (mod === 10) mod = 0;
    if (mod !== parseInt(c)) return null;
    year += (year + 2000) <= new Date().getFullYear() ? 2000 : 1900;
  }

  if (month > 70 && year > 2003) {
    month -= 70;
  } else if (month > 50) {
    month -= 50;
  } else if (month > 20 && year > 2003) {
    month -= 20;
  }

  return { year, month, day };
}

export function birthDateObjectToDate(date: BirthDate): Date {
  return new Date(date.year, date.month - 1, date.day);
}

export function validateBirthNumber(birthNumber: string): boolean {
  return dateFromBirthNumber(birthNumber.replace('/', '').replace(' ', '')) !== null;
}

export function formatBirthNumber(number: string): string {
  if (!number) return '';
  const clean = number.replace('/', '').replace(' ', '');
  if (clean.length < 6) return clean;
  return clean.substring(0, 6) + '/' + clean.substring(6);
}
