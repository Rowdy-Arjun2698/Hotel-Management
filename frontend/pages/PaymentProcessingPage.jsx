import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Smartphone, CreditCard, ShieldCheck } from "lucide-react";
import axios from "axios";

const PaymentProcessingPage = () => {
  const url = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const { tableId } = useParams();
  const location = useLocation();
  const method = location.state?.method || "upi";

  useEffect(() => {
    const processPayment = async () => {
      try {
        await axios.post(
          `${url}/api/customer/pay/${tableId}`,
          { method },
          { withCredentials: true }
        );
      } catch (err) {
        console.log(err);
      } finally {
        navigate(`/customer/${tableId}/more/payment-success`, { replace: true });
      }
    };

    const timer = setTimeout(processPayment, 2200);
    return () => clearTimeout(timer);
  }, [tableId]);

  return (
    <div className="px-4 py-4">
      <div className="flex min-h-[500px] flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white px-6 py-10 text-center">
        <div className="relative mb-8 flex items-center justify-center">
          <Smartphone size={72} className="text-gray-300" strokeWidth={1.2} />
          <CreditCard
            size={40}
            className="absolute -right-3 top-4 text-gray-400"
            strokeWidth={1.4}
          />
          <div className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-full bg-green-500">
            <ShieldCheck size={18} className="text-white" />
          </div>
        </div>

        <p className="text-base font-semibold text-gray-900">Processing your payment</p>
        <p className="mt-1 text-sm text-gray-400">Please do not close this screen.</p>

        <div className="mt-6 flex gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-gray-200" />
          <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
          <span className="h-1.5 w-1.5 rounded-full bg-gray-200" />
        </div>
      </div>
    </div>
  );
};

export default PaymentProcessingPage;
