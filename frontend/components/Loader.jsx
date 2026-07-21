import React from "react";
import { Leaf } from "lucide-react";

const Loader = ({ message = "Getting things ready..." }) => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-white px-6">
      {/* Spinner with brand mark at center */}
      <div className="relative flex h-20 w-20 items-center justify-center">
        {/* Outer rotating ring */}
        <span className="absolute inset-0 rounded-full border-4 border-orange-100" />
        <span className="absolute inset-0 rounded-full border-4 border-transparent border-t-red-700 animate-spin" />

        {/* Soft pulsing glow */}
        <span className="absolute inset-1 rounded-full bg-orange-50 animate-pulse" />

        {/* Brand icon */}
        <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-red-700 shadow-md shadow-red-200">
          <Leaf className="h-5 w-5 text-white" strokeWidth={2} />
        </div>
      </div>

      {/* Brand name */}
      <h2 className="mt-6 text-lg font-bold text-red-700 tracking-tight">
        Spice Garden
      </h2>

      {/* Message with bouncing dots */}
      <div className="mt-2 flex items-center gap-1.5">
        <span className="text-sm text-slate-500">{message}</span>
        <span className="flex gap-0.5">
          <span className="h-1 w-1 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.3s]" />
          <span className="h-1 w-1 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.15s]" />
          <span className="h-1 w-1 rounded-full bg-slate-400 animate-bounce" />
        </span>
      </div>
    </div>
  );
};

export default Loader;