"use client";

import { useEffect, useMemo, useState } from "react";

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

import {
  dispensers,
} from "@/lib/dispenser";

type SensorData = {
  ph: number;
  ph_status: string;
  temperature: number;
  turbidity: number;
  water_condition: string;
  timestamp: number;
};

const usagePoints = [
  60, 45, 55, 40, 48, 43,
  52, 47, 55, 40, 50, 45,
];

function statusStyle(status: string) {
  if (status === "Available") {
    return "bg-green-100 text-green-700";
  }

  if (
    status ===
    "Almost Empty"
  ) {
    return "bg-yellow-100 text-yellow-700";
  }

  return "bg-red-100 text-red-700";
}

function levelBarColor(level: number) {
  if (level > 50) {
    return "bg-green-500";
  }

  if (level > 20) {
    return "bg-yellow-400";
  }

  return "bg-red-500";
}

function Sparkline() {
  const w = 360;
  const h = 80;

  const pts =
    usagePoints.map((v, i) => {
      const x =
        (i /
          (usagePoints.length -
            1)) *
        w;

      const y =
        h - (v / 80) * h;

      return `${x},${y}`;
    });

  const polyline =
    pts.join(" ");

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="w-full h-20"
      preserveAspectRatio="none"
    >
      <polyline
        points={polyline}
        fill="none"
        stroke="#1447E6"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {usagePoints.map(
        (v, i) => {
          const x =
            (i /
              (usagePoints.length -
                1)) *
            w;

          const y =
            h -
            (v / 80) * h;

          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="3"
              fill="#1447E6"
            />
          );
        }
      )}
    </svg>
  );
}

