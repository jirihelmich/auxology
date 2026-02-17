import dayjs from 'dayjs';
import { dateFromBirthNumber, birthDateObjectToDate } from './birth-number';
import type { PatientWithPerson } from '../types/database';

interface AgeDiff {
  days: number;
  weeks: number;
  months: number;
}

export function getAgeDiff(patient: PatientWithPerson, asOf?: Date | dayjs.Dayjs): AgeDiff {
  const now = asOf ? dayjs(asOf) : dayjs();
  const bd = dateFromBirthNumber(patient.Person.birthNumber || '');
  if (!bd) return { days: 0, weeks: 0, months: 0 };
  const birthDate = dayjs(birthDateObjectToDate(bd));
  return {
    days: now.diff(birthDate, 'day'),
    weeks: now.diff(birthDate, 'week'),
    months: now.diff(birthDate, 'month'),
  };
}

function weeksSuffix(w: number): string {
  const abs = Math.abs(w);
  if (abs === 1) return 'týden';
  if (abs >= 2 && abs <= 4) return 'týdny';
  return 'týdnů';
}

function daysSuffix(d: number): string {
  const abs = Math.abs(d);
  if (abs === 1) return 'den';
  if (abs >= 2 && abs <= 4) return 'dny';
  return 'dnů';
}

function monthsSuffix(m: number): string {
  const abs = Math.abs(m);
  if (abs === 1) return 'měsíc';
  if (abs >= 2 && abs <= 4) return 'měsíce';
  return 'měsíců';
}

function printDiff(diff: AgeDiff): string {
  if (Math.abs(diff.months) > 2) {
    return diff.months + ' ' + monthsSuffix(diff.months);
  }
  const dayDiff = diff.days % 7;
  const week = diff.weeks;
  return week + ' ' + weeksSuffix(week) + ' ' + dayDiff + ' ' + daysSuffix(dayDiff);
}

export function age(patient: PatientWithPerson): string {
  if (!patient) return '';
  return printDiff(getAgeDiff(patient));
}

export function gestationalAge(patient: PatientWithPerson): string {
  if (!patient) return '';
  const adjustedDate = dayjs().add(patient.Patient.birthWeek, 'week');
  const diff = getAgeDiff(patient, adjustedDate);
  return printDiff(diff);
}

export function correctedAge(patient: PatientWithPerson, asOf?: Date): string {
  if (!patient) return '';
  const base = asOf ? dayjs(asOf) : dayjs();
  const adjusted = base.add(patient.Patient.birthWeek - 40, 'week');
  const diff = getAgeDiff(patient, adjusted);
  return printDiff(diff);
}

export function correctedWeek(patient: PatientWithPerson, asOf?: Date): number {
  if (!patient) return 0;
  const diff = getAgeDiff(patient, asOf ? dayjs(asOf) : undefined);
  return diff.weeks + patient.Patient.birthWeek - 40;
}

export function expectedBirth(patient: PatientWithPerson): string {
  if (!patient) return '';
  const bd = dateFromBirthNumber(patient.Person.birthNumber || '');
  if (!bd) return '';
  const birthDate = dayjs(birthDateObjectToDate(bd));
  const expected = birthDate.add(40 - patient.Patient.birthWeek, 'week');
  return formatDate(expected.toDate());
}

export function birthDateFromNumber(birthNumber: string): string {
  const date = dateFromBirthNumber(birthNumber.replace('/', '').replace(' ', ''));
  if (!date) return '';
  return formatDate(birthDateObjectToDate(date));
}

function formatDate(date: Date): string {
  if (!date || isNaN(date.getTime())) return '';
  return dayjs(date).format('D. M. YYYY');
}
