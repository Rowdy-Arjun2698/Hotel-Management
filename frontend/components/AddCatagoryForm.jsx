import React from "react";
import axios from "axios";
import { useState } from "react";

const AddCatagoryForm = ({ onClose,onSuccess }) => {
    const [FormData,setFormData]=useState({
         mainCategory:"Food",
         Catname:""
 })
 const handleSubmit=async (e)=>{
    e.preventDefault();

    try {
        await axios.post('http://localhost:3000/api/menu/addCat',FormData, {
        withCredentials: true,
       
    })
    onSuccess();
     onClose();
    } catch (error) {
         console.error("Error creating table:", error);
    }
   
 }
   
  return (
   <div
  onClick={onClose}
  className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
>
  <div
    onClick={(e) => e.stopPropagation()}
    className="w-[500px] bg-white rounded-2xl shadow-2xl p-8"
  >
    <h1 className="text-2xl font-bold text-gray-800 mb-6">
      Add New Category
    </h1>

    <form onSubmit={handleSubmit}>
      <div className="space-y-4">

        <input
          type="text"
          placeholder="Category Name"
          className="w-full border rounded-lg p-3 outline-none focus:border-[#d2873a]"
          value={FormData.Catname}
           onChange={(e) => setFormData((prev) => ({ ...prev, Catname: e.target.value }))}
          required
        />

        <select
          className="w-full border rounded-lg p-3 outline-none focus:border-[#d2873a]"
          value={FormData.mainCategory}
         onChange={(e) => setFormData((prev) => ({ ...prev, mainCategory: e.target.value }))}
        >
          <option value="Food">Food</option>
          <option value="Beverages">Beverages</option>
        </select>

      </div>

      <div className="flex justify-end gap-3 mt-8">

        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 cursor-pointer"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="px-6 py-2 rounded-lg bg-[#d2873a] text-white hover:bg-[#b9752e] cursor-pointer"
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