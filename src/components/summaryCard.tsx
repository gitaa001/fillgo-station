type Props = {
  title: string;
  value: number;
  color: string;
};

export default function SummaryCard({ title, value, color }: Props) {
  return (
    <div className={`flex-1 rounded-xl p-4 text-white ${color}`}>
      <h2 className="text-2xl font-bold">{value}</h2>
      <p className="text-sm">{title}</p>
    </div>
  );
}