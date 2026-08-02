import { Search, Plus, ChevronDown, Check } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

// Reusable custom dropdown — looks like the old select, but styleable
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

  return (
    <div className={`relative group ${width} ${open ? "z-50" : "z-10"}`} ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`h-11 w-full rounded-lg border border-gray-300 bg-white pl-4 pr-10 text-left text-[15px] text-gray-900 outline-none
                    cursor-pointer transition-all duration-200 ease-out
                    hover:border-gray-400
                    focus:border-orange-400 focus:ring-2 focus:ring-orange-100
                    ${open ? "border-orange-400 ring-2 ring-orange-100" : ""}`}
      >
        <span className="truncate">
          {options.find((opt) => opt.value === value)?.label || "Select Category"}
        </span>
      </button>

      <ChevronDown
        size={16}
        className={`pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400
                    transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      />

      <div
        className={`absolute z-50 left-0 right-0 mt-2 origin-top
          transition-all duration-150 ease-out
          ${
            open
              ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
              : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
          }`}
      >
        <ul
          role="listbox"
          className="max-h-64 space-y-0.5 overflow-auto rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg shadow-gray-900/5"
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
                className={`flex cursor-pointer select-none items-center justify-between gap-2 rounded-lg px-3.5 py-2.5 text-sm
                            transition-colors duration-150
                            ${
                              isSelected
                                ? "bg-orange-50 font-medium text-orange-600"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
              >
                <span className="truncate">{opt.label}</span>
                {isSelected && <Check size={16} className="shrink-0 text-orange-500" />}
              </li>
            );
          })}

          {options.length === 0 && (
            <li className="px-4 py-3 text-center text-sm text-gray-400">
              No categories found
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

const CategoryNav = ({
  setopenform,
  refreshCategories,
  categories,
  setdish,
  setselcat,
  setSearch,
  search,
}) => {
  const [mainCategory, setMainCategory] = useState("All");
  const [category, setCategory] = useState("");

  const filteredCategories =
    mainCategory === "All"
      ? categories
      : categories.filter((cat) => cat.mainCategory === mainCategory);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-end gap-5">
        {/* Search */}
        <div className="min-w-[320px] flex-1">
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Search Dish
          </label>

          <div className="relative group">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors duration-200 group-focus-within:text-orange-400"
            />
            <input
              type="text"
              placeholder="Search dish..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 text-[15px] text-gray-900 outline-none
                         transition-all duration-200 ease-out
                         hover:border-gray-400
                         focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            />
          </div>
        </div>

        {/* Main Category */}
        <div className="w-48">
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Main Category
          </label>

          <Dropdown
            value={mainCategory}
            onChange={setMainCategory}
            options={[
              { key: "all", value: "All", label: "All" },
              { key: "food", value: "Food", label: "Food" },
              { key: "beverages", value: "Beverages", label: "Beverages" },
            ]}
          />
        </div>

        {/* Category */}
        <div className="w-56">
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Category
          </label>

          <Dropdown
            value={category}
            onChange={(value) => {
              setCategory(value);
              setselcat(value);
            }}
            options={[
              {
                key: "all",
                value: "",
                label: "All",
              },
              ...filteredCategories.map((cat) => ({
                key: cat._id,
                value: cat._id,
                label: cat.Catname,
              })),
            ]}
          />
        </div>

        {/* Add Category */}
        <button
          className="flex h-11 items-center gap-2 rounded-lg border border-gray-300 px-5 text-sm font-semibold text-gray-700
                     transition-all duration-200 ease-out hover:bg-gray-50"
          onClick={() => setopenform(true)}
        >
          <Plus size={16} />
          Category
        </button>

        {/* Add Dish */}
        <button
          className="flex h-11 items-center gap-2 rounded-lg bg-orange-500 px-5 text-sm font-semibold text-white shadow-sm
                     transition-all duration-200 ease-out hover:bg-orange-600"
          onClick={() => setdish(true)}
        >
          <Plus size={16} />
          Dish
        </button>
      </div>
    </div>
  );
};

export default CategoryNav;