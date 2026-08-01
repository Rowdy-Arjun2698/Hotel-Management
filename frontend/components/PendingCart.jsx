import React, { useContext, useMemo, useState } from "react";
import axios from "axios";
import { CustomerContext } from "../context/CustomerContext";

const currency = (n) => `₹${Number(n || 0).toFixed(2)}`;

const PendingCart = ({ onOrderConfirmed }) => {
  const url = import.meta.env.VITE_BACKEND_URL;
  const { table, session, items, setitems } = useContext(CustomerContext);

  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  const pendingTotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const removePendingItem = (cartId) => {
    setitems((prev) => prev.filter((i) => i.cartId !== cartId ));
  };

  const handleConfirmOrder = async () => {
    if (!items.length || placing) return;
    setPlacing(true);
    setError("");
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
      // Tell the parent its placed-order list is stale so it can refetch
      onOrderConfirmed?.();
    } catch (err) {
      console.log(err);
      setError("Couldn't place your order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  if (!items.length) return null;

  return (
    <>
      {error && (
        <div className="mx-5 mb-3 rounded-xl bg-red-50 border border-red-100 px-4 py-2.5 text-sm text-red-500">
          {error}
        </div>
      )}

      <div className="px-5">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
          Ordering now
        </h2>
        <div className="rounded-2xl bg-amber-50 border border-amber-100 divide-y divide-amber-100 mb-24">
          {items.map((item) => (
            <div
              key={item.cartId}
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
                  onClick={() => removePendingItem(item.cartId)}
                  className="text-xs text-red-400"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

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
    </>
  );
};

export default PendingCart;