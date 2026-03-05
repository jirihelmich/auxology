import { GrowthChart } from './GrowthChart';
import { useT } from '../../i18n/LanguageContext';
import type { ChartDataPoint } from '../../hooks/useChartData';

interface GrowthChartGridProps {
  weightData: ChartDataPoint[];
  lengthData: ChartDataPoint[];
  headCircumferenceData: ChartDataPoint[];
  weightForLengthData: ChartDataPoint[];
  genderColor: string;
  genderName: string;
  weightCategoryName: string;
  birthWeight?: number;
  patientName?: string;
  onZoom?: (chart: 'weight' | 'length' | 'headCircumference' | 'weightForLength') => void;
}

export function GrowthChartGrid({
  weightData,
  lengthData,
  headCircumferenceData,
  weightForLengthData,
  genderColor,
  genderName,
  weightCategoryName,
  birthWeight,
  patientName,
  onZoom,
}: GrowthChartGridProps) {
  const { t } = useT();
  const suffix = t.chartSuffix(genderName, weightCategoryName);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <GrowthChart
        data={lengthData}
        title={`${t.chartLength}${suffix}`}
        xLabel={t.chartCorrectedAge}
        yLabel={t.chartLengthUnit}
        genderColor={genderColor}
        patientName={patientName}
        yMin={35}
        onClick={onZoom ? () => onZoom('length') : undefined}
      />
      <GrowthChart
        data={weightData}
        title={`${t.chartWeight}${suffix}`}
        xLabel={t.chartCorrectedAge}
        yLabel={t.chartWeightUnit}
        genderColor={genderColor}
        patientName={patientName}
        onClick={onZoom ? () => onZoom('weight') : undefined}
      />
      <GrowthChart
        data={weightForLengthData}
        title={`${t.chartWeightForLength}${suffix}`}
        xLabel={t.chartLengthUnit}
        yLabel={t.chartWeightUnit}
        genderColor={genderColor}
        patientName={patientName}
        onClick={onZoom ? () => onZoom('weightForLength') : undefined}
      />
      <GrowthChart
        data={headCircumferenceData}
        title={`${t.chartHeadCirc}${suffix}`}
        xLabel={t.chartCorrectedAge}
        yLabel={t.chartHeadCircUnit}
        genderColor={genderColor}
        patientName={patientName}
        onClick={onZoom ? () => onZoom('headCircumference') : undefined}
      />
    </div>
  );
}
