import { useState } from "react";
import { HelpCircle, ChevronDown, MessageCircle } from "lucide-react";

const FAQS = [
  { q: "How can I place an order?", a: "Browse the Menu tab, tap ADD on any dish, choose a variant, and confirm your cart." },
  { q: "How do I request the bill?", a: "Go to More \u2192 My Bill, or tap Generate Bill on the Orders tab once you're done ordering." },
  { q: "How can I call the waiter?", a: "Tap the Call Waiter tab in the bottom navigation. Staff will be notified with your table number." },
  { q: "What payment methods are accepted?", a: "We accept UPI, cards, and cash at the table." },
  { q: "Can I modify my order?", a: "Once an item is placed and being prepared it can't be changed \u2014 please call a waiter for help." },
];

const HelpPage = () => {
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <div className="px-4 py-4">
      <div className="mb-5 flex items-start gap-3 rounded-2xl bg-blue-50 p-4">
        <HelpCircle size={20} className="mt-0.5 flex-none text-blue-500" />
        <div>
          <p className="text-sm font-semibold text-gray-900">How can we help you?</p>
          <p className="text-xs text-gray-500">Find answers to common questions.</p>
        </div>
      </div>

      <p className="mb-2 text-sm font-semibold text-gray-900">Frequently Asked Questions</p>
      <div className="mb-5 overflow-hidden rounded-2xl border border-gray-100 bg-white">
        {FAQS.map((faq, idx) => (
          <div key={idx} className="border-b border-gray-100 last:border-b-0">
            <button
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              className="flex w-full items-center justify-between px-4 py-3.5 text-left"
            >
              <span className="text-sm text-gray-800">{faq.q}</span>
              <ChevronDown
                size={16}
                className={`flex-none text-gray-400 transition-transform ${
                  openIdx === idx ? "rotate-180" : ""
                }`}
              />
            </button>
            {openIdx === idx && (
              <p className="px-4 pb-3.5 text-xs leading-relaxed text-gray-500">{faq.a}</p>
            )}
          </div>
        ))}
      </div>

      <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-blue-400 py-3 text-sm font-semibold text-blue-500 transition-colors hover:bg-blue-50">
        <MessageCircle size={16} />
        Chat with Support
      </button>
      <p className="mt-2 text-center text-xs text-gray-400">We're here to help you!</p>
    </div>
  );
};

export default HelpPage;