"use client";

import StatCard from "@/components/pengelola/StatCard";
import NotifikasiList from "@/components/pengelola/NotifikasiList";
import {
  FiDroplet,
  FiCheckCircle,
  FiAlertTriangle,
  FiActivity,
  FiMapPin,
  FiCalendar,
} from "react-icons/fi";

const dispensers = [
  {
    id: "DSP001",
    name: "Dispenser Gedung A - Lt. 1",
    location: "Gedung A - Lantai 1",
    waterLevel: 85,
    status: "Available",
    ph: 7.2,
    turbidity: 0.5,
    temperature: 24,
    nextMaintenance: "4/24/2026",
  },
  {
    id: "DSP002",
    name: "Dispenser Gedung A - Lt. 2",
    location: "Gedung A - Lantai 2",
    waterLevel: 25,
    status: "Almost Empty",
    ph: 7.0,
    turbidity: 0.8,
    temperature: 25,
    nextMaintenance: "4/22/2026",
  },
  {
    id: "DSP003",
    name: "Dispenser Gedung B - Lt. 1",
    location: "Gedung B - Lantai 1",
    waterLevel: 5,
    status: "Empty",
    ph: 6.8,
    turbidity: 1.2,
    temperature: 26,
    nextMaintenance: "4/19/2026",
  },
  {
    id: "DSP004",
    name: "Dispenser Gedung B - Lt. 2",
    location: "Gedung B - Lantai 2",
    waterLevel: 92,
    status: "Available",
    ph: 7.4,
    turbidity: 0.4,
    temperature: 23,
    nextMaintenance: "4/26/2026",
  },
  {
    id: "DSP005",
    name: "Dispenser Gedung C - Lt. 1",
    location: "Gedung C - Lantai 1",
    waterLevel: 68,
    status: "Available",
    ph: 7.1,
    turbidity: 0.6,
    temperature: 24,
    nextMaintenance: "4/23/2026",
  },
  {
    id: "DSP006",
    name: "Dispenser Gedung C - Lt. 3",
    location: "Gedung C - Lantai 3",
    waterLevel: 18,
    status: "Almost Empty",
    ph: 6.9,
    turbidity: 0.9,
    temperature: 25,
    nextMaintenance: "4/21/2026",
  },
];

function statusStyle(status: string) {
  if (status === "Available")
    return "bg-blue-100 text-blue-700";
  if (status === "Almost Empty")
    return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-700";
}

function levelBarColor(level: number) {
  if (level > 50) return "bg-green-500";
  if (level > 20) return "bg-yellow-400";
  return "bg-red-500";
}

const usagePoints = [60, 45, 55, 40, 48, 43, 52, 47, 55, 40, 50, 45];
function Sparkline() {
  const w = 360;
  const h = 80;
  const pts = usagePoints.map((v, i) => {
    const x = (i / (usagePoints.length - 1)) * w;
    const y = h - (v / 80) * h;
    return `${x},${y}`;
  });
  const polyline = pts.join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-20" preserveAspectRatio="none">
      <polyline
        points={polyline}
        fill="none"
        stroke="#1447E6"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {usagePoints.map((v, i) => {
        const x = (i / (usagePoints.length - 1)) * w;
        const y = h - (v / 80) * h;
        return (
          <circle key={i} cx={x} cy={y} r="3" fill="#1447E6" />
        );
      })}
    </svg>
  );
}

