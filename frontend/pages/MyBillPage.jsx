import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FileText, Download } from "lucide-react";
import axios from "axios";

const MyBillPage = () => {
  const url = import.meta.env.VITE_BACKEND_URL;
  const { tableId } = useParams();

  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBill = async () => {
      try {
        const res = await axios.get(`${url}/api/customer/bill/${tableId}`, {
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
      <div className="rounded-2xl border border-red-100 bg-gradient-to-b from-red-50/60 to-white p-4">
        {/* Bill header */}
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-red-100">
            <FileText size={20} className="text-red-600" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-gray-900">Bill #{bill.billNumber}</p>
            <p className="text-xs text-gray-400">
              Table {bill.tableNumber} · {bill.date} · {bill.time}
            </p>
          </div>
          <span
            className={`flex-none rounded-full px-3 py-1 text-xs font-medium ${
              bill.status === "paid"
                ? "bg-green-50 text-green-600"
                : "bg-yellow-50 text-yellow-600"
            }`}
          >
            {bill.status === "paid" ? "Paid" : "Unpaid"}
          </span>
        </div>

        {/* Items */}
        <div className="space-y-2 border-t border-gray-100 pt-3">
          {bill.items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-sm">
              <span className="text-gray-700">{item.name}</span>
              <span className="font-medium text-gray-900">₹{item.price.toFixed(2)}</span>
            </div>
          ))}
        </div>

        {/* Totals */}
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
          <div className="flex justify-between pt-1 text-base font-bold text-red-600">
            <span>Grand Total</span>
            <span>₹{bill.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Payment details */}
      {bill.status === "paid" && (
        <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-4">
          <p className="mb-3 text-sm font-semibold text-gray-900">Payment Details</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Payment Method</span>
              <span className="text-gray-800">{bill.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Transaction ID</span>
              <span className="text-gray-800">{bill.transactionId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Paid On</span>
              <span className="text-gray-800">{bill.paidOn}</span>
            </div>
          </div>
        </div>
      )}

      <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-red-500 py-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50">
        <Download size={16} />
        Download Bill
      </button>
    </div>
  );
};

export default MyBillPage;