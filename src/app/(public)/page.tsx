import SummaryCard from "@/components/summaryCard";
import DispenserCard from "@/components/dispenserCard";
import BottomNavbar from "@/components/navbar";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaListUl,
} from "react-icons/fa";

export default function Home() {
  return (
    <div className="flex justify-center bg-[#EFF6FF] min-h-screen">
      {/* Mobile Container */}
      <div className="w-full max-w-sm bg-white min-h-screen rounded-3xl outline outline-gray-300 relative overflow-hidden">

        {/* CONTENT */}
        <div className="p-4 py-10 space-y-4 pb-20">

          {/* Banner */}
          <div
            className="text-white p-8 rounded-xl flex items-center justify-between relative overflow-hidden"
            style={{ minHeight: "80px", backgroundColor: "#1447E6" }}
          >
            <div>
              <h1 className="text-xl font-bold">Selamat Datang!</h1>
              <p className="text-sm">Temukan dispenser terdekat</p>
            </div>

            <img
              src="/Roga.png"
              alt="Logo"
              className="object-contain absolute right-4 bottom-0"
              style={{ width: "100px", height: "70px" }}
            />
          </div>

          {/* Summary */}
          <div className="flex gap-2">
            <SummaryCard
              title="Tersedia"
              value={3}
              color="bg-green-500"
              icon={FaCheckCircle}
            />

            <SummaryCard
              title="Hampir Habis"
              value={3}
              color="bg-yellow-500"
              icon={FaExclamationTriangle}
            />

            <SummaryCard
              title="Total"
              value={6}
              color="bg-[#1447E6]"
              icon={FaListUl}
            />
          </div>

          {/* Dispenser */}
          <h2 className="mt-6 text-black">Dispenser Terdekat</h2>

          <DispenserCard
            name="Dispenser Al Wasath"
            location="Gedung A ITB Jatinangor"
            distance="~2m dari lokasi Anda"
            waterLevel={92}
            status="Tersedia"
            ph={7.1}
            turbidity={0.6}
            temperature={24}
          />

          <DispenserCard
            name="Dispenser Gedung A Lt.1"
            location="Gedung A - Lantai 1"
            distance="~93m dari lokasi Anda"
            waterLevel={85}
            status="Tersedia"
            ph={7.2}
            turbidity={0.5}
            temperature={24}
          />
        </div>

        {/* NAVBAR */}
        <BottomNavbar />
      </div>
    </div>
  );
}