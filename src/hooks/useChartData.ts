import { useMemo } from 'react';
import { statisticalData } from '../lib/statistical-data';
import { zScore as calcZScore, percentile as calcPercentile, plusMinus } from '../utils/statistics';
import type { Gender, WeightCategory, MeasureType, LmsRow } from '../types/statistical';

export interface ChartDataPoint {
  week: number;
  p2?: number;
  p5?: number;
  p50?: number;
  p95?: number;
  p98?: number;
  patient?: number;
}

interface ChartOptions {
  dataStart?: number;
}

export function buildChartData(
  gender: Gender,
  weightCategory: WeightCategory,
  type: MeasureType,
  patientData: Record<number, number> = {},
  options: ChartOptions = {},
): ChartDataPoint[] {
  const catData = statisticalData[gender][weightCategory];
  const data = catData[type];
  if (!data || data.length === 0) return [];

  let dataStartWeek = options.dataStart ?? -3;
  if (type === 'weightForLength') {
    dataStartWeek = catData.startWeight;
  }

  const patientWeeks = Object.keys(patientData).map(Number);
  const patientStartWeek = patientWeeks.length ? Math.min(...patientWeeks) : dataStartWeek;
  const startWeek = patientWeeks.length ? Math.min(dataStartWeek, patientStartWeek) : dataStartWeek;
  const offset = dataStartWeek - startWeek;

  const patientEndWeek = patientWeeks.length ? Math.max(...patientWeeks) : dataStartWeek;
  const dataEndWeek = dataStartWeek + data.length - 1;
  const endWeek = patientWeeks.length
    ? Math.max(Math.min(patientEndWeek, 2 * dataEndWeek), dataEndWeek)
    : dataEndWeek;

  const length = endWeek - startWeek;
  const ratio = (type === 'length' || type === 'headCircumference') ? 10 : 1;

  const points: ChartDataPoint[] = [];

  for (let i = 0; i < length; i++) {
    const week = startWeek + i;
    const isBeforeData = week < dataStartWeek;
    const isAfterData = week > dataEndWeek;
    const patientValue = week in patientData ? patientData[week] / ratio : undefined;

    if (isBeforeData || isAfterData) {
      points.push({ week, patient: patientValue });
    } else {
      const row = data[i - offset];
      points.push({
        week,
        p2: row[0] / ratio,
        p5: row[1] / ratio,
        p50: row[2] / ratio,
        p95: row[3] / ratio,
        p98: row[4] / ratio,
        patient: patientValue,
      });
    }
  }

  return points;
}

const STATISTICAL_DATA_START = 37;

export function getPercentileValue(
  gender: Gender,
  weightCategory: WeightCategory,
  patientValue: number,
  type: MeasureType,
  lmsOffset: number,
): string {
  const lmsKey = (type + 'LMS') as keyof typeof statisticalData.male.under;
  const array = statisticalData[gender][weightCategory][lmsKey] as LmsRow[] | undefined;
  if (!array) return '-';
  const lms = array[lmsOffset];
  if (!lms) return '-';
  return '' + Math.round(calcPercentile(patientValue, lms));
}

export function getZScoreValue(
  gender: Gender,
  weightCategory: WeightCategory,
  patientValue: number,
  type: MeasureType,
  lmsOffset: number,
): string {
  const lmsKey = (type + 'LMS') as keyof typeof statisticalData.male.under;
  const array = statisticalData[gender][weightCategory][lmsKey] as LmsRow[] | undefined;
  if (!array) return '-';
  const lms = array[lmsOffset];
  if (!lms) return '-';
  return plusMinus(parseFloat(calcZScore(patientValue, lms).toFixed(2)));
}

export function getWfLPercentile(
  gender: Gender,
  weightCategory: WeightCategory,
  weight: number,
  lmsOffset: number,
): string {
  const array = statisticalData[gender][weightCategory].weightForLengthLMS;
  if (!array) return '-';
  const lms = array[lmsOffset];
  if (!lms) return '-';
  return '' + Math.round(calcPercentile(weight, lms));
}

export function getZScoreWfl(
  gender: Gender,
  weightCategory: WeightCategory,
  weight: number,
  lmsOffset: number,
): string {
  const array = statisticalData[gender][weightCategory].weightForLengthLMS;
  if (!array) return '-';
  const lms = array[lmsOffset];
  if (!lms) return '-';
  return plusMinus(parseFloat(calcZScore(weight, lms).toFixed(2)));
}

export function scoreOffset(birthWeek: number, examinationDate: Date, patientBirthNumber: string, ageDiffWeeks: number): number {
  const weekDiff = ageDiffWeeks + birthWeek;
  return weekDiff - STATISTICAL_DATA_START;
}

export function useChartData(
  gender: Gender | null,
  weightCategory: WeightCategory | null,
  patientDataMap: {
    weights: Record<number, number>;
    lengths: Record<number, number>;
    headCircumferences: Record<number, number>;
    weightsForLengths: Record<number, number>;
  } | null,
) {
  return useMemo(() => {
    if (!gender || !weightCategory) return null;
    const data = patientDataMap || { weights: {}, lengths: {}, headCircumferences: {}, weightsForLengths: {} };

    return {
      weight: buildChartData(gender, weightCategory, 'weight', data.weights),
      length: buildChartData(gender, weightCategory, 'length', data.lengths),
      headCircumference: buildChartData(gender, weightCategory, 'headCircumference', data.headCircumferences),
      weightForLength: buildChartData(gender, weightCategory, 'weightForLength', data.weightsForLengths),
    };
  }, [gender, weightCategory, patientDataMap]);
}
