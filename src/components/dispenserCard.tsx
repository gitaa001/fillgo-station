"use client";

import { useState } from "react";

import {
  FaMapMarkerAlt,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

import WaterQuality from "./waterQuality";

type Props = {
  name: string;
  location: string;
  waterLevel: number;
  status: string;
  ph: number;
  turbidity: number;
  temperature: number;

  waterCondition?: string;
};

export default function DispenserCard({
  name,
  location,
  waterLevel,
  status,
  ph,
  turbidity,
  temperature,

  waterCondition,
}: Props) {
  const [isOpen, setIsOpen] =
    useState(false);

  // WATER QUALITY
  const normalizedCondition =
    waterCondition?.toUpperCase();

  const phBad =
    ph < 6.5 || ph > 8.5;
  const phMedium =
    (ph >= 6.5 && ph < 7) ||
    (ph > 8 && ph <= 8.5);

  const turbidityBad =
    normalizedCondition
      ? normalizedCondition.includes("KERUH")
      : turbidity <= 1400;
  const turbidityMedium =
    normalizedCondition
      ? normalizedCondition.includes("SEDANG")
      : turbidity > 1400 &&
        turbidity <= 1800;

  const temperatureBad =
    temperature < 10 ||
    temperature > 35;
  const temperatureMedium =
    (temperature >= 10 &&
      temperature < 20) ||
    (temperature > 30 &&
      temperature <= 35);

  let quality = "Baik";

  if (
    phBad ||
    turbidityBad ||
    temperatureBad
  ) {
    quality = "Buruk";
  } else if (
    phMedium ||
    turbidityMedium ||
    temperatureMedium
  ) {
    quality = "Sedang";
  }

  // STATUS BADGE COLOR
  const statusColor =
    status === "Tersedia"
      ? "bg-green-500"
      : status === "Hampir Habis"
      ? "bg-yellow-500"
      : "bg-red-500";

  // WATER LEVEL BAR COLOR
  let waterLevelColor =
    "bg-green-500";

  if (waterLevel <= 30) {
    waterLevelColor =
      "bg-red-500";
  } else if (waterLevel <= 60) {
    waterLevelColor =
      "bg-yellow-500";
  }

  return (
    <div className="bg-white rounded-2xl p-5 outline outline-gray-300 shadow-md">

      {/* HEADER */}
      <div className="flex justify-between items-start">

        <div>
          <h2 className="font-semibold text-black">
            {name}
          </h2>

          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
            <FaMapMarkerAlt
              className="text-black"
              size={14}
            />

            {location}
          </p>
        </div>

        <span
          className={`text-white text-sm py-1 px-3 rounded-2xl ${statusColor}`}
        >
          {status}
        </span>
      </div>

      {/* WATER LEVEL */}
      <div className="mt-4">

        <div className="flex justify-between items-center mb-1">
          <p className="text-gray-400 text-sm">
            Ketersediaan Air
          </p>

          <span className="text-sm text-black font-semibold">
            {waterLevel}%
          </span>
        </div>

        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">

          <div
            className={`${waterLevelColor} h-2 rounded-full transition-all duration-300`}
            style={{
              width: `${waterLevel}%`,
            }}
          />
        </div>

        {waterCondition && (
          <div className="mt-2 flex justify-between text-sm">

            <span className="text-gray-500">
              Kondisi Air
            </span>

            <span className="font-medium text-black">
              {waterCondition}
            </span>

          </div>
        )}
      </div>

      {/* WATER QUALITY */}
      <div className="mt-5 flex items-center gap-2">

        <span className="text-sm text-gray-500">
          Kualitas air:
        </span>

        <button
          onClick={() =>
            setIsOpen(
              (prev) => !prev
            )
          }
          className={`
            flex
            items-center
            text-sm
            px-3
            py-1
            rounded-2xl
            font-semibold
            text-white
            transition-all

            ${
              quality === "Baik"
                ? "bg-green-500"
                : quality ===
                  "Sedang"
                ? "bg-yellow-500"
                : "bg-red-500"
            }
          `}
        >
          {quality}

          {isOpen ? (
            <FaChevronUp
              className="ml-1"
              size={14}
            />
          ) : (
            <FaChevronDown
              className="ml-1"
              size={14}
            />
          )}
        </button>
      </div>

      {/* DETAIL PARAMETER */}
      {isOpen && (
        <>
          <h3 className="mt-4 text-sm font-semibold text-gray-700">
            Detail Parameter Kualitas
          </h3>

          <WaterQuality
            ph={ph}
            turbidity={turbidity}
            temperature={temperature}
          />
        </>
      )}
    </div>
  );
}