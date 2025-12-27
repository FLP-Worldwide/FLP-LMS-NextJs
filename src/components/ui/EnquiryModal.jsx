"use client";
export default function EnquiryModal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl w-full max-w-6xl max-h-[95vh] flex flex-col">

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-2 border-b border-gray-200">
          <h3 className="font-semibold text-lg">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            ✕
          </button>
        </div>

        {/* BODY (SCROLLABLE) */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {children}
        </div>

      </div>
    </div>
  );
}
