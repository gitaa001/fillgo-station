"use client";

import { usePathname, useRouter } from "next/navigation";
import { FaHome, FaMap, FaBell } from "react-icons/fa";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { label: "Beranda", icon: FaHome, path: "/" },
    { label:    "Peta", icon: FaMap, path: "/map" },
    { label: "Notif", icon: FaBell, path: "/notifications" },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 shadow-md">
      {navItems.map((item) => {
        const isActive = pathname === item.path;
        const Icon = item.icon;

        return (
          <button
            key={item.path}
            onClick={() => router.push(item.path)}
            className={`flex flex-col items-center text-xs ${
              isActive ? "text-blue-600" : "text-gray-400"
            }`}
          >
            <Icon size={22} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}