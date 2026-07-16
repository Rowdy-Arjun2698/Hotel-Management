import React from "react";
import axios from "axios";
import { useState } from "react";

const AddCatagoryForm = ({ onClose, onSuccess }) => {
  const [FormData, setFormData] = useState({
    mainCategory: "Food",
    Catname: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:3000/api/menu/addCat', FormData, {
        withCredentials: true,
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error creating table:", error);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 [animation:catFadeIn_0.15s_ease-out]"
    >
      <style>{`
        @keyframes catFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes catSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[500px] bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 [animation:catSlideUp_0.2s_ease-out]"
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
          <h1 className="text-2xl font-bold text-gray-800">
            Add New Category
          </h1>
        </div>
        <p className="text-sm text-gray-400 mb-6 ml-[52px]">
          Create a new category for your menu
        </p>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                Category Name
              </label>
              <input
                type="text"
                placeholder="e.g. Starters, Desserts..."
                className="w-full border border-gray-200 rounded-lg p-3 outline-none transition-all duration-150 focus:border-[#d2873a] focus:ring-2 focus:ring-[#d2873a]/20"
                value={FormData.Catname}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, Catname: e.target.value }))
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                Main Category
              </label>
              <select
                className="w-full border border-gray-200 rounded-lg p-3 outline-none transition-all duration-150 focus:border-[#d2873a] focus:ring-2 focus:ring-[#d2873a]/20 cursor-pointer"
                value={FormData.mainCategory}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, mainCategory: e.target.value }))
                }
              >
                <option value="Food">🍽️ Food</option>
                <option value="Beverages">🥤 Beverages</option>
              </select>
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
              className="px-6 py-2 rounded-lg bg-[#d2873a] text-white hover:bg-[#b9752e] active:scale-95 transition-all duration-150 cursor-pointer font-medium shadow-md shadow-[#d2873a]/20"
            >
              Add Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCatagoryForm;