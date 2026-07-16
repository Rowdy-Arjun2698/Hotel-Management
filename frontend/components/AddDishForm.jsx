import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { ChevronDown, Check, Plus, X, Upload } from "lucide-react";

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
                  onChange(opt.value, opt.key);
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

const foodTypeOptions = [
  { key: "veg", value: "Veg" },
  { key: "nonveg", value: "Non-Veg" },
  { key: "egg", value: "Egg" },
];

const AddDishForm = ({ onClose, onSuccess, categories }) => {
  console.log(categories);
  const [dishName, setDishName] = useState("");
  const [description, setDescription] = useState("");
  const [foodType, setFoodType] = useState("Veg");
  const [isAvailable, setIsAvailable] = useState(true);
  const [variants, setVariants] = useState([{ name: "", price: "" }]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  // Category selection — mirrors CategoryNav's filter logic
  const [mainCategory, setMainCategory] = useState("Food");
  const [categoryName, setCategoryName] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const filteredCategories = categories.filter(
    (cat) => cat.mainCategory === mainCategory
  );

  // Reset chosen category whenever main category changes, since old
  // selection may not belong to the new filtered list
  const handleMainCategoryChange = (value) => {
    setMainCategory(value);
    setCategoryName("");
    setCategoryId("");
  };

  const handleCategoryChange = (value, key) => {
    setCategoryName(value);
    setCategoryId(key);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleVariantChange = (index, field, value) => {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v))
    );
  };

  const addVariant = () => {
    setVariants((prev) => [...prev, { name: "", price: "" }]);
  };

  const removeVariant = (index) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryId) {
      console.error("Please select a category");
      return;
    }

    setSubmitting(true);

    try {
      const payload = new FormData();
      payload.append("dishName", dishName);
      payload.append("description", description);
      payload.append("categoryId", categoryId);
      payload.append("foodType", foodType);
      payload.append("isAvailable", isAvailable);
      payload.append("variants", JSON.stringify(variants));
      if (image) payload.append("image", image);

      await axios.post("http://localhost:3000/api/menu/addDish", payload, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error creating dish:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 [animation:dishFadeIn_0.15s_ease-out]"
    >
      <style>{`
        @keyframes dishFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes dishSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[560px] max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 [animation:dishSlideUp_0.2s_ease-out]"
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-[#fbe9d7] flex items-center justify-center">
            <svg
              className="w-5 h-5 text-[#d2873a]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Add New Dish</h1>
        </div>
        <p className="text-sm text-gray-400 mb-6 ml-[52px]">
          Fill in the details for the new dish
        </p>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            {/* Image upload */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                Dish Image
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current.click()}
                className="w-full h-36 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50
                           hover:bg-gray-100 hover:border-[#d2873a]/40 transition-all duration-150
                           cursor-pointer flex items-center justify-center overflow-hidden"
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Dish preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1.5 text-gray-400">
                    <Upload size={22} />
                    <span className="text-sm">Click to upload image</span>
                  </div>
                )}
              </div>
            </div>

            {/* Dish name */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                Dish Name
              </label>
              <input
                type="text"
                placeholder="e.g. Paneer Tikka"
                value={dishName}
                onChange={(e) => setDishName(e.target.value)}
                className="w-full border border-gray-200 rounded-lg p-3 outline-none transition-all duration-150 focus:border-[#d2873a] focus:ring-2 focus:ring-[#d2873a]/20"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                Description
              </label>
              <textarea
                placeholder="A short description of the dish..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full border border-gray-200 rounded-lg p-3 outline-none resize-none transition-all duration-150 focus:border-[#d2873a] focus:ring-2 focus:ring-[#d2873a]/20"
              />
            </div>

            {/* Main Category + Category */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                  Main Category
                </label>
                <Dropdown
                  value={mainCategory}
                  onChange={handleMainCategoryChange}
                  options={[
                    { key: "food", value: "Food" },
                    { key: "beverages", value: "Beverages" },
                  ]}
                />
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                  Category
                </label>
                <Dropdown
                  value={categoryName || "Select category"}
                  onChange={handleCategoryChange}
                  options={filteredCategories.map((cat) => ({
                    key: cat._id,
                    value: cat.Catname,
                  }))}
                />
              </div>
            </div>

            {/* Food type dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                Food Type
              </label>
              <Dropdown
                value={foodType}
                onChange={setFoodType}
                options={foodTypeOptions}
              />
            </div>

            {/* Variants */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-600">
                  Variants
                </label>
                <button
                  type="button"
                  onClick={addVariant}
                  className="flex items-center gap-1 text-sm text-[#d2873a] hover:text-[#b9752e] font-medium cursor-pointer"
                >
                  <Plus size={16} /> Add
                </button>
              </div>

              <div className="space-y-2">
                {variants.map((variant, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Half, Full, Small..."
                      value={variant.name}
                      onChange={(e) =>
                        handleVariantChange(index, "name", e.target.value)
                      }
                      className="flex-1 border border-gray-200 rounded-lg p-2.5 text-sm outline-none transition-all duration-150 focus:border-[#d2873a] focus:ring-2 focus:ring-[#d2873a]/20"
                      required
                    />
                    <input
                      type="number"
                      min="0"
                      placeholder="Price"
                      value={variant.price}
                      onChange={(e) =>
                        handleVariantChange(index, "price", e.target.value)
                      }
                      className="w-28 border border-gray-200 rounded-lg p-2.5 text-sm outline-none transition-all duration-150 focus:border-[#d2873a] focus:ring-2 focus:ring-[#d2873a]/20"
                      required
                    />
                    {variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVariant(index)}
                        className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors duration-150 cursor-pointer"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Availability toggle */}
           <div className="flex items-center justify-between">
  <div>
    <label className="text-sm font-medium text-gray-600 block">
      Available
    </label>
    <span className={`text-xs transition-colors duration-200 ${isAvailable ? "text-[#d2873a]" : "text-gray-400"}`}>
      {isAvailable ? "Visible to customers" : "Hidden from menu"}
    </span>
  </div>

  <button
    type="button"
    role="switch"
    aria-checked={isAvailable}
    onClick={() => setIsAvailable((prev) => !prev)}
    className={`w-14 h-8 rounded-full relative shrink-0 cursor-pointer
                transition-colors duration-300 ease-out
                focus:outline-none focus:ring-2 focus:ring-[#d2873a]/40 focus:ring-offset-2
                ${isAvailable ? "bg-[#d2873a]" : "bg-gray-300"}`}
  >
    <span
      className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md
                  flex items-center justify-center
                  transition-transform duration-300 ease-out
                  ${isAvailable ? "translate-x-6" : "translate-x-0"}`}
    >
      {isAvailable ? (
        <Check size={13} className="text-[#d2873a]" strokeWidth={3} />
      ) : (
        <X size={13} className="text-gray-400" strokeWidth={3} />
      )}
    </span>
  </button>
</div>
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95 transition-all duration-150 cursor-pointer font-medium"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 rounded-lg bg-[#d2873a] text-white hover:bg-[#b9752e] active:scale-95 transition-all duration-150 cursor-pointer font-medium shadow-md shadow-[#d2873a]/20 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Adding..." : "Add Dish"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDishForm;