import axios from "axios";
import {
  UtensilsCrossed,
  Pencil,
  Trash2,
  Power,
  ChevronDown,
  Check,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

// ----------------------------------------------------------------------
// Reusable Dropdown
// ----------------------------------------------------------------------
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
                    text-left cursor-pointer transition-all duration-200 ease-out
                    hover:bg-gray-200/70
                    focus:bg-white focus:ring-2 focus:ring-orange-300
                    ${
                      open
                        ? "bg-white ring-2 ring-orange-300 shadow-sm"
                        : ""
                    }`}
      >
        <span className="truncate">{value}</span>
      </button>

      <ChevronDown
        size={16}
        className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500
        transition-transform duration-200 ${
          open ? "rotate-180" : ""
        }`}
      />

      <div
        className={`absolute z-10 left-0 right-0 mt-2 origin-top
        transition-all duration-150 ease-out
        ${
          open
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
        }`}
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
                className={`flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl
                text-sm cursor-pointer select-none transition-colors duration-150
                ${
                  isSelected
                    ? "bg-orange-50 text-orange-600 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="truncate">{opt.value}</span>

                {isSelected && (
                  <Check
                    size={16}
                    className="text-orange-500 shrink-0"
                  />
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// Food Type Badge (veg / non-veg / egg)
// ----------------------------------------------------------------------
const FoodTypeBadge = ({ foodType }) => {
  const type = (foodType || "").toLowerCase().replace(/[\s_]/g, "-");

  const config = {
    veg: {
      border: "border-green-600",
      shapeClass: "bg-green-600 rounded-full",
      title: "Vegetarian",
    },
    "non-veg": {
      border: "border-red-700",
      shapeClass:
        "bg-red-700 [clip-path:polygon(50%_0%,0%_100%,100%_100%)]",
      title: "Non-Vegetarian",
    },
    egg: {
      border: "border-amber-500",
      shapeClass: "bg-amber-400 rounded-full",
      title: "Contains Egg",
    },
  };

  const conf = config[type];

  if (!conf) return null;

  return (
    <div
      title={conf.title}
      className={`w-4 h-4 shrink-0 border-2 ${conf.border} flex items-center justify-center rounded-[3px] bg-white`}
    >
      <span className={`w-2 h-2 ${conf.shapeClass}`} />
    </div>
  );
};

// ----------------------------------------------------------------------
// Dish Card
// ----------------------------------------------------------------------
const DishCard = ({ dish,setdeldish,setdeletedish,setedit,setediteddish}) => {
  const {
    dishName = "Unnamed Dish",
    _id,
    image,
    categoryId,
    description,
    variants = [],
    isAvailable = true,
    foodType,
  } = dish || {};

  const [selectedVariant, setSelectedVariant] = useState(
    variants[0]?.name || ""
  );

  const [available, setAvailable] = useState(isAvailable);

  const activeVariant =
    variants.find((v) => v.name === selectedVariant) || variants[0];


  const handleDel=() => {
   setdeldish(dish)
   setdeletedish(true)
  }

  const handelEdit=()=>{
    setediteddish(dish)
    setedit(true)
  }

const handleToggleAvailability = async () => {
  try {
    const response = await axios.patch(
      `http://localhost:3000/api/menu/isAvailable/${_id}`,
      {
        isAvailable: !available,
      },
      {
        withCredentials: true,
      }
    );

    if (response.data.success) {
      setAvailable(!available);
    }
  } catch (error) {
    console.log(error);
  }
};


  
  return (
    <div className="bg-white rounded-2xl p-5 m-3 shadow-sm ring-1 ring-black/5 transition-shadow duration-200 hover:shadow-md">
      <div className="flex flex-wrap items-end gap-5">

        {/* Dish */}
        <div className="flex-1 min-w-[280px]">
          <label className="text-sm font-semibold text-gray-700 mb-2 block">
            Dish
          </label>

          <div className="flex items-center gap-4">

            <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center ring-1 ring-black/5">
              {image ? (
                <img
                  src={`http://localhost:3000${image}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <UtensilsCrossed
                  size={20}
                  className="text-[#d2873a]"
                />
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <FoodTypeBadge foodType={foodType} />
                <p className="font-semibold text-gray-800 truncate">
                  {dishName}
                </p>
              </div>

              {/* Replace with category name later if you populate category */}
              <p className="text-sm text-gray-500 truncate">
                {description}
              </p>
            </div>
          </div>
        </div>

        {/* Variant */}
        <div className="w-48">
          <label className="text-sm font-semibold text-gray-700 mb-2 block">
            Variant
          </label>

          <Dropdown
            value={selectedVariant}
            onChange={setSelectedVariant}
            options={variants.map((variant) => ({
              key: variant.name,
              value: variant.name,
            }))}
          />
        </div>

        {/* Price */}
        <div className="w-28">
          <label className="text-sm font-semibold text-gray-700 mb-2 block">
            Price
          </label>

          <div className="h-12 rounded-full bg-gray-100 flex items-center justify-center font-semibold text-[#d2873a]">
            ₹{activeVariant?.price ?? "--"}
          </div>
        </div>

        {/* Availability */}
        <button
          onClick={handleToggleAvailability}
          className={`h-12 px-6 rounded-full font-semibold flex items-center gap-2
          cursor-pointer transition-all duration-200 ease-out
          hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97]
          ${
            available
              ? "bg-green-100 text-green-700 hover:bg-green-200"
              : "bg-red-100 text-red-600 hover:bg-red-200"
          }`}
        >
          <Power size={18} />
          {available ? "Available" : "Unavailable"}
        </button>

        {/* Edit */}
        <button
          className="h-12 px-6 rounded-full bg-orange-100 text-[#d2873a]
          font-semibold flex items-center gap-2 cursor-pointer
          transition-all duration-200 ease-out
          hover:bg-orange-200 hover:-translate-y-0.5"
          onClick={handelEdit}
        >
          <Pencil size={18} />
          Edit
        </button>

        {/* Delete */}
        <button
          className="h-12 px-6 rounded-full bg-[#d2873a] text-white
          font-semibold flex items-center gap-2 cursor-pointer
          transition-all duration-200 ease-out
          hover:bg-[#bc742b] hover:-translate-y-0.5"
          onClick={handleDel}
        >
          <Trash2 size={18} />
          Delete
        </button>

      </div>
    </div>
  );
};

export default DishCard;