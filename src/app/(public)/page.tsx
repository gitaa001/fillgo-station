"use client";

import { useEffect, useMemo, useState } from "react";

import SummaryCard from "@/components/summaryCard";
import DispenserCard from "@/components/dispenserCard";
import BottomNavbar from "@/components/navbar";

import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaListUl,
  FaSearch,
} from "react-icons/fa";

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

export default function Home() {
  const [sensorData, setSensorData] =
    useState<SensorData | null>(null);

  const [searchQuery, setSearchQuery] =
    useState("");

  // FETCH SENSOR DATA
  useEffect(() => {
    async function fetchSensor() {
      try {
        const response =
          await fetch("/api/dispenser");

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
      setInterval(fetchSensor, 30000);

    return () =>
      clearInterval(interval);
  }, []);

  // FILTER DISPENSERS
  const filteredDispensers =
    useMemo(() => {
      return dispensers.filter((disp) =>
        disp.name
          .toLowerCase()
          .includes(
            searchQuery.toLowerCase()
          )
      );
    }, [searchQuery]);

  // SUMMARY
  const availableCount =
    dispensers.filter(
      (d) => d.status === "available"
    ).length;

  const lowCount =
    dispensers.filter(
      (d) => d.status === "low"
    ).length;

  return (
    <div className="flex justify-center bg-[#EFF6FF] min-h-screen">

      {/* MOBILE CONTAINER */}
      <div className="w-full max-w-sm bg-white min-h-screen rounded-3xl outline outline-gray-300 relative overflow-hidden">

        {/* SCROLLABLE CONTENT */}
        <div className="h-screen overflow-y-auto pb-24">

          {/* HEADER */}
          <div className="top-0 z-20 bg-white px-4 pt-10 pb-4 space-y-4 border-b border-gray-100">

            {/* BANNER */}
            <div
              className="text-white p-8 rounded-xl flex items-center justify-between relative overflow-hidden"
              style={{
                minHeight: "80px",
                backgroundColor: "#1447E6",
              }}
            >
              <div>
                <h1 className="text-xl font-bold">
                  Selamat Datang!
                </h1>

                <p className="text-sm">
                  Temukan dispenser terdekat
                </p>
              </div>

              <img
                src="/Roga.png"
                alt="Logo"
                className="object-contain absolute right-4 bottom-0"
                style={{
                  width: "100px",
                  height: "70px",
                }}
              />
            </div>

            {/* SUMMARY */}
            <div className="flex gap-2">

              <SummaryCard
                title="Tersedia"
                value={availableCount}
                color="bg-green-500"
                icon={FaCheckCircle}
              />

              <SummaryCard
                title="Hampir Habis"
                value={lowCount}
                color="bg-yellow-500"
                icon={FaExclamationTriangle}
              />

              <SummaryCard
                title="Total"
                value={dispensers.length}
                color="bg-[#1447E6]"
                icon={FaListUl}
              />

            </div>

            {/* SEARCH BAR */}
            <div className="relative">

              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />

              <input
                type="text"
                placeholder="Cari dispenser..."
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(
                    e.target.value
                  )
                }
                className="
                  w-full
                  bg-gray-100
                  rounded-xl
                  pl-11
                  pr-4
                  py-3
                  text-sm
                  text-black
                  outline-none
                  border
                  border-transparent
                  focus:border-blue-500
                  focus:bg-white
                "
              />
            </div>
          </div>

          {/* DISPENSER LIST */}
          <div className="p-4 space-y-4">

            <h2 className="text-black font-semibold">
              Dispenser Terdekat
            </h2>

            {filteredDispensers.map((disp) => {
              // KOICA LIVE SENSOR
              const isKoica =
                disp.id === "koica";

              const liveWaterLevel =
                sensorData?.turbidity
                  ? Math.max(
                      15,
                      Math.min(
                        100,
                        Math.round(
                          100 -
                            sensorData.turbidity /
                              30
                        )
                      )
                    )
                  : 92;

              const liveStatus =
                liveWaterLevel <= 30
                  ? "Kosong"
                  : liveWaterLevel <= 60
                  ? "Hampir Habis"
                  : "Tersedia";

              return (
                <DispenserCard
                  key={disp.id}

                  name={disp.name}

                  location={
                    disp.location
                  }

                  distance="~120m dari lokasi Anda"

                  waterLevel={
                    isKoica
                      ? liveWaterLevel
                      : disp.status ===
                        "available"
                      ? 90
                      : 45
                  }

                  status={
                    isKoica
                      ? liveStatus
                      : disp.status ===
                        "available"
                      ? "Tersedia"
                      : "Hampir Habis"
                  }

                  ph={
                    isKoica &&
                    sensorData
                      ? sensorData.ph
                      : 7.1
                  }

                  turbidity={
                    isKoica &&
                    sensorData
                      ? sensorData.turbidity
                      : 0.6
                  }

                  temperature={
                    isKoica &&
                    sensorData
                      ? sensorData.temperature
                      : 24
                  }

                  waterCondition={
                    isKoica &&
                    sensorData
                      ? sensorData.water_condition
                      : "Jernih"
                  }
                />
              );
            })}

          </div>
        </div>

        {/* STICKY NAVBAR */}
        <div className="absolute bottom-0 left-0 right-0 z-30">
          <BottomNavbar />
        </div>

      </div>
    </div>
  );
}