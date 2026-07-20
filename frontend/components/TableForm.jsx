import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Hash, Users, MapPin, ChevronDown, Check, Snowflake, Sun, UtensilsCrossed } from "lucide-react";

// ---------- Dropdown ----------
const Dropdown = ({ value, label, onChange, options, width = "w-full" }) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selected = options.find((opt) => opt.value === value);

  return (
    <div className={`relative group ${width} ${open ? "z-50" : "z-10"}`} ref={rootRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-600 mb-1.5">
          {label}
        </label>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full h-12 rounded-lg bg-white border pl-4 pr-10 outline-none
                    text-left cursor-pointer
                    transition-all duration-200 ease-out
                    hover:border-[#d2873a]/60
                    focus:ring-2 focus:ring-orange-200
                    ${open ? "border-[#d2873a] ring-2 ring-orange-200 shadow-sm" : "border-gray-300"}`}
      >
        <span className="flex items-center gap-2 truncate">
          {selected?.icon}
          <span className="truncate text-gray-800">
            {selected?.label || "Select Type"}
          </span>
        </span>
      </button>

      <ChevronDown
        size={16}
        className={`pointer-events-none absolute right-4 top-[42px] -translate-y-1/2 text-gray-500
                    transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      />

      <div
        className={`absolute z-50 left-0 right-0 mt-2 origin-top
          transition-all duration-150 ease-out
          ${open
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 -translate-y-1 pointer-events-none"}`}
      >
        <ul
          role="listbox"
          className="max-h-64 overflow-auto rounded-2xl bg-white border border-gray-200
                     shadow-lg shadow-gray-900/10 p-1.5 space-y-0.5"
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <li
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl text-sm
                            cursor-pointer select-none transition-colors duration-150
                            ${isSelected
                              ? "bg-orange-50 text-orange-600 font-medium"
                              : "text-gray-700 hover:bg-gray-100"}`}
              >
                <span className="flex items-center gap-2 truncate">
                  {opt.icon}
                  {opt.label}
                </span>
                {isSelected && <Check size={16} className="text-orange-500 shrink-0" />}
              </li>
            );
          })}

          {options.length === 0 && (
            <li className="px-4 py-3 text-sm text-gray-400 text-center">
              No categories found
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

// ---------- Table Form ----------
const TableForm = ({ onClose, }) => {
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

  const typeOptions = [
    { value: "AC", label: "AC", icon: <Snowflake size={16} className="text-sky-500" /> },
    { value: "Non-AC", label: "Non-AC", icon: <UtensilsCrossed size={16} className="text-gray-500" /> },
    { value: "Outdoor", label: "Outdoor", icon: <Sun size={16} className="text-amber-500" /> },
  ];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[500px] bg-white rounded-2xl shadow-2xl p-8"
      >
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Add New Table
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Fill in the details to create a new dining table
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5">

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                Table Number
              </label>
              <div className="relative">
                <Hash size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  placeholder="e.g. 12"
                  className="w-full border border-gray-300 rounded-lg p-3 pl-11 outline-none
                             transition-colors duration-200
                             focus:border-[#d2873a] focus:ring-2 focus:ring-orange-200"
                  value={formData.tableNumber}
                  onChange={(e) => setFormData((prev) => ({ ...prev, tableNumber: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                Capacity
              </label>
              <div className="relative">
                <Users size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  placeholder="Number of seats"
                  className="w-full border border-gray-300 rounded-lg p-3 pl-11 outline-none
                             transition-colors duration-200
                             focus:border-[#d2873a] focus:ring-2 focus:ring-orange-200"
                  value={formData.capacity}
                  onChange={(e) => setFormData((prev) => ({ ...prev, capacity: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                Location / Floor
              </label>
              <div className="relative">
                <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="e.g. Ground Floor, Terrace"
                  className="w-full border border-gray-300 rounded-lg p-3 pl-11 outline-none
                             transition-colors duration-200
                             focus:border-[#d2873a] focus:ring-2 focus:ring-orange-200"
                  value={formData.location}
                  onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                />
              </div>
            </div>

            <Dropdown
              label="Seating Type"
              value={formData.type}
              onChange={(val) => setFormData((prev) => ({ ...prev, type: val }))}
              options={typeOptions}
            />

          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-[#d2873a] text-white hover:bg-[#b9752e] shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"

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