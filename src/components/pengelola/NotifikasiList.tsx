type Notifikasi = {
  id: number;
  message: string;
  time: string;
  type: "critical" | "warning";
};

const notifications: Notifikasi[] = [
  {
    id: 1,
    message: "Dispenser Gedung B - Lt. 1 is empty. Immediate refill required.",
    time: "4/16/2026, 10:20:00 AM",
    type: "critical",
  },
  {
    id: 2,
    message: "Dispenser Gedung A - Lt. 2 is almost empty (25% remaining).",
    time: "4/16/2026, 10:25:00 AM",
    type: "warning",
  },
  {
    id: 3,
    message: "Dispenser Gedung C - Lt. 3 is almost empty (18% remaining).",
    time: "4/16/2026, 10:15:00 AM",
    type: "warning",
  },
];

export default function NotifikasiList() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-base font-semibold text-gray-900">🔔 Recent Notifications</span>
        </div>
        <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
          {notifications.length} New
        </span>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`flex items-start justify-between gap-4 p-3 rounded-xl border ${
              n.type === "critical"
                ? "bg-red-50 border-red-100"
                : "bg-yellow-50 border-yellow-100"
            }`}
          >
            <div>
              <p className="text-sm text-gray-800">{n.message}</p>
              <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
            </div>
            <span
              className={`shrink-0 text-xs font-semibold px-2 py-1 rounded-lg ${
                n.type === "critical"
                  ? "bg-red-500 text-white"
                  : "bg-yellow-400 text-yellow-900"
              }`}
            >
              {n.type}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}