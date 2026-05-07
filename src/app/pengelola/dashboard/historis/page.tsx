"use client";

import { useState, useMemo } from "react";
import TrendChart from "@/components/pengelola/TrendChart";
import {
  Download,
  Droplets,
  FlaskConical,
  Eye,
  Thermometer,
  ChevronDown,
} from "lucide-react";

type TimeRange = "24h" | "7d" | "30d";
type MetricKey = "waterLevel" | "ph" | "turbidity" | "temperature";

interface StatSummary {
  label: string;
  value: string;
  delta: string;
  deltaPositive: boolean;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  iconBg: string;
}

function generateSeries(
  points: number,
  base: number,
  amplitude: number,
  trend: number = 0
) {
  return Array.from({ length: points }, (_, i) => {
    const noise = (Math.random() - 0.5) * amplitude;
    const trendVal = (i / points) * trend;
    return parseFloat((base + noise + trendVal).toFixed(2));
  });
}

function buildLabels(range: TimeRange): string[] {
  const now = new Date();
  if (range === "24h") {
    return Array.from({ length: 24 }, (_, i) => {
      const d = new Date(now);
      d.setHours(now.getHours() - 23 + i);
      return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    });
  }
  if (range === "7d") {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now);
      d.setDate(now.getDate() - 6 + i);
      return d.toLocaleDateString("id-ID", { weekday: "short", day: "numeric" });
    });
  }
  return Array.from({ length: 30 }, (_, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() - 29 + i);
    return d.toLocaleDateString("id-ID", { month: "short", day: "numeric" });
  });
}

function buildData(range: TimeRange) {
  const pts = range === "24h" ? 24 : range === "7d" ? 7 : 30;
  return {
    waterLevel: generateSeries(pts, 60, 15, 20),
    ph: generateSeries(pts, 7.0, 0.4),
    turbidity: generateSeries(pts, 0.65, 0.3),
    temperature: generateSeries(pts, 24, 2),
  };
}

const DISPENSERS = [
  "Dispenser Gedung A - Lt. 1",
  "Dispenser Gedung A - Lt. 2",
  "Dispenser Gedung B - Lt. 1",
  "Dispenser Gedung C - Lobby",
];

