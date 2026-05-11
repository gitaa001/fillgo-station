"use client";

import { useEffect, useMemo, useState } from "react";
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
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";

import { dispensers } from "@/lib/dispenser";

type ReportPeriod = "weekly" | "monthly" | "quarterly";

type FirebaseLog = {
  distance: number;
  ph: number;
  ph_status: string;
  temperature: number;
  timestamp: number;
  turbidity: number;
  water_condition: string;
};

interface BarRow {
  label: string;
  waterLevel: number;
  ph: number;
  turbidity: number;
  incidents: number;
}

interface Summary {
  totalDispenser: number;
  activeDispenser: number;
  avgWaterLevel: number;
  avgPh: number;
  avgTurbidity: number;
  avgTemp: number;
  totalIncidents: number;
  resolvedIncidents: number;
  uptimePct: number;
}

type IncidentRow = {
  id: string;
  dispenser: string;
  type: string;
  date: string;
  status: "resolved" | "open";
};

const LIVE_DISPENSERS = dispensers.filter((d) => d.isLive).map((d) => d.name);

const DISPENSERS = [
  "Semua Dispenser",
  ...LIVE_DISPENSERS,
];

const PERIOD_LABELS: Record<ReportPeriod, string> = {
  weekly: "Weekly",
  monthly: "Monthly",
  quarterly: "Quarterly",
};

