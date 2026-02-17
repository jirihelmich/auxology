import { GrowthChart } from './GrowthChart';
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
  onZoom,
}: GrowthChartGridProps) {
  const suffix = `, ${genderName} s porodní hmotností ${weightCategoryName} 1500 g`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <GrowthChart
        data={lengthData}
        title={`Tělesná délka${suffix}`}
        xLabel="Korigovaný věk"
        yLabel="Tělesná délka [cm]"
        genderColor={genderColor}
        yMin={35}
        onClick={onZoom ? () => onZoom('length') : undefined}
      />
      <GrowthChart
        data={weightData}
        title={`Tělesná hmotnost${suffix}`}
        xLabel="Korigovaný věk"
        yLabel="Hmotnost [g]"
        genderColor={genderColor}
        onClick={onZoom ? () => onZoom('weight') : undefined}
      />
      <GrowthChart
        data={weightForLengthData}
        title={`Hmotnost k délce${suffix}`}
        xLabel="Tělesná délka [cm]"
        yLabel="Hmotnost [g]"
        genderColor={genderColor}
        onClick={onZoom ? () => onZoom('weightForLength') : undefined}
      />
      <GrowthChart
        data={headCircumferenceData}
        title={`Obvod hlavy${suffix}`}
        xLabel="Korigovaný věk"
        yLabel="Obvod hlavy [cm]"
        genderColor={genderColor}
        onClick={onZoom ? () => onZoom('headCircumference') : undefined}
      />
    </div>
  );
}
