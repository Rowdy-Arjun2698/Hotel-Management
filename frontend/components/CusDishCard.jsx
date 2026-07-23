import React, { useState, useRef, useEffect } from "react";
import { Plus, Minus, ShoppingBag } from "lucide-react";
import { useContext } from "react";
import { CustomerContext } from "../context/CustomerContext";
/**
 * DishCard — horizontal menu card with multi-variant, multi-quantity add flow.
 * Built directly around the API's dish document shape.
 *
 * Usage:
 *   <DishCard dish={dishFromApi} onAdd={(dish, selections) => {...}} />
 *
 * Expected `dish` shape (as returned by the API):
 * {
 *   _id, dishName, description, image, foodType: "Veg" | "Egg" | "Non-Veg",
 *   categoryId: { Catname, mainCategory, ... },
 *   variants: [{ name, price }],   // e.g. { name: "full", price: 100 }
 *   isAvailable: boolean,
 *   todaySold, totalSold, ...
 * }
 *
 * `imageBaseUrl` lets you prefix relative image paths like
 * "/uploads/hotel_.../dishes/xyz.png" with your API/CDN origin.
 * If `dish.image` is already an absolute URL, imageBaseUrl is ignored.
 */

const DEFAULT_DISH = {
  _id: "d1",
  dishName: "Tandoori",
  description: "spice",
  image:
    "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80",
  foodType: "Egg",
  variants: [
    { name: "full", price: 100 },
    { name: "half", price: 49 },
  ],
  isAvailable: false,
};

