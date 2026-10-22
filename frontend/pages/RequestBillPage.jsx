import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ClipboardX, PartyPopper } from "lucide-react";
import axios from "axios";
import PageHeader from "../components/PageHeader";

const RequestBillPage = () => {
  const url = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const { tableId } = useParams();

  // "checking" | "not-ready" | "ready"
  const [status, setStatus] = useState("checking");
  const [pendingItems, setPendingItems] = useState([]);
  const [generating, setGenerating] = useState(false);

  const checkStatus = async () => {
    setStatus("checking");
    try {
      const res = await axios.get(`${url}/api/customer/order-status`, {
        withCredentials: true,
      });
      if (res.data.allServed) {
        setStatus("ready");
      } else {
        setPendingItems(res.data.pendingItems || []);
        setStatus("not-ready");
      }
      console.log("Order status:", res.data);
    } catch (err) {
      console.log(err);
      setStatus("not-ready");
    }
  };

  useEffect(() => {
    if (tableId) checkStatus();
  }, [tableId]);

  const handleGenerateBill = async () => {
    setGenerating(true);
    try {
      await axios.post(
        `${url}/api/customer/generate-bill`,
        {},
        { withCredentials: true }
      );
      navigate(`/customer/${tableId}/more/bill-preview`);
    } catch (err) {
      console.log(err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="px-4 py-4">
      <PageHeader title="Request Bill" />

      <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white px-6 py-10 text-center">
        {status === "checking" && (
          <>
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-red-200 border-t-red-500" />
            </div>
            <p className="text-base font-semibold text-gray-900">Checking your order...</p>
            <p className="mt-1 text-sm text-gray-400">
              Please wait while we check if all your dishes are served.
            </p>
            <div className="mt-6 flex gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-gray-200" />
              <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
              <span className="h-1.5 w-1.5 rounded-full bg-gray-200" />
            </div>
          </>
        )}

        {status === "not-ready" && (
          <>
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-orange-50">
              <ClipboardX size={34} className="text-orange-400" />
            </div>
            <p className="text-base font-semibold text-gray-900">Bill isn't ready yet</p>
            <p className="mt-1 text-sm text-gray-400">
              Please wait until all your ordered dishes are served.
            </p>

            {pendingItems.length > 0 && (
              <div className="mt-5 w-full rounded-xl bg-gray-50 p-4 text-left">
                <p className="mb-2 text-xs font-semibold text-gray-500">Still preparing:</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  {pendingItems.map((item, idx) => (
                    <li key={idx}>• {item}</li>
                    
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={checkStatus}
              className="mt-6 w-full rounded-xl bg-red-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700"
            >
              Okay
            </button>
          </>
        )}

        {status === "ready" && (
          <>
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-500">
              <PartyPopper size={38} className="text-white" />
            </div>
            <p className="text-lg font-bold text-gray-900">Great! 🎉</p>
            <p className="mt-1 text-sm text-gray-400">All your dishes have been served.</p>
            <p className="text-sm text-gray-400">You can now generate your final bill.</p>

            <button
              onClick={handleGenerateBill}
              disabled={generating}
              className="mt-6 w-full rounded-xl bg-red-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
            >
              {generating ? "Generating..." : "Generate Bill"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default RequestBillPage;
