"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";

import {
  FaLocationArrow,
  FaMapMarkerAlt,
  FaPaperPlane,
} from "react-icons/fa";

import {
  dispensers,
  type Dispenser,
} from "@/lib/dispenser";

import BottomNavbar from "@/components/navbar";
import WaterQuality from "@/components/waterQuality";

mapboxgl.accessToken =
  process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

export default function MapPage() {
  // MAP
  const mapContainer =
    useRef<HTMLDivElement | null>(null);

  const mapRef =
    useRef<mapboxgl.Map | null>(null);

  // USER LOCATION
  const [userLocation, setUserLocation] =
    useState<{
      lat: number;
      lng: number;
    } | null>(null);

  // SEARCH
  const [searchQuery, setSearchQuery] =
    useState("");

  // SELECTED DISPENSER
  const [selectedDispenser, setSelectedDispenser] =
    useState<Dispenser | null>(null);

  // ROUTE ACTIVE
  const [isRouting, setIsRouting] =
    useState(false);

  // DATA SENSOR
  type SensorData = {
    ph: number;
    ph_status: string;
    temperature: number;
    turbidity: number;
    water_condition: string;
    timestamp: number;
  };

  const [sensorData, setSensorData] =
    useState<SensorData | null>(null);

  const selectedIsLive =
    selectedDispenser?.isLive &&
    sensorData !== null;

  const liveWaterLevel =
    sensorData?.turbidity !== undefined
      ? Math.max(
          15,
          Math.min(
            100,
            Math.round(
              sensorData.turbidity > 1800
                ? 90
                : sensorData.turbidity > 1400
                ? 50 +
                  ((sensorData.turbidity -
                    1400) /
                    400) *
                    40
                : 30
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

  // CALCULATE DISTANCE
  function calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) {
    const R = 6371;

    const dLat =
      ((lat2 - lat1) * Math.PI) / 180;

    const dLon =
      ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) *
        Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c =
      2 *
      Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
      );

    return R * c;
  }

  // FILTER DISPENSERS
  const filteredDispensers =
    dispensers.filter((disp) =>
      disp.name
        .toLowerCase()
        .includes(
          searchQuery.toLowerCase()
        )
    );

  // SORT DISPENSERS
  const sortedDispensers =
    userLocation
      ? [...filteredDispensers].sort(
          (a, b) => {
            const distA =
              calculateDistance(
                userLocation.lat,
                userLocation.lng,
                a.lat,
                a.lng
              );

            const distB =
              calculateDistance(
                userLocation.lat,
                userLocation.lng,
                b.lat,
                b.lng
              );

            return distA - distB;
          }
        )
      : filteredDispensers;

  // CLEAR ROUTE
  function clearRoute() {
    if (!mapRef.current) return;

    const map = mapRef.current;

    const existingLayer =
      map.getLayer("route");

    if (existingLayer) {
      map.removeLayer("route");
    }

    const existingSource =
      map.getSource("route");

    if (existingSource) {
      map.removeSource("route");
    }

    setIsRouting(false);
  }

  // DRAW ROUTE
  async function drawRoute(
    destinationLat: number,
    destinationLng: number
  ) {
    if (!mapRef.current) return;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const userLat =
          position.coords.latitude;

        const userLng =
          position.coords.longitude;

        const map = mapRef.current!;

        // REMOVE OLD ROUTE
        clearRoute();

        // FETCH ROUTE
        const response = await fetch(
          `https://api.mapbox.com/directions/v5/mapbox/walking/${userLng},${userLat};${destinationLng},${destinationLat}?geometries=geojson&access_token=${mapboxgl.accessToken}`
        );

        const data = await response.json();

        if (!data.routes?.length) return;

        const route =
          data.routes[0].geometry;

        // ADD SOURCE
        map.addSource("route", {
          type: "geojson",

          data: {
            type: "Feature",

            properties: {},

            geometry: route,
          },
        });

        // DRAW ROUTE
        map.addLayer({
          id: "route",

          type: "line",

          source: "route",

          layout: {
            "line-join": "round",
            "line-cap": "round",
          },

          paint: {
            "line-color": "#2563EB",

            "line-width": 5,

            "line-opacity": 0.85,
          },
        });

        // FIT ROUTE
        const coordinates =
          route.coordinates;

        const bounds =
          new mapboxgl.LngLatBounds(
            coordinates[0],
            coordinates[0]
          );

        for (const coord of coordinates) {
          bounds.extend(coord);
        }

        map.fitBounds(bounds, {
          padding: 100,
        });

        setIsRouting(true);
      }
    );
  }

  // RECENTER USER
  function recenterToUser() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } =
          position.coords;

        mapRef.current?.flyTo({
          center: [longitude, latitude],
          zoom: 16,
          speed: 1.2,
          curve: 1.5,
          essential: true,
        });
      }
    );
  }

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

  // MAP INITIALIZATION
  useEffect(() => {
    const container =
      mapContainer.current;

    if (!container) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } =
          position.coords;

        // SAVE USER LOCATION
        setUserLocation({
          lat: latitude,
          lng: longitude,
        });

        const map = new mapboxgl.Map({
          container,
          style: "mapbox://styles/mapbox/light-v11",
          center: [longitude, latitude],
          zoom: 16,
          pitch: 35,
          bearing: -17,
          antialias: true,
        });

        mapRef.current = map;

        // USER MARKER
        new mapboxgl.Marker({
          color: "#2563EB",
        })
          .setLngLat([
            longitude,
            latitude,
          ])
          .addTo(map);

        // DISPENSER MARKERS
        dispensers.forEach((disp) => {
          const el =
            document.createElement("div");

          el.style.width = "22px";
          el.style.height = "22px";

          el.style.borderRadius =
            "9999px";

          el.style.backgroundColor =
            disp.status === "available"
              ? "#2563EB"
              : "#EAB308";

          el.style.border =
            "3px solid white";

          el.style.boxShadow =
            "0 0 10px rgba(0,0,0,0.25)";

          el.style.cursor = "pointer";

          el.addEventListener(
            "click",
            () => {
              setSelectedDispenser(disp);

              map.flyTo({
                center: [
                  disp.lng,
                  disp.lat,
                ],
                zoom: 17,
                essential: true,
              });
            }
          );

          new mapboxgl.Marker(el)
            .setLngLat([
              disp.lng,
              disp.lat,
            ])
            .addTo(map);
        });
      },

      () => {
        const map = new mapboxgl.Map({
          container,

          style:
            "mapbox://styles/mapbox/light-v11",

          center: [
            107.768917,
            -6.928188,
          ],

          zoom: 16,
        });

        mapRef.current = map;
      }
    );

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div className="flex justify-center bg-[#EFF6FF] min-h-screen">
      <div className="w-full max-w-sm h-screen bg-white relative overflow-hidden rounded-3xl outline outline-gray-300">

        {/* MAP */}
        <div
          ref={mapContainer}
          className="w-full h-full"
        />

        {/* HEADER */}
        <div className="absolute top-4 left-4 right-4 z-10">

          <div className="bg-white rounded-2xl p-4 shadow-lg space-y-3">

            <div>
              <h1 className="text-lg font-semibold text-black">
                Peta Dispenser
              </h1>

              <p className="text-sm text-gray-500">
                Temukan dispenser terdekat
              </p>
            </div>

            {/* SEARCH BAR */}
            <input
              type="text"
              placeholder="Cari dispenser..."
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(
                  e.target.value
                )
              }
              className=" w-full bg-gray-100 rounded-xl px-4 py-3 text-sm text-black outline-none border border-transparent
                focus:border-blue-500
                focus:bg-white"
            />

          </div>
        </div>

        {/* SELECTED DISPENSER DETAIL */}
        {selectedDispenser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <button
              aria-label="Tutup detail dispenser"
              onClick={() => setSelectedDispenser(null)}
              className="absolute inset-0 bg-black/40"
            />

            <div className="relative w-full max-w-sm max-h-[85vh] overflow-y-auto rounded-3xl bg-white shadow-2xl border border-gray-200 p-4">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h2 className="font-bold text-black text-lg">
                    {selectedDispenser.name}
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    {selectedDispenser.location}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedDispenser(null)}
                  className="shrink-0 w-9 h-9 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center"
                  aria-label="Tutup modal"
                >
                  ✕
                </button>
              </div>

              <div className="mt-4 space-y-4">
                {selectedIsLive && sensorData ? (
                  <>
                    <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4">
                      <div className="flex justify-between items-center gap-3">
                        <div>
                          <p className="text-xs uppercase tracking-wide text-blue-500 font-semibold">
                            Detail Kualitas Air
                          </p>

                          <p className="text-sm text-gray-600 mt-1">
                            Pembacaan sensor terbaru dari dispenser ini.
                          </p>
                        </div>

                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-600 text-white whitespace-nowrap">
                          {liveStatus}
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                        <div className="rounded-xl bg-white p-3 border border-blue-100">
                          <p className="text-gray-500 text-xs">pH Air</p>
                          <p className="font-semibold text-black mt-1">
                            {sensorData.ph}
                          </p>
                        </div>

                        <div className="rounded-xl bg-white p-3 border border-blue-100">
                          <p className="text-gray-500 text-xs">Temperatur</p>
                          <p className="font-semibold text-black mt-1">
                            {sensorData.temperature}°C
                          </p>
                        </div>

                        <div className="rounded-xl bg-white p-3 border border-blue-100">
                          <p className="text-gray-500 text-xs">Turbidity</p>
                          <p className="font-semibold text-black mt-1">
                            {sensorData.turbidity}
                          </p>
                        </div>

                        <div className="rounded-xl bg-white p-3 border border-blue-100">
                          <p className="text-gray-500 text-xs">Kondisi Air</p>
                          <p className="font-semibold text-black mt-1">
                            {sensorData.water_condition}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="flex justify-between items-center mb-1 text-sm">
                          <span className="text-gray-500">Ketersediaan Air</span>
                          <span className="font-semibold text-black">
                            {liveWaterLevel}%
                          </span>
                        </div>

                        <div className="w-full h-2 rounded-full bg-blue-100 overflow-hidden">
                          <div
                            className="h-2 rounded-full bg-blue-600"
                            style={{ width: `${liveWaterLevel}%` }}
                          />
                        </div>
                      </div>

                      <div className="mt-4 rounded-xl bg-white p-3 border border-blue-100">
                        <WaterQuality
                          ph={sensorData.ph}
                          turbidity={sensorData.turbidity}
                          temperature={sensorData.temperature}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="rounded-2xl bg-gray-50 border border-gray-200 p-4 text-sm text-gray-600">
                    Sensor live belum tersedia untuk dispenser ini.
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() =>
                    drawRoute(
                      selectedDispenser.lat,
                      selectedDispenser.lng
                    )
                  }
                  className="flex-1 bg-blue-600 text-white rounded-xl py-3 font-medium"
                >
                  Navigasi
                </button>

                {isRouting && (
                  <button
                    onClick={clearRoute}
                    className="px-4 rounded-xl border border-gray-300"
                  >
                    Tutup
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* BOTTOM SECTION */}
        <div className="absolute bottom-10 left-0 right-0 z-20">

          {/* RECENTER BUTTON */}
          <div className="flex justify-end px-4 mb-3">
            <button
              onClick={recenterToUser}
              className="
                w-12
                h-12
                rounded-full
                bg-white
                border
                border-gray-200
                shadow-lg
                flex
                items-center
                justify-center
                active:scale-95
                transition
              "
            >
              <FaLocationArrow className="text-blue-600 text-lg" />
            </button>
          </div>

          {/* BOTTOM SHEET */}
          <div
            className="
              bg-white
              rounded-t-3xl
              px-4
              pt-4
              pb-6
              shadow-2xl
              outline
              outline-gray-300
              max-h-80
              overflow-y-auto
            "
          >
            <h2 className="text-lg font-semibold text-black mb-4">
              Dispenser Terdekat
            </h2>

            <div className="space-y-3">

              {sortedDispensers.map((disp) => {
                const distance =
                  userLocation
                    ? (
                        calculateDistance(
                          userLocation.lat,
                          userLocation.lng,
                          disp.lat,
                          disp.lng
                        ) * 1000
                      ).toFixed(0)
                    : null;

                return (
                  <div
                    key={disp.name}
                    onClick={() => {
                      setSelectedDispenser(disp);

                      mapRef.current?.flyTo({
                        center: [
                          disp.lng,
                          disp.lat,
                        ],

                        zoom: 17,
                      });
                    }}
                    className={`
                      bg-white
                      rounded-2xl
                      border
                      p-4
                      shadow-sm
                      cursor-pointer

                      ${
                        selectedDispenser?.name ===
                        disp.name
                          ? "border-blue-500"
                          : "border-gray-200"
                      }
                    `}
                  >

                    <div className="flex justify-between items-start">

                      <div>

                        <h3 className="font-bold text-black text-md">
                          {disp.name}
                        </h3>

                        <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                          <FaMapMarkerAlt />

                          <span>
                            {disp.location}
                          </span>
                        </div>

                        <p className="text-gray-400 text-sm mt-1">
                          {distance
                            ? `~${distance}m dari lokasi Anda`
                            : "Menghitung jarak..."}
                        </p>

                      </div>

                      <div className="flex flex-col items-end gap-3">

                        <span
                          className={`
                            text-xs
                            px-3
                            py-1
                            rounded-full
                            text-white

                            ${
                              disp.status ===
                              "available"
                                ? "bg-green-500"
                                : "bg-yellow-500"
                            }
                          `}
                        >
                          {disp.status ===
                          "available"
                            ? "Tersedia"
                            : "Hampir Habis"}
                        </span>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();

                            setSelectedDispenser(
                              disp
                            );

                            drawRoute(
                              disp.lat,
                              disp.lng
                            );
                          }}
                          className="
                            w-9
                            h-9
                            rounded-full
                            border
                            border-gray-200
                            flex
                            items-center
                            justify-center
                          "
                        >
                          <FaPaperPlane className="text-gray-500" />
                        </button>

                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* NAVBAR */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <BottomNavbar />
        </div>
      </div>
    </div>
  );
}