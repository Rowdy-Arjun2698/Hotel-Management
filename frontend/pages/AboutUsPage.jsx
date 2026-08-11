import { Leaf } from "lucide-react";
import PageHeader from "../components/PageHeader";

const AboutUsPage = () => {
  return (
    <div className="px-4 py-4">
      <PageHeader title="About Us" />

      <div className="flex flex-col items-center rounded-2xl border border-gray-100 bg-white px-6 py-12 text-center">
        <Leaf size={32} className="mb-2 text-red-500" />
        <p className="text-lg font-bold text-red-600">Spice Garden</p>
        <p className="mt-1 text-sm text-gray-400">Good food, good mood</p>
        <p className="mt-8 text-xs text-gray-300">Version 1.0.0</p>
      </div>
    </div>
  );
};

export default AboutUsPage;
