import React, { useEffect, useState } from "react";

/**
 * Toaster — a controlled toast with a little pressure-cooker animation.
 *
 * success = true  -> cooker whistles + puffs steam for a moment (cooking),
 *                     then the whistle blows (steam burst) and it's "done" —
 *                     lid settles, green check pops in.
 * success = false -> lid pops off immediately, cooker shakes and droops,
 *                     red cross pops in.
 *
 * Props:
 *   show      boolean
 *   success   boolean
 *   message   string
 *   onClose   function   called after the toast finishes (timeout or × click)
 *   duration  number     ms visible before auto-close (default 3600)
 *
 * Usage:
 *   const [toast, setToast] = useState({ show: false, success: true, message: "" });
 *   setToast({ show: true, success: true, message: "Butter Chicken added" });
 *   setToast({ show: true, success: false, message: "Butter Chicken cancelled" });
 *
 *   <Toaster
 *     show={toast.show}
 *     success={toast.success}
 *     message={toast.message}
 *     onClose={() => setToast((t) => ({ ...t, show: false }))}
 *   />
 */

const CookerIcon = ({ success }) => (
  <svg
    viewBox="0 0 64 64"
    className="w-11 h-11 flex-shrink-0 overflow-visible"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* steam puffs — puff while cooking, then stop once done */}
    {success && (
      <g>
        <circle cx="32" cy="16" r="2.4" className="steam-puff steam-1" />
        <circle cx="32" cy="16" r="2.1" className="steam-puff steam-2" />
        <circle cx="32" cy="16" r="1.8" className="steam-puff steam-3" />
        {/* the whistle "pop" — ring burst once cooking finishes */}
        <circle cx="32" cy="18" r="3" className="whistle-burst" />
      </g>
    )}

    {/* pot body */}
    <g className={success ? "cooker-body-cook" : "cooker-body-shake"}>
      {/* handles */}
      <rect x="4" y="34" width="8" height="6" rx="2.5" fill="#9CA3AF" />
      <rect x="52" y="34" width="8" height="6" rx="2.5" fill="#9CA3AF" />
      {/* body */}
      <path
        d="M14 32 h36 v14 a4 4 0 0 1 -4 4 H18 a4 4 0 0 1 -4 -4 Z"
        fill="#D1D5DB"
        stroke="#9CA3AF"
        strokeWidth="1.2"
      />
      {/* body shading */}
      <path d="M16 34 h32 v3 h-32 Z" fill="#E5E7EB" opacity="0.7" />
    </g>

    {/* lid — pops off + flies away on cancel, jiggles then settles on success */}
    <g className={success ? "lid-jiggle" : "lid-pop-off"}>
      <ellipse cx="32" cy="31" rx="19" ry="4" fill="#9CA3AF" />
      <ellipse cx="32" cy="30" rx="19" ry="4" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="1" />
      {/* whistle */}
      <rect x="29" y="19" width="6" height="9" rx="1.5" fill="#9CA3AF" />
      <circle cx="32" cy="18" r="3" fill="#9CA3AF" />
    </g>
  </svg>
);

const Toaster = ({ show, success, message, onClose, duration = 3600 }) => {
  const [leaving, setLeaving] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    if (!show) return;
    setLeaving(false);
    setAnimKey((k) => k + 1); // remount icon so its animation restarts from "cooking"

    const closeTimer = setTimeout(() => setLeaving(true), duration);
    return () => clearTimeout(closeTimer);
  }, [show, message, duration]);

  useEffect(() => {
    if (!leaving) return;
    const removeTimer = setTimeout(() => onClose && onClose(), 260);
    return () => clearTimeout(removeTimer);
  }, [leaving, onClose]);

  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[calc(100%-2rem)] max-w-sm">
      <div
        className={`relative flex items-center gap-3 bg-white rounded-2xl shadow-xl border border-gray-100 pl-3 pr-4 py-3 transition-all duration-300 ease-out ${
          leaving
            ? "opacity-0 translate-y-2 scale-95"
            : "opacity-100 translate-y-0 scale-100 animate-[toastIn_0.32s_cubic-bezier(0.22,1,0.36,1)]"
        }`}
      >
        {/* icon badge */}
        <div
          key={animKey}
          className={`relative flex items-center justify-center w-14 h-14 rounded-full flex-shrink-0 ${
            success ? "bg-emerald-50 icon-badge-cook" : "bg-red-50"
          }`}
        >
          <CookerIcon success={success} />

          {/* status badge — pops in once the cooker is actually done */}
          <span
            className={`absolute -bottom-0.5 -right-0.5 flex items-center justify-center w-5 h-5 rounded-full border-2 border-white ${
              success ? "bg-emerald-600 badge-pop-success" : "bg-red-600 badge-pop-cancel"
            }`}
          >
            {success ? (
              <svg viewBox="0 0 12 12" className="w-2.5 h-2.5">
                <path
                  d="M2 6.2 L4.7 9 L10 3"
                  fill="none"
                  stroke="white"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg viewBox="0 0 12 12" className="w-2.5 h-2.5">
                <path
                  d="M2.5 2.5 L9.5 9.5 M9.5 2.5 L2.5 9.5"
                  stroke="white"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#151514] truncate">
            {message}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {success ? (
              <span key={animKey} className="status-text-swap">
                <span className="status-cooking">Cooking up your order…</span>
                <span className="status-done">Added to order</span>
              </span>
            ) : (
              "Removed from order"
            )}
          </p>
        </div>

        <button
          onClick={() => setLeaving(true)}
          className="p-1 rounded-md text-gray-300 hover:text-gray-500 hover:bg-gray-50 flex-shrink-0 self-start"
          aria-label="Dismiss notification"
        >
          <svg viewBox="0 0 14 14" className="w-3.5 h-3.5">
            <path
              d="M2 2 L12 12 M12 2 L2 12"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(14px) scale(0.9); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* ============ SUCCESS: cook, then finish ============ */

        /* lid jiggles actively while "cooking" (~1.2s), then rests */
        .lid-jiggle {
          transform-origin: 32px 30px;
          animation: lidJiggle 0.4s ease-in-out 3;
        }
        @keyframes lidJiggle {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-0.8px) rotate(-2deg); }
          50% { transform: translateY(0) rotate(0deg); }
          75% { transform: translateY(-0.8px) rotate(2deg); }
        }

        .cooker-body-cook {
          animation: bodyWarm 0.6s ease-in-out 2;
        }
        @keyframes bodyWarm {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-0.6px); }
        }

        /* steam rises in puffs only during the cooking window, then stops */
        .steam-puff {
          fill: #CBD5E1;
          opacity: 0;
          animation: steamRise 0.7s ease-out 2;
        }
        .steam-1 { animation-delay: 0s; }
        .steam-2 { animation-delay: 0.25s; }
        .steam-3 { animation-delay: 0.5s; }
        @keyframes steamRise {
          0% { opacity: 0; transform: translate(0, 0) scale(0.6); }
          30% { opacity: 0.85; }
          100% { opacity: 0; transform: translate(3px, -13px) scale(1.3); }
        }

        /* the whistle "pop" ring — fires once, right as cooking finishes */
        .whistle-burst {
          fill: none;
          stroke: #10B981;
          stroke-width: 1.6;
          opacity: 0;
          transform-origin: 32px 18px;
          animation: whistleBurst 0.5s ease-out 1.25s forwards;
        }
        @keyframes whistleBurst {
          0% { opacity: 0.9; transform: scale(1); }
          100% { opacity: 0; transform: scale(3.4); }
        }

        /* icon badge gives a little satisfied bounce right when it's done */
        .icon-badge-cook {
          animation: doneBounce 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 1.25s;
        }
        @keyframes doneBounce {
          0% { transform: scale(1); }
          50% { transform: scale(1.12); }
          100% { transform: scale(1); }
        }

        /* status text: "Cooking..." fades to "Added to order" */
        .status-text-swap { position: relative; display: inline-grid; }
        .status-cooking, .status-done {
          grid-area: 1 / 1;
          transition: none;
        }
        .status-cooking {
          animation: fadeOutText 0.3s ease-in 1.1s forwards;
        }
        .status-done {
          opacity: 0;
          animation: fadeInText 0.3s ease-out 1.3s forwards;
        }
        @keyframes fadeOutText {
          to { opacity: 0; transform: translateY(-2px); }
        }
        @keyframes fadeInText {
          to { opacity: 1; }
        }

        .badge-pop-success {
          opacity: 0;
          transform: scale(0.3);
          animation: badgePop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) 1.3s forwards;
        }
        @keyframes badgePop {
          to { opacity: 1; transform: scale(1); }
        }

        /* ============ CANCEL: immediate lid pop + shake ============ */
        .lid-pop-off {
          transform-origin: 32px 30px;
          animation: lidPopOff 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        @keyframes lidPopOff {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
          40% { transform: translate(6px, -14px) rotate(25deg); opacity: 1; }
          100% { transform: translate(14px, -22px) rotate(50deg); opacity: 0; }
        }
        .cooker-body-shake {
          transform-origin: 32px 40px;
          animation: bodyShake 0.5s ease-in-out 0.15s 2, bodyDroop 0.4s ease-in 0.65s forwards;
        }
        @keyframes bodyShake {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-4deg); }
          75% { transform: rotate(4deg); }
        }
        @keyframes bodyDroop {
          to { transform: rotate(-6deg) translateY(2px); opacity: 0.55; }
        }
        .badge-pop-cancel {
          opacity: 0;
          transform: scale(0.3);
          animation: badgePop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) 0.55s forwards;
        }
      `}</style>
    </div>
  );
};

// --- Demo -------------------------------------------------------------

const ToasterDemo = () => {
  const [toast, setToast] = useState({ show: false, success: true, message: "" });

  const fire = (success, message) => setToast({ show: true, success, message });

  return (
    <div className="p-8 flex gap-3">
      <button
        onClick={() => fire(true, "Butter Chicken added · 3 items")}
        className="px-4 py-2 rounded-lg bg-[#151514] text-white text-sm font-semibold"
      >
        Add item
      </button>
      <button
        onClick={() => fire(false, "Butter Chicken cancelled")}
        className="px-4 py-2 rounded-lg border-2 border-[#151514] text-[#151514] text-sm font-semibold"
      >
        Cancel item
      </button>

      <Toaster
        show={toast.show}
        success={toast.success}
        message={toast.message}
        onClose={() => setToast((t) => ({ ...t, show: false }))}
      />
    </div>
  );
};

export default ToasterDemo;
export { Toaster };