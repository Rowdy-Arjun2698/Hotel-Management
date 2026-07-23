import React from "react";
import { NavLink,useParams } from "react-router-dom";
import { useContext } from "react";
import { UtensilsCrossed, Receipt, ConciergeBell, MoreHorizontal } from "lucide-react";
import { CustomerContext } from "../context/CustomerContext";
import Loader from "../components/Loader"


const BottomNav = () => {

  const {tableId}=useParams();

if(!tableId){
    return <Loader message="Loading restaurant..." />;
}
const navItems = [
  { to: `/customer/${tableId}/cmenu`, label: "Menu", icon: UtensilsCrossed, end: true },
  { to: `/customer/${tableId}/COrders`, label: "Orders", icon: Receipt },
  { to: "/call-waiter", label: "Call Waiter", icon: ConciergeBell },
  { to: "/more", label: "More", icon: MoreHorizontal },
];
  return (
    <nav className="flex items-center justify-around px-2 pt-2.5 pb-1.5">
      {navItems.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className="flex flex-col items-center justify-center gap-1 flex-1 group"
        >
          {({ isActive }) => (
            <>
              <Icon
                strokeWidth={isActive ? 2.2 : 1.8}
                className={`h-6 w-6 transition-all duration-200 ${
                  isActive ? "text-red-700" : "text-slate-500 group-active:scale-90"
                }`}
              />
              <span
                className={`text-[11px] transition-all duration-200 ${
                  isActive ? "text-red-700 font-semibold" : "text-slate-500 font-medium"
                }`}
              >
                {label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;