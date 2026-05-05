"use client";

import { useState } from "react";
import { FaMapMarkerAlt, FaChevronDown, FaChevronUp } from "react-icons/fa";
import WaterQuality from "./waterQuality";

type Props = {
  name: string;
  location: string;
  distance: string;
  waterLevel: number;
  status: string;
  ph: number;
  turbidity: number;
  temperature: number;
};


export default function DispenserCard({
  name,
  location,
  distance,
  waterLevel,
  status,
  ph,
  turbidity,
  temperature,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  let quality = "Baik";
  if (ph < 6.5 || ph > 8.5 || turbidity > 5 || temperature < 10 || temperature > 35) {
    quality = "Buruk";
  } else if ((ph >= 6.5 && ph < 7) || (ph > 8 && ph <= 8.5) || (turbidity > 1 && turbidity <= 5) || (temperature >= 10 && temperature < 20) || (temperature > 30 && temperature <= 35)) {
    quality = "Sedang";
  }
  const categories = [
    { label: "Baik", color: "bg-green-500", value: "Baik" },
    { label: "Sedang", color: "bg-yellow-500", value: "Sedang" },
    { label: "Buruk", color: "bg-red-500", value: "Buruk" },
  ];
  const handleCategoryClick = (cat: string) => {
    if (cat === quality) setIsOpen((prev) => !prev);
    else setIsOpen(false);
  };

  return (
    <div className="bg-white rounded-2xl p-5 outline-1 outline-gray-300 shadow-md">
      <div className="flex justify-between">
        <h2 className="font-semibold text-black">{name}</h2>
        <span className="text-white bg-green-500 text-sm py-1 px-2 rounded-2xl">
          {status}
        </span>
      </div>

      <p className="text-sm text-gray-500 flex items-center gap-1">
        <FaMapMarkerAlt className="text-black" size={14} />
        {location}
      </p>
      <p className="text-xs mt-1 text-gray-400">{distance}</p>

      <div className="mt-3">
        <div className="flex justify-between items-center mb-1">
          <p className="text-gray-400 text-sm">Ketersediaan Air</p>
          <span className="text-sm text-black font-semibold">{waterLevel}%</span>
        </div>
        <div className="w-full bg-gray-200 h-2 rounded">
          <div
            className="bg-green-500 h-2 rounded"
            style={{ width: `${waterLevel}%` }}
          />
        </div>
      </div>


      <div className="mt-5 flex items-center gap-2">
        <span className="text-sm text-gray-500 mr-1">Kualitas air:</span>
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className={`flex items-center text-sm px-3 py-1 rounded-2xl border font-semibold transition-colors duration-150
            ${
              quality === "Baik"
                ? "bg-green-500 text-white border-transparent"
                : quality === "Sedang"
                ? "bg-yellow-500 text-white border-transparent"
                : "bg-red-500 text-white border-transparent"
            }`}
        >
          {quality}
          {isOpen ? (
            <FaChevronUp className="ml-1" size={14} />
          ) : (
            <FaChevronDown className="ml-1" size={14} />
          )}
        </button>
      </div>

      {isOpen && (
        <>
          <h3 className="mt-4 text-sm font-semibold text-gray-700">Detail Parameter Kualitas</h3>
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