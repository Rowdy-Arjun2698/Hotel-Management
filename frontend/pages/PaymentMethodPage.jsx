import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Zap, CreditCard, Landmark, Wallet, Banknote, CheckCircle2 } from "lucide-react";
import axios from "axios";
import PageHeader from "../components/PageHeader";

const METHODS = [
  { id: "upi", label: "UPI", icon: Zap },
  { id: "card", label: "Credit / Debit Card", icon: CreditCard },
  { id: "netbanking", label: "Net Banking", icon: Landmark },
  { id: "cash", label: "Cash (Pay at Counter)", icon: Banknote },
  { id: "wallet", label: "Wallets", icon: Wallet },
];

const PaymentMethodPage = () => {
  const url = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const { tableId } = useParams();

  const [selected, setSelected] = useState("upi");
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchTotal = async () => {
      try {
        const res = await axios.get(`${url}/api/customer/bill-preview/${tableId}`, {
          withCredentials: true,
        });
        setTotal(res.data.bill?.total || 0);
      } catch (err) {
        console.log(err);
      }
    };
    if (tableId) fetchTotal();
  }, [tableId]);

  const handlePay = () => {
    navigate(`/customer/${tableId}/more/payment-processing`, { state: { method: selected } });
  };

  return (
    <div className="px-4 py-4">
      <PageHeader title="Select Payment Method" />

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
        {METHODS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setSelected(id)}
            className="flex w-full items-center gap-3 border-b border-gray-100 px-4 py-4 text-left last:border-b-0 hover:bg-gray-50 transition-colors"
          >
            <Icon size={20} className="flex-none text-gray-500" />
            <span className="flex-1 text-sm font-medium text-gray-800">{label}</span>
            {selected === id ? (
              <CheckCircle2 size={20} className="flex-none text-red-600" />
            ) : (
              <span className="h-5 w-5 flex-none rounded-full border-2 border-gray-200" />
            )}
          </button>
        ))}
      </div>

      <button
        onClick={handlePay}
        className="mt-4 w-full rounded-xl bg-red-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700"
      >
        Pay ₹{total.toFixed(2)}
      </button>
    </div>
  );
};

export default PaymentMethodPage;
