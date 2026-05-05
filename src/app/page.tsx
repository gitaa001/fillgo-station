import SummaryCard from "@/components/summaryCard";
import DispenserCard from "@/components/dispenserCard";

export default function Home() {
  return (
    <div className="flex justify-center bg-gray-100 min-h-screen">
      <div className="w-full max-w-sm p-4 space-y-4 bg-white">
        {/* Banner */}
        <div className="bg-blue-600 text-white p-4 rounded-xl">
          <h1 className="text-lg font-bold">Selamat Datang!</h1>
          <p className="text-sm">Temukan dispenser terdekat</p>
        </div>

        {/* Summary */}
        <div className="flex gap-2">
          <SummaryCard title="Tersedia" value={3} color="bg-green-500" />
          <SummaryCard title="Hampir Habis" value={3} color="bg-yellow-500" />
          <SummaryCard title="Total" value={6} color="bg-blue-500" />
        </div>

        {/* Dispenser */}
        <h2 className="font-semibold">Dispenser Terdekat</h2>

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
    </div>
  );
}