import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Star } from "lucide-react";
import axios from "axios";
import PageHeader from "../components/PageHeader";

const StarRow = ({ value, onChange, size = 22 }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((n) => (
      <button key={n} type="button" onClick={() => onChange(n)}>
        <Star
          size={size}
          className={n <= value ? "fill-amber-400 text-amber-400" : "text-gray-300"}
        />
      </button>
    ))}
  </div>
);

const OVERALL_LABELS = ["", "Poor", "Okay", "Good", "Great", "Excellent"];

const RateFoodPage = () => {
  const url = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const { tableId } = useParams();

  const [overall, setOverall] = useState(4);
  const [dishes, setDishes] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const res = await axios.get(`${url}/api/customer/order-items/${tableId}`, {
          withCredentials: true,
        });
        setDishes((res.data.items || []).map((item) => ({ name: item.name, rating: 4 })));
      } catch (err) {
        console.log(err);
      }
    };
    if (tableId) fetchDishes();
  }, [tableId]);

  const setDishRating = (idx, rating) => {
    setDishes((prev) => prev.map((d, i) => (i === idx ? { ...d, rating } : d)));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await axios.post(
        `${url}/api/customer/feedback/${tableId}`,
        { overall, dishes, feedback },
        { withCredentials: true }
      );
      navigate(-1);
    } catch (err) {
      console.log(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="px-4 py-4">
      <PageHeader title="Rate Your Food" />

      <div className="rounded-2xl border border-gray-100 bg-white p-4">
        <p className="mb-2 text-sm font-medium text-gray-700">How was your overall experience?</p>
        <div className="flex items-center gap-3">
          <StarRow value={overall} onChange={setOverall} size={26} />
          <span className="text-sm font-medium text-gray-500">{OVERALL_LABELS[overall]}</span>
        </div>

        {dishes.length > 0 && (
          <div className="mt-5 space-y-3 border-t border-gray-100 pt-4">
            <p className="text-xs font-semibold text-gray-400">Rate each dish</p>
            {dishes.map((dish, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{dish.name}</span>
                <StarRow value={dish.rating} onChange={(v) => setDishRating(idx, v)} />
              </div>
            ))}
          </div>
        )}

        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Any additional feedback?"
          rows={3}
          className="mt-5 w-full resize-none rounded-xl border border-gray-200 p-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-red-400 focus:outline-none"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="mt-4 w-full rounded-xl bg-red-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
      >
        {submitting ? "Submitting..." : "Submit Review"}
      </button>
    </div>
  );
};

export default RateFoodPage;
