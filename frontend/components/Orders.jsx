import React, { useState, useEffect, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CustomerContext } from "../context/CustomerContext";
import Loader from "../components/Loader";

const STATUS_STYLES = {
  placed: "bg-blue-50 text-blue-600",
  preparing: "bg-amber-50 text-amber-600",
  ready: "bg-purple-50 text-purple-600",
  served: "bg-emerald-50 text-emerald-600",
};

const STATUS_LABELS = {
  placed: "Placed",
  preparing: "Preparing",
  ready: "Ready",
  served: "Served",
};

const currency = (n) => `₹${Number(n || 0).toFixed(2)}`;

const Orders = () => {
  const url = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const { hotel, table, session, items, setitems } = useContext(CustomerContext);

  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [generatingBill, setGeneratingBill] = useState(false);
  const [error, setError] = useState("");

  // The single order document for this session, containing all items
  // confirmed with the kitchen so far: { _id, items: [...], totalAmount }
  const [order, setOrder] = useState(null);

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`${url}/api/customer/order/${session?._id}`, {
        withCredentials: true,
      });
      setOrder(res.data.order || null);
    } catch (err) {
      console.log(err);
      setError("Couldn't load your order right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?._id) {
      fetchOrder();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const pendingTotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const removePendingItem = (menuId) => {
    setitems((prev) => prev.filter((i) => i.menuId !== menuId));
  };

  const handleConfirmOrder = async () => {
    if (!items.length || placing) return;
    setPlacing(true);
    try {
      await axios.post(
        `${url}/api/customer/order/confirm`,
        {
          sessionId: session?._id,
          tableId: table?._id,
          items,
        },
        { withCredentials: true }
      );
      setitems([]);
      fetchOrder();
    } catch (err) {
      console.log(err);
      setError("Couldn't place your order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  const handleGenerateBill = async () => {
    if (generatingBill) return;
    setGeneratingBill(true);
    try {
      const res = await axios.post(
        `${url}/api/customer/bill/generate`,
        { sessionId: session?._id },
        { withCredentials: true }
      );
      navigate(`/bill/${res.data.bill._id}`);
    } catch (err) {
      console.log(err);
      setError("Couldn't generate the bill. Please try again.");
    } finally {
      setGeneratingBill(false);
    }
  };

  if (loading) {
    return <Loader message="Fetching your order" />;
  }

  const hasOrder = order && order.items.length > 0;
  const hasPending = items.length > 0;
  const canGenerateBill = hasOrder && !hasPending;

  return (
    <div className="min-h-full bg-slate-50 pb-6">
      {/* Page heading */}
      <div className="px-5 pt-5 pb-3">
        <h1 className="text-lg font-semibold text-slate-800">Your order</h1>
        <p className="text-sm text-slate-400">
          {hotel?.name ? `${hotel.name} · ` : ""}
          {table?.name ? `Table ${table.name}` : "Table"}
        </p>
      </div>

      {error && (
        <div className="mx-5 mb-3 rounded-xl bg-red-50 border border-red-100 px-4 py-2.5 text-sm text-red-500">
          {error}
        </div>
      )}

      <div className="px-5">
        {/* Placed orders */}
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
          {hasOrder ? "Placed orders" : "No items ordered yet"}
        </h2>

        {hasOrder ? (
          <div className="space-y-2.5 mb-3">
            <div className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
              <div className="divide-y divide-slate-100">
                {order.items.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between px-4 py-2.5"
                  >
                    <div>
                      <p className="text-sm text-slate-700">
                        {item.variantName}{" "}
                        <span className="text-slate-400">
                          · Qty {item.quantity}
                        </span>
                      </p>
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full inline-block mt-1 ${
                          STATUS_STYLES[item.status] || "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {STATUS_LABELS[item.status] || item.status}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-slate-700">
                      {currency(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-white border border-slate-100 shadow-sm px-4 py-6 text-center mb-3">
            <p className="text-sm text-slate-400">
              Add items from the menu to start your order.
            </p>
            <button
              onClick={() => navigate("/menu")}
              className="mt-3 text-sm font-medium text-emerald-600"
            >
              Browse menu
            </button>
          </div>
        )}

        {hasOrder && (
          <div className="flex items-center justify-between px-1 mb-5">
            <p className="text-sm text-slate-400">Placed so far</p>
            <p className="text-sm font-semibold text-slate-700">
              {currency(order.totalAmount)}
            </p>
          </div>
        )}

        {/* Items just added, waiting to be confirmed */}
        {hasPending && (
          <>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
              Ordering now
            </h2>
            <div className="rounded-2xl bg-amber-50 border border-amber-100 divide-y divide-amber-100 mb-24">
              {items.map((item) => (
                <div
                  key={item.menuId}
                  className="flex items-center justify-between px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      {item.dishName}
                    </p>
                    <p className="text-xs text-slate-500">
                      Qty {item.quantity} · {currency(item.price)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-semibold text-slate-700">
                      {currency(item.price * item.quantity)}
                    </p>
                    <button
                      onClick={() => removePendingItem(item.menuId)}
                      className="text-xs text-red-400"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Generate bill, shown once everything placed has nothing pending on top */}
        {canGenerateBill && (
          <button
            onClick={handleGenerateBill}
            disabled={generatingBill}
            className="w-full mb-24 rounded-xl border border-slate-200 bg-white py-3 text-sm font-medium text-slate-700 disabled:opacity-60"
          >
            {generatingBill ? "Generating bill…" : "Generate bill"}
          </button>
        )}
      </div>

      {/* Sticky confirm bar for items being ordered now */}
      {hasPending && (
        <div
          className="fixed bottom-[4.5rem] left-0 right-0 mx-auto max-w-md px-5"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <button
            onClick={handleConfirmOrder}
            disabled={placing}
            className="w-full rounded-2xl bg-slate-900 text-white py-3.5 text-sm font-semibold shadow-lg shadow-slate-900/20 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {placing ? (
              "Placing order…"
            ) : (
              <>
                Confirm & place order
                <span className="opacity-80">· {currency(pendingTotal)}</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default Orders;