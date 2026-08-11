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

  useEffect(() => {
    const fetchBill = async () => {
      try {
        const res = await axios.get(`${url}/api/customer/bill-preview/${tableId}`, {
          withCredentials: true,
        });
        setBill(res.data.bill);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    if (tableId) fetchBill();
  }, [tableId]);

  if (loading) return <p className="p-4 text-sm text-gray-400">Loading bill...</p>;
  if (!bill) return <p className="p-4 text-sm text-gray-400">No bill found yet.</p>;

  return (
    <div className="px-4 py-4">
      <PageHeader title="Bill Preview" />

      <div className="rounded-2xl border border-gray-100 bg-white p-4">
        <p className="text-base font-bold text-gray-900">{bill.restaurantName}</p>
        <p className="text-xs text-gray-400">
          Table {bill.tableNumber} · {bill.date} · {bill.time}
        </p>

        <div className="mt-4 border-t border-gray-100 pt-3">
          <div className="mb-2 flex justify-between text-xs font-semibold text-gray-400">
            <span>Item</span>
            <div className="flex gap-6">
              <span>Qty</span>
              <span>Price</span>
            </div>
          </div>
          <div className="space-y-2">
            {bill.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <span className="text-gray-700">{item.name}</span>
                <div className="flex gap-6">
                  <span className="w-4 text-center text-gray-500">{item.qty}</span>
                  <span className="w-16 text-right font-medium text-gray-900">
                    ₹{item.price.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3 space-y-1.5 border-t border-gray-100 pt-3 text-sm">
          <div className="flex justify-between text-gray-500">
            <span>Subtotal</span>
            <span>₹{bill.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>CGST ({bill.cgstPercent}%)</span>
            <span>₹{bill.cgst.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>SGST ({bill.sgstPercent}%)</span>
            <span>₹{bill.sgst.toFixed(2)}</span>
          </div>
          <div className="flex justify-between pt-1 text-base font-bold text-gray-900">
            <span>Total</span>
            <span>₹{bill.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-gray-50 px-4 py-3 text-center text-xs text-gray-400">
        Please review your bill carefully before proceeding to payment.
      </div>

      <button
        onClick={() => navigate(`/customer/${tableId}/more/payment`)}
        className="mt-4 w-full rounded-xl bg-red-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700"
      >
        Proceed to Pay ₹{bill.total.toFixed(2)}
      </button>
    </div>
  );
};

export default BillPreviewPage;
