import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const BackHeader = ({ title, backTo }) => {
  const navigate = useNavigate();
  const { tableId } = useParams();

  const handleBack = () => {
    if (backTo) {
      navigate(`/customer/${tableId}/${backTo}`);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="flex h-14 items-center gap-3 px-4">
      <button
        onClick={handleBack}
        className="flex h-8 w-8 items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-gray-100"
      >
        <ArrowLeft size={20} />
      </button>
      <h1 className="text-base font-semibold text-gray-900">{title}</h1>
    </div>
  );
};

export default BackHeader;