import { useState } from "react";
import axios from "axios";
import {
  Check,
  X,
  UtensilsCrossed,
  ClipboardList,
} from "lucide-react";
import ItemStatusDropdown from "./ItemStatusDropdown";

const statusStyles = {
  Preparing: "bg-orange-50 text-orange-600",
  Ready: "bg-green-50 text-green-600",
  Served: "bg-blue-50 text-blue-600",
  Cancelled: "bg-red-50 text-red-600",
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

// No top-level order.status in the backend response, so derive one
// from the items — same rule as TablesPanel (any item Preparing → order shows Preparing).
function getOrderStatus(order) {
  if (!Array.isArray(order.items) || order.items.length === 0) return "Active";
  if (order.items.some((i) => i.status === "Preparing")) return "Preparing";
  if (order.items.every((i) => i.status === "Served")) return "Served";
  if (order.items.some((i) => i.status === "Ready")) return "Ready";
  return order.items[0].status || "Active";
}

const OrderDetail = ({ order }) => {
  const [localOrder, setLocalOrder] = useState(order);

  // Keep localOrder in sync whenever a different order is selected
  if (order && localOrder?._id !== order._id) {
    setLocalOrder(order);
  }

  // async function updateItemStatus(itemIndex, newStatus) {
  //   // optimistic update — items have no _id, so we update by index
  //   setLocalOrder((prev) => ({
  //     ...prev,
  //     items: prev.items.map((it, idx) =>
  //       idx === itemIndex ? { ...it, status: newStatus } : it
  //     ),
  //   }));

  //   try {
  //     await axios.patch(
  //       `${import.meta.env.VITE_BACKEND_URL}api/hotelOrders /update_item_status/${order._id}/${itemIndex}`,
  //       { status: newStatus },
  //       { withCredentials: true }
  //     );
  //   } catch (err) {
  //     console.log(err);
  //     setLocalOrder(order); // revert on failure
  //   }
  // }

  // async function updateOrderStatus(newStatus) {
  //   try {
  //     await axios.patch(
  //       `http://localhost:3000/api/orders/update_status/${order._id}`,
  //       { status: newStatus },
  //       { withCredentials: true }
  //     );
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 bg-white py-24 text-center">
        <ClipboardList size={28} className="text-gray-300" />
        <p className="text-sm font-medium text-gray-500">
          Select a table to view its order
        </p>
      </div>
    );
  }

  const displayOrder = localOrder || order;
  const status = getOrderStatus(displayOrder);
  const tableNumber = displayOrder.tableId?.tableNumber ?? "—";
  const tableLocation = displayOrder.tableId?.location;
  const createdAt = displayOrder.createdAt
    ? new Date(displayOrder.createdAt).toLocaleString()
    : "";

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_260px]">
      {/* Order card */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-1 flex items-center gap-3">
          <h2 className="text-xl font-bold text-gray-900">
            Table {tableNumber}
          </h2>
          <StatusBadge status={status} />
        </div>
        <p className="mb-5 text-sm text-gray-500">
          {tableLocation && <>{tableLocation} &nbsp;•&nbsp; </>}
          {createdAt}
        </p>

        <div className="border-t border-gray-200" />

        {/* Items */}
        <div className="mt-4">
          <div className="grid grid-cols-[1fr_60px_120px] gap-4 px-2 pb-2 text-xs font-semibold text-gray-500">
            <span>Item</span>
            <span>Qty</span>
            <span>Status</span>
          </div>

          <div className="space-y-1">
            {displayOrder.items.map((item, idx) => (
              <div
                key={idx}
                className="grid grid-cols-[1fr_60px_120px] items-center gap-4 rounded-lg px-2 py-2.5 transition-colors hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-orange-50 text-orange-400">
                    <UtensilsCrossed size={16} />
                  </span>
                  <div className="min-w-0">
                    {/* No item name in backend response — only menuId (raw id).
                        Falling back to variantName until menu is populated. */}
                    <p className="truncate text-[15px] font-medium text-gray-900">
                      {item.name || item.variantName || "Item"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.variantName} • ₹{item.finalprice ?? item.price}
                    </p>
                  </div>
                </div>

                <span className="text-sm text-gray-700">{item.quantity}</span>

                <ItemStatusDropdown
                  value={item.status}
                  onChange={(newStatus) => updateItemStatus(idx, newStatus)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
          <span className="text-sm font-semibold text-gray-700">Total</span>
          <span className="text-sm font-bold text-gray-900">
            ₹{displayOrder.totalAmount}
          </span>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-wrap gap-3 border-t border-gray-200 pt-5">
          <button
            onClick={() => updateOrderStatus("Ready")}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
          >
            <Check size={16} />
            Mark as Ready
          </button>

          <button
            onClick={() => updateOrderStatus("Served")}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-orange-500 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
          >
            <UtensilsCrossed size={16} />
            Mark as Served
          </button>

          <button
            onClick={() => updateOrderStatus("Cancelled")}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-300 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            <X size={16} />
            Cancel Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;