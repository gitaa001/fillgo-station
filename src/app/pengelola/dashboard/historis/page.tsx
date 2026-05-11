"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import TrendChart from "@/components/pengelola/TrendChart";

import {
  Download,
  Droplets,
  FlaskConical,
  Eye,
  Thermometer,
} from "lucide-react";

type FirebaseLog = {
  distance: number;

  ph: number;

  ph_status: string;

  temperature: number;

  timestamp: number;

  turbidity: number;

  water_condition: string;
};

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

function formatLogLabel(
  timestamp: number
) {
  if (timestamp > 1000000000000) {
    return new Date(
      timestamp
    ).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (timestamp > 0) {
    const totalSeconds =
      Math.floor(timestamp);
    const hours = Math.floor(
      totalSeconds / 3600
    );
    const minutes = Math.floor(
      (totalSeconds % 3600) / 60
    );
    const seconds =
      totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${String(
        minutes
      ).padStart(2, "0")}:${String(
        seconds
      ).padStart(2, "0")}`;
    }

    return `${minutes}:${String(
      seconds
    ).padStart(2, "0")}`;
  }

  return "-";
}

export default function HistorisPage() {

  const [logs, setLogs] =
    useState<FirebaseLog[]>(
      []
    );

  // FETCH LOGS
  useEffect(() => {

    async function fetchLogs() {
      try {

        const response =
          await fetch(
            "/api/dispenser/logs"
          );

        const data =
          await response.json();

        setLogs(data);

      } catch (error) {

        console.error(
          error
        );
      }
    }

    fetchLogs();

    const interval =
      setInterval(
        fetchLogs,
        30000
      );

    return () =>
      clearInterval(interval);

  }, []);

  // LABELS
  const labels =
    useMemo(() => {

      return logs.map(
        (log) => {
          return formatLogLabel(
            log.timestamp
          );
        }
      );

    }, [logs]);

  // DATASETS
  const waterLevelData =
    useMemo(() => {

      return logs.map(
        (log) =>
          Math.max(
            15,

            Math.min(
              100,

              Math.round(
                100 -
                  log.turbidity /
                    30
              )
            )
          )
      );

    }, [logs]);

  const phData =
    logs.map((l) => l.ph);

  const turbidityData =
    logs.map(
      (l) => l.turbidity
    );

  const temperatureData =
    logs.map(
      (l) => l.temperature
    );

  // LAST VALUES
  const lastLog =
    logs[logs.length - 1];

  // STATS
const currentWaterLevel =
  lastLog
    ? waterLevelData[
        waterLevelData.length -
          1
      ]
    : 0;

const waterStatus =
  currentWaterLevel <= 20
    ? "Empty"
    : currentWaterLevel <= 60
    ? "Almost Empty"
    : "Available";

const temperatureStatus =
  lastLog &&
  lastLog.temperature >= 18 &&
  lastLog.temperature <= 30
    ? "Normal"
    : "Warning";

const stats: StatSummary[] =
  lastLog
    ? [
        {
          label:
            "Current Water Level",

          value: `${currentWaterLevel}%`,

          delta:
            waterStatus,

          deltaPositive:
            currentWaterLevel > 60,

          icon: (
            <Droplets
              size={36}
              strokeWidth={
                1.5
              }
            />
          ),

          color:
            "#2563EB",

          bgColor:
            "#FFFFFF",

          iconBg:
            "#DBEAFE",
        },

        {
          label:
            "pH Level",

          value:
            lastLog.ph.toFixed(
              2
            ),

          delta:
            lastLog.ph_status,

          deltaPositive:
            lastLog.ph >=
              6.5 &&
            lastLog.ph <=
              8.5,

          icon: (
            <FlaskConical
              size={36}
              strokeWidth={
                1.5
              }
            />
          ),

          color:
            "#22C55E",

          bgColor:
            "#FFFFFF",

          iconBg:
            "#DCFCE7",
        },

        {
          label:
            "Turbidity",

          value: `${lastLog.turbidity} NTU`,

          delta:
            lastLog.water_condition,

          deltaPositive:
            lastLog.water_condition ===
            "JERNIH",

          icon: (
            <Eye
              size={36}
              strokeWidth={
                1.5
              }
            />
          ),

          color:
            "#F59E0B",

          bgColor:
            "#FFFFFF",

          iconBg:
            "#FEF3C7",
        },

        {
          label:
            "Temperature",

          value: `${lastLog.temperature.toFixed(
            1
          )}°C`,

          delta:
            temperatureStatus,

          deltaPositive:
            temperatureStatus ===
            "Normal",

          icon: (
            <Thermometer
              size={36}
              strokeWidth={
                1.5
              }
            />
          ),

          color:
            "#EF4444",

          bgColor:
            "#FFFFFF",

          iconBg:
            "#FFE4E6",
        },
      ]
    : [];
    
    function exportCSV() {

    if (!logs.length) return;

    const headers = [
      "Timestamp",
      "pH",
      "pH Status",
      "Temperature",
      "Turbidity",
      "Water Condition",
    ];

    const rows = logs.map(
      (log) => [

        new Date(
          log.timestamp * 1000
        ).toLocaleString("id-ID"),

        log.ph,

        log.ph_status,

        log.temperature,

        log.turbidity,

        log.water_condition,
      ]
    );

    const csvContent =
      [
        headers.join(","),

        ...rows.map((r) =>
          r.join(",")
        ),
      ].join("\n");

    const blob =
      new Blob(
        [csvContent],
        {
          type:
            "text/csv;charset=utf-8;",
        }
      );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      `fillgo-history-${Date.now()}.csv`;

    link.click();

    URL.revokeObjectURL(url);
  }
  return (
    <div className="min-h-screen bg-[#EFF6FF] p-6 font-sans">

      {/* HEADER */}
      <div className="mb-6">

        <h1 className="text-2xl font-bold text-gray-900">
          Historical Data
        </h1>

        <p className="text-sm text-gray-500 mt-0.5">
          Realtime Firebase
          sensor analytics
        </p>

      </div>

      {/* EXPORT */}
      <div className="flex justify-end mb-6">

        <button
          onClick={exportCSV}
          className="flex items-center gap-2 bg-[#3B82F6] rounded-xl px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
        >
          <Download size={15} />
          Export CSV
        </button>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">

        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center justify-between"
            style={{
              background:
                s.bgColor,
            }}
          >

            <div>

              <p className="text-xs font-medium text-gray-500 mb-1">
                {s.label}
              </p>

              <p className="text-2xl font-bold text-gray-900">
                {s.value}
              </p>

              <p
                className="text-xs font-medium mt-1"
                style={{
                  color:
                    s.deltaPositive
                      ? "#22C55E"
                      : "#EF4444",
                }}
              >
                {s.delta}
              </p>

            </div>

            <div
              className="rounded-full p-3"
              style={{
                background:
                  s.iconBg,

                color:
                  s.color,
              }}
            >
              {s.icon}
            </div>

          </div>
        ))}

      </div>

      {/* CHARTS */}
      <div className="flex flex-col gap-5">

        <TrendChart
          title="Water Level Trend"
          labels={labels}
          datasets={[
            {
              label:
                "Water Level (%)",

              data:
                waterLevelData,

              color:
                "#3B82F6",

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
              label:
                "pH Level",

              data: phData,

              color:
                "#22C55E",

              fill: false,
            },
          ]}
          yMin={0}
          yMax={14}
        />

        <TrendChart
          title="Turbidity History"
          labels={labels}
          datasets={[
            {
              label:
                "Turbidity",

              data:
                turbidityData,

              color:
                "#F59E0B",

              fill: false,
            },
          ]}
          yMin={0}
          yMax={2500}
        />

        <TrendChart
          title="Temperature History"
          labels={labels}
          datasets={[
            {
              label:
                "Temperature",

              data:
                temperatureData,

              color:
                "#EF4444",

              fill: false,
            },
          ]}
          yMin={0}
          yMax={40}
        />

      </div>
    </div>
  );
}