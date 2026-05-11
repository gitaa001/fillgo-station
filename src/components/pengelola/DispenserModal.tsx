"use client";

import { useState } from "react";
import { FiX } from "react-icons/fi";

import type {
  Dispenser,
} from "@/lib/dispenser";

type DispenserForm = {
  id: string;

  name: string;

  location: string;

  lat: number;
  lng: number;

  isLive: boolean;
};

type Props = {
  open: boolean;

  onClose: () => void;

  onSave: (
    data: DispenserForm
  ) => void;

  initial?: Dispenser | null;
};

const emptyForm: DispenserForm = {
  id: "",

  name: "",

  location: "",

  lat: -6.928188,
  lng: 107.768917,

  isLive: false,
};

function ModalContent({
  onClose,
  onSave,
  initial,
}: Props) {

  const [form, setForm] =
  useState<DispenserForm>(
    initial
      ? {
          id: initial.id,

          name: initial.name,

          location:
            initial.location,

          lat: initial.lat,

          lng: initial.lng,

          isLive:
            initial.isLive ??
            false,
        }
      : emptyForm
  );

  const isEdit = !!initial;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } =
      e.target;

    setForm((prev) => ({
      ...prev,

      [name]:
        name === "lat" ||
        name === "lng"
          ? parseFloat(value)
          : value,
    }));
  };

  const handleSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    onSave({
      ...form,

      id: isEdit
        ? form.id
        : `DSP${String(
            Date.now()
          ).slice(-3)}`,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">

      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl">

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">

          <h2 className="text-base font-semibold text-gray-900">
            {isEdit
              ? "Edit Dispenser"
              : "Tambah Dispenser"}
          </h2>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition-colors"
          >
            <FiX size={20} />
          </button>

        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="px-6 py-5 space-y-4"
        >

          {/* NAMA */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Nama Dispenser
            </label>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Dispenser Gedung A - Lt. 1"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-[#1447E6] transition-colors"
            />
          </div>

          {/* LOKASI */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Lokasi
            </label>

            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              required
              placeholder="Gedung A - Lantai 1"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-[#1447E6] transition-colors"
            />
          </div>

          {/* COORDINATES */}
          <div className="grid grid-cols-2 gap-3">

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Latitude
              </label>

              <input
                name="lat"
                type="number"
                step="0.000001"
                value={form.lat}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-[#1447E6]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Longitude
              </label>

              <input
                name="lng"
                type="number"
                step="0.000001"
                value={form.lng}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-[#1447E6]"
              />
            </div>

          </div>

          {/* LIVE DEVICE */}
          <div>

            <label className="flex items-center gap-3 cursor-pointer">

              <input
                type="checkbox"
                checked={form.isLive}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,

                    isLive:
                      e.target.checked,
                  }))
                }
                className="w-4 h-4 accent-[#1447E6]"
              />

              <span className="text-sm text-gray-700">
                Live Sensor Device
              </span>

            </label>

            <p className="text-xs text-gray-400 mt-1">
              Aktif jika dispenser
              terhubung ke Firebase sensor
            </p>

          </div>

          {/* ACTIONS */}
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
              {isEdit
                ? "Simpan Perubahan"
                : "Tambah Dispenser"}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}

export default function DispenserModal(
  props: Props
) {
  if (!props.open) return null;

  const key =
    `${props.open}-${
      props.initial?.id ?? "new"
    }`;

  return (
    <ModalContent
      key={key}
      {...props}
    />
  );
}