import React from "react";
import axios from "axios";
import { useState } from "react";

const TableForm = ({ onClose }) => {
   const [formData, setFormData] = useState({
  tableNumber: "",
  capacity: "",
  location: "",
  type: "AC",
});
    const handleSubmit = async (e) => {
    e.preventDefault();
        
    // axios call
    try {
      await axios.post('http://localhost:3000/api/table/addtable', formData, {
        withCredentials: true,
      });
      console.log("Table Created");
      onClose(); // close modal only after success
    } catch (error) {
      console.error("Error creating table:", error);
    }
  };
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[500px] bg-white rounded-2xl shadow-2xl p-8"
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Add New Table
        </h1>
<form onSubmit={handleSubmit}>
        <div className="space-y-4">
            
          <input
            type="number"
            placeholder="Table Number"
            className="w-full border rounded-lg p-3 outline-none focus:border-[#d2873a]"
            value={formData.tableNumber}
            onChange={(e) => setFormData((prev) => ({ ...prev, tableNumber: e.target.value }))}
          />

          <input
            type="number"
            placeholder="Capacity"
            className="w-full border rounded-lg p-3 outline-none focus:border-[#d2873a]"
            value={formData.capacity}
            onChange={(e) => setFormData((prev) => ({ ...prev, capacity: e.target.value }))}    
          />

          <input
            type="text"
            placeholder="Location / Floor"
            className="w-full border rounded-lg p-3 outline-none focus:border-[#d2873a]"
            value={formData.location}
            onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
          />

          <select 
            className="w-full border rounded-lg p-3 outline-none focus:border-[#d2873a]"
            value={formData.type}
            onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value }))}
          >
            <option>AC</option>
            <option>Non-AC</option>
            <option>Outdoor</option>
          </select>

        </div>

        <div className="flex justify-end gap-3 mt-8">

          <button
          type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 cursor-alias"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-6 py-2 rounded-lg bg-[#d2873a] text-white hover:bg-[#b9752e] cursor-pointer"
          >
            Add Table
          </button>
          
        </div>
        </form>
      </div>
    </div>
  );
};

export default TableForm;