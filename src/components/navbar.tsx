"use client";

import { usePathname, useRouter } from "next/navigation";
import { FaHome, FaMap, FaBell } from "react-icons/fa";
import { hasNotifications } from "@/lib/notifications";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    {
      label: "Beranda",
      icon: FaHome,
      path: "/",
      hasBadge: false,
    },
    {
      label: "Peta",
      icon: FaMap,
      path: "/map",
      hasBadge: false,
    },
    {
      label: "Notifikasi",
      icon: FaBell,
      path: "/notifications",
      hasBadge: hasNotifications,
    },
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
            <span className="relative">
              <Icon size={22} />

              {item.hasBadge && (
                <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
              )}
            </span>

            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
