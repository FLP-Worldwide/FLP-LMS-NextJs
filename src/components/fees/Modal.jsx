"use client";

export default function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-xl border border-gray-200 w-full max-w-lg p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="text-sm text-gray-500 hover:text-black"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
