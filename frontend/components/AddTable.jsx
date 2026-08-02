import React from "react";
import { GrAdd } from "react-icons/gr";

const AddTable = ({ onClick }) => {
  return (
    <>
      <style>{`
        @keyframes cloth-drape {
          0% { transform: scaleY(0); opacity: 0; }
          60% { transform: scaleY(1.05); opacity: 1; }
          100% { transform: scaleY(1); opacity: 1; }
        }
        @keyframes leg-drop {
          0% { transform: translateY(-6px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes plus-pop {
          0% { transform: scale(0) rotate(-45deg); opacity: 0; }
          70% { transform: scale(1.15) rotate(0deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        .add-table-group:hover .cloth {
          animation: cloth-drape 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          transform-origin: top;
        }
        .add-table-group:hover .leg-left,
        .add-table-group:hover .leg-right {
          animation: leg-drop 0.3s ease-out 0.1s forwards;
        }
        .add-table-group:hover .plus-badge {
          animation: plus-pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s forwards;
        }
        .add-table-group .cloth,
        .add-table-group .leg-left,
        .add-table-group .leg-right {
          opacity: 0;
        }
        .add-table-group .plus-badge {
          opacity: 0;
          transform: scale(0) rotate(-45deg);
        }
      `}</style>

      <div
        onClick={onClick}
        className="add-table-group group relative flex h-[270px] w-[270px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-white shadow-sm transition-all duration-300 hover:border-orange-400 hover:bg-orange-50/40 hover:shadow-md"
      >
        {/* subtle glow accent on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-400/0 via-orange-400/0 to-orange-400/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="relative z-10 flex flex-col items-center gap-4">
          {/* Table illustration */}
          <div className="relative flex h-20 w-24 items-end justify-center">
            {/* tabletop base (always visible, faint) */}
            <svg
              viewBox="0 0 96 60"
              className="absolute bottom-0 h-14 w-24 text-gray-300 transition-colors duration-300 group-hover:text-orange-300"
              fill="none"
            >
              <rect x="8" y="14" width="80" height="8" rx="3" fill="currentColor" opacity="0.5" />
              <rect className="leg-left" x="16" y="22" width="6" height="26" rx="2" fill="currentColor" opacity="0.5" />
              <rect className="leg-right" x="74" y="22" width="6" height="26" rx="2" fill="currentColor" opacity="0.5" />
            </svg>

            {/* tablecloth draping on hover */}
            <svg
              viewBox="0 0 96 40"
              className="cloth absolute bottom-[26px] h-8 w-24 text-orange-400"
              fill="none"
            >
              <path
                d="M4 4 Q48 -4 92 4 L92 20 Q48 30 4 20 Z"
                fill="currentColor"
              />
            </svg>

            {/* plus badge */}
            <div className="plus-badge absolute -top-1 flex h-11 w-11 items-center justify-center rounded-full bg-orange-500 text-lg text-white shadow-md ring-4 ring-orange-100">
              <GrAdd />
            </div>
          </div>

          <div className="px-4 text-center">
            <h2 className="text-lg font-bold tracking-tight text-gray-900">
              Add Table
            </h2>

            <p className="mt-1 text-sm leading-snug text-gray-500">
              Create a new dining table
            </p>

            <span className="mt-3 inline-block -translate-y-1 text-xs font-semibold text-orange-500 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              Click to add →
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddTable;