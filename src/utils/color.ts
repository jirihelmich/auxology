import type { PatientWithPerson } from '../types/database';

export function genderColor(patient: PatientWithPerson | null | undefined): string {
  if (!patient) return '#1c84c6';
  return patient.Person.gender === 'female' ? '#ed5565' : '#1c84c6';
}

export function shadeColor(color: string | null | undefined, percent: number): string {
  if (!color) return '#000000';
  const f = parseInt(color.slice(1), 16);
  const t = percent < 0 ? 0 : 255;
  const p = percent < 0 ? percent * -1 : percent;
  const R = f >> 16;
  const G = (f >> 8) & 0x00ff;
  const B = f & 0x0000ff;
  return (
    '#' +
    (
      0x1000000 +
      (Math.round((t - R) * p) + R) * 0x10000 +
      (Math.round((t - G) * p) + G) * 0x100 +
      (Math.round((t - B) * p) + B)
    )
      .toString(16)
      .slice(1)
  );
}
