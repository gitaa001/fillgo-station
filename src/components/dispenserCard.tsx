"use client";

import { useState } from "react";
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
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl p-4 shadow">
      <div className="flex justify-between">
        <h2 className="font-semibold">{name}</h2>
        <span className="text-green-600 text-sm">{status}</span>
      </div>

      <p className="text-sm text-gray-500">{location}</p>
      <p className="text-xs text-gray-400">{distance}</p>

      <div className="mt-3">
        <p className="text-sm">Ketersediaan Air</p>
        <div className="w-full bg-gray-200 h-2 rounded">
          <div
            className="bg-green-500 h-2 rounded"
            style={{ width: `${waterLevel}%` }}
          />
        </div>
        <p className="text-right text-sm">{waterLevel}%</p>
      </div>

      <button
        onClick={() => setOpen(!open)}
        className="mt-3 text-sm text-green-600"
      >
        Kualitas Air
      </button>

      {open && (
        <WaterQuality
          ph={ph}
          turbidity={turbidity}
          temperature={temperature}
        />
      )}
    </div>
  );
}