import React from "react";
import {
  Home,
  FileText,
  Table2,
  Users,
  BarChart3,
  Settings,
  Bell,
  CheckCircle2,
  TrendingUp,
  Leaf,
  UtensilsCrossed,
} from "lucide-react";

const FEATURES = [
  { icon: UtensilsCrossed, label: "Order\nManagement" },
  { icon: Table2, label: "Table\nManagement" },
  { icon: Users, label: "Customer\nManagement" },
  { icon: BarChart3, label: "Analytics &\nReports" },
];

const TABLES = [
  { flip: false, delay: "0s" },
  { flip: true, delay: "0.6s" },
  { flip: false, delay: "1.1s" },
  { flip: true, delay: "0.3s" },
];

const HeroPanel = () => {
  return (
    <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-[#FBF9F6] to-[#F1EBE2]">
      {/* soft ambient glows */}
      <div className="absolute -top-24 right-0 h-[420px] w-[420px] rounded-full bg-[#E07B39]/10 blur-[110px]" />
      <div className="absolute bottom-0 left-1/4 h-[320px] w-[320px] rounded-full bg-[#3FB27F]/10 blur-[110px]" />

      {/* headline + features */}
      <div className="relative z-10 px-12 pt-16 xl:px-16">
        <h1
          className="text-4xl font-bold leading-[1.15] text-[#201C18] xl:text-[2.75rem]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Manage Your Hotel
          <br />
          <span className="text-[#E07B39]">Effortlessly</span>
        </h1>

        <p className="mt-5 max-w-md text-[15px] leading-relaxed text-[#8A8578]">
          Streamline orders, manage tables, delight customers and grow your
          business — all in one place.
        </p>

        <div className="mt-9 flex gap-5">
          {FEATURES.map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-2.5 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-black/5 bg-white shadow-sm transition-transform duration-300 hover:-translate-y-1">
                <Icon size={22} className="text-[#E07B39]" strokeWidth={1.8} />
              </div>
              <span className="whitespace-pre-line text-[11px] font-medium leading-tight text-[#8A8578]">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* floating: Table ready card */}
      <div
        className="absolute right-[19rem] top-10 z-20 flex items-center gap-2.5 rounded-xl border border-black/5 bg-white px-3.5 py-2.5 shadow-lg"
        style={{ animation: "float-y 6s ease-in-out infinite" }}
      >
        <div className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-[#E07B39]/12">
          <UtensilsCrossed size={15} className="text-[#E07B39]" />
        </div>
        <div className="leading-tight">
          <p className="text-xs font-semibold text-[#201C18]">Table 5</p>
          <p className="text-[10px] text-[#3FB27F]">Order Ready</p>
        </div>
        <CheckCircle2 size={16} className="ml-1 flex-none text-[#3FB27F]" />
      </div>

      {/* floating: New order badge */}
      <div
        className="absolute right-10 top-2 z-20 flex items-center gap-2.5 rounded-xl border border-black/5 bg-white px-3.5 py-2.5 shadow-lg"
        style={{ animation: "float-y-slow 7s ease-in-out infinite", animationDelay: "0.5s" }}
      >
        <div className="relative flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-[#E07B39]/12">
          <Bell size={15} className="text-[#E07B39]" />
          <span
            className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#E4483A] text-[9px] font-bold text-white"
            style={{ animation: "pulse-ring 2s ease-out infinite" }}
          >
            3
          </span>
        </div>
        <div className="leading-tight">
          <p className="text-xs font-semibold text-[#201C18]">New Order</p>
          <p className="text-[10px] text-[#8A8578]">Table 8 · 2 items</p>
        </div>
      </div>

      {/* floating: revenue mini card */}
      <div
        className="absolute bottom-[15.5rem] left-14 z-20 w-[180px] rounded-2xl border border-black/5 bg-white p-4 shadow-xl"
        style={{ animation: "float-y 8s ease-in-out infinite", animationDelay: "1s" }}
      >
        <div className="flex items-start justify-between">
          <p className="text-[11px] text-[#8A8578]">Today's Revenue</p>
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#3FB27F]">
            <TrendingUp size={12} className="text-white" />
          </div>
        </div>
        <p className="mt-1 text-xl font-bold text-[#201C18]">₹25,430</p>
        <p className="mt-0.5 text-[11px] font-medium text-[#3FB27F]">+8.5%</p>
        <svg viewBox="0 0 140 36" className="mt-2 w-full">
          <polyline
            points="0,28 20,24 40,26 60,16 80,20 100,10 120,14 140,4"
            fill="none"
            stroke="#3FB27F"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="200"
            style={{ animation: "chart-draw 2.5s ease-out forwards" }}
          />
        </svg>
      </div>

      {/* dashboard mockup */}
      <div
        className="absolute bottom-16 right-8 z-10 flex w-[340px] overflow-hidden rounded-2xl border border-black/5 bg-white shadow-2xl"
        style={{
          transform: "perspective(1200px) rotateY(-6deg) rotateX(2deg)",
          animation: "float-y-slow 9s ease-in-out infinite",
        }}
      >
        {/* sidebar */}
        <div className="flex w-12 flex-none flex-col items-center gap-4 bg-[#232019] py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E07B39]">
            <Home size={15} className="text-white" />
          </div>
          {[FileText, Table2, Users, BarChart3, Settings].map((Icon, i) => (
            <Icon key={i} size={15} className="text-white/40" />
          ))}
        </div>

        {/* content */}
        <div className="flex-1 p-4">
          <p className="text-[10px] text-[#8A8578]">Dashboard</p>
          <p className="mt-0.5 text-sm font-semibold text-[#201C18]">
            Welcome back, Admin 👋
          </p>

          <div className="mt-3 grid grid-cols-3 gap-1.5">
            <div className="rounded-lg bg-[#F7F4EF] p-2">
              <p className="text-[9px] text-[#8A8578]">Today's Orders</p>
              <p className="text-sm font-bold text-[#201C18]">126</p>
              <p className="text-[9px] font-medium text-[#3FB27F]">+12%</p>
            </div>
            <div className="rounded-lg bg-[#F7F4EF] p-2">
              <p className="text-[9px] text-[#8A8578]">Total Revenue</p>
              <p className="text-sm font-bold text-[#201C18]">₹25,430</p>
              <p className="text-[9px] font-medium text-[#3FB27F]">+8.5%</p>
            </div>
            <div className="rounded-lg bg-[#F7F4EF] p-2">
              <p className="text-[9px] text-[#8A8578]">Active Tables</p>
              <p className="text-sm font-bold text-[#201C18]">18/32</p>
              <p className="text-[9px] font-medium text-[#E07B39]">Busy</p>
            </div>
          </div>

          <div className="mt-2.5 space-y-1.5 rounded-lg bg-[#F7F4EF] p-2.5">
            <p className="mb-1 text-[9px] font-medium text-[#8A8578]">Recent Orders</p>
            {[
              { id: "#1254", table: "Table 12", status: "View all", color: "#8A8578" },
              { id: "#1253", table: "Table 7", status: "Preparing", color: "#E07B39" },
              { id: "#1252", table: "Table 3", status: "Ready", color: "#3FB27F" },
            ].map((o) => (
              <div key={o.id} className="flex items-center justify-between text-[9px]">
                <span className="text-[#201C18]/80">
                  Order {o.id} · {o.table}
                </span>
                <span style={{ color: o.color }} className="font-medium">
                  {o.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* animated restaurant floor strip */}
      <div className="absolute bottom-0 left-0 right-0 z-0 flex h-24 items-end justify-center gap-10 pb-4">
        {TABLES.map((t, i) => (
          <div key={i} className="relative h-14 w-14 flex-none">
            {/* chairs */}
            <span className="absolute -top-2.5 left-1/2 h-2.5 w-4 -translate-x-1/2 rounded-full bg-[#D9CBB8]" />
            <span className="absolute -bottom-2.5 left-1/2 h-2.5 w-4 -translate-x-1/2 rounded-full bg-[#D9CBB8]" />
            <span className="absolute left-[-10px] top-1/2 h-4 w-2.5 -translate-y-1/2 rounded-full bg-[#D9CBB8]" />
            <span className="absolute right-[-10px] top-1/2 h-4 w-2.5 -translate-y-1/2 rounded-full bg-[#D9CBB8]" />
            {/* tabletop */}
            <div className="relative h-14 w-14 rounded-2xl bg-gradient-to-br from-[#E9C79A] to-[#D9AE72] shadow-md">
              <span
                className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E07B39]"
                style={{ animation: "candle-flicker 2.4s ease-in-out infinite", animationDelay: t.delay }}
              />
            </div>
          </div>
        ))}

        {/* potted plant */}
        <div className="mb-1 flex flex-none flex-col items-center" style={{ animation: "leaf-sway 5s ease-in-out infinite", transformOrigin: "bottom center" }}>
          <Leaf size={22} className="text-[#3FB27F]" />
          <div className="mt-0.5 h-3 w-4 rounded-sm bg-[#D9AE72]" />
        </div>

        {/* counter with glowing edge */}
        <div className="relative mb-0 h-16 w-28 flex-none rounded-t-xl bg-gradient-to-b from-[#E9C79A] to-[#C99A5F] shadow-md">
          <span
            className="absolute bottom-0 left-0 right-0 h-1.5 rounded-b-xl bg-[#E07B39]"
            style={{ animation: "led-glow 2.6s ease-in-out infinite", boxShadow: "0 0 12px 2px rgba(224,123,57,0.7)" }}
          />
        </div>
      </div>
    </div>
  );
};

export default HeroPanel;