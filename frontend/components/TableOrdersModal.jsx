import React, { useEffect, useState } from "react";
import axios from "axios";
import { ClipboardList, X, UtensilsCrossed } from "lucide-react";
import { socket } from "../src/socket"; // your socket instance

const statusStyles = {
  pending: "bg-amber-100 text-amber-700",
  preparing: "bg-amber-200 text-amber-800",
  ready: "bg-amber-300 text-amber-900",
  served: "bg-amber-50 text-amber-600",
  default: "bg-amber-100 text-amber-700",
};

const getStatusClass = (status) =>
  statusStyles[status?.toLowerCase()] || statusStyles.default;

const TableOrdersModal = ({ tableId, tableNumber, onClose }) => {
  const [orders, setOrders] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/table/getor/${tableId}`,
        {
            withCredentials: true,
        }
      );
      console.log("Fetched orders:", res.data.order);

      setOrders(res.data.order || null);
     
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchOrders();

    socket.emit("joinTable", tableId);

    socket.on("ordersUpdated", fetchOrders);

    return () => {
      socket.off("ordersUpdated", fetchOrders);
    };
  }, [tableId]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 [animation:dishFadeIn_0.15s_ease-out]"
    >
      <style>{`
        @keyframes dishFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes dishSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[560px] max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl p-8 border-2 border-amber-100 [animation:dishSlideUp_0.2s_ease-out]"
      >
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-amber-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              Table {tableNumber} Orders
            </h1>
          </div>

          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-xs font-semibold">
            <UtensilsCrossed size={12} />
            Live
          </span>
        </div>
        <p className="text-sm text-gray-400 mb-6 ml-[52px]">
          Track active orders for this table in real time
        </p>

        {!orders ? (
  <div className="w-full h-36 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center gap-1.5 text-gray-400">
    <ClipboardList size={22} />
    <span className="text-sm">No active orders</span>
  </div>
) : (
  <div className="space-y-4">
    <div
      className="border border-gray-200 rounded-2xl p-4 transition-all duration-150 hover:border-amber-200 hover:bg-amber-50/30"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-800">
          Order #{orders._id.slice(-5)}
        </h3>

        <span className="text-sm font-semibold text-amber-600">
          ₹{orders.totalAmount}
        </span>
      </div>

      <div className="space-y-3">
        {orders.items.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between border-b border-gray-100 pb-2"
          >
            <div className="flex items-center gap-3">
              <img
                src={`http://localhost:3000${item.menuId.image}`}
                alt={item.menuId.dishName}
                className="w-12 h-12 rounded-lg object-cover"
              />

              <div>
                <p className="font-medium text-gray-800">
                  {item.menuId.dishName}
                </p>

                <p className="text-sm text-gray-500">
                  {item.variantName} • Qty {item.quantity}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="font-semibold">
                ₹{item.finalprice}
              </p>

              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusClass(
                  item.status
                )}`}
              >
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)}

        <div className="flex justify-end mt-8">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95 transition-all duration-150 cursor-pointer font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TableOrdersModal;