const resolveImage = (image, imageBaseUrl) => {
  if (!image) return "";
  if (/^https?:\/\//i.test(image)) return image;
  return `${imageBaseUrl}${image}`;
};

// Maps the API's foodType string ("Veg" | "Egg" | "Non-Veg") to the
// FoodTypeMark's internal type key.
const normalizeFoodType = (foodType) => {
  const value = (foodType || "").toLowerCase();
  if (value === "veg") return "veg";
  if (value === "egg") return "egg";
  if (value === "non-veg" || value === "nonveg") return "nonveg";
  return "all";
};

const FoodTypeMark = ({ type, dim = false }) => {
  if (type === "all") return null;

  const border = {
    veg: "border-emerald-600",
    egg: "border-amber-600",
    nonveg: "border-red-700",
  };
  const dot = {
    veg: "bg-emerald-600 rounded-full",
    egg: "bg-amber-500 rounded-full",
    nonveg: "bg-red-700",
  };

  return (
    <span
      className={`flex h-3 w-3 items-center justify-center rounded-[3px] border-[1.5px] ${
        border[type]
      } ${dim ? "opacity-50" : ""}`}
    >
      <span
        className={`h-1.5 w-1.5 ${dot[type]}`}
        style={
          type === "nonveg"
            ? { clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }
            : {}
        }
      />
    </span>
  );
};

const CusDishCard = ({ dish, onAdd, imageBaseUrl = "" }) => {
  const isAvailable = dish.isAvailable !== false;
  const foodTypeKey = normalizeFoodType(dish.foodType);
  const {url}=useContext(CustomerContext);

  const variants =
    dish.variants && dish.variants.length > 0
      ? dish.variants
      : [{ name: "Regular", price: dish.price || 0 }];

  const [open, setOpen] = useState(false);
  const [qty, setQty] = useState({}); // { variantName: quantity }
  const panelRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Reset any open/selected state if the dish becomes unavailable mid-session
  useEffect(() => {
    if (!isAvailable) {
      setOpen(false);
      setQty({});
    }
  }, [isAvailable]);

  const totalCount = Object.values(qty).reduce((sum, n) => sum + n, 0);
  const totalPrice = variants.reduce(
    (sum, v) => sum + (qty[v.name] || 0) * v.price,
    0
  );

  const changeQty = (variantName, delta) => {
    setQty((prev) => {
      const next = { ...prev };
      const current = next[variantName] || 0;
      const updated = Math.max(0, current + delta);
      if (updated === 0) {
        delete next[variantName];
      } else {
        next[variantName] = updated;
      }
      return next;
    });
  };

  const handleConfirm = () => {
    const selections = variants
      .filter((v) => qty[v.name] > 0)
      .map((v) => ({ ...v, quantity: qty[v.name] }));
    if (selections.length > 0 && onAdd) {
      onAdd(dish, selections);
    }
    setOpen(false);
  };

  return (
    <div
      className={`relative w-full max-w-2xl rounded-xl border p-2 flex gap-3 items-stretch transition-shadow ${
        isAvailable
          ? "bg-white border-gray-100 shadow-sm hover:shadow-md"
          : "bg-gray-50 border-gray-100"
      }`}
    >
      {/* Image */}
      <div className="relative flex-shrink-0">
        <img
          src={`http://localhost:3000${dish.image}`}
          alt={dish.dishName}
          className={`w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover ${
            isAvailable ? "" : "grayscale opacity-60"
          }`}
        />
        {!isAvailable && (
          <div className="absolute inset-0 rounded-lg bg-black/5 flex items-end justify-center pb-1">
            <span className="text-[9px] font-semibold uppercase tracking-wide text-white bg-gray-500/90 px-1.5 py-0.5 rounded-full">
              Sold out
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <FoodTypeMark type={foodTypeKey} dim={!isAvailable} />
            {dish.categoryId?.Catname && (
              <span
                className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                  isAvailable
                    ? "text-gray-500 bg-gray-100"
                    : "text-gray-400 bg-gray-100"
                }`}
              >
                {dish.categoryId.Catname}
              </span>
            )}
          </div>

          <h3
            className={`text-sm sm:text-base font-semibold leading-tight truncate ${
              isAvailable ? "text-[#151514]" : "text-gray-400"
            }`}
          >
            {dish.dishName}
          </h3>
          <p
            className={`text-xs mt-0.5 line-clamp-1 ${
              isAvailable ? "text-gray-500" : "text-gray-400"
            }`}
          >
            {dish.description}
          </p>
        </div>

        <div className="flex items-end justify-between mt-1">
          <p
            className={`text-sm font-semibold ${
              isAvailable ? "text-[#151514]" : "text-gray-400"
            }`}
          >
            ₹{Math.min(...variants.map((v) => v.price))}
            {variants.length > 1 ? " onwards" : ""}
          </p>

          {/* Add button */}
          <div className="relative" ref={panelRef}>
            <button
              onClick={() => isAvailable && setOpen((o) => !o)}
              disabled={!isAvailable}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold border-2 transition-colors ${
                !isAvailable
                  ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                  : totalCount > 0
                  ? "bg-[#151514] text-white border-[#151514]"
                  : "bg-white text-[#151514] border-[#151514] hover:bg-gray-50"
              }`}
            >
              {!isAvailable ? (
                "UNAVAILABLE"
              ) : totalCount > 0 ? (
                <>
                  <ShoppingBag size={12} />
                  {totalCount} ADDED
                </>
              ) : (
                <>
                  <Plus size={12} />
                  ADD
                </>
              )}
            </button>

            {/* Variant panel */}
            {open && isAvailable && (
              <div className="absolute right-0 z-20 mt-2 w-72 bg-white rounded-xl border border-gray-100 shadow-xl p-3 animate-[fadeIn_0.12s_ease-out]">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 px-1">
                  Choose variant
                </p>

                <div className="flex flex-col gap-1 max-h-56 overflow-y-auto">
                  {variants.map((v) => {
                    const currentQty = qty[v.name] || 0;
                    return (
                      <div
                        key={v.name}
                        className="flex items-center justify-between px-1 py-2 rounded-lg hover:bg-gray-50"
                      >
                        <div>
                          <p className="text-sm font-medium text-[#151514] capitalize">
                            {v.name}
                          </p>
                          <p className="text-xs text-gray-500">₹{v.price}</p>
                        </div>

                        {currentQty === 0 ? (
                          <button
                            onClick={() => changeQty(v.name, 1)}
                            className="text-xs font-semibold text-[#151514] border border-[#151514] rounded-md px-3 py-1 hover:bg-gray-50"
                          >
                            ADD
                          </button>
                        ) : (
                          <div className="flex items-center gap-2 bg-[#151514] text-white rounded-md px-1.5 py-1">
                            <button
                              onClick={() => changeQty(v.name, -1)}
                              className="p-0.5 hover:opacity-70"
                              aria-label={`Decrease ${v.name} quantity`}
                            >
                              <Minus size={13} />
                            </button>
                            <span className="text-xs font-semibold w-4 text-center">
                              {currentQty}
                            </span>
                            <button
                              onClick={() => changeQty(v.name, 1)}
                              className="p-0.5 hover:opacity-70"
                              aria-label={`Increase ${v.name} quantity`}
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={handleConfirm}
                  disabled={totalCount === 0}
                  className={`w-full mt-3 rounded-lg py-2 text-sm font-semibold transition-colors ${
                    totalCount > 0
                      ? "bg-[#151514] text-white hover:opacity-90"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {totalCount > 0
                    ? `Add ${totalCount} item${totalCount > 1 ? "s" : ""} · ₹${totalPrice}`
                    : "Select a variant"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CusDishCard;