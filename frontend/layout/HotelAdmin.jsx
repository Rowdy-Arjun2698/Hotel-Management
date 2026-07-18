import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const HotelAdmin = () => {
  return (
    <div className="h-screen w-screen bg-gray-100 flex overflow-hidden">

      {/* Sidebar */}
      <aside className="w-64 h-screen bg-[#151514] flex-shrink-0 shadow-xl">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto bg-gray-100">
        <div className="min-h-full ;-0 m-0">
          <Outlet />
        </div>
      </main>

    </div>
  );
};

export default HotelAdmin;