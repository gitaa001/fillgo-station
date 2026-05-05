type Props = {
  ph: number;
  turbidity: number;
  temperature: number;
};

export default function WaterQuality({ ph, turbidity, temperature }: Props) {
  return (
    <div className="mt-3 space-y-2 text-sm">
      <div>pH: {ph}</div>
      <div>Turbidity: {turbidity}</div>
      <div>Temperature: {temperature}°C</div>
    </div>
  );
}