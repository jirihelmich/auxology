export type PercentileRow = [number, number, number, number, number];
export type LmsRow = [number, number, number];

export interface GenderWeightData {
  weight: PercentileRow[];
  weightLMS: LmsRow[];
  length: PercentileRow[];
  lengthLMS: LmsRow[];
  headCircumference: PercentileRow[];
  headCircumferenceLMS: LmsRow[];
  weightForLength: PercentileRow[];
  weightForLengthLMS: LmsRow[];
  startWeight: number;
}

export interface StatisticalData {
  male: {
    under: GenderWeightData;
    above: GenderWeightData;
  };
  female: {
    under: GenderWeightData;
    above: GenderWeightData;
  };
}

export type Gender = 'male' | 'female';
export type WeightCategory = 'under' | 'above';
export type MeasureType = 'weight' | 'length' | 'headCircumference' | 'weightForLength';
