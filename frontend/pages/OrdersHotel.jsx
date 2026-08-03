import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bell, ChevronDown } from "lucide-react";
import TablesPanel from "../components/TablesPanel";
import OrderDetail from "../components/OrderDetail";

const STATUS_FILTERS = ["All Status", "Preparing", "Ready", "Active", "Cancelled"];

// An order counts as "Preparing" if any of its items are still Preparing.
// (Change to .every(...) instead of .some(...) if you want ALL items
// to be Preparing before it shows up.)
const isPreparing = (order) =>
  Array.isArray(order.items) && order.items.some((i) => i.status === "Preparing");

const OrdersHotel = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [filterOpen, setFilterOpen] = useState(false);

  async function fetchActiveTables() {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/hotelOrders/active_tables`,
        { withCredentials: true }
      );
      if (response.data.success) {
        // backend returns orders, each with a nested tableId object
        // and its own items[] (each item has its own status)
        console.log("Fetched active tables:", response.data.orders);
        setOrders(response.data.orders || response.data.data);
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchActiveTables();
  }, []);

  // Panel is hard-locked to orders that are currently Preparing
  const preparingOrders = orders.filter(isPreparing);

  const filteredOrders =
    statusFilter === "All Status" || statusFilter === "Preparing"
      ? preparingOrders
      : []; // any other filter has nothing to show, since panel = Preparing only

  const selectedOrder = orders.find((o) => o._id === selectedOrderId);

  console.log("orders", orders);
console.log("preparingOrders", preparingOrders);
console.log("filteredOrders", filteredOrders);

  return (
    <div className="min-h-full w-full bg-gray-100 px-8 py-8">
      {/* Page header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="mt-1 text-sm text-gray-500">
            Live orders from all tables
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition hover:bg-gray-50">
            <Bell size={18} />
            {preparingOrders.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-semibold text-white">
                {preparingOrders.length}
              </span>
            )}
          </button>

          <div className="relative">
            <button
              onClick={() => setFilterOpen((o) => !o)}
              className="flex h-10 items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
            >
              {statusFilter}
              <ChevronDown
                size={16}
                className={`text-gray-400 transition-transform duration-200 ${
                  filterOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {filterOpen && (
              <ul className="absolute right-0 z-20 mt-2 w-40 space-y-0.5 rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg shadow-gray-900/5">
                {STATUS_FILTERS.map((s) => (
                  <li
                    key={s}
                    onClick={() => {
                      setStatusFilter(s);
                      setFilterOpen(false);
                    }}
                    className={`cursor-pointer rounded-lg px-3 py-2 text-sm transition-colors ${
                      statusFilter === s
                        ? "bg-orange-50 font-medium text-orange-600"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
        <TablesPanel
  tables={filteredOrders}   // ← array of order objects, matches what this file expects
  selectedId={selectedOrderId}
  onSelect={(order) => setSelectedOrderId(order._id)}
/>

        <OrderDetail order={selectedOrder} />
      </div>
    </div>
  );
};

export default OrdersHotel;