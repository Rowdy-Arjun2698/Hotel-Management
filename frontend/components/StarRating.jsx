import { useState } from "react";
import { Star } from "lucide-react";

const StarRating = ({ value, onChange, size = 22 }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
        >
          <Star
            size={size}
            className={
              n <= (hover || value)
                ? "fill-amber-400 text-amber-400"
                : "fill-transparent text-gray-300"
            }
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;