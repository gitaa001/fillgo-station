import { ReactNode, isValidElement, cloneElement } from "react";


type Props = {
  title: string;
  value: number;
  color: string;
  icon?: ReactNode;
};

export default function SummaryCard({ title, value, color, icon }: Props) {
  return (
    <div className={`flex-1 rounded-xl p-4 text-white ${color} flex flex-col`}>
        {icon && (
          <div className="mb-3 flex">
            {isValidElement(icon)
              ? cloneElement(icon, { size: 24, color: "white" })
              : icon}
          </div>
        )}
      <h2 className="text-2xl font-bold">{value}</h2>
      <p className="text-sm">{title}</p>
    </div>
  );
}