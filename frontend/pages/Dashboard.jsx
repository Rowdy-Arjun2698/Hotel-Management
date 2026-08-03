import { useState } from "react";
import {
  Wallet,
  ShoppingBag,
  Table2,
  Clock3,
  Timer,
  CheckCircle2,
  XCircle,
  Users,
  Calendar,
  Download,
} from "lucide-react";
import StatCard from "../components/StatCard";
import RevenueChart from "../components/RevenueChart";
import TopSellingDishes from "../components/TopSellingDishes";
import RecentOrders from "../components/RecentOrders";

const Dashboard = () => {
  const [dateLabel] = useState("03 Aug 2026");

  return (
    <div className="min-h-full w-full bg-gray-100 px-8 py-8">
      {/* Page header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Overview of your restaurant business
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex h-10 items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50">
            <Calendar size={15} className="text-gray-400" />
            {dateLabel}
          </button>

          <button className="flex h-10 items-center gap-2 rounded-lg bg-orange-500 px-4 text-sm font-semibold text-white shadow-sm shadow-orange-500/20 transition-all duration-150 hover:bg-orange-600 hover:shadow-md active:scale-[0.98]">
            <Download size={15} />
            Download Report
          </button>
        </div>
      </div>

      {/* Top stat row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Wallet}
          label="Today's Revenue"
          value="₹12,540"
          changeType="up"
          changeLabel="12.9% from yesterday"
        />
        <StatCard
          icon={ShoppingBag}
          label="Today's Orders"
          value="126"
          changeType="up"
          changeLabel="8.2% from yesterday"
        />
        <StatCard
          icon={Table2}
          label="Active Tables"
          value="14 / 20"
          changeType={null}
          changeLabel="70% Occupied"
        />
        <StatCard
          icon={Clock3}
          label="Pending Orders"
          value="7"
          changeType={null}
          changeLabel="Preparing"
        />
      </div>

      {/* Charts row */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[1.6fr_1fr_1fr]">
        <RevenueChart />
        <TopSellingDishes />
        <RecentOrders />
      </div>

      {/* Bottom stat row */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Timer}
          label="Avg. Preparation Time"
          value="13 min"
          changeType="up"
          changeLabel="2 min from yesterday"
        />
        <StatCard
          icon={CheckCircle2}
          label="Completed Orders"
          value="119"
          changeType="up"
          changeLabel="9.8% from yesterday"
        />
        <StatCard
          icon={XCircle}
          label="Cancelled Orders"
          value="2"
          valueClassName="text-red-500"
          changeType="down"
          changeLabel="-2 from yesterday"
        />
        <StatCard
          icon={Users}
          label="Total Customers"
          value="98"
          changeType="up"
          changeLabel="15.0% from yesterday"
        />
      </div>
    </div>
  );
};

export default Dashboard;