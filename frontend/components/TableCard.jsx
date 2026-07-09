import React from "react";
import { useState } from "react";
import {
  MdTableRestaurant,
  MdQrCode,
  MdEdit,
  MdDelete,
} from "react-icons/md";
import { FaFileInvoice } from "react-icons/fa";
import { IoReceiptSharp } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import { IoOptions } from "react-icons/io5";
import QrModel from"./QrModel"
const TableCard = ({tableData}) => {
  console.log(tableData.qr)
  const [openQR, setOpenQR] = useState(false);
  return (
    <div className="w-[250px] h-[250px] rounded-2xl bg-sky-50 border-1 border-gray-300 shadow-lg hover:shadow-2xl transition-all duration-300 p-5 flex flex-col m-4 justify-between">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <MdTableRestaurant className="text-2xl text-[#d2873a]" />
          <h2 className="text-xl font-bold text-gray-800">
            Table {tableData.tableNumber}
          </h2>
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${tableData.status === "Available" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {tableData.status}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-2 text-sm text-gray-600">
        <p>👥 Capacity : {tableData.capacity}</p>
    
        <p className="flex flex-row gap-1"> <FaLocationDot className="text-lg text-blue-500" /> Location : {tableData.location}</p>
        <p className="flex flex-row gap-1"> <IoOptions className="text-lg text-gray-500" /> Type : {tableData.type} </p>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-2 gap-2">

        <button className="flex items-center justify-center gap-2 bg-blue-50 text-blue-600 rounded-lg py-2 hover:bg-blue-100 cursor-pointer transition">
          <IoReceiptSharp />
          Order
        </button>

        <button className="flex items-center justify-center gap-2 bg-green-50 text-green-600 rounded-lg py-2 hover:bg-green-100 cursor-pointer transition">
          <FaFileInvoice />
          Bill
        </button>

        <button type="button"   onClick={() => setOpenQR(true)} className="flex items-center justify-center gap-2 bg-orange-50 text-orange-600 rounded-lg py-2 hover:bg-orange-100 cursor-pointer transition">
          <MdQrCode />
          QR
        </button>

        {openQR && (
  <QrModel
    qr={tableData.qr}
    tableNumber={tableData.tableNumber}
    onClose={() => setOpenQR(false)}
  />
)}

        <div className="flex gap-2">
          <button className="flex-1 flex justify-center items-center bg-gray-100 rounded-lg py-2 hover:bg-gray-200 cursor-pointer transition">
            <MdEdit />
          </button>

          <button className="flex-1 flex justify-center items-center bg-red-100 text-red-600 rounded-lg py-2 hover:bg-red-200 cursor-pointer transition">
            <MdDelete />
          </button>
        </div>

      </div>

    </div>
  );
};

export default TableCard;