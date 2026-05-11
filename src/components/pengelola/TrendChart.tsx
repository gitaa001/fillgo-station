"use client";

import {
  ResponsiveContainer,
  AreaChart,
  LineChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface Dataset {
  label: string;
  data: number[];
  color: string;
  fill?: boolean;
}

interface TrendChartProps {
  title: string;
  labels: string[];
  datasets: Dataset[];
  yMin?: number;
  yMax?: number;
}

function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export default function TrendChart({
  title,
  labels,
  datasets,
  yMin,
  yMax,
}: TrendChartProps) {
  const chartData = labels.map((label, i) => {
    const point: Record<string, string | number> = { name: label };
    datasets.forEach((ds) => {
      point[ds.label] = ds.data[i] ?? 0;
    });
    return point;
  });

  const hasFill = datasets.some((ds) => ds.fill);

  const tickStep = Math.max(1, Math.floor(labels.length / 8));

  const ChartComponent = hasFill ? AreaChart : LineChart;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <h2 className="text-sm font-semibold text-gray-700 mb-4">{title}</h2>
      <ResponsiveContainer width="100%" height={220}>
        <ChartComponent data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <defs>
            {datasets.map((ds) => (
              <linearGradient key={ds.label} id={`grad-${ds.label}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={ds.color} stopOpacity={0.35} />
                <stop offset="95%" stopColor={ds.color} stopOpacity={0.03} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="4 4" stroke="#F1F5F9" vertical={true} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: "#94A3B8" }}
            tickLine={false}
            axisLine={false}
            interval={tickStep - 1}
          />
          <YAxis
            domain={[yMin ?? "auto", yMax ?? "auto"]}
            tick={{ fontSize: 11, fill: "#94A3B8" }}
            tickLine={false}
            axisLine={false}
            width={40}
          />
          <Tooltip
            contentStyle={{
              background: "#fff",
              border: "1px solid #E2E8F0",
              borderRadius: "10px",
              fontSize: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
            labelStyle={{ color: "#64748B", fontWeight: 500, marginBottom: 4 }}
          />
          {datasets.length > 1 && (
            <Legend
              wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
              iconType="circle"
              iconSize={8}
            />
          )}
          {datasets.map((ds) =>
            ds.fill ? (
              <Area
                key={ds.label}
                type="monotone"
                dataKey={ds.label}
                stroke={ds.color}
                strokeWidth={2}
                fill={`url(#grad-${ds.label})`}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0, fill: ds.color }}
              />
            ) : (
              <Line
                key={ds.label}
                type="monotone"
                dataKey={ds.label}
                stroke={ds.color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0, fill: ds.color }}
              />
            )
          )}
        </ChartComponent>
      </ResponsiveContainer>
      {/* Single-dataset legend */}
      {datasets.length === 1 && (
        <div className="flex justify-center mt-2">
          <span className="flex items-center gap-1.5 text-xs text-gray-400">
            <span
              className="inline-block w-6 h-0.5 rounded"
              style={{ background: datasets[0].color }}
            />
            <span style={{ color: datasets[0].color }}>{datasets[0].label}</span>
          </span>
        </div>
      )}
    </div>
  );
}