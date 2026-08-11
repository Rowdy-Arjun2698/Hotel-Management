import { useState } from "react";
import { useParams } from "react-router-dom";
import { BellRing } from "lucide-react";
import axios from "axios";
import PageHeader from "../components/PageHeader";

const CallWaiterPage = () => {
  const url = import.meta.env.VITE_BACKEND_URL;
  const { tableId } = useParams();

  const [called, setCalled] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCall = async () => {
    setLoading(true);
    try {
      await axios.post(
        `${url}/api/customer/call-waiter/${tableId}`,
        {},
        { withCredentials: true }
      );
      setCalled(true);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-4">
      <PageHeader title="Call Waiter" />

      <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white px-6 py-10 text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-amber-50">
          <BellRing size={40} className="text-amber-500" />
        </div>

        <p className="text-base font-semibold text-gray-900">
          {called ? "Waiter notified!" : "Need help?"}
        </p>
        <p className="mt-1 text-sm text-gray-400">
          {called
            ? "Our waiter has been notified and will be with you shortly."
            : "Our waiter will be with you shortly."}
        </p>

        <button
          onClick={handleCall}
          disabled={called || loading}
          className="mt-6 w-full rounded-xl bg-red-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
        >
          {loading ? "Calling..." : called ? "Waiter Called" : "Call Waiter"}
        </button>

        <p className="mt-4 text-xs text-gray-400">We appreciate your patience.</p>
      </div>
    </div>
  );
};

export default CallWaiterPage;
