const DEFAULT_DISHES = [
  { name: "Chicken Biryani", count: 45 },
  { name: "Paneer Butter Masala", count: 38 },
  { name: "Margherita Pizza", count: 32 },
  { name: "Veg Manchurian", count: 28 },
  { name: "Masala Dosa", count: 22 },
];

const TopSellingDishes = ({ dishes = DEFAULT_DISHES, onViewAll }) => {
  const maxCount = Math.max(...dishes.map((d) => d.count), 1);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="mb-3 text-[15px] font-semibold text-gray-900">
        Top Selling Dishes
      </h3>

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