"use client";

export default function EnquiryModal({ title, children, onClose }) {
  return (
    <>
      {/* OVERLAY */}
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onClose}
      />

      {/* DRAWER */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-6xl bg-white shadow-xl flex flex-col animate-slide-in">
        {/* HEADER */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h3 className="text-lg font-semibold">{title}</h3>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {children}
        </div>
      </div>

      {/* ANIMATION */}
      <style jsx>{`
        .animate-slide-in {
          animation: slideIn 0.25s ease-out;
        }
        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}
