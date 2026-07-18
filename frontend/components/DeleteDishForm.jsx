import { AlertTriangle, X, UtensilsCrossed, Trash2 } from "lucide-react";
import { useEffect } from "react";

// ----------------------------------------------------------------------
// DeleteDishForm
// Pass: dishName, image, onConfirm, onCancel
// ----------------------------------------------------------------------
const DeleteDishForm = ({ dishName, image, onConfirm, onCancel,deldish }) => {
  
  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onCancel?.();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl shadow-black/20 ring-1 ring-black/5
        p-7 animate-[popIn_0.22s_cubic-bezier(0.16,1,0.3,1)]"
      >
        {/* Close */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center
          text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-150 cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Warning icon */}
        <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-5 ring-1 ring-red-100">
          <AlertTriangle size={26} className="text-red-500" strokeWidth={2.2} />
        </div>

        {/* Copy */}
        <h2 className="text-lg font-bold text-gray-900 mb-1.5">
          Delete this dish?
        </h2>
        <p className="text-sm text-gray-500 leading-relaxed mb-6">
          This will permanently remove the dish from your menu. This action
          can't be undone.
        </p>

        {/* Dish preview */}
        <div className="flex items-center gap-3.5 bg-gray-50 rounded-2xl p-3.5 mb-7 ring-1 ring-black/5">
          <div className="w-14 h-14 rounded-xl bg-white overflow-hidden shrink-0 flex items-center justify-center ring-1 ring-black/5">
            {deldish.image ? (
  <img
    src={`http://localhost:3000${deldish.image}`}
    alt={deldish.dishName}
    className="w-full h-full object-cover"
  />
) : (
  <UtensilsCrossed size={20} className="text-[#d2873a]" />
)}
          </div>
          <p className="font-semibold text-gray-800 truncate">
            {deldish.dishName || "Unnamed Dish"}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="flex-1 h-12 rounded-full bg-gray-100 text-gray-700 font-semibold
            cursor-pointer transition-all duration-200 ease-out
            hover:bg-gray-200 active:scale-[0.97]"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 h-12 rounded-full bg-red-600 text-white font-semibold
            flex items-center justify-center gap-2 cursor-pointer
            transition-all duration-200 ease-out
            hover:bg-red-700 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97]
            shadow-sm shadow-red-600/30"
          >
            <Trash2 size={17} />
            Delete
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.94) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default DeleteDishForm;