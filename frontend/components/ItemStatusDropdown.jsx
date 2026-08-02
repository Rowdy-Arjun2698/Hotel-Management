import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

const STATUS_OPTIONS = ["Preparing", "Ready", "Served", "Cancelled"];

const statusStyles = {
  Preparing: "bg-orange-50 text-orange-600",
  Ready: "bg-green-50 text-green-600",
  Served: "bg-blue-50 text-blue-600",
  Cancelled: "bg-red-50 text-red-600",
};

const ItemStatusDropdown = ({ value, onChange }) => {
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

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition
        ${statusStyles[value] || "bg-gray-100 text-gray-600"}`}
      >
        {value}
        <ChevronDown
          size={12}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul className="absolute right-0 z-20 mt-1.5 w-32 space-y-0.5 rounded-lg border border-gray-200 bg-white p-1 shadow-lg shadow-gray-900/5">
          {STATUS_OPTIONS.map((opt) => (
            <li
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className={`flex cursor-pointer items-center justify-between gap-2 rounded-md px-2.5 py-1.5 text-xs transition-colors
              ${
                opt === value
                  ? "bg-orange-50 font-medium text-orange-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {opt}
              {opt === value && <Check size={12} className="text-orange-500" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ItemStatusDropdown;