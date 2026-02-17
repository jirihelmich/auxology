import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { ChartDataPoint } from '../../hooks/useChartData';

interface GrowthChartProps {
  data: ChartDataPoint[];
  title: string;
  xLabel?: string;
  yLabel?: string;
  genderColor?: string;
  height?: number;
  showLegend?: boolean;
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
  yMin,
  onClick,
}: GrowthChartProps) {
  return (
    <div className="relative" onClick={onClick} style={onClick ? { cursor: 'pointer' } : undefined}>
      <h6 className="text-sm font-semibold text-gray-700 mb-2 text-center">{title}</h6>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 20, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#d3d3d3" />
          <XAxis
            dataKey="week"
            type="number"
            domain={['dataMin', 'dataMax']}
            label={xLabel ? { value: xLabel, position: 'insideBottom', offset: -10 } : undefined}
            tick={{ fontSize: 11 }}
          />
          <YAxis
            domain={yMin !== undefined ? [yMin, 'auto'] : ['auto', 'auto']}
            label={yLabel ? { value: yLabel, angle: -90, position: 'insideLeft', offset: 0 } : undefined}
            tick={{ fontSize: 11 }}
          />
          <Tooltip
            formatter={(value: number, name: string) => {
              const labels: Record<string, string> = {
                p2: '2. percentil',
                p5: '5. percentil',
                p50: '50. percentil',
                p95: '95. percentil',
                p98: '98. percentil',
                patient: 'Pacient',
              };
              return [value, labels[name] || name];
            }}
          />
          {showLegend && <Legend />}
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
