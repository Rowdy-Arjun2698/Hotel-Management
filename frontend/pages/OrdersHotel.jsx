import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bell, ChevronDown } from "lucide-react";
import TablesPanel from "../components/TablesPanel";
import OrderDetail from "../components/OrderDetail";

const STATUS_FILTERS = ["All Status", "Preparing", "Ready", "Active", "Cancelled"];

const OrdersHotel = () => {
  const [tables, setTables] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [filterOpen, setFilterOpen] = useState(false);

  async function fetchActiveTables() {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/orders/active_tables",
        { withCredentials: true }
      );
      if (response.data.success) {
        // backend should already return only tables with an active order,
        // sorted by order creation time (oldest/first order → top)
        setTables(response.data.data);
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchActiveTables();
  }, []);

  const filteredTables =
    statusFilter === "All Status"
      ? tables
      : tables.filter((t) => t.status === statusFilter);

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
            {tables.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-semibold text-white">
                {tables.length}
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
          tables={filteredTables}
          selectedId={selectedOrderId}
          onSelect={(table) => setSelectedOrderId(table.orderId)}
        />

        <OrderDetail orderId={selectedOrderId} />
      </div>
    </div>
  );
};

export default OrdersHotel;