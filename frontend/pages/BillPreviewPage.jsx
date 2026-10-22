import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import PageHeader from "../components/PageHeader";

const BillPreviewPage = () => {
  const url = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const { tableId } = useParams();

  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchBill = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await axios.get(
          `${url}/api/customer/bill-preview`,
          { withCredentials: true }
        );

        if (!cancelled) {
          setBill(res.data.bill || null);
        }
      } catch (err) {
        console.error(
          "Failed to fetch bill:",
          err.response?.data || err.message
        );

        if (!cancelled) {
          setBill(null);
          setError(
            err.response?.data?.message ||
              "Unable to load your bill. Please try again."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    if (tableId) {
      fetchBill();
    } else {
      setError("Table information is missing.");
      setLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [url, tableId]);

  const formatMoney = (amount) =>
    `₹${Number(amount ?? 0).toFixed(2)}`;

  if (loading) {
    return (
      <div className="flex min-h-40 items-center justify-center gap-3 p-4">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-red-600" />
        <p className="text-sm text-gray-500">Loading bill...</p>
      </div>
    );
  }

  if (!bill) {
    return (
      <div className="px-4 py-6">
        <PageHeader title="Bill Preview" />

        <div className="mt-6 rounded-xl bg-gray-50 p-5 text-center">
          <p className="text-sm text-gray-600">
            {error || "No bill found yet."}
          </p>

          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-4">
      <PageHeader title="Bill Preview" />

      <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-4">
        <p className="text-base font-bold text-gray-900">
          {bill.restaurantName || "Restaurant"}
        </p>

        <p className="text-xs text-gray-400">
          Table {bill.tableNumber ?? "N/A"}
          {" · "}
          {bill.date || ""}
          {bill.time ? ` · ${bill.time}` : ""}
        </p>

        <div className="mt-4 border-t border-gray-100 pt-3">
          <div className="mb-3 flex justify-between text-xs font-semibold text-gray-400">
            <span>Item</span>

            <div className="flex gap-6">
              <span className="w-8 text-center">Qty</span>
              <span className="w-20 text-right">Amount</span>
            </div>
          </div>

          <div className="space-y-3">
            {(bill.items || []).map((item, idx) => (
              <div
                key={`${item.menuId || item.name}-${idx}`}
                className="flex items-start justify-between gap-3 text-sm"
              >
                <div className="min-w-0 flex-1">
                  <p className="break-words text-gray-700">
                    {item.name || "Unknown item"}
                  </p>

                  {item.variantName && (
                    <p className="mt-0.5 text-xs text-gray-400">
                      Variant: {item.variantName}
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 items-start gap-6">
                  <span className="w-8 text-center text-gray-500">
                    {item.quantity ?? 0}
                  </span>

                  <span className="w-20 text-right font-medium text-gray-900">
                    {formatMoney(item.itemTotal)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 space-y-2 border-t border-gray-100 pt-3 text-sm">
          <div className="flex justify-between text-gray-500">
            <span>Subtotal</span>
            <span>{formatMoney(bill.subtotal)}</span>
          </div>

          <div className="flex justify-between text-gray-500">
            <span>CGST ({bill.cgstPercent ?? 0}%)</span>
            <span>{formatMoney(bill.cgst)}</span>
          </div>

          <div className="flex justify-between text-gray-500">
            <span>SGST ({bill.sgstPercent ?? 0}%)</span>
            <span>{formatMoney(bill.sgst)}</span>
          </div>

          <div className="flex justify-between border-t border-gray-100 pt-3 text-base font-bold text-gray-900">
            <span>Total</span>
            <span>{formatMoney(bill.total)}</span>
          </div>
        </div>

        <div className="mt-4 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-500">
          Payment status:{" "}
          <span className="font-semibold text-gray-700">
            {bill.paymentStatus || "Pending"}
          </span>
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-gray-50 px-4 py-3 text-center text-xs text-gray-500">
        Please review your bill carefully before proceeding to payment.
      </div>

      <button
        onClick={() =>
          navigate(`/customer/${tableId}/more/payment`)
        }
        disabled={bill.paymentStatus === "Paid"}
        className="mt-4 w-full rounded-xl bg-red-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        {bill.paymentStatus === "Paid"
          ? "Payment Completed"
          : `Proceed to Pay ${formatMoney(bill.total)}`}
      </button>
    </div>
  );
};

export default BillPreviewPage;