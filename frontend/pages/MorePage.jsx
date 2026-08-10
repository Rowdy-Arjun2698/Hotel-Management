import { useNavigate, useParams } from "react-router-dom";
import { FileText, Star, Bell, HelpCircle, Info } from "lucide-react";
import MoreListItem from "../components/MoreListItem";

const MorePage = () => {
  const navigate = useNavigate();
  const { tableId } = useParams();

  const items = [
    {
      icon: FileText,
      iconBg: "#FEE2E2",
      iconColor: "#DC2626",
      title: "My Bill",
      subtitle: "View your bill, charges and payment status",
      path: "more/bill",
    },
    {
      icon: Star,
      iconBg: "#FEF3C7",
      iconColor: "#D97706",
      title: "Give Feedback",
      subtitle: "Rate your experience and help us improve",
      path: "more/feedback",
    },
    {
      icon: Bell,
      iconBg: "#D1FAE5",
      iconColor: "#059669",
      title: "Notifications",
      subtitle: "Stay updated with your order and offers",
      path: "notifications",
    },
    {
      icon: HelpCircle,
      iconBg: "#DBEAFE",
      iconColor: "#2563EB",
      title: "Help",
      subtitle: "Get help and find answers to common questions",
      path: "more/help",
    },
    {
      icon: Info,
      iconBg: "#EDE9FE",
      iconColor: "#7C3AED",
      title: "About",
      subtitle: "Know more about Spice Garden",
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