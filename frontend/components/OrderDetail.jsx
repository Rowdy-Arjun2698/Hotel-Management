import { useState } from "react";
import axios from "axios";
import {
  Check,
  X,
  UtensilsCrossed,
  ClipboardList,
  ArrowRight,
} from "lucide-react";
import ItemStatusDropdown from "./ItemStatusDropdown";

const statusStyles = {
  Preparing: "bg-orange-50 text-orange-600",
  Ready: "bg-green-50 text-green-600",
  Served: "bg-blue-50 text-blue-600",
  Cancelled: "bg-red-50 text-red-600",
  Active: "bg-gray-100 text-gray-500",
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

// Maps the API's foodType string ("Veg" | "Egg" | "Non-Veg") to the
// FoodTypeMark's internal type key. Same mapping used in DishCard.
const normalizeFoodType = (foodType) => {
  const value = (foodType || "").toLowerCase();
  if (value === "veg") return "veg";
  if (value === "egg") return "egg";
  if (value === "non-veg" || value === "nonveg") return "nonveg";
  return "all";
};

// Copied directly from DishCard so both components render identical marks.
const FoodTypeMark = ({ type, dim = false }) => {
  if (type === "all") return null;

  const border = {
    veg: "border-emerald-600",
    egg: "border-amber-600",
    nonveg: "border-red-700",
  };
  const dot = {
    veg: "bg-emerald-600 rounded-full",
    egg: "bg-amber-500 rounded-full",
    nonveg: "bg-red-700",
  };

  return (
    <span
      className={`flex h-3 w-3 items-center justify-center rounded-[3px] border-[1.5px] ${
        border[type]
      } ${dim ? "opacity-50" : ""}`}
    >
      <span
        className={`h-1.5 w-1.5 ${dot[type]}`}
        style={
          type === "nonveg"
            ? { clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }
            : {}
        }
      />
    </span>
  );
};

// REMOVED: getOrderStatus() — status now comes straight from the backend
// via displayOrder.orderStatus, so no frontend derivation is needed.

const OrderDetail = ({ order }) => {
  const [localOrder, setLocalOrder] = useState(order);

  // Keep localOrder in sync whenever a different order is selected
  if (order && localOrder?._id !== order._id) {
    setLocalOrder(order);
  }

  async function updateItemStatus(itemIndex, newStatus) {
    // optimistic update — items have no _id, so we update by index
    setLocalOrder((prev) => ({
      ...prev,
      items: prev.items.map((it, idx) =>
        idx === itemIndex ? { ...it, status: newStatus } : it
      ),
    }));

    try {
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/hotelOrders/update_item_status/${order._id}/${itemIndex}`,
        { status: newStatus },
        { withCredentials: true }
      );
    } catch (err) {
      console.log(err);
      setLocalOrder(order); // revert on failure
    }
  }

  async function updateOrderStatus(newStatus) {
    try {
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/hotelOrders/update_status/${order._id}`,
        { status: newStatus },
        { withCredentials: true }
      );
      // Keep localOrder.orderStatus in sync so the badge updates immediately
      // without waiting for the parent to refetch/re-pass the order prop.
      setLocalOrder((prev) => ({ ...prev, orderStatus: newStatus }));
    } catch (err) {
      console.log(err);
    }
  }

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

  // Use the backend-provided orderStatus directly instead of deriving it.
  const status = displayOrder.orderStatus;

  const tableNumber = displayOrder.tableId?.tableNumber ?? "—";
  const tableLocation = displayOrder.tableId?.location;
  const createdAt = displayOrder.createdAt
    ? new Date(displayOrder.createdAt).toLocaleString()
    : "";

  // Button enable/disable logic based on item statuses:
  // - "Mark as Ready" is only allowed once every item is Ready or Served
  //   (i.e. nothing is still Preparing/Cancelled/etc.)
  // - "Mark as Served" is only allowed once every item is Served.
  const items = displayOrder.items || [];
  const canMarkReady =
    items.length > 0 &&
    items.every((it) => it.status === "Ready" || it.status === "Served");
  const canMarkServed =
    items.length > 0 && items.every((it) => it.status === "Served");

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
            {items.map((item, idx) => (
              <div
                key={idx}
                className="grid grid-cols-[1fr_60px_120px] items-center gap-4 rounded-lg px-2 py-2.5 transition-colors hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 flex-none items-center justify-center overflow-hidden rounded-lg bg-orange-50 text-orange-400">
                    {item.menuId?.image ? (
                      <img
                        src={`http://localhost:3000${item.menuId.image}`}
                        alt={item.menuId?.dishName || "Item"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <UtensilsCrossed size={16} />
                    )}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <FoodTypeMark type={normalizeFoodType(item.menuId?.foodType)} />
                      <p className="truncate text-[15px] font-medium text-gray-900">
                        {item.menuId?.dishName || "Item"}
                      </p>
                    </div>
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
        <div className="mt-6 border-t border-gray-200 pt-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              onClick={() => canMarkReady && updateOrderStatus("Ready")}
              disabled={!canMarkReady}
              // Disabled styling: reduced opacity + cursor-not-allowed,
              // and hover/active effects are suppressed via disabled: variants
              // so the button doesn't look interactive when it can't be used.
              className={`group flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 py-3 text-sm font-semibold text-white shadow-sm shadow-green-600/20 transition-all duration-150 hover:bg-green-700 hover:shadow-md hover:shadow-green-600/25 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-green-600 disabled:hover:shadow-sm disabled:active:scale-100`}
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
                <Check size={12} strokeWidth={3} />
              </span>
              Mark as Ready
              <ArrowRight
                size={14}
                className="ml-0.5 opacity-0 transition-all duration-150 group-hover:translate-x-0.5 group-hover:opacity-100"
              />
            </button>

            <button
              onClick={() => canMarkServed && updateOrderStatus("Served")}
              disabled={!canMarkServed}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl border border-orange-200 bg-orange-50 py-3 text-sm font-semibold text-orange-600 transition-all duration-150 hover:border-orange-300 hover:bg-orange-100 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-orange-200 disabled:hover:bg-orange-50 disabled:active:scale-100`}
            >
              <UtensilsCrossed size={15} />
              Mark as Served
            </button>
          </div>

          <div className="mt-3 flex justify-end">
            <button
              onClick={() => updateOrderStatus("Cancelled")}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-gray-400 transition-colors duration-150 hover:bg-red-50 hover:text-red-600"
            >
              <X size={13} />
              Cancel Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;