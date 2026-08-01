import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Pencil,
  User,
  Mail,
  Phone,
  MapPin,
  Star,
  Briefcase,
  Clock,
  UtensilsCrossed,
  Info,
  Calendar,
  History,
  ShieldCheck,
} from "lucide-react";

function Field({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-full bg-orange-50 text-orange-500">
        <Icon size={16} strokeWidth={2} />
      </span>
      <div className="min-w-0">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="mt-0.5 break-words text-[15px] font-medium text-gray-900">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-0.5 text-[15px] font-medium text-gray-900">
        {value || "—"}
      </p>
    </div>
  );
}

function SectionCard({ icon: Icon, title, children }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Icon size={18} className="text-orange-500" strokeWidth={2} />
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="mb-5 border-t border-gray-200" />
      {children}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="min-h-full bg-gray-100 p-8">
      <div className="mb-8 h-8 w-56 animate-pulse rounded-md bg-gray-200" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[340px_1fr]">
        <div className="h-[500px] animate-pulse rounded-xl bg-gray-200" />
        <div className="space-y-6">
          <div className="h-40 animate-pulse rounded-xl bg-gray-200" />
          <div className="h-32 animate-pulse rounded-xl bg-gray-200" />
          <div className="h-28 animate-pulse rounded-xl bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

const Profile = () => {
  const [hotel, setHotel] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | error | success

  async function fetchHotel() {
    setStatus("loading");
    try {
      const response = await axios.get(
        "http://localhost:3000/api/hotel/fetchuser",
        { withCredentials: true }
      );
      if (response.data?.success) {
        setHotel(response.data.user);
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  useEffect(() => {
    fetchHotel();
  }, []);

  if (status === "loading") return <Skeleton />;

  if (status === "error") {
    return (
      <div className="flex min-h-full flex-col items-center justify-center gap-3 bg-gray-100 p-8 text-center">
        <p className="text-lg font-semibold text-gray-900">
          Couldn't load the profile
        </p>
        <p className="max-w-sm text-sm text-gray-500">
          Check your connection and try again.
        </p>
        <button
          onClick={fetchHotel}
          className="mt-1 rounded-lg bg-orange-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          Retry
        </button>
      </div>
    );
  }

  const rating = Math.round(hotel?.rating ?? 5);
  const address = hotel?.address || {};
  const addressLine =
    hotel?.addressLine ||
    address?.line ||
    [address?.locality, address?.city].filter(Boolean).join(", ");

  return (
    <div className="min-h-full bg-gray-100 px-8 py-8">
      {/* Page header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hotel Profile</h1>
          <p className="mt-1 text-sm text-gray-500">
            View and manage your hotel information
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600">
          <Pencil size={16} />
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[340px_1fr]">
        {/* Left: profile card */}
        <div className="h-fit rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-gray-900">
              {hotel?.logoUrl ? (
                <img
                  src={hotel.logoUrl}
                  alt={hotel?.hotelName || "Hotel logo"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <UtensilsCrossed size={30} className="text-orange-400" />
              )}
            </div>

            <h2 className="mt-4 text-xl font-bold text-gray-900">
              {hotel?.hotelName || "Untitled Restaurant"}
            </h2>

            <div className="mt-1.5 flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={17}
                  className={
                    i < rating
                      ? "fill-orange-400 text-orange-400"
                      : "fill-gray-200 text-gray-200"
                  }
                />
              ))}
            </div>
          </div>

          <div className="my-6 border-t border-gray-200" />

          <div className="space-y-5">
            <Field icon={User} label="Owner Name" value={hotel?.ownerName} />
            <Field icon={Mail} label="Email" value={hotel?.email} />
            <Field icon={Phone} label="Phone" value={hotel?.phone} />
            <Field
              icon={MapPin}
              label="Address"
              value={
                addressLine
                  ? `${addressLine}${
                      address?.state ? ", " + address.state : ""
                    }${address?.pincode ? " - " + address.pincode : ""}`
                  : hotel?.fullAddress
              }
            />
          </div>
        </div>

        {/* Right: detail sections */}
        <div className="space-y-6">
          <SectionCard icon={Briefcase} title="Business Information">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-3">
              <div>
                <p className="text-sm text-gray-500">GST Enabled</p>
                <span
                  className={
                    "mt-1.5 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold " +
                    (hotel?.gstEnabled
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500")
                  }
                >
                  {hotel?.gstEnabled ? "Yes" : "No"}
                </span>
              </div>
              <InfoItem label="GST Number" value={hotel?.gstNumber} />
              <InfoItem
                label="GST Percentage"
                value={
                  hotel?.gstPercentage != null
                    ? `${hotel.gstPercentage}%`
                    : null
                }
              />
              <div className="sm:col-span-3">
                <InfoItem label="FSSAI Number" value={hotel?.fssaiNumber} />
              </div>
            </div>
          </SectionCard>

          <SectionCard icon={Clock} title="Restaurant Timing">
            <div className="grid grid-cols-2 gap-6">
              <InfoItem label="Opening Time" value={hotel?.openingTime} />
              <InfoItem label="Closing Time" value={hotel?.closingTime} />
            </div>
          </SectionCard>

          <SectionCard icon={UtensilsCrossed} title="Restaurant Capacity">
            <InfoItem label="Total Tables" value={hotel?.totalTables} />
          </SectionCard>

          <SectionCard icon={Info} title="Other Information">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <InfoItem label="City" value={address?.city} />
              <InfoItem label="Logo URL" value={hotel?.logoUrl} />
              <InfoItem label="Pincode" value={address?.pincode} />
              <InfoItem
                label="Registered On"
                value={formatDate(hotel?.registeredOn || hotel?.createdAt)}
              />
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Footer strip */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-6 rounded-xl border border-orange-100 bg-orange-50 px-7 py-5">
        <div className="flex items-center gap-3">
          <Calendar size={18} className="text-orange-500" />
          <div>
            <p className="text-sm text-gray-500">Account Created</p>
            <p className="text-[14px] font-medium text-gray-900">
              {formatDate(hotel?.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <History size={18} className="text-orange-500" />
          <div>
            <p className="text-sm text-gray-500">Last Updated</p>
            <p className="text-[14px] font-medium text-gray-900">
              {formatDate(hotel?.updatedAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ShieldCheck size={18} className="text-orange-500" />
          <div>
            <p className="text-sm text-gray-500">Account Status</p>
            <span className="mt-0.5 inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
              {hotel?.status || "Active"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default Profile;