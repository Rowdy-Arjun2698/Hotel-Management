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
import { NavLink,useNavigate } from "react-router-dom";
import axios from "axios";

const Sidebar = () => {
    const navigate = useNavigate();
    const logout = () => {
       const response=axios.get("http://localhost:3000/api/hotel/logout",{withCredentials:true})    
       navigate("/")                
    };
  return (
    <div className="side w-full h-full bg-transparent flex flex-col ">
      <div className="logo w-full h-[10%] bg-transparent flex justify-center items-center  ">
        <span className=" bg-red-500 p-3 m-3 ">Only for the logo</span>
      </div>
      <div className="featurelist w-full h-[90%] bg-transparent flex flex-col justify-start items-center text-white p-4 gap-4">
        <NavLink
          to="/hoteladmin/Home"
          className={({ isActive }) =>
            `w-full h-[10%] flex justify-center items-center gap-3 rounded-lg cursor-pointer ${
              isActive ? "bg-[#d2873aff]" : "hover:bg-[#d2873aff]"
            }`
          }
        >
          <IoHome /> Home
        </NavLink>
        <NavLink
  to="/hoteladmin/Dashboard"
  className={({ isActive }) =>
    `w-full h-[10%] flex justify-center items-center gap-3 rounded-lg cursor-pointer ${
      isActive ? "bg-[#d2873aff]" : "hover:bg-[#d2873aff]"
    }`
  }
>
          <MdSpaceDashboard /> Dashboard
        </NavLink>
       <NavLink
  to="/hoteladmin/Menu"
  className={({ isActive }) =>
    `w-full h-[10%] flex justify-center items-center gap-3 rounded-lg cursor-pointer ${
      isActive ? "bg-[#d2873aff]" : "hover:bg-[#d2873aff]"
    }`
  }
>
          <IoRestaurant /> Menu
        </NavLink>
       <NavLink
  to="/hoteladmin/Table"
  className={({ isActive }) =>
    `w-full h-[10%] flex justify-center items-center gap-3 rounded-lg cursor-pointer ${
      isActive ? "bg-[#d2873aff]" : "hover:bg-[#d2873aff]"
    }`
  }
>
          <MdTableRestaurant /> Table Management
        </NavLink>
       <NavLink
  to="/hoteladmin/Orders"
  className={({ isActive }) =>
    `w-full h-[10%] flex justify-center items-center gap-3 rounded-lg cursor-pointer ${
      isActive ? "bg-[#d2873aff]" : "hover:bg-[#d2873aff]"
    }`
  }
>
          <MdKitchen /> Orders
        </NavLink>
      <NavLink
  to="/hoteladmin/WaiterDashboard"
  className={({ isActive }) =>
    `w-full h-[10%] flex justify-center items-center gap-3 rounded-lg cursor-pointer ${
      isActive ? "bg-[#d2873aff]" : "hover:bg-[#d2873aff]"
    }`
  }
>
          <RiServiceBellFill /> Waiter dashboard
        </NavLink>
        <NavLink
  to="/hoteladmin/Account"
  className={({ isActive }) =>
    `w-full h-[10%] flex justify-center items-center gap-3 rounded-lg cursor-pointer ${
      isActive ? "bg-[#d2873aff]" : "hover:bg-[#d2873aff]"
    }`
  }
>
          <MdOutlineAccountBalanceWallet /> Account
        </NavLink>
        <NavLink
  to="/hoteladmin/Reports"
  className={({ isActive }) =>
    `w-full h-[10%] flex justify-center items-center gap-3 rounded-lg cursor-pointer ${
      isActive ? "bg-[#d2873aff]" : "hover:bg-[#d2873aff]"
    }`
  }
>
          <TbReportAnalytics /> Reports
        </NavLink>
        <NavLink
  to="/hoteladmin/Profile"
  className={({ isActive }) =>
    `w-full h-[10%] flex justify-center items-center gap-3 rounded-lg cursor-pointer ${
      isActive ? "bg-[#d2873aff]" : "hover:bg-[#d2873aff]"
    }`
  }
>
          <CgProfile /> Profile
        </NavLink>
       <NavLink
  to="/hoteladmin/Settings"
  className={({ isActive }) =>
    `w-full h-[10%] flex justify-center items-center gap-3 rounded-lg cursor-pointer ${
      isActive ? "bg-[#d2873aff]" : "hover:bg-[#d2873aff]"
    }`
  }
>
          <IoSettings /> Settings
        </NavLink>
        <button className="w-full text-red-500 h-[10%] bg-transparent flex justify-center items-center rounded-lg cursor-pointer gap-3 hover:bg-red-500 hover:text-white   " onClick={logout}>
          Logout <FiLogOut />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
