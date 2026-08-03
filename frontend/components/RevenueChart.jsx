import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const RANGE_OPTIONS = ["This Week", "This Month", "This Year"];

const DEFAULT_DATA = [
  { day: "Mon", value: 9200 },
  { day: "Tue", value: 14500 },
  { day: "Wed", value: 11800 },
  { day: "Thu", value: 19500 },
  { day: "Fri", value: 13200 },
  { day: "Sat", value: 17000 },
  { day: "Sun", value: 20500 },
];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-lg">
      <p className="text-[11px] font-medium text-gray-500">{label}</p>
      <p className="text-sm font-bold text-gray-900">
        ₹{payload[0].value.toLocaleString("en-IN")}
      </p>
    </div>
  );
}

const RevenueChart = ({ data = DEFAULT_DATA }) => {
  const [range, setRange] = useState("This Week");
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-[15px] font-semibold text-gray-900">
          Revenue Overview
        </h3>

        <div className="relative">
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50"
          >
            {range}
            <ChevronDown
              size={13}
              className={`text-gray-400 transition-transform duration-200 ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>

          {open && (
            <ul className="absolute right-0 z-20 mt-2 w-36 space-y-0.5 rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg shadow-gray-900/5">
              {RANGE_OPTIONS.map((opt) => (
                <li
                  key={opt}
                  onClick={() => {
                    setRange(opt);
                    setOpen(false);
                  }}
                  className={`cursor-pointer rounded-lg px-3 py-2 text-xs transition-colors ${
                    range === opt
                      ? "bg-orange-50 font-medium text-orange-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {opt}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 4, left: -12, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f97316" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "#9ca3af" }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              tickFormatter={(v) => `${v / 1000}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#f97316"
              strokeWidth={2.5}
              fill="url(#revenueFill)"
              dot={{ r: 4, fill: "#f97316", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6 }}
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;