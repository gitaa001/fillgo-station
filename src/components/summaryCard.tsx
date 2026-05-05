import { IconType } from "react-icons";

type Props = {
  title: string;
  value: number;
  color: string;
  icon?: IconType;
};

export default function SummaryCard({ title, value, color, icon: Icon }: Props) {
  return (
    <div className={`flex-1 rounded-xl p-4 text-white ${color} flex flex-col`}>
      {Icon && (
        <div className="mb-3 flex">
          <Icon size={24} color="white" />
        </div>
      )}

      <h2 className="text-2xl font-bold">{value}</h2>
      <p className="text-sm">{title}</p>
    </div>
  );
}