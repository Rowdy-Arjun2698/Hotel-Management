import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  Hash,
  Users,
  MapPin,
  ChevronDown,
  Check,
  Snowflake,
  Sun,
  UtensilsCrossed,
} from "lucide-react";
import { PencilLine,Edit2 } from "lucide-react";

// ---------------- Dropdown ----------------
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
                    hover:border-indigo-500/60
                    focus:ring-2 focus:ring-indigo-200
                    ${open ? "border-indigo-500 ring-2 ring-indigo-200 shadow-sm" : "border-gray-300"}`}
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
                              ? "bg-indigo-50 text-indigo-600 font-medium"
                              : "text-gray-700 hover:bg-gray-100"}`}
              >
                <span className="flex items-center gap-2 truncate">
                  {opt.icon}
                  {opt.label}
                </span>
                {isSelected && <Check size={16} className="text-indigo-500 shrink-0" />}
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

// ---------------- Table Edit Form ----------------
const TableEdit = ({ table, onClose,fetchAllTables }) => {
  const [formData, setFormData] = useState({
    tableNumber: "",
    capacity: "",
    location: "",
    type: "AC",
  });

  // Fill form when table changes
  useEffect(() => {
    if (table) {
      setFormData({
        tableNumber: table.tableNumber || "",
        capacity: table.capacity || "",
        location: table.location || "",
        type: table.type || "AC",
      });
    }
  }, [table]);

  const typeOptions = [
    {
      value: "AC",
      label: "AC",
      icon: <Snowflake size={16} className="text-sky-500" />,
    },
    {
      value: "Non-AC",
      label: "Non-AC",
      icon: <UtensilsCrossed size={16} className="text-gray-500" />,
    },
    {
      value: "Outdoor",
      label: "Outdoor",
      icon: <Sun size={16} className="text-indigo-500" />,
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `http://localhost:3000/api/table/updatetable/${table._id}`,
        formData,
        {
          withCredentials: true,
        }
      );

      console.log("Table Updated Successfully");
      fetchAllTables()
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[500px] bg-white rounded-2xl shadow-2xl p-8"
      >
       <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
              <PencilLine className="w-5 h-5 text-indigo-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Edit Dish</h1>
          </div>

          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold">
            <Edit2 size={12} />
            Editing
          </span>
        </div>
        <p className="text-sm text-gray-400 mb-6 ml-[52px]">
          Update the details of the selected Table
        </p>
        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            {/* Table Number */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                Table Number
              </label>

              <div className="relative">
                <Hash
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-lg p-3 pl-11 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  value={formData.tableNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tableNumber: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            {/* Capacity */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                Capacity
              </label>

              <div className="relative">
                <Users
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-lg p-3 pl-11 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  value={formData.capacity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      capacity: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                Location / Floor
              </label>

              <div className="relative">
                <MapPin
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg p-3 pl-11 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      location: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            {/* Seating Type */}
            <Dropdown
              label="Seating Type"
              value={formData.type}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  type: value,
                })
              }
              options={typeOptions}
            />
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
               className="px-6 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 active:scale-95 transition-all duration-150 cursor-pointer font-medium shadow-md shadow-indigo-500/20 disabled:opacity-60 disabled:cursor-not-allowed"
            >
            
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TableEdit;