import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { BodyMeasurement, MeasurementKey } from '../types';
import { MEASUREMENT_LABELS } from '../types';
import { format } from 'date-fns';

interface Props {
  measurements: BodyMeasurement[];
  metric: MeasurementKey;
}

export function MeasurementChart({ measurements, metric }: Props) {
  const data = measurements
    .filter((m) => m[metric] != null)
    .map((m) => ({
      date: format(new Date(m.timestamp), 'MMM d'),
      value: m[metric],
    }));

  if (data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-[#5a5a44] text-sm">
        No {MEASUREMENT_LABELS[metric].toLowerCase()} data yet
      </div>
    );
  }

  const values = data.map((d) => d.value as number);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const padding = (max - min) * 0.15 || 1;

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#3a3a2a" />
          <XAxis dataKey="date" tick={{ fill: '#9a9680', fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis
            domain={[min - padding, max + padding]}
            tick={{ fill: '#9a9680', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#2e2e22', border: '1px solid #3a3a2a', borderRadius: '12px' }}
            labelStyle={{ color: '#c8c4b0', fontSize: 12 }}
            itemStyle={{ color: '#7cb87a', fontSize: 12 }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#7cb87a"
            strokeWidth={2}
            dot={{ fill: '#7cb87a', r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
