import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useT } from '../../i18n/LanguageContext';
import type { ChartDataPoint } from '../../hooks/useChartData';

interface GrowthChartProps {
  data: ChartDataPoint[];
  title: string;
  xLabel?: string;
  yLabel?: string;
  genderColor?: string;
  height?: number;
  showLegend?: boolean;
  patientName?: string;
  yMin?: number;
  onClick?: () => void;
}

export function GrowthChart({
  data,
  title,
  xLabel,
  yLabel,
  genderColor = '#1c84c6',
  height = 350,
  showLegend = false,
  patientName,
  yMin,
  onClick,
}: GrowthChartProps) {
  const { t } = useT();

  return (
    <div className="relative" onClick={onClick} style={onClick ? { cursor: 'pointer' } : undefined}>
      <h6 className="text-sm font-semibold text-gray-700 mb-2 text-center">{title}</h6>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: showLegend ? 55 : 20, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#d3d3d3" />
          <XAxis
            dataKey="week"
            type="number"
            domain={['dataMin', 'dataMax']}
            label={xLabel ? { value: xLabel, position: 'insideBottom', offset: showLegend ? -45 : -10 } : undefined}
            tick={{ fontSize: 11 }}
          />
          <YAxis
            domain={yMin !== undefined ? [yMin, 'auto'] : ['auto', 'auto']}
            label={yLabel ? { value: yLabel, angle: -90, position: 'insideLeft', offset: 0 } : undefined}
            tick={{ fontSize: 11 }}
          />
          <Tooltip
            formatter={(value: number, name: string) => {
              const unit = yLabel?.match(/\[(.+)\]/)?.[1] || '';
              const labels: Record<string, string> = {
                p2: t.chartPercentile2,
                p5: t.chartPercentile5,
                p50: t.chartPercentile50,
                p95: t.chartPercentile95,
                p98: t.chartPercentile98,
                Pacient: patientName || t.patient,
              };
              return [`${value} ${unit}`, labels[name] || name];
            }}
            labelFormatter={(label: number) => {
              const xUnit = xLabel?.match(/\[(.+)\]/)?.[1];
              return xUnit ? `${label} ${xUnit}` : t.chartWeekSuffix(label);
            }}
          />
          {showLegend && (
            <Legend
              content={() => (
                <div className="flex items-center justify-center gap-6 text-xs text-gray-700 mt-2">
                  <span className="flex items-center gap-1.5">
                    <svg width="30" height="10"><line x1="0" y1="5" x2="30" y2="5" stroke="#000" strokeWidth="1" /></svg>
                    {t.chartLegend298}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg width="30" height="10"><line x1="0" y1="5" x2="30" y2="5" stroke="#000" strokeWidth="1" strokeDasharray="4 4" /></svg>
                    {t.chartLegend595}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg width="30" height="10"><line x1="0" y1="5" x2="30" y2="5" stroke="#000" strokeWidth="1" strokeDasharray="1 2" /></svg>
                    {t.chartLegend50}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg width="30" height="10"><line x1="0" y1="5" x2="30" y2="5" stroke={genderColor} strokeWidth="2" /><circle cx="15" cy="5" r="3" fill={genderColor} /></svg>
                    {patientName || t.patient}
                  </span>
                </div>
              )}
            />
          )}
          <Line type="monotone" dataKey="p2" stroke="#000" strokeWidth={1} dot={false} connectNulls name="p2" />
          <Line type="monotone" dataKey="p5" stroke="#000" strokeWidth={1} strokeDasharray="4 4" dot={false} connectNulls name="p5" />
          <Line type="monotone" dataKey="p50" stroke="#000" strokeWidth={1} strokeDasharray="1 2" dot={false} connectNulls name="p50" />
          <Line type="monotone" dataKey="p95" stroke="#000" strokeWidth={1} strokeDasharray="4 4" dot={false} connectNulls name="p95" />
          <Line type="monotone" dataKey="p98" stroke="#000" strokeWidth={1} dot={false} connectNulls name="p98" />
          <Line
            type="monotone"
            dataKey="patient"
            stroke={genderColor}
            strokeWidth={2}
            dot={{ fill: genderColor, r: 3 }}
            connectNulls
            name="Pacient"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
