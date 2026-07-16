import { Search, Plus, ChevronDown, Check } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

// Reusable custom dropdown — looks like the old select, but styleable
const Dropdown = ({ value, onChange, options, width = "w-full" }) => {
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
    <div className={`relative group ${width}`} ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full h-12 rounded-full bg-gray-100 pl-5 pr-10 outline-none
                    text-left cursor-pointer
                    transition-all duration-200 ease-out
                    hover:bg-gray-200/70
                    focus:bg-white focus:ring-2 focus:ring-orange-300
                    ${open ? "bg-white ring-2 ring-orange-300 shadow-sm" : ""}`}
      >
        <span className="truncate">{value}</span>
      </button>

      <ChevronDown
        size={16}
        className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500
                    transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      />

      <div
        className={`absolute z-20 left-0 right-0 mt-2 origin-top
                    transition-all duration-150 ease-out
                    ${open
                      ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                      : "opacity-0 scale-95 -translate-y-1 pointer-events-none"}`}
      >
        <ul
          role="listbox"
          className="max-h-64 overflow-auto rounded-2xl bg-white border border-gray-200
                     shadow-lg shadow-gray-900/5 p-1.5 space-y-0.5"
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <li
                key={opt.key}
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
                <span className="truncate">{opt.value}</span>
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

const CategoryNav = ({ setopenform, refreshCategories,categories,setdish }) => {
  const [mainCategory, setMainCategory] = useState("All");

  const [category, setCategory] = useState("");


  const filteredCategories =
    mainCategory === "All"
      ? categories
      : categories.filter((cat) => cat.mainCategory === mainCategory);


  return (
    <div className="bg-white rounded-2xl p-5 sticky m-3 shadow-sm ring-1 ring-black/5">
      <div className="flex flex-wrap items-end gap-5">

        {/* Search */}
        <div className="flex-1 min-w-[320px]">
          <label className="text-sm font-semibold text-gray-700 mb-2 block">
            Search Dish
          </label>

          <div className="relative group">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors duration-200 group-focus-within:text-orange-400"
            />
            <input
              type="text"
              placeholder="Search dish..."
              className="w-full h-12 rounded-full bg-gray-100 pl-11 pr-4 outline-none
                         transition-all duration-200 ease-out
                         hover:bg-gray-200/70
                         focus:bg-white focus:ring-2 focus:ring-orange-300 focus:shadow-sm"
            />
          </div>
        </div>

        {/* Main Category */}
        <div className="w-48">
          <label className="text-sm font-semibold text-gray-700 mb-2 block">
            Main Category
          </label>

          <Dropdown
            value={mainCategory}
            onChange={setMainCategory}
            options={[
              { key: "all", value: "All" },
              { key: "food", value: "Food" },
              { key: "beverages", value: "Beverages" },
            ]}
          />
        </div>

        {/* Category */}
        <div className="w-56">
          <label className="text-sm font-semibold text-gray-700 mb-2 block">
            Category
          </label>

          <Dropdown
            value={category}
            onChange={setCategory}
            options={filteredCategories.map((cat) => ({
              key: cat._id,
              value: cat.Catname,
            }))}
          />
        </div>

        {/* Add Category */}
        <button
          className="h-12 px-6 rounded-full bg-orange-100 text-[#d2873a] font-semibold
                     flex items-center gap-2 cursor-pointer
                     transition-all duration-200 ease-out
                     hover:bg-orange-200 hover:-translate-y-0.5
                     active:translate-y-0 active:scale-[0.97]"
          onClick={() => setopenform(true)}
        >
          <Plus size={18} />
          Category
        </button>

        {/* Add Dish */}
        <button
          className="h-12 px-6 rounded-full bg-[#d2873a] text-white font-semibold
                     flex items-center gap-2 cursor-pointer
                     transition-all duration-200 ease-out
                     hover:bg-[#bc742b] hover:-translate-y-0.5 hover:shadow-md hover:shadow-orange-200/60
                     active:translate-y-0 active:scale-[0.97]"
                     onClick={()=>setdish(true)}
        >
          <Plus size={18} />
          Dish
        </button>

      </div>
    </div>
  );
};

export default CategoryNav;