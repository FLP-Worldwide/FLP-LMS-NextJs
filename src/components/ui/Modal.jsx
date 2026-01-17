"use client";

export default function Modal({
  title,
  children,
  onClose,
  rightSlot = null,
  zIndex = 50,
  className = "",
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ zIndex }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
      />

      {/* Modal box */}
      <div
        className={`relative bg-white rounded-xl border border-gray-200 p-5 w-full max-w-4xl shadow-lg ${className}`}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold">{title}</h3>

          <div className="flex items-center gap-3">
            {rightSlot}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>

        {/* BODY */}
        {children}
      </div>
    </div>
  );
}
