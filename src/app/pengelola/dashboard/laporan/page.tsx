"use client";

import { useState, useMemo } from "react";
import LaporanExport from "@/components/pengelola/LaporanExport";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  ChevronDown,
  FileText,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";

type ReportPeriod = "weekly" | "monthly" | "quarterly";

const DISPENSERS = [
  "Semua Dispenser",
  "Dispenser Gedung A - Lt. 1",
  "Dispenser Gedung A - Lt. 2",
  "Dispenser Gedung B - Lt. 1",
  "Dispenser Gedung C - Lobby",
];

const PERIOD_LABELS: Record<ReportPeriod, string> = {
  weekly: "Weekly",
  monthly: "Monthly",
  quarterly: "Quarterly",
};

function mockBarData(period: ReportPeriod) {
  const labels =
    period === "weekly"
      ? ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"]
      : period === "monthly"
      ? ["Mg 1", "Mg 2", "Mg 3", "Mg 4"]
      : ["Jan-Mar", "Apr-Jun", "Jul-Sep", "Okt-Des"];

  return labels.map((label) => ({
    label,
    waterLevel: Math.round(50 + Math.random() * 40),
    ph: parseFloat((6.8 + Math.random() * 0.6).toFixed(2)),
    turbidity: parseFloat((0.3 + Math.random() * 0.6).toFixed(2)),
    incidents: Math.floor(Math.random() * 4),
  }));
}

function mockSummary() {
  return {
    totalDispenser: 4,
    activeDispenser: 3,
    avgWaterLevel: 74,
    avgPh: 7.1,
    avgTurbidity: 0.62,
    avgTemp: 24.3,
    totalIncidents: 5,
    resolvedIncidents: 4,
    uptimePct: 97.4,
  };
}

const INCIDENT_LOG = [
  { id: "INC-001", dispenser: "Gedung A - Lt. 1", type: "Low Water Level", date: "Apr 20, 2026", status: "resolved" },
  { id: "INC-002", dispenser: "Gedung B - Lt. 1", type: "pH Out of Range", date: "Apr 18, 2026", status: "resolved" },
  { id: "INC-003", dispenser: "Gedung C - Lobby", type: "High Turbidity", date: "Apr 15, 2026", status: "resolved" },
  { id: "INC-004", dispenser: "Gedung A - Lt. 2", type: "Temperature Spike", date: "Apr 12, 2026", status: "resolved" },
  { id: "INC-005", dispenser: "Gedung B - Lt. 1", type: "Low Water Level", date: "Apr 8, 2026", status: "open" },
];

