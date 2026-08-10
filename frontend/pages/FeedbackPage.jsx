import { useState } from "react";
import { useParams } from "react-router-dom";
import { Star } from "lucide-react";
import axios from "axios";
import StarRating from "../components/StarRating";

const RATING_LABELS = { 1: "Poor", 2: "Fair", 3: "Good", 4: "Great", 5: "Excellent" };

const FeedbackPage = () => {
  const url = import.meta.env.VITE_BACKEND_URL;
  const { tableId } = useParams();

  const [overall, setOverall] = useState(0);
  const [food, setFood] = useState(0);
  const [service, setService] = useState(0);
  const [comments, setComments] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!overall) return;
    try {
      setSubmitting(true);
      await axios.post(
        `${url}/api/customer/feedback/${tableId}`,
        { overall, food, service, comments },
        { withCredentials: true }
      );
      setSubmitted(true);
    } catch (err) {
      console.log(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
          <Star size={26} className="fill-green-500 text-green-500" />
        </div>
        <p className="text-base font-semibold text-gray-900">Thanks for your feedback!</p>
        <p className="mt-1 text-sm text-gray-400">It helps us serve you better next time.</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-4">
      <div className="mb-5 flex items-start gap-3 rounded-2xl bg-amber-50 p-4">
        <Star size={20} className="mt-0.5 flex-none fill-amber-400 text-amber-400" />
        <div>
          <p className="text-sm font-semibold text-gray-900">We value your feedback!</p>
          <p className="text-xs text-gray-500">Your feedback helps us serve you better.</p>
        </div>
      </div>

      <div className="mb-6">
        <p className="mb-2 text-sm font-semibold text-gray-900">Overall Experience</p>
        <StarRating value={overall} onChange={setOverall} size={28} />
        {overall > 0 && (
          <p className="mt-1 text-xs font-medium text-amber-500">
            {RATING_LABELS[overall]} ({overall}/5)
          </p>
        )}
      </div>

      <div className="mb-6 space-y-4">
        <p className="text-sm font-semibold text-gray-900">Rate Your Experience</p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Food Quality</span>
          <StarRating value={food} onChange={setFood} size={18} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Service</span>
          <StarRating value={service} onChange={setService} size={18} />
        </div>
      </div>

      <div className="mb-6">
        <p className="mb-2 text-sm font-semibold text-gray-900">Additional Comments (Optional)</p>
        <textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="Tell us more about your experience..."
          rows={3}
          className="w-full resize-none rounded-xl border border-gray-200 p-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-red-400 focus:outline-none"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={!overall || submitting}
        className="w-full rounded-xl bg-red-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
      >
        {submitting ? "Submitting..." : "Submit Feedback"}
      </button>
    </div>
  );
};

export default FeedbackPage;