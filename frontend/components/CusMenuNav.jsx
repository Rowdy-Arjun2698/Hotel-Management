import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Search, SlidersHorizontal, ChevronDown, Check } from "lucide-react";

const foodTypes = [
  { value: "all", label: "All" },
  { value: "veg", label: "Veg" },
  { value: "egg", label: "Egg" },
  { value: "nonveg", label: "Non-Veg" },
];

// Small square icon mimicking the standard veg / egg / non-veg mark
const FoodTypeMark = ({ type }) => {
  if (type === "all") return null;

  const border = {
    veg: "border-emerald-600",
    egg: "border-amber-600",
    nonveg: "border-red-700",
  };
  const dot = {
    veg: "bg-emerald-600 rounded-full",
    egg: "bg-amber-600 rounded-full",
    nonveg: "bg-red-700",
  };

  return (
    <span className={`flex h-3.5 w-3.5 items-center justify-center rounded-[3px] border-[1.5px] ${border[type]}`}>
      <span
        className={`h-1.5 w-1.5 ${dot[type]}`}
        style={type === "nonveg" ? { clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" } : {}}
      />
    </span>
  );
};

// Compact pill dropdown — mobile-friendly version of the PC dropdown
// Menu is rendered via a portal directly onto <body>, so it always
// escapes any parent's overflow-x-auto / sticky clipping.
const Dropdown = ({ value, onChange, options, placeholder = "Select" }) => {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const rootRef = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (
        rootRef.current &&
        !rootRef.current.contains(e.target) &&
        !e.target.closest("[data-dropdown-menu]")
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Reposition on scroll/resize while open, so the menu tracks the button
  useEffect(() => {
    if (!open) return;
    function updatePosition() {
      if (btnRef.current) {
        const rect = btnRef.current.getBoundingClientRect();
        setCoords({ top: rect.bottom + window.scrollY + 8, left: rect.left + window.scrollX });
      }
    }
    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open]);

  const toggleOpen = () => {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setCoords({ top: rect.bottom + window.scrollY + 8, left: rect.left + window.scrollX });
    }
    setOpen((o) => !o);
  };

  const selectedLabel = options.find((opt) => opt.value === value)?.label;

  return (
    <div className="relative shrink-0" ref={rootRef}>
      <button
        ref={btnRef}
        type="button"
        onClick={toggleOpen}
        className={`flex h-10 items-center gap-2 whitespace-nowrap rounded-full border px-4 pr-3 text-sm font-medium
                    outline-none transition-all duration-200 ease-out
                    ${
                      open
                        ? "border-red-300 bg-white shadow-sm ring-2 ring-red-100"
                        : value
                        ? "border-red-200 bg-red-50 text-red-700"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
      >
        <span className="truncate max-w-[7.5rem]">{selectedLabel || placeholder}</span>
        <ChevronDown
          size={15}
          className={`text-current opacity-60 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open &&
        createPortal(
          <ul
            data-dropdown-menu
            role="listbox"
            style={{ position: "absolute", top: coords.top, left: coords.left }}
            className="z-50 w-48 max-h-64 overflow-auto rounded-2xl border border-gray-200 bg-white p-1.5
                       shadow-lg shadow-gray-900/10"
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
                  className={`flex items-center justify-between gap-2 rounded-xl px-3.5 py-2.5 text-sm
                              cursor-pointer select-none transition-colors duration-150
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
              <li className="px-4 py-3 text-center text-sm text-gray-400">No categories found</li>
            )}
          </ul>,
          document.body
        )}
    </div>
  );
};

const CusMenuNav = ({ categories = [],setselcat,setsearcher,setfood}) => {
  const [mainCategory, setMainCategory] = useState("");
  const [category, setCategory] = useState("");
  const [foodType, setFoodType] = useState("all");
  const [search, setSearch] = useState("");

  const filteredCategories =
    mainCategory === "" ? categories : categories.filter((cat) => cat.mainCategory === mainCategory);



  return (
    <div className="sticky top-0 z-30 bg-white px-4 pb-2 pt-3">
      {/* Search row */}
      <div className="flex items-center gap-2">
        <div className="group relative flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors duration-200 group-focus-within:text-red-700"
          />
          <input
            type="text"
             value={search}
  onChange={(e) => {
    setSearch(e.target.value);
    setsearcher(e.target.value);
  }}
            placeholder="Search for dishes..."
            className="h-11 w-full rounded-full bg-orange-50/70 pl-11 pr-4 text-sm text-slate-700
                       outline-none placeholder:text-slate-400
                       transition-all duration-200 ease-out
                       focus:bg-white focus:ring-2 focus:ring-red-200"
          />
        </div>

        <button
          type="button"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200
                     text-slate-600 transition-all duration-200 ease-out
                     hover:bg-slate-50 active:scale-90"
          aria-label="Filters"
        >
          <SlidersHorizontal size={17} strokeWidth={2} />
        </button>
      </div>

      {/* Dropdown row: Main category + Category, both compact pills */}
      <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <Dropdown
          onChange={(value)=>{setMainCategory(value)}}
          value={mainCategory}
          placeholder="Main category"
          options={[
            { key: "all", value: "", label: "All" },
            { key: "food", value: "Food", label: "Food" },
            { key: "beverages", value: "Beverages", label: "Beverages" },
          ]}
        />

        <Dropdown
           value={category}
  onChange={(value) => {
    setCategory(value);
    setselcat(value);
  }}
          placeholder="Category"
          options={[
            { key: "all", value: "", label: "All" },
            ...filteredCategories.map((cat) => ({
              key: cat._id,
              value: cat._id,
              label: cat.Catname,
            })),
          ]}
        />
      </div>

      {/* Veg / Egg / Non-veg filter row */}
      <div className="mt-2.5 flex items-center gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {foodTypes.map((type) => {
          const isActive = foodType === type.value;
          return (
            <button
              key={type.value}
              type="button"
              onClick={() => {
  setFoodType(type.value);

  if (type.value === "all") {
    setfood("");
  } else if (type.value === "veg") {
    setfood("Veg");
  } else if (type.value === "egg") {
    setfood("Egg");
  } else if (type.value === "nonveg") {
    setfood("Non-Veg");
  }
}}
              className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium
                          transition-all duration-200 ease-out active:scale-95
                          ${
                            isActive
                              ? "border-red-700 bg-red-50 text-red-700"
                              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                          }`}
            >
              <FoodTypeMark type={type.value} />
              {type.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CusMenuNav;