import { IconType } from "react-icons";

type Props = {
  title: string;
  value: string | number;
  icon: IconType;
  iconBg: string;
  iconColor: string;
};

export default function StatCard({ title, value, icon: Icon, iconBg, iconColor }: Props) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-500 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg}`}>
        <Icon size={22} color={iconColor} />
      </div>
    </div>
  );
}