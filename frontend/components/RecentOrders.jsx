import { UtensilsCrossed } from "lucide-react";

const DEFAULT_ORDERS = [
  { table: 2, timeAgo: "2 mins ago", amount: 450 },
  { table: 5, timeAgo: "6 mins ago", amount: 860 },
  { table: 11, timeAgo: "6 mins ago", amount: 620 },
  { table: 3, timeAgo: "12 mins ago", amount: 320 },
];

const RecentOrders = ({ orders = DEFAULT_ORDERS, onViewAll }) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="mb-3 text-[15px] font-semibold text-gray-900">
        Recent Orders
      </h3>

      <div className="space-y-1">
        {orders.map((order, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between rounded-lg px-1 py-2 transition-colors duration-150 hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-orange-50 text-orange-500">
                <UtensilsCrossed size={14} />
              </span>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Table {order.table}
                </p>
                <p className="text-xs text-gray-400">{order.timeAgo}</p>
              </div>
            </div>
            <span className="text-sm font-semibold text-gray-900">
              ₹{order.amount}
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={onViewAll}
        className="mt-3 text-xs font-semibold text-orange-500 transition-colors hover:text-orange-600"
      >
        View All
      </button>
    </div>
  );
};

export default RecentOrders;