function DonutChart() {
  const available = 3;
  const almostEmpty = 2;
  const empty = 1;
  const total = 6;

  const radius = 60;
  const cx = 80;
  const cy = 80;
  const circumference = 2 * Math.PI * radius;

  const aFrac = available / total;
  const alFrac = almostEmpty / total;
  const eFrac = empty / total;

  const aDash = aFrac * circumference;
  const alDash = alFrac * circumference;
  const eDash = eFrac * circumference;

  const aOffset = 0;
  const alOffset = -aDash;
  const eOffset = -(aDash + alDash);

  return (
    <div className="flex items-center gap-6">
      <svg width="160" height="160" viewBox="0 0 160 160">
        {/* Available – green */}
        <circle
          cx={cx} cy={cy} r={radius}
          fill="none" stroke="#22c55e" strokeWidth="28"
          strokeDasharray={`${aDash} ${circumference - aDash}`}
          strokeDashoffset={aOffset}
          transform={`rotate(-90 ${cx} ${cy})`}
        />
        {/* Almost empty – yellow */}
        <circle
          cx={cx} cy={cy} r={radius}
          fill="none" stroke="#eab308" strokeWidth="28"
          strokeDasharray={`${alDash} ${circumference - alDash}`}
          strokeDashoffset={alOffset}
          transform={`rotate(-90 ${cx} ${cy})`}
        />
        {/* Empty – red */}
        <circle
          cx={cx} cy={cy} r={radius}
          fill="none" stroke="#ef4444" strokeWidth="28"
          strokeDasharray={`${eDash} ${circumference - eDash}`}
          strokeDashoffset={eOffset}
          transform={`rotate(-90 ${cx} ${cy})`}
        />
      </svg>
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
          <span className="text-gray-600">Available: 50%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block" />
          <span className="text-gray-600">Almost Empty: 33%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
          <span className="text-gray-600">Empty: 17%</span>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Real-time monitoring of water dispensers</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Dispensers"
          value={6}
          icon={FiDroplet}
          iconBg="bg-blue-50"
          iconColor="#1447E6"
        />
        <StatCard
          title="Available"
          value={3}
          icon={FiCheckCircle}
          iconBg="bg-green-50"
          iconColor="#22c55e"
        />
        <StatCard
          title="Need Attention"
          value={3}
          icon={FiAlertTriangle}
          iconBg="bg-yellow-50"
          iconColor="#eab308"
        />
        <StatCard
          title="Avg. Water Level"
          value="48.8%"
          icon={FiActivity}
          iconBg="bg-red-50"
          iconColor="#ef4444"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Donut */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Dispenser Status Distribution</h2>
          <DonutChart />
        </div>

        {/* Sparkline */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700 mb-1">Today&apos;s Usage Trend</h2>
          <div className="flex items-end justify-between text-xs text-gray-400 mb-2">
            {["8:00","9:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00"].map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
          <Sparkline />
        </div>
      </div>

      {/* Notifications */}
      <NotifikasiList />

      {/* All dispensers */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-gray-900">All Dispensers</h2>
          <span className="text-sm text-gray-400">6 Total</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {dispensers.map((d) => (
            <div
              key={d.id}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-3"
            >
              {/* Name & status */}
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold text-gray-900">{d.name}</h3>
                <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyle(d.status)}`}>
                  {d.status}
                </span>
              </div>

              {/* Location */}
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <FiMapPin size={12} />
                {d.location}
              </p>

              {/* Water level bar */}
              <div>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span className="flex items-center gap-1"><FiDroplet size={12} /> Water Level</span>
                  <span className="font-semibold text-gray-800">{d.waterLevel}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-2 rounded-full ${levelBarColor(d.waterLevel)}`}
                    style={{ width: `${d.waterLevel}%` }}
                  />
                </div>
              </div>

              {/* Parameters */}
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { label: "pH", value: d.ph },
                  { label: "Turbidity", value: `${d.turbidity} NTU` },
                  { label: "Temp", value: `${d.temperature}°C` },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-gray-50 rounded-xl py-2">
                    <p className="text-[10px] text-gray-400">{label}</p>
                    <p className="text-sm font-semibold text-gray-800">{value}</p>
                  </div>
                ))}
              </div>

              {/* Next maintenance */}
              <p className="text-[11px] text-gray-400 flex items-center gap-1">
                <FiCalendar size={11} />
                Next: {d.nextMaintenance}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}