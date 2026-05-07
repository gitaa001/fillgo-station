"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Topbar from "@/components/pengelola/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const isAuth = localStorage.getItem("pengelola_auth");
    if (!isAuth) {
      router.replace("/pengelola/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-[#EFF6FF]">
      <Topbar />
      <main className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}