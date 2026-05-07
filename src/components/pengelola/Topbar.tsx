"use client";

import { useRouter, usePathname } from "next/navigation";
import { FaDroplet } from "react-icons/fa6";
import {
  FiGrid,
  FiDatabase,
  FiClock,
  FiFileText,
  FiBell,
  FiLogOut,
} from "react-icons/fi";

const navItems = [
  { label: "Dashboard", icon: FiGrid, path: "/pengelola" },
  { label: "Dispensers", icon: FiDatabase, path: "/pengelola/dispenser" },
  { label: "History", icon: FiClock, path: "/pengelola/historis" },
  { label: "Reports", icon: FiFileText, path: "/pengelola/laporan" },
];

const NOTIF_COUNT = 3;
const USER_EMAIL = "admin@gmail.com";

export default function Topbar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem("pengelola_auth");
    router.push("/pengelola/login");
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center gap-6">

        {/* Logo */}
        <button
          onClick={() => router.push("/pengelola")}
          className="flex items-center gap-2.5 shrink-0 mr-2"
        >
          <div className="w-8 h-8 rounded-lg bg-[#1447E6] flex items-center justify-center">
            <FaDroplet size={14} color="white" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-bold text-gray-900">FillGo Station</p>
            <p className="text-[10px] text-gray-400">Monitoring System</p>
          </div>
        </button>

        {/* Nav */}
        <nav className="flex items-center gap-1 flex-1">
          {navItems.map(({ label, icon: Icon, path }) => {
            const isActive =
              path === "/pengelola"
                ? pathname === "/pengelola"
                : pathname.startsWith(path);

            return (
              <button
                key={path}
                onClick={() => router.push(path)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-[#EFF6FF] text-[#1447E6] font-semibold"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                }`}
              >
                <Icon size={15} />
                {label}
              </button>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3 shrink-0">

          {/* Notif bell */}
          <button className="relative text-gray-500 hover:text-gray-800 transition-colors p-1">
            <FiBell size={20} />
            {NOTIF_COUNT > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold leading-none">
                {NOTIF_COUNT}
              </span>
            )}
          </button>

          {/* Email */}
          <span className="text-sm text-gray-500 hidden md:block">
            {USER_EMAIL}
          </span>

          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-[#1447E6] flex items-center justify-center text-white text-xs font-bold">
            {USER_EMAIL[0].toUpperCase()}
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            title="Logout"
            className="text-gray-400 hover:text-red-500 transition-colors p-1"
          >
            <FiLogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}