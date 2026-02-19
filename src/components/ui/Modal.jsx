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
      className="fixed inset-0 flex items-center justify-center"
      style={{ zIndex }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
      />

      {/* Modal box */}
      <div
        className={`
          relative bg-white rounded-xl border border-gray-200
          w-full max-w-5xl
          max-h-[90vh]         /* 🔥 LIMIT HEIGHT */
          flex flex-col        /* 🔥 FLEX COLUMN */
          shadow-lg
          ${className}
        `}
      >
        {/* HEADER (Sticky) */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
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

        {/* BODY (Scrollable Area) */}
        <div className="overflow-y-auto px-6 py-4 flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
