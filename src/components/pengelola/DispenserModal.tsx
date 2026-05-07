"use client";

import { useState } from "react";
import { FiX } from "react-icons/fi";

export type DispenserData = {
  id: string;
  name: string;
  location: string;
  waterLevel: number;
  status: "Available" | "Almost Empty" | "Empty";
  ph: number;
  turbidity: number;
  temperature: number;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (data: DispenserData) => void;
  initial?: DispenserData | null;
};

const emptyForm: DispenserData = {
  id: "",
  name: "",
  location: "",
  waterLevel: 100,
  status: "Available",
  ph: 7.0,
  turbidity: 0.5,
  temperature: 25,
};

function ModalContent({ open, onClose, onSave, initial }: Props) {
  const [form, setForm] = useState<DispenserData>(initial ?? emptyForm);

  const isEdit = !!initial;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: ["waterLevel", "ph", "turbidity", "temperature"].includes(name)
        ? parseFloat(value)
        : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...form,
      id: isEdit ? form.id : `DSP${String(Date.now()).slice(-3)}`,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">
            {isEdit ? "Edit Dispenser" : "Tambah Dispenser"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

          {/* Nama */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Nama Dispenser</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Dispenser Gedung A - Lt. 1"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-[#1447E6] transition-colors"
            />
          </div>

          {/* Lokasi */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Lokasi</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              required
              placeholder="Gedung A - Lantai 1"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-[#1447E6] transition-colors"
            />
          </div>

          {/* Status & Water Level */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-[#1447E6] transition-colors"
              >
                <option value="Available">Available</option>
                <option value="Almost Empty">Almost Empty</option>
                <option value="Empty">Empty</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Water Level (%)
              </label>
              <input
                name="waterLevel"
                type="number"
                min={0}
                max={100}
                value={form.waterLevel}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-[#1447E6] transition-colors"
              />
            </div>
          </div>

          {/* Parameter kualitas air */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">pH</label>
              <input
                name="ph"
                type="number"
                step="0.1"
                min={0}
                max={14}
                value={form.ph}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-[#1447E6] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Turbidity (NTU)</label>
              <input
                name="turbidity"
                type="number"
                step="0.1"
                min={0}
                value={form.turbidity}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-[#1447E6] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Temp (°C)</label>
              <input
                name="temperature"
                type="number"
                step="0.5"
                value={form.temperature}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-[#1447E6] transition-colors"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-gray-100 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-[#1447E6] hover:bg-[#1040d0] text-white transition-colors"
            >
              {isEdit ? "Simpan Perubahan" : "Tambah Dispenser"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function DispenserModal(props: Props) {
  if (!props.open) return null;

  const key = `${props.open}-${props.initial?.id ?? "new"}`;

  return <ModalContent key={key} {...props} />;
}