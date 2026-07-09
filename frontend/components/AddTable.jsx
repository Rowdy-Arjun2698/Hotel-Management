import React from "react";
import { GrAdd } from "react-icons/gr";

const AddTable = ({ onClick }) => {
  return (
    <div
      onClick={onClick}
      className="w-[250px] h-[250px] rounded-2xl bg-amber-50 shadow-lg border-4 border-dashed border-gray-300 hover:border-[#d2873a] hover:shadow-2xl transition-all m-4 duration-300 cursor-pointer flex items-center justify-center"
    >
      <div className="flex flex-col items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-[#d2873a] text-white flex items-center justify-center text-3xl shadow-md hover:scale-110 transition-transform duration-300">
          <GrAdd />
        </div>

        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Add Table
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Create a new dining table
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddTable;