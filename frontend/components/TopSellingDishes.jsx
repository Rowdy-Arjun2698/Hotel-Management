import { useEffect, useState } from "react";
import axios from "axios";

const TopSellingDishes = ({ onViewAll }) => {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopDishes = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/dashboard/top-selling`, {
          params: { limit: 5 },
          withCredentials: true, // sends the auth cookie
        });
        setDishes(res.data.dishes || []);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load top dishes");
      } finally {
        setLoading(false);
      }
    };

    fetchTopDishes();
  }, []);

  const maxCount = Math.max(...dishes.map((d) => d.count), 1);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="mb-3 text-[15px] font-semibold text-gray-900">
        Top Selling Dishes
      </h3>

      {loading && <p className="text-sm text-gray-400">Loading...</p>}

      {!loading && error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && !error && dishes.length === 0 && (
        <p className="text-sm text-gray-400">No sales data yet</p>
      )}

      {!loading && !error && dishes.length > 0 && (
        <div className="space-y-3">
          {dishes.map((dish, idx) => (
            <div key={dish.name} className="group">
              <div className="flex items-center justify-between">
                <span className="truncate text-sm text-gray-700">
                  {idx + 1}. {dish.name}
                </span>
                <span className="ml-2 flex-none text-sm font-semibold text-gray-900">
                  {dish.count}
                </span>
              </div>
              <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-orange-400 transition-all duration-700 ease-out group-hover:bg-orange-500"
                  style={{ width: `${(dish.count / maxCount) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={onViewAll}
        className="mt-4 text-xs font-semibold text-orange-500 transition-colors hover:text-orange-600"
      >
        View All
      </button>
    </div>
  );
};

export default TopSellingDishes;