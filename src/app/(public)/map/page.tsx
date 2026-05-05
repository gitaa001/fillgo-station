"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import BottomNavbar from "@/components/navbar";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

export default function MapPage() {
  const mapContainer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [107.772, -6.917], // contoh: Bandung
      zoom: 15,
    });

    // contoh marker
    new mapboxgl.Marker()
      .setLngLat([107.772, -6.917])
      .setPopup(new mapboxgl.Popup().setText("Dispenser Al Wasath"))
      .addTo(map);

    return () => map.remove();
  }, []);

  return (
    <div className="flex justify-center bg-[#EFF6FF] min-h-screen">
      <div className="w-full max-w-sm bg-white min-h-screen rounded-3xl outline outline-gray-300 relative overflow-hidden">

        {/* HEADER */}
        <div className="p-4 font-semibold text-black text-lg border-b">
          Peta Dispenser
        </div>

        {/* MAP */}
        <div
          ref={mapContainer}
          className="w-full h-[calc(100vh-140px)]"
        />

        {/* NAVBAR */}
        <BottomNavbar />
      </div>
    </div>
  );
}