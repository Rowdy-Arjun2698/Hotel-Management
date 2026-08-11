import { useNavigate, useParams } from "react-router-dom";
import { HelpCircle, Headset, ShieldCheck, FileText, ChevronRight } from "lucide-react";
import PageHeader from "../components/PageHeader";

const LINKS = [
  { icon: HelpCircle, label: "FAQs", path: "faqs" },
  { icon: Headset, label: "Contact Support", path: "contact" },
  { icon: ShieldCheck, label: "Privacy Policy", path: "privacy-policy" },
  { icon: FileText, label: "Terms & Conditions", path: "terms" },
];

const HelpSupportPage = () => {
  const navigate = useNavigate();
  const { tableId } = useParams();

  return (
    <div className="px-4 py-4">
      <PageHeader title="Help & Support" />

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
        {LINKS.map(({ icon: Icon, label, path }) => (
          <button
            key={path}
            onClick={() => navigate(`/customer/${tableId}/more/help/${path}`)}
            className="flex w-full items-center gap-3 border-b border-gray-100 px-4 py-4 text-left last:border-b-0 hover:bg-gray-50 transition-colors"
          >
            <Icon size={18} className="flex-none text-gray-500" />
            <span className="flex-1 text-sm text-gray-800">{label}</span>
            <ChevronRight size={16} className="flex-none text-gray-300" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default HelpSupportPage;