function Dropdown<T extends string>({
  label,
  value,
  options,
  labelMap,
  onChange,
}: {
  label: string;
  value: T;
  options: T[];
  labelMap: Record<T, string> | string[];
  onChange: (v: T) => void;
}) {
  const [open, setOpen] = useState(false);
  const getLabel = (v: T) =>
    Array.isArray(labelMap) ? (v as string) : (labelMap as Record<T, string>)[v];

  return (
    <div className="min-w-[160px]">
      <label className="block text-xs font-medium text-gray-500 mb-1.5">{label}</label>
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 hover:border-blue-400 transition-colors"
        >
          <span className="truncate">{getLabel(value)}</span>
          <ChevronDown
            size={15}
            className={`ml-2 shrink-0 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>
        {open && (
          <div className="absolute z-20 top-full mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
            {options.map((o) => (
              <button
                key={o}
                onClick={() => { onChange(o); setOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 transition-colors ${
                  o === value ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"
                }`}
              >
                {getLabel(o)}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function KpiCard({
  label,
  value,
  sub,
  trend,
  color,
}: {
  label: string;
  value: string;
  sub?: string;
  trend?: "up" | "down" | "neutral";
  color: string;
}) {
  const TrendIcon =
    trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor =
    trend === "up" ? "#22C55E" : trend === "down" ? "#EF4444" : "#94A3B8";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-1">
      <p className="text-xs font-medium text-gray-400">{label}</p>
      <p className="text-2xl font-bold" style={{ color }}>
        {value}
      </p>
      {sub && (
        <div className="flex items-center gap-1 mt-0.5">
          <TrendIcon size={13} style={{ color: trendColor }} />
          <span className="text-xs" style={{ color: trendColor }}>
            {sub}
          </span>
        </div>
      )}
    </div>
  );
}

export default function LaporanPage() {
  const [period, setPeriod] = useState<ReportPeriod>("monthly");
  const [dispenser, setDispenser] = useState(DISPENSERS[0]);

  const barData = useMemo(() => mockBarData(period), [period, dispenser]);
  const summary = useMemo(() => mockSummary(), [dispenser]);

  return (
    <div className="min-h-screen bg-[#EFF6FF] p-6 font-sans">
      {/* ── Header ── */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Analyze performance metrics and export reports
        </p>
      </div>

      {/* ── Filter + Export bar ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6 flex flex-wrap items-end gap-4">
        <Dropdown
          label="Select Dispenser"
          value={dispenser}
          options={DISPENSERS as unknown as string[] & typeof DISPENSERS}
          labelMap={DISPENSERS as unknown as Record<string, string>}
          onChange={(v) => setDispenser(v)}
        />
        <Dropdown
          label="Report Period"
          value={period}
          options={["weekly", "monthly", "quarterly"] as ReportPeriod[]}
          labelMap={PERIOD_LABELS}
          onChange={(v) => setPeriod(v)}
        />
        <div className="ml-auto">
          <LaporanExport period={period} dispenser={dispenser} barData={barData} summary={summary} />
        </div>
      </div>

      {/* ── KPI grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
        <KpiCard label="Active Dispensers" value={`${summary.activeDispenser}/${summary.totalDispenser}`} sub="Online now" trend="neutral" color="#3B82F6" />
        <KpiCard label="Avg Water Level" value={`${summary.avgWaterLevel}%`} sub="+3% vs last" trend="up" color="#3B82F6" />
        <KpiCard label="Avg pH" value={summary.avgPh.toString()} sub="Normal range" trend="neutral" color="#22C55E" />
        <KpiCard label="Avg Turbidity" value={`${summary.avgTurbidity} NTU`} sub="Below limit" trend="up" color="#F59E0B" />
        <KpiCard label="Uptime" value={`${summary.uptimePct}%`} sub="This period" trend="up" color="#8B5CF6" />
        <KpiCard label="Open Incidents" value={`${summary.totalIncidents - summary.resolvedIncidents}`} sub={`${summary.resolvedIncidents} resolved`} trend="down" color="#EF4444" />
      </div>

      {/* ── Charts row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* Water Level bar */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">
            Avg Water Level per Period
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="4 4" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#94A3B8" }} tickLine={false} axisLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#94A3B8" }} tickLine={false} axisLine={false} width={36} />
              <Tooltip
                contentStyle={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 10, fontSize: 12 }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={((v: number) => `${v}%`) as any}
              />
              <Bar dataKey="waterLevel" radius={[6, 6, 0, 0]}>
                {barData.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.waterLevel >= 70 ? "#3B82F6" : entry.waterLevel >= 40 ? "#F59E0B" : "#EF4444"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Incident bar */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">
            Incident Count per Period
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="4 4" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#94A3B8" }} tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#94A3B8" }} tickLine={false} axisLine={false} width={36} />
              <Tooltip
                contentStyle={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 10, fontSize: 12 }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={((v: number) => String(v)) as any}
              />
              <Bar dataKey="incidents" radius={[6, 6, 0, 0]} fill="#FCA5A5">
                {barData.map((entry, i) => (
                  <Cell key={i} fill={entry.incidents === 0 ? "#BBF7D0" : entry.incidents >= 3 ? "#FCA5A5" : "#FDE68A"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Parameter summary table ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Parameter Summary</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {["Period", "Avg Water Level", "Avg pH", "Avg Turbidity (NTU)", "Incidents"].map((h) => (
                  <th key={h} className="text-left pb-3 pr-4 text-xs font-semibold text-gray-400 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {barData.map((row, i) => (
                <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="py-3 pr-4 font-medium text-gray-700">{row.label}</td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${row.waterLevel}%`,
                            background: row.waterLevel >= 70 ? "#3B82F6" : row.waterLevel >= 40 ? "#F59E0B" : "#EF4444",
                          }}
                        />
                      </div>
                      <span className="text-gray-600">{row.waterLevel}%</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-gray-600">{row.ph}</td>
                  <td className="py-3 pr-4 text-gray-600">{row.turbidity}</td>
                  <td className="py-3 pr-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                        row.incidents === 0
                          ? "bg-green-50 text-green-600"
                          : row.incidents >= 3
                          ? "bg-red-50 text-red-500"
                          : "bg-yellow-50 text-yellow-600"
                      }`}
                    >
                      {row.incidents === 0 ? (
                        <CheckCircle size={11} />
                      ) : (
                        <AlertTriangle size={11} />
                      )}
                      {row.incidents === 0 ? "None" : row.incidents}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Incident log ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-700">Incident Log</h2>
          <span className="text-xs text-gray-400">{INCIDENT_LOG.length} total</span>
        </div>
        <div className="flex flex-col gap-2">
          {INCIDENT_LOG.map((inc) => (
            <div
              key={inc.id}
              className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    inc.status === "resolved" ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  {inc.status === "resolved" ? (
                    <CheckCircle size={15} className="text-green-500" />
                  ) : (
                    <Clock size={15} className="text-red-500" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">{inc.type}</p>
                  <p className="text-xs text-gray-400">{inc.dispenser} · {inc.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400 hidden sm:block">{inc.id}</span>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    inc.status === "resolved"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-500"
                  }`}
                >
                  {inc.status === "resolved" ? "Resolved" : "Open"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}