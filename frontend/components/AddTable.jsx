import React from "react";
import { GrAdd } from "react-icons/gr";

const AddTable = ({ onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group w-[250px] h-[250px] rounded-2xl bg-amber-50 shadow-lg border-4 border-dashed border-gray-300 hover:border-[#d2873a] hover:shadow-2xl hover:bg-amber-100/60 transition-all m-4 duration-300 cursor-pointer flex items-center justify-center relative overflow-hidden"
    >
      {/* subtle glow accent on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#d2873a]/0 via-[#d2873a]/0 to-[#d2873a]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex flex-col items-center gap-5 relative z-10">
        <div className="w-16 h-16 rounded-full bg-[#d2873a] text-white flex items-center justify-center text-3xl shadow-md ring-4 ring-[#d2873a]/20 group-hover:ring-[#d2873a]/40 group-hover:scale-110 transition-all duration-300">
          <GrAdd />
        </div>

        <div className="text-center px-4">
          <h2 className="text-xl font-semibold text-gray-800 tracking-tight">
            Add Table
          </h2>

          <p className="text-sm text-gray-500 mt-1 leading-snug">
            Create a new dining table
          </p>

          <span className="inline-block mt-3 text-xs font-medium text-[#d2873a] opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0 transition-all duration-300">
            Click to add →
          </span>
        </div>
      </div>
    </div>
  );
};

export default AddTable;