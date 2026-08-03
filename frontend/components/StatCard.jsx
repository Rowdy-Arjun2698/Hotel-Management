import { ArrowUpRight, ArrowDownRight } from "lucide-react";

/**
 * changeType: "up" | "down" | undefined
 * changeLabel: e.g. "12.9% from yesterday"
 */
const StatCard = ({ icon: Icon, label, value, changeType, changeLabel, valueClassName = "" }) => {
  const isUp = changeType === "up";
  const isDown = changeType === "down";

  return (
    <div className="group rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium text-gray-500">{label}</p>
        {Icon && (
          <span className="flex h-7 w-7 flex-none items-center justify-center rounded-lg bg-orange-50 text-orange-500 transition-transform duration-200 group-hover:scale-110">
            <Icon size={14} />
          </span>
        )}
      </div>

      <p className={`mt-2 text-2xl font-bold text-gray-900 ${valueClassName}`}>
        {value}
      </p>

      {changeLabel && (
        <div
          className={`mt-1.5 flex items-center gap-1 text-xs font-medium ${
            isUp ? "text-green-600" : isDown ? "text-red-500" : "text-gray-400"
          }`}
        >
          {isUp && <ArrowUpRight size={13} />}
          {isDown && <ArrowDownRight size={13} />}
          <span>{changeLabel}</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;