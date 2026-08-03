import { useState } from "react";
import {
  Bell,
  ChevronDown,
  Star,
  UtensilsCrossed,
  Store,
  MapPin,
  Phone,
  Utensils,
  QrCode,
  ShoppingBasket,
  ChefHat,
  Receipt,
  ArrowRight,
  ClipboardList,
  Table2,
  BookOpen,
  BarChart3,
  Users,
} from "lucide-react";

const STEPS = [
  {
    step: 1,
    icon: QrCode,
    badgeColor: "bg-orange-500",
    iconBg: "bg-orange-50 text-orange-500",
    title: "Scan QR Code",
    description: "Customer scans QR code on the table.",
  },
  {
    step: 2,
    icon: ShoppingBasket,
    badgeColor: "bg-green-500",
    iconBg: "bg-green-50 text-green-600",
    title: "Place Order",
    description: "Customer browses the menu and places order.",
  },
  {
    step: 3,
    icon: ChefHat,
    badgeColor: "bg-blue-500",
    iconBg: "bg-blue-50 text-blue-600",
    title: "Kitchen Receives",
    description: "Order is sent to the kitchen instantly.",
  },
  {
    step: 4,
    icon: UtensilsCrossed,
    badgeColor: "bg-amber-500",
    iconBg: "bg-amber-50 text-amber-600",
    title: "Order Served",
    description: "Food is prepared and served to the customer.",
  },
  {
    step: 5,
    icon: Receipt,
    badgeColor: "bg-purple-500",
    iconBg: "bg-purple-50 text-purple-600",
    title: "Bill & Payment",
    description: "Bill is generated and payment is completed.",
  },
];

const FEATURES = [
  {
    icon: ClipboardList,
    iconBg: "bg-orange-50 text-orange-500",
    ring: "hover:ring-orange-100",
    title: "Manage Orders",
    description: "Receive and track orders in real time. Keep your kitchen and service in sync.",
  },
  {
    icon: Table2,
    iconBg: "bg-green-50 text-green-600",
    ring: "hover:ring-green-100",
    title: "Manage Tables",
    description: "Organize your tables, track occupancy and improve customer flow.",
  },
  {
    icon: BookOpen,
    iconBg: "bg-blue-50 text-blue-600",
    ring: "hover:ring-blue-100",
    title: "Manage Menu",
    description: "Add, edit and update your menu items and availability in seconds.",
  },
  {
    icon: BarChart3,
    iconBg: "bg-purple-50 text-purple-600",
    ring: "hover:ring-purple-100",
    title: "Business Insights",
    description: "Get valuable insights and reports to grow your restaurant business.",
  },
];

// Simple original device-mockup illustration (laptop + phone).
function DeviceIllustration() {
  return (
    <svg viewBox="0 0 220 140" className="h-full w-full transition-transform duration-500 group-hover:scale-[1.03]">
      <rect x="10" y="10" width="140" height="88" rx="6" fill="#fdf2ee" stroke="#fca57d" strokeWidth="1.5" />
      <rect x="18" y="18" width="124" height="64" rx="3" fill="#fff" stroke="#fed7c3" />
      <rect x="24" y="26" width="40" height="6" rx="3" fill="#f97316" opacity="0.5" />
      <rect x="24" y="38" width="70" height="26" rx="3" fill="#ffedd5" />
      <rect x="98" y="38" width="30" height="26" rx="3" fill="#fed7aa" />
      <rect x="24" y="68" width="20" height="8" rx="2" fill="#fdba74" />
      <rect x="50" y="68" width="20" height="8" rx="2" fill="#fdba74" />
      <rect x="76" y="68" width="20" height="8" rx="2" fill="#fdba74" />
      <rect x="30" y="98" width="100" height="6" rx="3" fill="#fca57d" />
      <rect x="150" y="34" width="52" height="92" rx="10" fill="#fff" stroke="#fca57d" strokeWidth="1.5" />
      <rect x="156" y="44" width="40" height="60" rx="3" fill="#fdf2ee" />
      <circle cx="176" cy="114" r="3" fill="#f97316" opacity="0.6" />
      <circle cx="192" cy="130" r="10" fill="#ffedd5" />
      <path d="M187 130a5 5 0 0 1 10 0" stroke="#fb923c" strokeWidth="1.6" fill="none" />
    </svg>
  );
}

