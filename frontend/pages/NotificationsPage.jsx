import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ChefHat, Truck, Bell, ClipboardCheck, CheckCircle2 } from "lucide-react";
import axios from "axios";
import PageHeader from "../components/PageHeader";

const ICONS = {
  preparing: { icon: ChefHat, bg: "#D1FAE5", color: "#059669" },
  onway: { icon: Truck, bg: "#DBEAFE", color: "#2563EB" },
  ready: { icon: Bell, bg: "#FEF3C7", color: "#D97706" },
  served: { icon: ClipboardCheck, bg: "#FEE2E2", color: "#DC2626" },
  payment: { icon: CheckCircle2, bg: "#D1FAE5", color: "#059669" },
};

const NotificationsPage = () => {
  const url = import.meta.env.VITE_BACKEND_URL;
  const { tableId } = useParams();

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`${url}/api/customer/notifications/${tableId}`, {
          withCredentials: true,
        });
        setNotifications(res.data.notifications || []);
      } catch (err) {
        console.log(err);
      }
    };
    if (tableId) fetchNotifications();
  }, [tableId]);

  return (
    <div className="px-4 py-4">
      <PageHeader title="Notifications" />

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
        {notifications.length === 0 && (
          <p className="p-4 text-sm text-gray-400">No notifications yet.</p>
        )}
        {notifications.map((n, idx) => {
          const conf = ICONS[n.type] || ICONS.ready;
          const Icon = conf.icon;
          return (
            <div
              key={idx}
              className="flex items-start gap-3 border-b border-gray-100 px-4 py-3.5 last:border-b-0"
            >
              <div
                className="flex h-9 w-9 flex-none items-center justify-center rounded-full"
                style={{ backgroundColor: conf.bg }}
              >
                <Icon size={16} style={{ color: conf.color }} />
              </div>
              <p className="flex-1 text-sm text-gray-700">{n.message}</p>
              <span className="flex-none whitespace-nowrap text-xs text-gray-400">
                {n.time}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NotificationsPage;
