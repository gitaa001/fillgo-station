"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import BottomNavbar from "@/components/navbar";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

export default function MapPage() {
  const mapContainer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = mapContainer.current;

    if (!container) return;

    let map: mapboxgl.Map;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        map = new mapboxgl.Map({
          container,
          style: "mapbox://styles/mapbox/streets-v12",

          center: [longitude, latitude],

          zoom: 16,

          pitch: 45,
          bearing: -17,

          antialias: true,
        });

        // USER LOCATION MARKER
        new mapboxgl.Marker({
          color: "#2563EB",
        })
          .setLngLat([longitude, latitude])
          .setPopup(new mapboxgl.Popup().setText("Lokasi Anda"))
          .addTo(map);

        // DISPENSER DATA
        const dispensers = [
          {
            name: "Dispenser Al Wasath",
            lng: 107.768917,
            lat: -6.928188,
            status: "available",
          },
          {
            name: "Dispenser GKU 3",
            lng: 107.7702,
            lat: -6.9274,
            status: "low",
          },
        ];

        // DISPENSER MARKERS
        dispensers.forEach((disp) => {
          const el = document.createElement("div");

          el.style.width = "20px";
          el.style.height = "20px";
          el.style.borderRadius = "9999px";

          el.style.backgroundColor =
            disp.status === "available"
              ? "#22C55E"
              : "#EAB308";

          el.style.border = "3px solid white";

          el.style.boxShadow = "0 0 12px rgba(0,0,0,0.25)";

          new mapboxgl.Marker(el)
            .setLngLat([disp.lng, disp.lat])
            .setPopup(
              new mapboxgl.Popup().setHTML(`
                <div style="padding:4px;">
                  <h3 style="font-weight:bold; margin-bottom:4px;">
                    ${disp.name}
                  </h3>

                  <p style="font-size:13px;">
                    Status:
                    ${
                      disp.status === "available"
                        ? " Tersedia"
                        : " Hampir Habis"
                    }
                  </p>
                </div>
              `)
            )
            .addTo(map);
        });
      },

      () => {
        // FALLBACK LOCATION
        map = new mapboxgl.Map({
          container,
          style: "mapbox://styles/mapbox/streets-v12",

          center: [107.768917, -6.928188],

          zoom: 16,

          pitch: 45,
          bearing: -17,

          antialias: true,
        });
      }
    );

    return () => {
      if (map) map.remove();
    };
  }, []);

  return (
    <div className="flex justify-center bg-[#EFF6FF] min-h-screen ">
      <div className="w-full max-w-sm h-screen bg-white relative overflow-hidden rounded-3xl outline outline-gray-300">

        {/* FLOATING HEADER */}
        <div className="absolute top-4 left-4 right-4 z-10">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl px-4 py-3 shadow-lg border border-gray-100">
            <h1 className="text-lg font-semibold text-black">
              Peta Dispenser
            </h1>

            <p className="text-sm text-gray-500">
              Temukan dispenser terdekat
            </p>
          </div>
        </div>

        {/* MAP */}
        <div
          ref={mapContainer}
          className="w-full h-full"
        />

        {/* NAVBAR */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <BottomNavbar />
        </div>
      </div>
    </div>
  );
}