import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface SparklineCellProps {
  data: number[];
  color: string;
  fillColor: string;
}

export function SparklineCell({ data, color }: SparklineCellProps) {
  const chartData = data.map((v, i) => ({ i, v }));

  return (
    <ResponsiveContainer width={100} height={30}>
      <LineChart data={chartData}>
        <Line type="monotone" dataKey="v" stroke={color} strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
