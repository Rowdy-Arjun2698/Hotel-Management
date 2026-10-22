import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const PageHeader = ({ title, onBack }) => {
  const navigate = useNavigate();
  return (
    <div className="mb-4 flex items-center gap-3">
      <button
        onClick={onBack || (() => navigate(-1))}
        className="flex h-9 w-9 flex-none items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
      >
        <ArrowLeft size={18} className="text-gray-700" />
      </button>
      <h1 className="text-base font-semibold text-gray-900">{title}</h1>
    </div>
  );
};

export default PageHeader;
