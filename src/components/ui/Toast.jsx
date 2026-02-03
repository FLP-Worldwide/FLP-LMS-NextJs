"use client";

export default function Toast({ message, type = "info", onClose }) {
  const styles = {
    success: "bg-green-50 text-green-700 border-green-300",
    error: "bg-red-50 text-red-700 border-red-300",
    warning: "bg-yellow-50 text-yellow-700 border-yellow-300",
    info: "bg-blue-50 text-blue-700 border-blue-300",
  };

  return (
    <div
      className={`flex items-center justify-between
                  min-w-[280px] max-w-sm
                  border rounded-lg px-4 py-3 shadow
                  text-sm ${styles[type]}`}
    >
      <span>{message}</span>

      <button
        onClick={onClose}
        className="ml-3 text-lg leading-none hover:opacity-70"
      >
        ×
      </button>
    </div>
  );
}
