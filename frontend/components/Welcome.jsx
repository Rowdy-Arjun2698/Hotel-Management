import React, { useEffect, useState,useContext } from "react";
import { useSearchParams, useNavigate,useParams } from "react-router-dom";
import { Leaf, MapPin, UtensilsCrossed, ArrowRight } from "lucide-react";
import { CustomerContext } from "../context/CustomerContext";
import Loader from "../components/Loader";

const Welcome = () => {
  const { tableId } = useParams();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  // Values come from the QR code URL, e.g. /?table=05&outlet=Koramangala
 const {hotel, table}=useContext(CustomerContext);


if(!hotel || !table){
    return <Loader message="Loading restaurant..." />;
}

const urlk=`/customer/${table._id}/cmenu`

const tablenum = table.tableNumber;
const outlet = `${hotel.address}, ${hotel.city}`;
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative min-h-full overflow-hidden bg-gradient-to-b from-orange-50 via-white to-white">
      {/* Decorative background pattern */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 overflow-hidden">
        <div className="absolute -top-16 -left-10 h-52 w-52 rounded-full bg-red-100/70 blur-2xl" />
        <div className="absolute -top-8 -right-16 h-64 w-64 rounded-full bg-orange-100/70 blur-2xl" />
      </div>

      <div className="relative flex flex-col items-center px-6 pt-14 pb-10 text-center">
        {/* Brand mark */}
        <div
          className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-red-700 shadow-lg shadow-red-200 transition-all duration-700 ease-out ${
            mounted ? "opacity-100 scale-100" : "opacity-0 scale-75"
          }`}
        >
          <Leaf className="h-8 w-8 text-white" strokeWidth={2} />
        </div>

        <h1
          className={`mt-5 text-[26px] font-bold text-slate-900 transition-all duration-700 delay-100 ease-out ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        >
          Welcome to Spice Garden
        </h1>
        <p
          className={`mt-1.5 text-sm text-slate-500 transition-all duration-700 delay-150 ease-out ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        >
          Good food, good mood — glad you're here
        </p>

        {/* Table / outlet session card */}
        <div
          className={`mt-8 w-full rounded-2xl border border-orange-100 bg-white p-5 shadow-sm transition-all duration-700 delay-200 ease-out ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
        >
          <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-emerald-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Active Session
          </div>

          <div className="mt-4 flex items-center justify-center gap-8">
            <div className="flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-50">
                <UtensilsCrossed className="h-5 w-5 text-red-700" strokeWidth={2} />
              </div>
              <span className="mt-2 text-[11px] uppercase tracking-wide text-slate-400">
                Table No.
              </span>
              <span className="text-lg font-bold text-slate-900">{tablenum}</span>
            </div>

            <div className="h-10 w-px bg-slate-100" />

            <div className="flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-50">
                <MapPin className="h-5 w-5 text-red-700" strokeWidth={2} />
              </div>
              <span className="mt-2 text-[11px] uppercase tracking-wide text-slate-400">
                Outlet
              </span>
              <span className="max-w-[8rem] text-sm font-semibold text-slate-900">
                {outlet}
              </span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => navigate(urlk)}
          className={`mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-red-700 py-3.5 text-sm font-semibold text-white shadow-md shadow-red-200 transition-all duration-700 delay-300 ease-out active:scale-[0.98] ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
        >
          Explore Menu
          <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
        </button>

        <p
          className={`mt-4 text-[11px] text-slate-400 transition-all duration-700 delay-300 ease-out ${
            mounted ? "opacity-100" : "opacity-0"
          }`}
        >
          Your order will be linked to Table {tablenum} automatically
        </p>
      </div>
    </div>
  );
};

export default Welcome;