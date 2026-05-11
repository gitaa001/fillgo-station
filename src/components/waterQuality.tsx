type Props = {
  ph: number;
  turbidity: number;
  temperature: number;
};

export default function WaterQuality({ ph, turbidity, temperature }: Props) {
  // Rule base
  const phStatus = ph >= 6.5 && ph <= 8.5
    ? { color: "text-green-600", icon: "✓", msg: "pH air normal dan aman untuk dikonsumsi" }
    : { color: "text-red-600", icon: "!", msg: "pH air di luar rentang ideal" };

  const turbidityStatus = turbidity > 1800
    ? { color: "text-green-600", icon: "✓", msg: "Air jernih" }
    : turbidity > 1400
    ? { color: "text-yellow-600", icon: "!", msg: "Air agak keruh" }
    : { color: "text-red-600", icon: "!", msg: "Air sangat keruh" };

  const tempStatus = temperature >= 10 && temperature <= 30
    ? { color: "text-green-600", icon: "✓", msg: "Suhu air ideal" }
    : temperature < 10
    ? { color: "text-blue-600", icon: "!", msg: "Suhu terlalu dingin" }
    : { color: "text-red-600", icon: "!", msg: "Suhu terlalu panas" };

  return (
    <div className="mt-3 grid gap-3 text-sm text-gray-500">
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <span className="font-semibold w-24">pH</span>
          <span>{ph}</span>
        </div>
        <div className="text-xs text-gray-500 ml-24">Rentang Ideal: 6.5 - 8.5</div>
        <div className={`ml-24 text-xs flex items-center gap-1 ${phStatus.color}`}>
          <span className="font-bold">{phStatus.icon}</span> {phStatus.msg}
        </div>
      </div>
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <span className="font-semibold w-24">Turbidity</span>
          <span>{turbidity}</span>
        </div>
        <div className="text-xs text-gray-500 ml-24">Ideal: {'>'}1800 (Jernih)</div>
        <div className={`ml-24 text-xs flex items-center gap-1 ${turbidityStatus.color}`}>
          <span className="font-bold">{turbidityStatus.icon}</span> {turbidityStatus.msg}
        </div>
      </div>
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <span className="font-semibold w-24">Temperature</span>
          <span>{temperature}°C</span>
        </div>
        <div className="text-xs text-gray-500 ml-24">Ideal: 10 - 30°C</div>
        <div className={`ml-24 text-xs flex items-center gap-1 ${tempStatus.color}`}>
          <span className="font-bold">{tempStatus.icon}</span> {tempStatus.msg}
        </div>
      </div>
    </div>
  );
}