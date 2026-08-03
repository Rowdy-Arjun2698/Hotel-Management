import { UtensilsCrossed, ChevronRight } from "lucide-react";

const statusStyles = {
  Preparing: "bg-orange-50 text-orange-600",
  Ready: "bg-green-50 text-green-600",
  Active: "bg-blue-50 text-blue-600",
  Cancelled: "bg-red-50 text-red-600",
};

const tableAccent = {
  Preparing: "bg-orange-50 text-orange-500",
  Ready: "bg-green-50 text-green-600",
  Active: "bg-blue-50 text-blue-500",
  Cancelled: "bg-red-50 text-red-500",
};

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
        statusStyles[status] || "bg-gray-100 text-gray-500"
      }`}
    >
      {status}
    </span>
  );
}

// Since backend orders don't carry a top-level status, derive one
// from the items. If any item is still Preparing, show the order as
// Preparing overall (adjust to .every(...) if you want ALL items done).
function getOrderStatus(order) {
  if (!Array.isArray(order.items) || order.items.length === 0) return "Active";
  if (order.items.some((i) => i.status === "Preparing")) return "Preparing";
  return order.items[0].status || "Active";
}

const TablesPanel = ({ tables, selectedId, onSelect }) => {
  const orders = tables || [];

  return (
    <div className="h-fit rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="mb-2 px-2 text-base font-semibold text-gray-900">
        Tables
      </h3>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center gap-2 px-3 py-10 text-center">
          <UtensilsCrossed size={22} className="text-gray-300" />
          <p className="text-sm text-gray-400">No active orders right now</p>
        </div>
      ) : (
        <div className="space-y-1">
          {orders.map((order) => {
            const status = getOrderStatus(order);
            const itemCount = order.items?.length || 0;
            const tableNumber = order.tableId?.tableNumber ?? "—";

            return (
              <div key={order._id}>
                <button
                  onClick={() => onSelect(order)}
                  className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-3 text-left transition-colors duration-150 ${
                    selectedId === order._id ? "bg-orange-50" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-9 w-9 flex-none items-center justify-center rounded-full ${
                        tableAccent[status] || "bg-gray-100 text-gray-400"
                      }`}
                    >
                      <UtensilsCrossed size={16} />
                    </span>
                    <div>
                      <p className="text-[15px] font-semibold text-gray-900">
                        Table {tableNumber}
                      </p>
                      <p className="text-xs text-gray-500">{itemCount} items</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <StatusBadge status={status} />
                    <ChevronRight size={16} className="text-gray-300" />
                  </div>
                </button>
                <div className="mx-3 border-t border-gray-100" />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TablesPanel;