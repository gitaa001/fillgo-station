"use client";

import { FiEdit2, FiTrash2, FiMapPin } from "react-icons/fi";
import { DispenserData } from "./DispenserModal";

type Props = {
  dispensers: DispenserData[];
  onEdit: (d: DispenserData) => void;
  onDelete: (id: string) => void;
};

function statusStyle(status: string) {
  if (status === "Available") return "bg-blue-100 text-blue-700";
  if (status === "Almost Empty") return "bg-yellow-100 text-yellow-800";
  return "bg-red-100 text-red-700";
}

export default function DispenserTable({ dispensers, onEdit, onDelete }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <p className="text-sm font-semibold text-gray-700">
          Dispensers ({dispensers.length})
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs text-gray-400 font-semibold uppercase tracking-wide">
              <th className="px-6 py-3 text-left">ID</th>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Location</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-right">Water Level</th>
              <th className="px-6 py-3 text-right">pH</th>
              <th className="px-6 py-3 text-right">Temperature</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {dispensers.map((d, i) => (
              <tr
                key={d.id}
                className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                  i === dispensers.length - 1 ? "border-b-0" : ""
                }`}
              >
                <td className="px-6 py-4 text-gray-400 font-mono text-xs">{d.id}</td>

                <td className="px-6 py-4 font-semibold text-gray-800">{d.name}</td>

                <td className="px-6 py-4 text-gray-500">
                  <span className="flex items-center gap-1">
                    <FiMapPin size={12} className="shrink-0" />
                    {d.location}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle(d.status)}`}>
                    {d.status}
                  </span>
                </td>

                <td className="px-6 py-4 text-right text-gray-700 font-medium">
                  {d.waterLevel}%
                </td>

                <td className="px-6 py-4 text-right text-gray-700">{d.ph}</td>

                <td className="px-6 py-4 text-right text-gray-700">{d.temperature}°C</td>

                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(d)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-[#1447E6] hover:bg-blue-50 transition-colors"
                      title="Edit"
                    >
                      <FiEdit2 size={15} />
                    </button>
                    <button
                      onClick={() => onDelete(d.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="Hapus"
                    >
                      <FiTrash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {dispensers.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-sm text-gray-400">
                  Tidak ada dispenser ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}