// Simple original storefront line-art illustration.
function StorefrontIllustration() {
  return (
    <svg viewBox="0 0 220 140" className="h-full w-full transition-transform duration-500 group-hover:scale-[1.03]">
      <rect x="30" y="55" width="120" height="60" rx="2" fill="none" stroke="#fdba74" strokeWidth="1.5" />
      <rect x="30" y="40" width="120" height="18" rx="2" fill="none" stroke="#fb923c" strokeWidth="1.5" />
      <rect x="70" y="75" width="40" height="40" fill="none" stroke="#fdba74" strokeWidth="1.5" />
      <path d="M70 95 h40" stroke="#fdba74" strokeWidth="1.2" />
      <path d="M90 75 v40" stroke="#fdba74" strokeWidth="1.2" />
      <rect x="130" y="80" width="14" height="35" fill="none" stroke="#fdba74" strokeWidth="1.5" />
      <text x="60" y="52" fontSize="9" fill="#fb923c" fontFamily="sans-serif" fontWeight="700">
        RESTAURANT
      </text>
      <circle cx="45" cy="20" r="9" fill="none" stroke="#fed7c3" strokeWidth="1.5" />
      <circle cx="175" cy="28" r="6" fill="none" stroke="#fed7c3" strokeWidth="1.5" />
      <path d="M20 115 h180" stroke="#fed7c3" strokeWidth="1.5" />
      <circle cx="170" cy="100" r="12" fill="none" stroke="#fdba74" strokeWidth="1.2" />
      <path d="M164 100 h12 M170 94 v12" stroke="#fdba74" strokeWidth="1" />
    </svg>
  );
}