function formatTimestamp(timestamp: number) {
  if (timestamp > 1000000000000) {
    return new Date(timestamp).toLocaleString("id-ID");
  }

  const totalSeconds = Math.max(0, Math.floor(timestamp));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}j ${minutes}m ${seconds}d`;
  }

  if (minutes > 0) {
    return `${minutes}m ${seconds}d`;
  }

  return `${seconds}d`;
}

function getWaterLevel(turbidity: number) {
  return Math.max(15, Math.min(100, Math.round(100 - turbidity / 30)));
}

function getPeriodWindow(period: ReportPeriod) {
  if (period === "weekly") return 7;
  if (period === "monthly") return 30;
  return 90;
}

function classifyIncident(log: FirebaseLog) {
  if (log.ph < 6.5 || log.ph > 8.5) return "pH Out of Range";
  if (log.turbidity <= 1400) return "High Turbidity";
  if (log.temperature < 10 || log.temperature > 35) return "Temperature Spike";
  return null;
}

function aggregateLogSet(logSet: FirebaseLog[], labels: string[]): BarRow[] {
  if (!logSet.length) {
    return labels.map((label) => ({
      label,
      waterLevel: 0,
      ph: 0,
      turbidity: 0,
      incidents: 0,
    }));
  }

  const buckets = labels.map(() => [] as FirebaseLog[]);

  logSet.forEach((log, index) => {
    const bucketIndex = Math.min(
      labels.length - 1,
      Math.floor((index * labels.length) / logSet.length)
    );

    buckets[bucketIndex].push(log);
  });

  return buckets.map((bucket, index) => {
    if (!bucket.length) {
      return {
        label: labels[index],
        waterLevel: 0,
        ph: 0,
        turbidity: 0,
        incidents: 0,
      };
    }

    const waterLevels = bucket.map((log) => getWaterLevel(log.turbidity));
    const incidentCount = bucket.filter((log) => classifyIncident(log)).length;

    return {
      label: labels[index],
      waterLevel: Math.round(waterLevels.reduce((sum, value) => sum + value, 0) / bucket.length),
      ph: parseFloat(
        (bucket.reduce((sum, log) => sum + log.ph, 0) / bucket.length).toFixed(2)
      ),
      turbidity: parseFloat(
        (bucket.reduce((sum, log) => sum + log.turbidity, 0) / bucket.length).toFixed(2)
      ),
      incidents: incidentCount,
    };
  });
}

function buildIncidentLog(logSet: FirebaseLog[]): IncidentRow[] {
  const incidents = logSet
    .filter((log) => classifyIncident(log))
    .map((log) => ({
      log,
      type: classifyIncident(log) as string,
    }));

  const latestIncidentTimestamp =
    incidents.length > 0
      ? Math.max(...incidents.map((item) => item.log.timestamp))
      : null;

  return incidents
    .slice()
    .reverse()
    .map((item, index) => ({
      id: `INC-${String(index + 1).padStart(3, "0")}`,
      dispenser: DISPENSERS[1] ?? "Dispenser Live",
      type: item.type,
      date: formatTimestamp(item.log.timestamp),
      status:
        latestIncidentTimestamp !== null &&
        item.log.timestamp === latestIncidentTimestamp
          ? "open"
          : "resolved",
    }));
}

function buildSummary(logSet: FirebaseLog[]): Summary {
  const total = logSet.length;
  const totalIncidents = logSet.filter((log) => classifyIncident(log)).length;
  const openIncident = totalIncidents > 0 ? 1 : 0;

  if (!total) {
    return {
      totalDispenser: dispensers.length,
      activeDispenser: LIVE_DISPENSERS.length,
      avgWaterLevel: 0,
      avgPh: 0,
      avgTurbidity: 0,
      avgTemp: 0,
      totalIncidents: 0,
      resolvedIncidents: 0,
      uptimePct: 0,
    };
  }

  const avgWaterLevel = Math.round(
    logSet.reduce((sum, log) => sum + getWaterLevel(log.turbidity), 0) / total
  );
  const avgPh = parseFloat(
    (logSet.reduce((sum, log) => sum + log.ph, 0) / total).toFixed(2)
  );
  const avgTurbidity = parseFloat(
    (logSet.reduce((sum, log) => sum + log.turbidity, 0) / total).toFixed(2)
  );
  const avgTemp = parseFloat(
    (logSet.reduce((sum, log) => sum + log.temperature, 0) / total).toFixed(1)
  );
  const uptimePct = parseFloat(
    (((total - totalIncidents) / total) * 100).toFixed(1)
  );

  return {
    totalDispenser: dispensers.length,
    activeDispenser: LIVE_DISPENSERS.length,
    avgWaterLevel,
    avgPh,
    avgTurbidity,
    avgTemp,
    totalIncidents,
    resolvedIncidents: Math.max(totalIncidents - openIncident, 0),
    uptimePct,
  };
}

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
    <div className="min-w-40">
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
  const [logs, setLogs] = useState<FirebaseLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchLogs() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/dispenser/logs");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error ?? "Failed to fetch report logs");
        }

        if (mounted) {
          setLogs(Array.isArray(data) ? data : []);
        }
      } catch (fetchError) {
        if (mounted) {
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : "Failed to fetch report logs"
          );
          setLogs([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchLogs();

    const interval = setInterval(fetchLogs, 30000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const periodLogs = useMemo(() => {
    const windowSize = getPeriodWindow(period);
    return logs.slice(-windowSize);
  }, [logs, period]);

  const barData = useMemo(() => {
    const labels =
      period === "weekly"
        ? ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"]
        : period === "monthly"
        ? ["Mg 1", "Mg 2", "Mg 3", "Mg 4"]
        : ["Tri 1", "Tri 2", "Tri 3", "Tri 4"];

    return aggregateLogSet(periodLogs, labels);
  }, [periodLogs, period]);

  const summary = useMemo(() => buildSummary(periodLogs), [periodLogs]);

  const incidentLog = useMemo(() => buildIncidentLog(periodLogs), [periodLogs]);

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
          options={DISPENSERS}
          labelMap={DISPENSERS}
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

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

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
        {loading && (
          <p className="mb-3 text-sm text-gray-400">Memuat data laporan...</p>
        )}
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
          <span className="text-xs text-gray-400">{incidentLog.length} total</span>
        </div>
        <div className="flex flex-col gap-2">
          {incidentLog.map((inc) => (
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