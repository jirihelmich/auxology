import { X } from 'lucide-react';
import { GrowthChart } from './GrowthChart';
import type { ChartDataPoint } from '../../hooks/useChartData';

interface ChartZoomModalProps {
  data: ChartDataPoint[];
  title: string;
  genderColor: string;
  xLabel?: string;
  yLabel?: string;
  onClose: () => void;
}

export function ChartZoomModal({ data, title, genderColor, xLabel, yLabel, onClose }: ChartZoomModalProps) {
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      <div className="flex justify-end p-4">
        <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
          <X size={30} />
        </button>
      </div>
      <div className="flex-1 px-8 pb-8">
        <GrowthChart
          data={data}
          title={title}
          xLabel={xLabel}
          yLabel={yLabel}
          genderColor={genderColor}
          height={700}
          showLegend
        />
      </div>
    </div>
  );
}
