import { useState, useEffect } from "react";
import axios from "axios";
import {
  X,
  UtensilsCrossed,
  ClipboardList,
  Trash2,
  CheckCheck,
} from "lucide-react";
import ItemStatusDropdown from "./ItemStatusDropdown";

const statusStyles = {
  "In Progress": "bg-orange-50 text-orange-600",
  "No Progress": "bg-gray-100 text-gray-500",
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

const normalizeFoodType = (foodType) => {
  const value = (foodType || "").toLowerCase();
  if (value === "veg") return "veg";
  if (value === "egg") return "egg";
  if (value === "non-veg" || value === "nonveg") return "nonveg";
  return "all";
};

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

function deriveOrderStatus(items) {
  if (!items || items.length === 0) return "No Progress";
  const hasActiveItem = items.some(
    (it) => it.status === "Preparing" || it.status === "Ready"
  );
  return hasActiveItem ? "In Progress" : "No Progress";
}

function CancelConfirmModal({ title, description, onClose, onConfirm }) {
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const trimmedReason = reason.trim();

  async function handleConfirm() {
    if (!trimmedReason) return;
    setSubmitting(true);
    try {
      await onConfirm(trimmedReason);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-1 flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 transition-colors duration-150 hover:bg-gray-50 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        </div>
        <p className="mb-4 text-sm text-gray-500">{description}</p>

        <label className="mb-1.5 block text-xs font-semibold text-gray-500">
          Reason for cancellation
        </label>
        <textarea
          autoFocus
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g. Guest changed their mind, out of stock..."
          rows={3}
          className="mb-5 w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-100"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={submitting}
            className="rounded-lg px-3 py-2 text-xs font-medium text-gray-500 transition-colors duration-150 hover:bg-gray-50 disabled:opacity-50"
          >
            Keep item
          </button>
          <button
            onClick={handleConfirm}
            disabled={!trimmedReason || submitting}
            className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition-colors duration-150 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={13} />
            {submitting ? "Cancelling..." : "Confirm cancellation"}
          </button>
        </div>
      </div>
    </div>
  );
}

const OrderDetail = ({ order }) => {
  const [localOrder, setLocalOrder] = useState(order);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [markingAllReady, setMarkingAllReady] = useState(false);

  useEffect(() => {
    setLocalOrder(order);
  }, [order]);

  async function updateItemStatus(itemIndex, newStatus, reason) {
    setLocalOrder((prev) => ({
      ...prev,
      items: prev.items.map((it, idx) =>
        idx === itemIndex
          ? {
              ...it,
              status: newStatus,
              ...(reason ? { cancelReason: reason } : {}),
            }
          : it
      ),
    }));

    try {
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/hotelOrders/update_item_status/${order._id}/${itemIndex}`,
        reason ? { status: newStatus, reason } : { status: newStatus },
        { withCredentials: true }
      );
    } catch (err) {
      console.log(err);
      setLocalOrder(order); // revert on failure
    }
  }

  async function cancelOrder(reason) {
    setLocalOrder((prev) => ({
      ...prev,
      items: prev.items.map((it) => ({
        ...it,
        status: "Cancelled",
        cancelReason: reason,
      })),
    }));

    try {
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/hotelOrders/cancel_order/${order._id}`,
        { reason },
        { withCredentials: true }
      );
    } catch (err) {
      console.log(err);
      setLocalOrder(order); // revert on failure
    }
  }

  // Mark every non-cancelled/non-ready item as Ready in one go.
  async function markAllReady() {
    const targetIndexes = (localOrder?.items || [])
      .map((it, idx) => ({ it, idx }))
      .filter(({ it }) => it.status !== "Cancelled" && it.status !== "Ready");

    if (targetIndexes.length === 0) return;

    setMarkingAllReady(true);

    const prevOrder = localOrder;
    setLocalOrder((prev) => ({
      ...prev,
      items: prev.items.map((it) =>
        it.status !== "Cancelled" ? { ...it, status: "Ready" } : it
      ),
    }));

    try {
      await Promise.all(
        targetIndexes.map(({ idx }) =>
          axios.patch(
            `${import.meta.env.VITE_BACKEND_URL}/api/hotelOrders/update_item_status/${order._id}/${idx}`,
            { status: "Ready" },
            { withCredentials: true }
          )
        )
      );
    } catch (err) {
      console.log(err);
      setLocalOrder(prevOrder); // revert all on failure
    } finally {
      setMarkingAllReady(false);
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
  const items = displayOrder.items || [];
  const status = deriveOrderStatus(items);

  const tableNumber = displayOrder.tableId?.tableNumber ?? "—";
  const tableLocation = displayOrder.tableId?.location;
  const createdAt = displayOrder.createdAt
    ? new Date(displayOrder.createdAt).toLocaleString()
    : "";

  const hasMarkableItems = items.some(
    (it) => it.status !== "Cancelled" && it.status !== "Ready"
  );

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
          <div className="grid grid-cols-[1fr_60px_120px_36px] gap-4 px-2 pb-2 text-xs font-semibold text-gray-500">
            <span>Item</span>
            <span>Qty</span>
            <span>Status</span>
            <span />
          </div>

          <div className="space-y-1">
            {items.map((item, idx) => {
              const isCancelled = item.status === "Cancelled";
              return (
                <div
                  key={idx}
                  className="grid grid-cols-[1fr_60px_120px_36px] items-center gap-4 rounded-lg px-2 py-2.5 transition-colors hover:bg-gray-50"
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
                        <p
                          className={`truncate text-[15px] font-medium ${
                            isCancelled
                              ? "text-gray-400 line-through"
                              : "text-gray-900"
                          }`}
                        >
                          {item.menuId?.dishName || "Item"}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500">
                        {item.variantName} • ₹{item.finalprice ?? item.price}
                      </p>
                      {isCancelled && item.cancelReason && (
                        <p className="mt-0.5 text-xs italic text-red-500">
                          {item.cancelReason}
                        </p>
                      )}
                    </div>
                  </div>

                  <span className="text-sm text-gray-700">{item.quantity}</span>

                  {isCancelled ? (
                    <StatusBadge status="No Progress" />
                  ) : (
                    <ItemStatusDropdown
                      value={item.status}
                      onChange={(newStatus) => updateItemStatus(idx, newStatus)}
                      hideCancel
                    />
                  )}

                  {!isCancelled && (
                    <button
                      onClick={() => setCancelTarget({ itemIndex: idx })}
                      title="Cancel this dish"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-300 transition-colors duration-150 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              );
            })}
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
        <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-5">
          <button
            onClick={markAllReady}
            disabled={!hasMarkableItems || markingAllReady}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-600 transition-colors duration-150 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CheckCheck size={13} />
            {markingAllReady ? "Marking..." : "Mark All Ready"}
          </button>

          <button
            onClick={() => setCancelTarget({ itemIndex: "ALL" })}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-gray-400 transition-colors duration-150 hover:bg-red-50 hover:text-red-600"
          >
            <X size={13} />
            Cancel Order
          </button>
        </div>
      </div>

      {cancelTarget && (
        <CancelConfirmModal
          title={
            cancelTarget.itemIndex === "ALL"
              ? "Cancel entire order?"
              : "Cancel this dish?"
          }
          description={
            cancelTarget.itemIndex === "ALL"
              ? "This will cancel every item on Table " + tableNumber + "'s order. This can't be undone."
              : `This will mark "${
                  items[cancelTarget.itemIndex]?.menuId?.dishName || "this item"
                }" as cancelled. This can't be undone.`
          }
          onClose={() => setCancelTarget(null)}
          onConfirm={async (reason) => {
            if (cancelTarget.itemIndex === "ALL") {
              await cancelOrder(reason);
            } else {
              await updateItemStatus(cancelTarget.itemIndex, "Cancelled", reason);
            }
            setCancelTarget(null);
          }}
        />
      )}
    </div>
  );
};

export default OrderDetail;