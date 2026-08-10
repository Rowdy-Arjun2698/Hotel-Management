import { ChevronRight } from "lucide-react";

const MoreListItem = ({ icon: Icon, iconBg, iconColor, title, subtitle, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 border-b border-gray-100 px-4 py-4 text-left transition-colors last:border-b-0 hover:bg-gray-50"
    >
      <div
        className="flex h-10 w-10 flex-none items-center justify-center rounded-xl"
        style={{ backgroundColor: iconBg }}
      >
        <Icon size={18} style={{ color: iconColor }} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="truncate text-xs text-gray-400">{subtitle}</p>
      </div>
      <ChevronRight size={18} className="flex-none text-gray-300" />
    </button>
  );
};

export default MoreListItem;