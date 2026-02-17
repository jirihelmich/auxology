import type { StatisticalData } from '../../types/statistical';

import { weight as muWeight, weightLMS as muWeightLMS } from './male/under/weight';
import { length as muLength, lengthLMS as muLengthLMS } from './male/under/length';
import { headCircumference as muHC, headCircumferenceLMS as muHCLMS } from './male/under/circumference';
import { weightForLength as muWFL, weightForLengthLMS as muWFLLMS, startWeight as muSW } from './male/under/weightForLength';

import { weight as maWeight, weightLMS as maWeightLMS } from './male/above/weight';
import { length as maLength, lengthLMS as maLengthLMS } from './male/above/length';
import { headCircumference as maHC, headCircumferenceLMS as maHCLMS } from './male/above/circumference';
import { weightForLength as maWFL, weightForLengthLMS as maWFLLMS, startWeight as maSW } from './male/above/weightForLength';

import { weight as fuWeight, weightLMS as fuWeightLMS } from './female/under/weight';
import { length as fuLength, lengthLMS as fuLengthLMS } from './female/under/length';
import { headCircumference as fuHC, headCircumferenceLMS as fuHCLMS } from './female/under/circumference';
import { weightForLength as fuWFL, weightForLengthLMS as fuWFLLMS, startWeight as fuSW } from './female/under/weightForLength';

import { weight as faWeight, weightLMS as faWeightLMS } from './female/above/weight';
import { length as faLength, lengthLMS as faLengthLMS } from './female/above/length';
import { headCircumference as faHC, headCircumferenceLMS as faHCLMS } from './female/above/circumference';
import { weightForLength as faWFL, weightForLengthLMS as faWFLLMS, startWeight as faSW } from './female/above/weightForLength';

export const statisticalData: StatisticalData = {
  male: {
    under: {
      weight: muWeight,
      weightLMS: muWeightLMS,
      length: muLength,
      lengthLMS: muLengthLMS,
      headCircumference: muHC,
      headCircumferenceLMS: muHCLMS,
      weightForLength: muWFL,
      weightForLengthLMS: muWFLLMS,
      startWeight: muSW,
    },
    above: {
      weight: maWeight,
      weightLMS: maWeightLMS,
      length: maLength,
      lengthLMS: maLengthLMS,
      headCircumference: maHC,
      headCircumferenceLMS: maHCLMS,
      weightForLength: maWFL,
      weightForLengthLMS: maWFLLMS,
      startWeight: maSW,
    },
  },
  female: {
    under: {
      weight: fuWeight,
      weightLMS: fuWeightLMS,
      length: fuLength,
      lengthLMS: fuLengthLMS,
      headCircumference: fuHC,
      headCircumferenceLMS: fuHCLMS,
      weightForLength: fuWFL,
      weightForLengthLMS: fuWFLLMS,
      startWeight: fuSW,
    },
    above: {
      weight: faWeight,
      weightLMS: faWeightLMS,
      length: faLength,
      lengthLMS: faLengthLMS,
      headCircumference: faHC,
      headCircumferenceLMS: faHCLMS,
      weightForLength: faWFL,
      weightForLengthLMS: faWFLLMS,
      startWeight: faSW,
    },
  },
};