function DonutChart({
  available,
  almostEmpty,
  empty,
  total,
}: {
  available: number;
  almostEmpty: number;
  empty: number;
  total: number;
}) {
  const radius = 60;

  const cx = 80;
  const cy = 80;

  const circumference =
    2 * Math.PI * radius;

  const aFrac =
    available / total;

  const alFrac =
    almostEmpty / total;

  const eFrac =
    empty / total;

  const aDash =
    aFrac * circumference;

  const alDash =
    alFrac * circumference;

  const eDash =
    eFrac * circumference;

  const aOffset = 0;

  const alOffset = -aDash;

  const eOffset =
    -(aDash + alDash);

  return (
    <div className="flex items-center gap-6">

      <svg
        width="160"
        height="160"
        viewBox="0 0 160 160"
      >

        {/* AVAILABLE */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="#22c55e"
          strokeWidth="28"
          strokeDasharray={`${aDash} ${
            circumference - aDash
          }`}
          strokeDashoffset={
            aOffset
          }
          transform={`rotate(-90 ${cx} ${cy})`}
        />

        {/* ALMOST EMPTY */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="#eab308"
          strokeWidth="28"
          strokeDasharray={`${alDash} ${
            circumference - alDash
          }`}
          strokeDashoffset={
            alOffset
          }
          transform={`rotate(-90 ${cx} ${cy})`}
        />

        {/* EMPTY */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="#ef4444"
          strokeWidth="28"
          strokeDasharray={`${eDash} ${
            circumference - eDash
          }`}
          strokeDashoffset={
            eOffset
          }
          transform={`rotate(-90 ${cx} ${cy})`}
        />
      </svg>

      <div className="space-y-2 text-sm">

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />

          <span className="text-gray-600">
            Available:{" "}
            {Math.round(
              (available /
                total) *
                100
            )}
            %
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block" />

          <span className="text-gray-600">
            Almost Empty:{" "}
            {Math.round(
              (almostEmpty /
                total) *
                100
            )}
            %
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />

          <span className="text-gray-600">
            Empty:{" "}
            {Math.round(
              (empty /
                total) *
                100
            )}
            %
          </span>
        </div>

      </div>
    </div>
  );
}

export default function DashboardPage() {

  const [sensorData, setSensorData] =
    useState<SensorData | null>(
      null
    );

  // FETCH FIREBASE SENSOR
  useEffect(() => {

    async function fetchSensor() {
      try {

        const response =
          await fetch(
            "/api/dispenser"
          );

        const data =
          await response.json();

        setSensorData(data);

      } catch (error) {

        console.error(
          "Failed to fetch sensor data",
          error
        );
      }
    }

    fetchSensor();

    const interval =
      setInterval(
        fetchSensor,
        30000
      );

    return () =>
      clearInterval(interval);

  }, []);

  // ENRICH DISPENSERS
  const enrichedDispensers =
    useMemo(() => {

      return dispensers.map(
        (disp) => {

          // LIVE DEVICE
          if (
            disp.isLive &&
            sensorData
          ) {

            const waterLevel =
              Math.max(
                15,

                Math.min(
                  100,

                  Math.round(
                    100 -
                      sensorData.turbidity /
                        30
                  )
                )
              );

            const status =
              waterLevel <= 20
                ? "Empty"
                : waterLevel <= 60
                ? "Almost Empty"
                : "Available";

            return {
              ...disp,

              waterLevel,

              status,

              ph:
                sensorData.ph,

              turbidity:
                sensorData.turbidity,

              temperature:
                sensorData.temperature,

              nextMaintenance:
                "2026-05-24",
            };
          }

          // STATIC DUMMY
          const waterLevel =
            disp.status ===
            "available"
              ? 85
              : 42;

          const status =
            waterLevel <= 20
              ? "Empty"
              : waterLevel <= 60
              ? "Almost Empty"
              : "Available";

          return {
            ...disp,

            waterLevel,

            status,

            ph: 7.1,

            turbidity: 0.7,

            temperature: 24,

            nextMaintenance:
              "2026-05-22",
          };
        }
      );
    }, [sensorData]);

  const availableCount =
    enrichedDispensers.filter(
      (d) =>
        d.status ===
        "Available"
    ).length;

  const almostEmptyCount =
    enrichedDispensers.filter(
      (d) =>
        d.status ===
        "Almost Empty"
    ).length;

  const emptyCount =
    enrichedDispensers.filter(
      (d) =>
        d.status === "Empty"
    ).length;

  const avgWaterLevel =
    (
      enrichedDispensers.reduce(
        (acc, d) =>
          acc + d.waterLevel,
        0
      ) /
      enrichedDispensers.length
    ).toFixed(1);

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Dashboard
        </h1>

        <p className="text-sm text-gray-500 mt-0.5">
          Real-time monitoring of
          water dispensers
        </p>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        <StatCard
          title="Total Dispensers"
          value={
            enrichedDispensers.length
          }
          icon={FiDroplet}
          iconBg="bg-blue-50"
          iconColor="#1447E6"
        />

        <StatCard
          title="Available"
          value={availableCount}
          icon={FiCheckCircle}
          iconBg="bg-green-50"
          iconColor="#22c55e"
        />

        <StatCard
          title="Need Attention"
          value={
            almostEmptyCount +
            emptyCount
          }
          icon={FiAlertTriangle}
          iconBg="bg-yellow-50"
          iconColor="#eab308"
        />

        <StatCard
          title="Avg. Water Level"
          value={`${avgWaterLevel}%`}
          icon={FiActivity}
          iconBg="bg-red-50"
          iconColor="#ef4444"
        />

      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* DONUT */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">

          <h2 className="text-sm font-semibold text-gray-700 mb-4">
            Dispenser Status
            Distribution
          </h2>

          <DonutChart
            available={
              availableCount
            }
            almostEmpty={
              almostEmptyCount
            }
            empty={emptyCount}
            total={
              enrichedDispensers.length
            }
          />

        </div>

        {/* SPARKLINE */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">

          <h2 className="text-sm font-semibold text-gray-700 mb-1">
            Today&apos;s Usage
            Trend
          </h2>

          <div className="flex items-end justify-between text-xs text-gray-400 mb-2">
            {[
              "8:00",
              "9:00",
              "10:00",
              "11:00",
              "12:00",
              "13:00",
              "14:00",
              "15:00",
              "16:00",
              "17:00",
              "18:00",
              "19:00",
            ].map((t) => (
              <span key={t}>
                {t}
              </span>
            ))}
          </div>

          <Sparkline />

        </div>
      </div>

      {/* NOTIFICATIONS */}
      <NotifikasiList />

      {/* DISPENSERS */}
      <div>

        <div className="flex items-center justify-between mb-3">

          <h2 className="text-base font-semibold text-gray-900">
            All Dispensers
          </h2>

          <span className="text-sm text-gray-400">
            {
              enrichedDispensers.length
            }{" "}
            Total
          </span>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {enrichedDispensers.map(
            (d) => (
              <div
                key={d.id}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-3"
              >

                {/* HEADER */}
                <div className="flex items-start justify-between gap-2">

                  <h3 className="text-sm font-semibold text-gray-900">
                    {d.name}
                  </h3>

                  <span
                    className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyle(
                      d.status
                    )}`}
                  >
                    {d.status}
                  </span>

                </div>

                {/* LOCATION */}
                <p className="text-xs text-gray-400 flex items-center gap-1">

                  <FiMapPin size={12} />

                  {d.location}

                </p>

                {/* WATER LEVEL */}
                <div>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">

                    <span className="flex items-center gap-1">
                      <FiDroplet size={12} />
                      Water Level
                    </span>

                    <span className="font-semibold text-gray-800">
                      {d.waterLevel}%
                    </span>

                  </div>

                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">

                    <div
                      className={`h-2 rounded-full ${levelBarColor(
                        d.waterLevel
                      )}`}
                      style={{
                        width: `${d.waterLevel}%`,
                      }}
                    />

                  </div>
                </div>

                {/* PARAMETERS */}
                <div className="grid grid-cols-3 gap-2 text-center">

                  {[
                    {
                      label: "pH",
                      value: d.ph,
                    },

                    {
                      label:
                        "Turbidity",

                      value: `${d.turbidity} NTU`,
                    },

                    {
                      label:
                        "Temp",

                      value: `${d.temperature}°C`,
                    },
                  ].map(
                    ({
                      label,
                      value,
                    }) => (
                      <div
                        key={label}
                        className="bg-gray-50 rounded-xl py-2"
                      >

                        <p className="text-[10px] text-gray-400">
                          {label}
                        </p>

                        <p className="text-sm font-semibold text-gray-800">
                          {value}
                        </p>

                      </div>
                    )
                  )}

                </div>

                {/* NEXT MAINTENANCE */}
                <p className="text-[11px] text-gray-400 flex items-center gap-1">

                  <FiCalendar size={11} />

                  Next:{" "}
                  {
                    d.nextMaintenance
                  }

                </p>
              </div>
            )
          )}

        </div>
      </div>
    </div>
  );
}