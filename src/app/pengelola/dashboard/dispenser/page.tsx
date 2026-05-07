"use client";

import { useState } from "react";
import { FiPlus, FiSearch, FiChevronDown } from "react-icons/fi";
import DispenserTable from "@/components/pengelola/DispenserTable";
import DispenserModal, { DispenserData } from "@/components/pengelola/DispenserModal";

const initialDispensers: DispenserData[] = [
  {
    id: "DSP001",
    name: "Dispenser Gedung A - Lt. 1",
    location: "Gedung A - Lantai 1",
    waterLevel: 85,
    status: "Available",
    ph: 7.2,
    turbidity: 0.5,
    temperature: 24,
  },
  {
    id: "DSP002",
    name: "Dispenser Gedung A - Lt. 2",
    location: "Gedung A - Lantai 2",
    waterLevel: 25,
    status: "Almost Empty",
    ph: 7.0,
    turbidity: 0.8,
    temperature: 25,
  },
  {
    id: "DSP003",
    name: "Dispenser Gedung B - Lt. 1",
    location: "Gedung B - Lantai 1",
    waterLevel: 5,
    status: "Empty",
    ph: 6.8,
    turbidity: 1.2,
    temperature: 26,
  },
  {
    id: "DSP004",
    name: "Dispenser Gedung B - Lt. 2",
    location: "Gedung B - Lantai 2",
    waterLevel: 92,
    status: "Available",
    ph: 7.4,
    turbidity: 0.4,
    temperature: 23,
  },
  {
    id: "DSP005",
    name: "Dispenser Gedung C - Lt. 1",
    location: "Gedung C - Lantai 1",
    waterLevel: 68,
    status: "Available",
    ph: 7.1,
    turbidity: 0.6,
    temperature: 24,
  },
  {
    id: "DSP006",
    name: "Dispenser Gedung C - Lt. 3",
    location: "Gedung C - Lantai 3",
    waterLevel: 18,
    status: "Almost Empty",
    ph: 6.9,
    turbidity: 0.9,
    temperature: 25,
  },
];

const STATUS_OPTIONS = ["All Status", "Available", "Almost Empty", "Empty"];

export default function DispenserPage() {
  const [dispensers, setDispensers] = useState<DispenserData[]>(initialDispensers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<DispenserData | null>(null);
  const filtered = dispensers.filter((d) => {
    const matchSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.location.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "All Status" || d.status === statusFilter;
    return matchSearch && matchStatus;
  });
  const handleAdd = () => {
    setEditTarget(null);
    setModalOpen(true);
  };

  const handleEdit = (d: DispenserData) => {
    setEditTarget(d);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Hapus dispenser ini?")) return;
    setDispensers((prev) => prev.filter((d) => d.id !== id));
  };

  const handleSave = (data: DispenserData) => {
    setDispensers((prev) => {
      const exists = prev.find((d) => d.id === data.id);
      if (exists) return prev.map((d) => (d.id === data.id ? data : d));
      return [...prev, data];
    });
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dispenser Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage and configure water dispensers</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-[#1447E6] hover:bg-[#1040d0] transition-colors text-white text-sm font-semibold px-5 py-2.5 rounded-xl shrink-0"
        >
          <FiPlus size={16} />
          Add Dispenser
        </button>
      </div>

      {/* Search & filter */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
        <div className="flex items-center gap-2 flex-1 bg-gray-50 rounded-xl px-4 py-2.5">
          <FiSearch size={16} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search dispensers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent w-full text-sm text-gray-700 outline-none placeholder:text-gray-400"
          />
        </div>

        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none bg-gray-50 border border-gray-200 rounded-xl pl-4 pr-9 py-2.5 text-sm text-gray-700 outline-none focus:border-[#1447E6] transition-colors cursor-pointer"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <FiChevronDown
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
        </div>
      </div>

      {/* Table */}
      <DispenserTable
        dispensers={filtered}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Modal */}
      <DispenserModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initial={editTarget}
      />
    </div>
  );
}