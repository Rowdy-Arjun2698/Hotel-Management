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
        className={`h-11 w-full rounded-lg border border-gray-300 bg-white pl-4 pr-10 text-left text-[15px] text-gray-900 outline-none
                    cursor-pointer transition-all duration-200 ease-out
                    hover:border-gray-400
                    focus:border-orange-400 focus:ring-2 focus:ring-orange-100
                    ${open ? "border-orange-400 ring-2 ring-orange-100" : ""}`}
      >
        <span className="truncate">{value}</span>
      </button>

      <ChevronDown
        size={16}
        className={`pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400
        transition-transform duration-200 ${open ? "rotate-180" : ""}`}
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
                className={`flex cursor-pointer select-none items-center justify-between gap-2 rounded-lg px-3.5 py-2.5
                text-sm transition-colors duration-150
                ${
                  isSelected
                    ? "bg-orange-50 font-medium text-orange-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="truncate">{opt.value}</span>

                {isSelected && (
                  <Check size={16} className="shrink-0 text-orange-500" />
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
      shapeClass: "bg-red-700 [clip-path:polygon(50%_0%,0%_100%,100%_100%)]",
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
      className={`h-4 w-4 shrink-0 border-2 ${conf.border} flex items-center justify-center rounded-[3px] bg-white`}
    >
      <span className={`h-2 w-2 ${conf.shapeClass}`} />
    </div>
  );
};

// ----------------------------------------------------------------------
// Dish Card
// ----------------------------------------------------------------------
const DishCard = ({ dish, setdeldish, setdeletedish, setedit, setediteddish }) => {
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

  const handleDel = () => {
    setdeldish(dish);
    setdeletedish(true);
  };

  const handelEdit = () => {
    setediteddish(dish);
    setedit(true);
  };

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
    <div className="m-3 rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
      <div className="flex flex-wrap items-end gap-5">
        {/* Dish */}
        <div className="min-w-[280px] flex-1">
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Dish
          </label>

          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-orange-50">
              {image ? (
                <img
                  src={`http://localhost:3000${image}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <UtensilsCrossed size={20} className="text-orange-500" />
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <FoodTypeBadge foodType={foodType} />
                <p className="truncate font-semibold text-gray-900">
                  {dishName}
                </p>
              </div>

              <p className="truncate text-sm text-gray-500">{description}</p>
            </div>
          </div>
        </div>

        {/* Variant */}
        <div className="w-48">
          <label className="mb-2 block text-sm font-semibold text-gray-700">
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
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Price
          </label>

          <div className="flex h-11 items-center justify-center rounded-lg border border-gray-300 bg-gray-50 font-semibold text-orange-600">
            ₹{activeVariant?.price ?? "--"}
          </div>
        </div>

        {/* Availability */}
       {/* Availability */}
<div className="flex flex-col items-start gap-2">
  <label className="text-sm font-semibold text-gray-700">
    Availability
  </label>

  <button
    type="button"
    role="switch"
    aria-checked={available}
    onClick={handleToggleAvailability}
    className={`relative flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 ease-out
    ${available ? "bg-green-500" : "bg-gray-300"}`}
  >
    <span
      className={`inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ease-out
      ${available ? "translate-x-[22px]" : "translate-x-[3px]"}`}
    />
  </button>

  <span
    className={`text-xs font-medium ${
      available ? "text-green-600" : "text-gray-400"
    }`}
  >
    {available ? "Available" : "Unavailable"}
  </span>
</div>
        {/* Edit */}
        <button
          className="flex h-11 items-center gap-2 rounded-lg border border-gray-300 px-5 text-sm font-semibold text-gray-700
          transition-all duration-200 ease-out hover:bg-gray-50"
          onClick={handelEdit}
        >
          <Pencil size={16} />
          Edit
        </button>

        {/* Delete */}
        <button
          className="flex h-11 items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-5 text-sm font-semibold text-red-600
          transition-all duration-200 ease-out hover:bg-red-100"
          onClick={handleDel}
        >
          <Trash2 size={16} />
          Delete
        </button>
      </div>
    </div>
  );
};

export default DishCard;