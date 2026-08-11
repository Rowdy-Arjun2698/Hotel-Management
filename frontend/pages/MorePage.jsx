import { useNavigate, useParams } from "react-router-dom";
import { FileText, Star, Phone, Bell, HelpCircle, Info } from "lucide-react";
import MoreListItem from "../components/MoreListItem";

const MorePage = () => {
  const navigate = useNavigate();
  const { tableId } = useParams();

  const items = [
    {
      icon: FileText,
      iconBg: "#FEE2E2",
      iconColor: "#DC2626",
      title: "Request Bill",
      subtitle: "Generate your final bill",
      path: "more/request-bill",
    },
    {
      icon: Star,
      iconBg: "#FEF3C7",
      iconColor: "#D97706",
      title: "Rate Your Food",
      subtitle: "Review dishes you ordered",
      path: "more/feedback",
    },
    {
      icon: Phone,
      iconBg: "#DBEAFE",
      iconColor: "#2563EB",
      title: "Call Waiter",
      subtitle: "Need any assistance?",
      path: "more/call-waiter",
    },
    {
      icon: Bell,
      iconBg: "#D1FAE5",
      iconColor: "#059669",
      title: "Notifications",
      subtitle: "Order & service updates",
      path: "notifications",
    },
    {
      icon: HelpCircle,
      iconBg: "#EDE9FE",
      iconColor: "#7C3AED",
      title: "Help & Support",
      subtitle: "We're here to help",
      path: "more/help",
    },
    {
      icon: Info,
      iconBg: "#FCE7F3",
      iconColor: "#DB2777",
      title: "About Us",
      subtitle: "About Spice Garden",
      path: "more/about",
    },
  ];

  return (
    <div className="px-4 py-4">
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {items.map((item) => (
          <MoreListItem
            key={item.path}
            {...item}
            onClick={() => navigate(`/customer/${tableId}/${item.path}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default MorePage;