const Home = ({
  adminName = "Arjun",
  hotelName = "Hotel Saffron",
  notificationCount = 2,
  user = { name: "Arjun Mehta", role: "Admin", avatar: null },
  hotel = {
    logoText: "HOTEL\nSAFFRON",
    name: "Hotel Saffron",
    isActive: true,
    rating: 4.8,
    reviewCount: 512,
    cuisineType: "Multi Cuisine",
    restaurantType: "Family Restaurant",
    address: "123, Shivaji Road, Dadar, Mumbai, Maharashtra 400014",
    phone: "+91 98765 43210",
    heroImage: null,
  },
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-full w-full space-y-5 bg-gray-100 px-8 py-8">
      {/* Greeting header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Good Morning, {adminName}! 👋
          </h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Welcome back to {hotelName}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button className="group relative flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-200 hover:text-orange-500 hover:shadow-md">
            <Bell size={18} className="transition-transform duration-200 group-hover:rotate-12" />
            {notificationCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-semibold text-white ring-2 ring-gray-100">
                {notificationCount}
              </span>
            )}
          </button>

          <div className="relative">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="flex items-center gap-2.5 rounded-lg px-2 py-1 transition-colors duration-200 hover:bg-white"
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-9 w-9 rounded-full object-cover ring-2 ring-transparent transition-all duration-200 group-hover:ring-orange-200"
                />
              ) : (
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-sm font-semibold text-orange-600">
                  {user.name.charAt(0)}
                </span>
              )}
              <div className="hidden text-left sm:block">
                <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-400">{user.role}</p>
              </div>
              <ChevronDown
                size={15}
                className={`text-gray-400 transition-transform duration-200 ${
                  menuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {menuOpen && (
              <ul className="absolute right-0 z-20 mt-2 w-40 origin-top-right space-y-0.5 rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg shadow-gray-900/5 animate-in fade-in zoom-in-95 duration-150">
                <li className="cursor-pointer rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100">
                  Profile
                </li>
                <li className="cursor-pointer rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100">
                  Settings
                </li>
                <li className="cursor-pointer rounded-lg px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50">
                  Logout
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Hotel profile card */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-md">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[120px_1fr_1.3fr]">
          <div className="group flex h-28 w-28 flex-none flex-col items-center justify-center rounded-xl bg-gray-950 text-center transition-transform duration-300 hover:scale-[1.03]">
            <span className="mb-1 flex h-7 w-7 items-center justify-center rounded-full bg-orange-500/20 text-orange-400 transition-transform duration-300 group-hover:rotate-12">
              <Store size={14} />
            </span>
            {hotel.logoText.split("\n").map((line, i) => (
              <span key={i} className="text-[11px] font-bold tracking-widest text-orange-400">
                {line}
              </span>
            ))}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-xl font-bold text-gray-900">{hotel.name}</h2>
              {hotel.isActive && (
                <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-600">
                  Active
                </span>
              )}
            </div>

            <div className="mt-1 flex items-center gap-1.5">
              <div className="flex items-center gap-0.5 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={13}
                    fill={i < Math.round(hotel.rating) ? "currentColor" : "none"}
                    className={i < Math.round(hotel.rating) ? "" : "text-gray-300"}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-gray-700">{hotel.rating}</span>
              <span className="text-xs text-gray-400">({hotel.reviewCount} Reviews)</span>
            </div>

            <dl className="mt-4 space-y-2.5">
              <div className="flex items-start gap-2.5">
                <UtensilsCrossed size={14} className="mt-0.5 flex-none text-gray-400" />
                <div className="text-sm">
                  <dt className="inline text-gray-500">Cuisine Type&nbsp;</dt>
                  <dd className="inline font-medium text-gray-800">{hotel.cuisineType}</dd>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Store size={14} className="mt-0.5 flex-none text-gray-400" />
                <div className="text-sm">
                  <dt className="inline text-gray-500">Restaurant Type&nbsp;</dt>
                  <dd className="inline font-medium text-gray-800">{hotel.restaurantType}</dd>
                </div>
              </div>
            </dl>
          </div>

          <div className="min-w-0">
            <dl className="space-y-2.5">
              <div className="flex items-start gap-2.5">
                <MapPin size={14} className="mt-0.5 flex-none text-gray-400" />
                <div className="text-sm">
                  <dt className="text-gray-500">Address</dt>
                  <dd className="font-medium text-gray-800">{hotel.address}</dd>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Phone size={14} className="mt-0.5 flex-none text-gray-400" />
                <div className="text-sm">
                  <dt className="inline text-gray-500">Phone&nbsp;</dt>
                  <dd className="inline font-medium text-gray-800">{hotel.phone}</dd>
                </div>
              </div>
            </dl>
          </div>
        </div>

        <div className="group mt-4 h-40 w-full overflow-hidden rounded-lg bg-gray-100 sm:h-48">
          {hotel.heroImage ? (
            <img
              src={hotel.heroImage}
              alt={hotel.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-gray-300">
              <Store size={28} />
            </div>
          )}
        </div>
      </div>

      {/* What is OrderBridge */}
      <div className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
        <div className="grid grid-cols-1 items-center gap-5 sm:grid-cols-[auto_1fr_180px]">
          <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-orange-50 text-orange-500 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
            <Utensils size={20} />
          </span>

          <div>
            <h3 className="text-[15px] font-bold text-gray-900">What is OrderBridge?</h3>
            <p className="mt-1 text-sm leading-relaxed text-gray-500">
              OrderBridge is a smart restaurant management platform that helps
              you manage orders, tables, menus, staff, and customers in one
              place. It simplifies your operations and helps your business
              grow.
            </p>
          </div>

          <div className="hidden h-24 w-full sm:block">
            <DeviceIllustration />
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-md">
        <h3 className="mb-5 text-[15px] font-bold text-gray-900">How It Works</h3>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          {STEPS.map((s, idx) => (
            <div key={s.step} className="flex flex-1 items-start gap-3 sm:flex-col sm:items-center sm:text-center">
              <div className="group relative flex-none cursor-default">
                <span
                  className={`flex h-14 w-14 items-center justify-center rounded-full ${s.iconBg} transition-all duration-300 group-hover:scale-110 group-hover:shadow-md`}
                >
                  <s.icon size={22} className="transition-transform duration-300 group-hover:-rotate-6" />
                </span>
                <span
                  className={`absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full ${s.badgeColor} text-[10px] font-bold text-white ring-2 ring-white transition-transform duration-300 group-hover:scale-110`}
                >
                  {s.step}
                </span>
              </div>

              <div className="sm:mt-1">
                <p className="text-sm font-semibold text-gray-900">{s.title}</p>
                <p className="mt-0.5 max-w-[140px] text-xs text-gray-500 sm:mx-auto">
                  {s.description}
                </p>
              </div>

              {idx < STEPS.length - 1 && (
                <ArrowRight
                  size={16}
                  className="mt-2 hidden flex-none text-gray-300 sm:block sm:self-center"
                  style={{ marginTop: "1.5rem" }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* How It Helps You */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-md">
        <h3 className="mb-4 text-[15px] font-bold text-gray-900">How It Helps You</h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className={`group rounded-xl border border-gray-100 p-4 ring-1 ring-transparent transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-lg hover:ring-4 ${f.ring}`}
            >
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${f.iconBg} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}
              >
                <f.icon size={18} />
              </span>
              <p className="mt-3 text-sm font-semibold text-gray-900">{f.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-gray-500">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* About Us */}
      <div className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
        <div className="grid grid-cols-1 items-center gap-5 sm:grid-cols-[auto_1fr_200px]">
          <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-orange-50 text-orange-500 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
            <Users size={20} />
          </span>

          <div>
            <h3 className="text-[15px] font-bold text-gray-900">About Us</h3>
            <p className="mt-1 text-sm leading-relaxed text-gray-500">
              We are passionate about simplifying restaurant operations using
              technology. Our mission is to empower restaurant owners with an
              easy-to-use platform that improves efficiency, reduces manual
              work, and enhances the overall dining experience.
            </p>
          </div>

          <div className="hidden h-24 w-full sm:block">
            <StorefrontIllustration />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;