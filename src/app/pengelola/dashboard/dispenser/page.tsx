"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FiPlus,
  FiSearch,
  FiChevronDown,
} from "react-icons/fi";

import DispenserTable from "@/components/pengelola/DispenserTable";

import DispenserModal from "@/components/pengelola/DispenserModal";

import {
  dispensers as baseDispensers,
  type Dispenser,
} from "@/lib/dispenser";

type SensorData = {
  ph: number;
  ph_status: string;
  temperature: number;
  turbidity: number;
  water_condition: string;
  timestamp: number;
};

type EnrichedDispenser =
  Dispenser & {
    waterLevel: number;

    status:
      | "Available"
      | "Almost Empty"
      | "Empty";

    ph: number;

    turbidity: number;

    temperature: number;
  };

type DispenserForm = {
  id: string;

  name: string;

  location: string;

  lat: number;

  lng: number;

  isLive: boolean;
};

const STATUS_OPTIONS = [
  "All Status",
  "Available",
  "Almost Empty",
  "Empty",
];

export default function DispenserPage() {

  const [sensorData, setSensorData] =
    useState<SensorData | null>(
      null
    );

  const [
    customDispensers,
    setCustomDispensers,
  ] = useState<
    EnrichedDispenser[]
  >([]);

  const [search, setSearch] =
    useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("All Status");

  const [
    modalOpen,
    setModalOpen,
  ] = useState(false);

  const [
    editTarget,
    setEditTarget,
  ] =
    useState<Dispenser | null>(
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
    useMemo<
      EnrichedDispenser[]
    >(() => {

      return baseDispensers.map(
        (
          disp
        ): EnrichedDispenser => {

          // LIVE SENSOR
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
                    sensorData.turbidity >
                      1800
                      ? 90
                      : sensorData.turbidity >
                        1400
                      ? 50 +
                        ((sensorData.turbidity -
                          1400) /
                          400) *
                          40
                      : 30
                  )
                )
              );

            const status: EnrichedDispenser["status"] =
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
            };
          }

          // STATIC DISPENSERS
          const waterLevel =
            disp.status ===
            "available"
              ? 85
              : disp.status ===
                "low"
              ? 42
              : 15;

          const status: EnrichedDispenser["status"] =
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
          };
        }
      );

    }, [sensorData]);

  // MERGED DISPENSERS
  const allDispensers: EnrichedDispenser[] =
    [
      ...enrichedDispensers,
      ...customDispensers,
    ];

  // FILTERED DISPENSERS
  const filtered =
    useMemo<
      EnrichedDispenser[]
    >(() => {

      return allDispensers.filter(
        (d) => {

          const matchSearch =
            d.name
              .toLowerCase()
              .includes(
                search.toLowerCase()
              ) ||
            d.location
              .toLowerCase()
              .includes(
                search.toLowerCase()
              );

          const matchStatus =
            statusFilter ===
              "All Status" ||
            d.status ===
              statusFilter;

          return (
            matchSearch &&
            matchStatus
          );
        }
      );

    }, [
      allDispensers,
      search,
      statusFilter,
    ]);

  // ADD
  const handleAdd = () => {
    setEditTarget(null);

    setModalOpen(true);
  };

  // EDIT
  const handleEdit = (
    d: EnrichedDispenser
  ) => {
    setEditTarget(d);

    setModalOpen(true);
  };

  // DELETE
  const handleDelete = (
    id: string
  ) => {

    if (
      !confirm(
        "Hapus dispenser ini?"
      )
    ) {
      return;
    }

    setCustomDispensers(
      (prev) =>
        prev.filter(
          (d) => d.id !== id
        )
    );
  };

  // SAVE
  const handleSave = (
    data: DispenserForm
  ) => {

    const enriched: EnrichedDispenser =
      {
        ...data,

        waterLevel:
          data.isLive
            ? 88
            : 85,

        status:
          "Available",

        ph: 7.1,

        turbidity: 0.7,

        temperature: 24,
      };

    setCustomDispensers(
      (prev) => {

        const exists =
          prev.find(
            (d) =>
              d.id === data.id
          );

        if (exists) {

          return prev.map(
            (d) =>
              d.id === data.id
                ? enriched
                : d
          );
        }

        return [
          ...prev,
          enriched,
        ];
      }
    );

    setModalOpen(false);
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex items-start justify-between gap-4">

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Dispenser
            Management
          </h1>

          <p className="text-sm text-gray-500 mt-0.5">
            Manage and configure
            water dispensers
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-[#1447E6] hover:bg-[#1040d0] transition-colors text-white text-sm font-semibold px-5 py-2.5 rounded-xl shrink-0"
        >

          <FiPlus size={16} />

          Add Dispenser

        </button>

      </div>

      {/* SEARCH & FILTER */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">

        {/* SEARCH */}
        <div className="flex items-center gap-2 flex-1 bg-gray-50 rounded-xl px-4 py-2.5">

          <FiSearch
            size={16}
            className="text-gray-400 shrink-0"
          />

          <input
            type="text"
            placeholder="Search dispensers..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="bg-transparent w-full text-sm text-gray-700 outline-none placeholder:text-gray-400"
          />

        </div>

        {/* FILTER */}
        <div className="relative">

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
            className="appearance-none bg-gray-50 border border-gray-200 rounded-xl pl-4 pr-9 py-2.5 text-sm text-gray-700 outline-none focus:border-[#1447E6] transition-colors cursor-pointer"
          >

            {STATUS_OPTIONS.map(
              (s) => (
                <option
                  key={s}
                  value={s}
                >
                  {s}
                </option>
              )
            )}

          </select>

          <FiChevronDown
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />

        </div>
      </div>

      {/* TABLE */}
      <DispenserTable
        dispensers={filtered}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* MODAL */}
      <DispenserModal
        open={modalOpen}
        onClose={() =>
          setModalOpen(false)
        }
        onSave={handleSave}
        initial={editTarget}
      />

    </div>
  );
}