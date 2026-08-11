import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CustomerContext } from "../context/CustomerContext";
import Loader from "../components/Loader";
import PendingCart from "../components/PendingCart";

const STATUS_STYLES = {
  Placed: "bg-blue-50 text-blue-600",
  Preparing: "bg-amber-50 text-amber-600",
  Ready: "bg-purple-50 text-purple-600",
  Served: "bg-emerald-50 text-emerald-600",
  Cancelled: "bg-red-50 text-red-600",
};

const STATUS_LABELS = {
  Placed: "Placed",
  Preparing: "Preparing",
  Ready: "Ready",
  Served: "Served",
  Cancelled: "Cancelled",
};

const currency = (n) => `₹${Number(n || 0).toFixed(2)}`;

const Orders = () => {
  const url = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const { hotel, table, session, items } = useContext(CustomerContext);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [order, setOrder] = useState(null);

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`${url}/api/customer/orders`, {
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
    fetchOrder();
  }, []);

  if (loading) {
    return <Loader message="Fetching your order" />;
  }

  const hasOrder = order && order.items.length > 0;

  return (
    <div className="min-h-full bg-slate-50 pb-6">
      {/* Header */}
      <div className="px-5 pt-5 pb-4">
        <h1 className="text-lg font-semibold text-slate-800">Your order</h1>
        <p className="text-sm text-slate-400 mt-0.5">
          {hotel?.hotelName ? `${hotel.hotelName} · ` : ""}
          {table?.tableNumber ? `Table ${table.tableNumber}` : "Table"}
        </p>

        {order && (
          <span
            className={`mt-3 inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full ${
              STATUS_STYLES[order.orderStatus] || "bg-slate-100 text-slate-500"
            }`}
          >
            Order Status: {STATUS_LABELS[order.orderStatus] || order.orderStatus}
          </span>
        )}
      </div>

      {error && (
        <div className="mx-5 mb-3 rounded-xl bg-red-50 border border-red-100 px-4 py-2.5 text-sm text-red-500">
          {error}
        </div>
      )}

      <div className="px-5">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
          {hasOrder ? "Placed orders" : "No items ordered yet"}
        </h2>

        {hasOrder ? (
          <div className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden mb-4">
            <div className="divide-y divide-slate-100">
              {order.items.map((item, index) => (
                <div
                  key={item.menuId._id + index}
                  className="flex items-start justify-between gap-3 px-4 py-3"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-1.5">
                      <p className="text-sm font-medium text-slate-800">
                        {item.menuId?.dishName || "Dish Name"}
                      </p>
                      <p className="text-sm text-slate-500">
                        {item.variantName}
                        <span className="text-slate-400"> · Qty {item.quantity}</span>
                      </p>
                    </div>
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full inline-block mt-1.5 ${
                        STATUS_STYLES[item.status] || "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {STATUS_LABELS[item.status] || item.status}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-slate-700 whitespace-nowrap">
                    {currency(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-t border-slate-100">
              <p className="text-sm text-slate-500">Placed so far</p>
              <p className="text-sm font-semibold text-slate-800">
                {currency(order.totalAmount)}
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-white border border-slate-100 shadow-sm px-4 py-8 text-center mb-4">
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
      </div>

      <PendingCart onOrderConfirmed={fetchOrder} />
    </div>
  );
};

export default Orders;