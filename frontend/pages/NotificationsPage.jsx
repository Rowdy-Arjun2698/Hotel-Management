import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CheckCircle2, ChefHat, Bell as BellIcon, ConciergeBell, Tag } from "lucide-react";
import axios from "axios";

const ICON_MAP = {
  order_confirmed: { icon: CheckCircle2, bg: "#D1FAE5", color: "#059669" },
  order_preparing: { icon: ChefHat, bg: "#FEF3C7", color: "#D97706" },
  order_ready: { icon: ConciergeBell, bg: "#EDE9FE", color: "#7C3AED" },
  call_waiter: { icon: BellIcon, bg: "#DBEAFE", color: "#2563EB" },
  offer: { icon: Tag, bg: "#FEE2E2", color: "#DC2626" },
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
        setNotifications(res.data.notifications);
      } catch (err) {
        console.log(err);
      }
    };

    if (tableId) fetchNotifications();
  }, [tableId]);

  return (
    <div className="px-4 py-4">
      {notifications.length === 0 && (
        <p className="py-10 text-center text-sm text-gray-400">No notifications yet</p>
      )}

      <div className="space-y-3">
        {notifications.map((n) => {
          const cfg = ICON_MAP[n.type] || ICON_MAP.offer;
          const Icon = cfg.icon;
          return (
            <div
              key={n._id}
              className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-white p-3.5"
            >
              <div
                className="flex h-9 w-9 flex-none items-center justify-center rounded-full"
                style={{ backgroundColor: cfg.bg }}
              >
                <Icon size={16} style={{ color: cfg.color }} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900">{n.title}</p>
                <p className="text-xs text-gray-400">{n.message}</p>
              </div>
              <span className="flex-none text-[11px] text-gray-300">{n.timeAgo}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NotificationsPage;