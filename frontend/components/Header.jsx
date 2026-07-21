import React from "react";
import { Menu, Bell, Leaf } from "lucide-react";

const Header = ({ notificationCount = 0, onMenuClick, onBellClick }) => {
  return (
    <header className="flex items-start justify-between px-4 pt-4 pb-3">
      <button
        onClick={onMenuClick}
        className="mt-1 text-slate-800 active:scale-90 transition-transform"
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6" strokeWidth={2} />
      </button>

      <div className="flex flex-col items-center">
        <Leaf className="h-5 w-5 text-red-700 mb-0.5" strokeWidth={2} />
        <h1 className="text-2xl font-bold text-red-700 leading-tight tracking-tight">
          Spice Garden
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">Good food, good mood</p>
      </div>

      <button
        onClick={onBellClick}
        className="relative mt-1 text-slate-800 active:scale-90 transition-transform"
        aria-label="Notifications"
      >
        <Bell className="h-6 w-6" strokeWidth={2} />
        {notificationCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[10px] font-semibold text-white">
            {notificationCount}
          </span>
        )}
      </button>
    </header>
  );
};

export default Header;