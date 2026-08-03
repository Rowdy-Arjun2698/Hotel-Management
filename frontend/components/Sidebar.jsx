import React from "react";
import { IoHome, IoRestaurant, IoSettings } from "react-icons/io5";
import {
  MdSpaceDashboard,
  MdTableRestaurant,
  MdKitchen,
  MdOutlineAccountBalanceWallet,
} from "react-icons/md";
import { RiServiceBellFill } from "react-icons/ri";
import { TbReportAnalytics } from "react-icons/tb";
import { FiLogOut } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";


const navLinkClass = ({ isActive }) =>
  `group relative w-full h-12 flex justify-center items-center gap-3 rounded-lg cursor-pointer font-medium text-[15px] transition-all duration-300 ease-out overflow-hidden
  ${
    isActive
      ? "bg-[#d2873a] text-white shadow-md shadow-[#d2873a]/30"
      : "text-white/70 hover:text-white hover:bg-[#d2873a]/20 hover:pl-1"
  }`;

const Sidebar = () => {
  const navigate = useNavigate();
  const logout = () => {
    const response = axios.get("http://localhost:3000/api/hotel/logout", {
      withCredentials: true,
    });
    navigate("/");
  };

  return (
    <div className="side w-full h-full bg-transparent flex flex-col">
      <div className="logo w-auto h-auto bg-transparent flex justify-center items-center">
        
        <img
        src="../assets/Logo.svg"
        alt="OrderBridge"
        className="w-auto h-auto fill-transparent"
      />
      </div>

      <div className="featurelist w-full h-[90%] bg-transparent flex flex-col justify-start items-center text-white p-4 gap-4">
        <NavLink to="/hoteladmin/Home" className={navLinkClass}>
          {({ isActive }) => (
            <>
              <span
                className={`absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-white transition-all duration-300 ${
                  isActive ? "opacity-100 scale-100" : "opacity-0 scale-0"
                }`}
              />
              <IoHome className="transition-transform duration-300 group-hover:scale-110" />
              Home
            </>
          )}
        </NavLink>

        <NavLink to="/hoteladmin/Dashboard" className={navLinkClass}>
          {({ isActive }) => (
            <>
              <span
                className={`absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-white transition-all duration-300 ${
                  isActive ? "opacity-100 scale-100" : "opacity-0 scale-0"
                }`}
              />
              <MdSpaceDashboard className="transition-transform duration-300 group-hover:scale-110" />
              Dashboard
            </>
          )}
        </NavLink>

        <NavLink to="/hoteladmin/Menu" className={navLinkClass}>
          {({ isActive }) => (
            <>
              <span
                className={`absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-white transition-all duration-300 ${
                  isActive ? "opacity-100 scale-100" : "opacity-0 scale-0"
                }`}
              />
              <IoRestaurant className="transition-transform duration-300 group-hover:scale-110" />
              Menu
            </>
          )}
        </NavLink>

        <NavLink to="/hoteladmin/Table" className={navLinkClass}>
          {({ isActive }) => (
            <>
              <span
                className={`absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-white transition-all duration-300 ${
                  isActive ? "opacity-100 scale-100" : "opacity-0 scale-0"
                }`}
              />
              <MdTableRestaurant className="transition-transform duration-300 group-hover:scale-110" />
              Table Management
            </>
          )}
        </NavLink>

        <NavLink to="/hoteladmin/Orders" className={navLinkClass}>
          {({ isActive }) => (
            <>
              <span
                className={`absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-white transition-all duration-300 ${
                  isActive ? "opacity-100 scale-100" : "opacity-0 scale-0"
                }`}
              />
              <MdKitchen className="transition-transform duration-300 group-hover:scale-110" />
              Orders
            </>
          )}
        </NavLink>

        <NavLink to="/hoteladmin/WaiterDashboard" className={navLinkClass}>
          {({ isActive }) => (
            <>
              <span
                className={`absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-white transition-all duration-300 ${
                  isActive ? "opacity-100 scale-100" : "opacity-0 scale-0"
                }`}
              />
              <RiServiceBellFill className="transition-transform duration-300 group-hover:scale-110" />
              Waiter dashboard
            </>
          )}
        </NavLink>

        <NavLink to="/hoteladmin/Account" className={navLinkClass}>
          {({ isActive }) => (
            <>
              <span
                className={`absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-white transition-all duration-300 ${
                  isActive ? "opacity-100 scale-100" : "opacity-0 scale-0"
                }`}
              />
              <MdOutlineAccountBalanceWallet className="transition-transform duration-300 group-hover:scale-110" />
              Account
            </>
          )}
        </NavLink>

        <NavLink to="/hoteladmin/Reports" className={navLinkClass}>
          {({ isActive }) => (
            <>
              <span
                className={`absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-white transition-all duration-300 ${
                  isActive ? "opacity-100 scale-100" : "opacity-0 scale-0"
                }`}
              />
              <TbReportAnalytics className="transition-transform duration-300 group-hover:scale-110" />
              Reports
            </>
          )}
        </NavLink>

        <NavLink to="/hoteladmin/Profile" className={navLinkClass}>
          {({ isActive }) => (
            <>
              <span
                className={`absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-white transition-all duration-300 ${
                  isActive ? "opacity-100 scale-100" : "opacity-0 scale-0"
                }`}
              />
              <CgProfile className="transition-transform duration-300 group-hover:scale-110" />
              Profile
            </>
          )}
        </NavLink>

        <NavLink to="/hoteladmin/Settings" className={navLinkClass}>
          {({ isActive }) => (
            <>
              <span
                className={`absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-white transition-all duration-300 ${
                  isActive ? "opacity-100 scale-100" : "opacity-0 scale-0"
                }`}
              />
              <IoSettings className="transition-transform duration-300 group-hover:scale-110" />
              Settings
            </>
          )}
        </NavLink>

        <button
          className="group w-full text-red-400 h-12 bg-transparent flex justify-center items-center rounded-lg cursor-pointer gap-3 font-medium text-[15px] transition-all duration-300 ease-out hover:bg-red-500 hover:text-white hover:shadow-md hover:shadow-red-500/30"
          onClick={logout}
        >
          Logout
          <FiLogOut className="transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;