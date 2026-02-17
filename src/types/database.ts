export interface Address {
  id: number;
  street: string | null;
  city: string | null;
  country: string | null;
  zipcode: string | null;
}

export interface Person {
  id: number;
  gender: string | null;
  titlePrefix: string | null;
  firstName: string | null;
  lastName: string | null;
  firstNameSearchable: string | null;
  lastNameSearchable: string | null;
  titlePostfix: string | null;
  email: string | null;
  phone: string | null;
  birthNumber: string | null;
  birthDate: Date | null;
  addressId: number;
  weight: number | null;
  length: number | null;
  headCircumference: number | null;
  description: string | null;
  workplace: string | null;
}

export interface User {
  id: number;
  personId: number;
  username: string;
  password: string;
}

export interface Patient {
  id: number;
  personId: number;
  doctorId: number;
  motherId: number;
  fatherId: number;
  isActive: boolean;
  birthWeek: number;
  expectedBirthDate: Date;
  birthWeight: number;
  birthLength: number | null;
  birthHeadCircumference: number | null;
}

export interface Examination {
  id: number;
  patientId: number;
  doctorId: number;
  dateTime: Date;
  weight: number;
  length: number;
  headCircumference: number;
  description: string | null;
  image: unknown;
}

export interface PatientWithPerson {
  Patient: Patient;
  Person: Person;
}

export interface PatientDetail extends PatientWithPerson {
  Mother: Person;
  Father: Person;
  MotherAddress: Address;
  FatherAddress: Address;
}

export interface PatientWithExamination extends PatientDetail {
  Examination: Examination;
}
