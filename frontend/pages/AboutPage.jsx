import { Leaf, ChevronRight, FileText, Shield, BookOpen } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="px-4 py-4">
      <div className="mb-5 flex flex-col items-center rounded-2xl border border-gray-100 bg-white py-6">
        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-purple-50">
          <Leaf size={22} className="text-purple-500" />
        </div>
        <p className="text-base font-bold text-red-600">Spice Garden</p>
        <p className="text-xs text-gray-400">Good food, good mood</p>
        <p className="mt-1 text-xs text-gray-300">Version 1.0.0</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
        {[
          { icon: BookOpen, label: "Our Story", subtitle: "Learn more about us" },
          { icon: FileText, label: "Terms & Conditions" },
          { icon: Shield, label: "Privacy Policy" },
        ].map((item, idx) => (
          <button
            key={idx}
            className="flex w-full items-center gap-3 border-b border-gray-100 px-4 py-3.5 text-left last:border-b-0 hover:bg-gray-50"
          >
            <item.icon size={16} className="flex-none text-gray-400" />
            <div className="min-w-0 flex-1">
              <p className="text-sm text-gray-800">{item.label}</p>
              {item.subtitle && <p className="text-xs text-gray-400">{item.subtitle}</p>}
            </div>
            <ChevronRight size={16} className="flex-none text-gray-300" />
          </button>
        ))}
      </div>

      <p className="mt-6 text-center text-[11px] text-gray-300">
        © 2026 Spice Garden. All rights reserved.
      </p>
    </div>
  );
};

export default AboutPage;