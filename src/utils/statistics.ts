import type { LmsRow } from '../types/statistical';

export function zScore(patientData: number, lms: LmsRow): number {
  const l = lms[0];
  const m = lms[1];
  const s = lms[2];
  return (Math.pow(patientData / m, l) - 1) / (l * s);
}

export function cumnormdist(x: number): number {
  const b1 = 0.31938153;
  const b2 = -0.356563782;
  const b3 = 1.781477937;
  const b4 = -1.821255978;
  const b5 = 1.330274429;
  const p = 0.2316419;
  const c = 0.39894228;

  if (x >= 0.0) {
    const t = 1.0 / (1.0 + p * x);
    return 1.0 - c * Math.exp(-x * x / 2.0) * t *
      (t * (t * (t * (t * b5 + b4) + b3) + b2) + b1);
  } else {
    const t = 1.0 / (1.0 - p * x);
    return c * Math.exp(-x * x / 2.0) * t *
      (t * (t * (t * (t * b5 + b4) + b3) + b2) + b1);
  }
}

export function percentile(patientData: number, lms: LmsRow): number {
  return 100 * cumnormdist(zScore(patientData, lms));
}

export function plusMinus(num: number): string {
  if (num > 0) return '+ ' + num;
  if (num < 0) return '- ' + Math.abs(num);
  return '' + num;
}
