import React from "react";
import { useState } from "react";
import {
  MdTableRestaurant,
  MdQrCode,
  MdEdit,
  MdDelete,
  MdPeople,
  MdAcUnit,
  MdWbSunny,
} from "react-icons/md";
import { FaFileInvoice } from "react-icons/fa";
import { IoReceiptSharp, IoOptions } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import QrModel from "./QrModel";

const typeStyles = {
  AC: {
    icon: <MdAcUnit size={14} />,
    className: "bg-sky-50 text-sky-600",
  },
  "Non-AC": {
    icon: <IoOptions size={14} />,
    className: "bg-gray-100 text-gray-600",
  },
  Outdoor: {
    icon: <MdWbSunny size={14} />,
    className: "bg-amber-50 text-amber-600",
  },
};

function DetailRow({ icon, iconColorClass, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`flex h-8 w-8 flex-none items-center justify-center rounded-full ${iconColorClass}`}
      >
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="truncate text-[14px] font-medium text-gray-900">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

const TableCard = ({
  tableData,
  openDelete,
  setTable,
  settb,
  openEdit,
  Openorder,
  settorder,
}) => {
  const [openQR, setOpenQR] = useState(false);

  const isAvailable = tableData.status;
  const typeStyle = typeStyles[tableData.type] || {
    icon: <IoOptions size={14} />,
    className: "bg-gray-100 text-gray-600",
  };

  const handledel = () => {
    setTable(tableData);
    openDelete();
  };
  const handleEdit = () => {
    settb(tableData);
    openEdit();
  };
  const handleOrder = () => {
    settorder(tableData);
    Openorder();
  };

  return (
    <div className="flex w-[270px] flex-col justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-orange-50 text-orange-500">
            <MdTableRestaurant size={18} />
          </span>
          <h2 className="text-lg font-bold text-gray-900">
            Table {tableData.tableNumber}
          </h2>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            isAvailable
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {isAvailable ? "Available" : "Unavaialble"}
        </span>
      </div>

      <div className="mb-4 border-t border-gray-200" />

      {/* Details */}
      <div className="mb-5 space-y-3">
        <DetailRow
          icon={<MdPeople size={14} />}
          iconColorClass="bg-gray-100 text-gray-600"
          label="Capacity"
          value={tableData.capacity}
        />
        <DetailRow
          icon={<FaLocationDot size={14} />}
          iconColorClass="bg-blue-50 text-blue-500"
          label="Location"
          value={tableData.location}
        />
        <DetailRow
          icon={typeStyle.icon}
          iconColorClass={typeStyle.className}
          label="Type"
          value={tableData.type}
        />
      </div>

      {/* Buttons */}
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleOrder}
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-50 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-100"
          >
            <IoReceiptSharp size={15} />
            Order
          </button>

          <button className="flex items-center justify-center gap-2 rounded-lg bg-green-50 py-2 text-sm font-medium text-green-600 transition hover:bg-green-100">
            <FaFileInvoice size={14} />
            Bill
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setOpenQR(true)}
            className="flex items-center justify-center gap-1.5 rounded-lg bg-orange-50 py-2 text-sm font-medium text-orange-600 transition hover:bg-orange-100"
          >
            <MdQrCode size={16} />
          </button>

          <button
            onClick={handleEdit}
            className="flex items-center justify-center rounded-lg bg-gray-100 py-2 text-gray-700 transition hover:bg-gray-200"
          >
            <MdEdit size={16} />
          </button>

          <button
            onClick={handledel}
            className="flex items-center justify-center rounded-lg bg-red-100 py-2 text-red-600 transition hover:bg-red-200"
          >
            <MdDelete size={16} />
          </button>
        </div>

        {openQR && (
          <QrModel
            qr={tableData.qr}
            tableNumber={tableData.tableNumber}
            onClose={() => setOpenQR(false)}
          />
        )}
      </div>
    </div>
  );
};

export default TableCard;