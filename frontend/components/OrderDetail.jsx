import { useState, useEffect } from "react";
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

const TIMELINE_STEPS = ["Order Placed", "In Kitchen", "Ready", "Served", "Completed"];

function OrderTimeline({ statusHistory = [] }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      {TIMELINE_STEPS.map((step, idx) => {
        const entry = statusHistory[idx];
        const isDone = !!entry;
        const isLast = idx === TIMELINE_STEPS.length - 1;

        return (
          <div key={step} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={`flex h-5 w-5 flex-none items-center justify-center rounded-full ${
                  isDone ? "bg-green-500" : "bg-gray-200"
                }`}
              >
                {isDone && <Check size={12} className="text-white" />}
              </span>
              {!isLast && (
                <span
                  className={`w-px flex-1 ${isDone ? "bg-green-300" : "bg-gray-200"}`}
                  style={{ minHeight: "28px" }}
                />
              )}
            </div>

            <div className={isLast ? "" : "pb-6"}>
              <p className={`text-sm font-medium ${isDone ? "text-gray-900" : "text-gray-400"}`}>
                {step}
              </p>
              <p className="text-xs text-gray-400">{entry || "—"}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const OrderDetail = ({ orderId }) => {
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | error | success

  async function fetchOrder() {
    if (!orderId) return;
    setStatus("loading");
    try {
      const response = await axios.get(
        `http://localhost:3000/api/orders/get_order/${orderId}`,
        { withCredentials: true }
      );
      if (response.data.success) {
        setOrder(response.data.data);
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.log(err);
      setStatus("error");
    }
  }

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  async function updateItemStatus(itemId, newStatus) {
    // optimistic update
    setOrder((prev) => ({
      ...prev,
      items: prev.items.map((it) =>
        it._id === itemId ? { ...it, status: newStatus } : it
      ),
    }));

    try {
      await axios.patch(
        `http://localhost:3000/api/orders/update_item_status/${orderId}/${itemId}`,
        { status: newStatus },
        { withCredentials: true }
      );
    } catch (err) {
      console.log(err);
      fetchOrder(); // revert on failure
    }
  }

  async function updateOrderStatus(newStatus) {
    try {
      await axios.patch(
        `http://localhost:3000/api/orders/update_status/${orderId}`,
        { status: newStatus },
        { withCredentials: true }
      );
      fetchOrder();
    } catch (err) {
      console.log(err);
    }
  }

  if (!orderId) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 bg-white py-24 text-center">
        <ClipboardList size={28} className="text-gray-300" />
        <p className="text-sm font-medium text-gray-500">
          Select a table to view its order
        </p>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="h-6 w-32 animate-pulse rounded-md bg-gray-200" />
        <div className="mt-4 space-y-3">
          <div className="h-14 animate-pulse rounded-lg bg-gray-100" />
          <div className="h-14 animate-pulse rounded-lg bg-gray-100" />
          <div className="h-14 animate-pulse rounded-lg bg-gray-100" />
        </div>
      </div>
    );
  }

  if (status === "error" || !order) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white py-16 text-center shadow-sm">
        <p className="text-sm font-medium text-gray-500">
          Couldn't load this order
        </p>
        <button
          onClick={fetchOrder}
          className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_260px]">
      {/* Order card */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-1 flex items-center gap-3">
          <h2 className="text-xl font-bold text-gray-900">
            Table {order.tableNumber}
          </h2>
          <StatusBadge status={order.status} />
        </div>
        <p className="mb-5 text-sm text-gray-500">
          Order ID: {order.orderCode} &nbsp;•&nbsp; {order.time}
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
            {order.items.map((item) => (
              <div
                key={item._id}
                className="grid grid-cols-[1fr_60px_120px] items-center gap-4 rounded-lg px-2 py-2.5 transition-colors hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-orange-50 text-orange-400">
                    <UtensilsCrossed size={16} />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[15px] font-medium text-gray-900">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500">{item.variant}</p>
                  </div>
                </div>

                <span className="text-sm text-gray-700">{item.qty}</span>

                <ItemStatusDropdown
                  value={item.status}
                  onChange={(newStatus) => updateItemStatus(item._id, newStatus)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        {order.notes?.length > 0 && (
          <div className="mt-5 border-t border-gray-200 pt-5">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
              <ClipboardList size={16} className="text-gray-400" />
              Order Notes
            </div>
            <ul className="space-y-1 pl-1">
              {order.notes.map((note, idx) => (
                <li key={idx} className="text-sm text-gray-600">
                  • {note}
                </li>
              ))}
            </ul>
          </div>
        )}

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

      <OrderTimeline statusHistory={order.statusHistory} />
    </div>
  );
};

export default OrderDetail;