import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Check, Download } from "lucide-react";
import axios from "axios";

const AUTO_CLOSE_SECONDS = 118; // 01:58

const PaymentSuccessPage = () => {
  const url = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const { tableId } = useParams();

  const [bill, setBill] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(AUTO_CLOSE_SECONDS);

  useEffect(() => {
    const fetchBill = async () => {
      try {
        const res = await axios.get(`${url}/api/customer/bill/${tableId}`, {
          withCredentials: true,
        });
        setBill(res.data.bill);
      } catch (err) {
        console.log(err);
      }
    };
    if (tableId) fetchBill();
  }, [tableId]);

  useEffect(() => {
    if (secondsLeft <= 0) {
      navigate(`/customer/${tableId}/menu`, { replace: true });
      return;
    }
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft, tableId]);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  const handleDownload = async () => {
    try {
      const res = await axios.get(`${url}/api/customer/bill/${tableId}/download`, {
        withCredentials: true,
        responseType: "blob",
      });
      const blobUrl = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", `Bill-${bill?.billNumber || tableId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="px-4 py-4">
      <div className="rounded-2xl border border-gray-100 bg-white px-6 py-10 text-center">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-500">
          <Check size={44} className="text-white" strokeWidth={3} />
        </div>

        <p className="text-lg font-bold text-gray-900">Payment Successful!</p>
        <p className="mt-2 text-3xl font-extrabold text-green-600">
          ₹{bill ? bill.total.toFixed(2) : "0.00"}
        </p>
        <p className="mt-3 text-sm text-gray-400">
          Thank you for dining with us! Your bill is ready.
        </p>

        {bill && (
          <div className="mt-6 space-y-2 rounded-xl bg-gray-50 p-4 text-left text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Bill No.</span>
              <span className="text-gray-800">{bill.billNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Date &amp; Time</span>
              <span className="text-gray-800">
                {bill.date} · {bill.time}
              </span>
            </div>
          </div>
        )}

        <button
          onClick={handleDownload}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700"
        >
          <Download size={16} />
          Download Bill
        </button>

        <p className="mt-4 text-xs text-gray-400">
          This screen will close automatically in{" "}
          <span className="font-semibold text-gray-600">
            {mm}:{ss}
          </span>
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
