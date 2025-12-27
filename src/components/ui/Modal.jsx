"use client";

export default function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
      />

      {/* Modal box */}
      <div className="relative bg-white rounded-xl border border-gray-200 p-5 w-full max-w-2xl shadow-lg">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