export default function HistorisPage() {
  const [selectedDispenser, setSelectedDispenser] = useState(DISPENSERS[0]);
  const [timeRange, setTimeRange] = useState<TimeRange>("24h");
  const [dispenserOpen, setDispenserOpen] = useState(false);
  const [rangeOpen, setRangeOpen] = useState(false);

  const labels = useMemo(() => buildLabels(timeRange), [timeRange]);
  const data = useMemo(() => buildData(timeRange), [timeRange, selectedDispenser]);

  const last = (arr: number[]) => arr[arr.length - 1];
  const first = (arr: number[]) => arr[0];
  const delta = (arr: number[]) => parseFloat((last(arr) - first(arr)).toFixed(2));

  const stats: StatSummary[] = [
    {
      label: "Current Water Level",
      value: `${last(data.waterLevel).toFixed(1)}%`,
      delta: `${delta(data.waterLevel) >= 0 ? "+" : ""}${delta(data.waterLevel)}% (${timeRange})`,
      deltaPositive: delta(data.waterLevel) >= 0,
      icon: <Droplets size={36} strokeWidth={1.5} />,
      color: "#3B82F6",
      bgColor: "#EFF6FF",
      iconBg: "#DBEAFE",
    },
    {
      label: "pH Level",
      value: last(data.ph).toFixed(2),
      delta: `${delta(data.ph) >= 0 ? "+" : ""}${delta(data.ph)} (${timeRange})`,
      deltaPositive: delta(data.ph) >= 0,
      icon: <FlaskConical size={36} strokeWidth={1.5} />,
      color: "#22C55E",
      bgColor: "#F0FDF4",
      iconBg: "#DCFCE7",
    },
    {
      label: "Turbidity",
      value: `${last(data.turbidity).toFixed(2)} NTU`,
      delta: last(data.turbidity) < 1 ? "Good" : "Check needed",
      deltaPositive: last(data.turbidity) < 1,
      icon: <Eye size={36} strokeWidth={1.5} />,
      color: "#F59E0B",
      bgColor: "#FFFBEB",
      iconBg: "#FEF3C7",
    },
    {
      label: "Temperature",
      value: `${last(data.temperature).toFixed(1)}°C`,
      delta: "Normal range",
      deltaPositive: true,
      icon: <Thermometer size={36} strokeWidth={1.5} />,
      color: "#EF4444",
      bgColor: "#FFF1F2",
      iconBg: "#FFE4E6",
    },
  ];

  const rangeLabels: Record<TimeRange, string> = {
    "24h": "Last 24 Hours",
    "7d": "Last 7 Days",
    "30d": "Last 30 Days",
  };

  return (
    <div className="min-h-screen bg-[#EFF6FF] p-6 font-sans">
      {/* ── Header ── */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Historical Data</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          View and analyze dispenser performance over time
        </p>
      </div>

      {/* ── Filter bar ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6 flex flex-wrap items-end gap-4">
        {/* Dispenser select */}
        <div className="flex-1 min-w-[220px]">
          <label className="block text-xs font-medium text-gray-500 mb-1.5">
            Select Dispenser
          </label>
          <div className="relative">
            <button
              onClick={() => { setDispenserOpen(!dispenserOpen); setRangeOpen(false); }}
              className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 hover:border-blue-400 transition-colors"
            >
              <span className="truncate">{selectedDispenser}</span>
              <ChevronDown size={16} className={`ml-2 shrink-0 text-gray-400 transition-transform ${dispenserOpen ? "rotate-180" : ""}`} />
            </button>
            {dispenserOpen && (
              <div className="absolute z-20 top-full mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                {DISPENSERS.map((d) => (
                  <button
                    key={d}
                    onClick={() => { setSelectedDispenser(d); setDispenserOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 transition-colors ${d === selectedDispenser ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"}`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Time range */}
        <div className="min-w-[160px]">
          <label className="block text-xs font-medium text-gray-500 mb-1.5">
            Time Range
          </label>
          <div className="relative">
            <button
              onClick={() => { setRangeOpen(!rangeOpen); setDispenserOpen(false); }}
              className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 hover:border-blue-400 transition-colors"
            >
              <span>{rangeLabels[timeRange]}</span>
              <ChevronDown size={16} className={`ml-2 shrink-0 text-gray-400 transition-transform ${rangeOpen ? "rotate-180" : ""}`} />
            </button>
            {rangeOpen && (
              <div className="absolute z-20 top-full mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                {(Object.keys(rangeLabels) as TimeRange[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => { setTimeRange(r); setRangeOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 transition-colors ${r === timeRange ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"}`}
                  >
                    {rangeLabels[r]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Export */}
        <button className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors shrink-0">
          <Download size={15} />
          Export CSV
        </button>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center justify-between"
            style={{ background: s.bgColor }}
          >
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">{s.label}</p>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p
                className="text-xs font-medium mt-1"
                style={{ color: s.deltaPositive ? "#22C55E" : "#EF4444" }}
              >
                {s.deltaPositive ? "↑" : "↓"} {s.delta}
              </p>
            </div>
            <div
              className="rounded-full p-3"
              style={{ background: s.iconBg, color: s.color }}
            >
              {s.icon}
            </div>
          </div>
        ))}
      </div>

      {/* ── Charts ── */}
      <div className="flex flex-col gap-5">
        <TrendChart
          title="Water Level Trend"
          labels={labels}
          datasets={[
            {
              label: "Water Level (%)",
              data: data.waterLevel,
              color: "#3B82F6",
              fill: true,
            },
          ]}
          yMin={0}
          yMax={100}
        />

        <TrendChart
          title="pH Level History"
          labels={labels}
          datasets={[
            {
              label: "pH Level",
              data: data.ph,
              color: "#22C55E",
              fill: false,
            },
          ]}
          yMin={6}
          yMax={8}
        />

        <TrendChart
          title="Turbidity History"
          labels={labels}
          datasets={[
            {
              label: "Turbidity (NTU)",
              data: data.turbidity,
              color: "#F59E0B",
              fill: false,
            },
          ]}
          yMin={0}
          yMax={1}
        />

        <TrendChart
          title="Temperature History"
          labels={labels}
          datasets={[
            {
              label: "Temperature (°C)",
              data: data.temperature,
              color: "#EF4444",
              fill: false,
            },
          ]}
          yMin={20}
          yMax={30}
        />
      </div>

      {/* ── Maintenance schedule ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mt-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-base">📅</span>
          <h2 className="text-sm font-semibold text-gray-700">Maintenance Schedule</h2>
        </div>
        <div className="flex flex-wrap gap-x-12 gap-y-3">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Last Maintenance</p>
            <p className="text-sm font-semibold text-gray-800">April 10, 2026</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Next Maintenance</p>
            <p className="text-sm font-semibold text-blue-500">April 24, 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
}