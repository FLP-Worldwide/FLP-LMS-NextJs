"use client";

import { createContext, useContext, useState } from "react";
import Toast from "./Toast";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const show = (message, type = "info", duration = 3000) => {
    const id = Date.now();

    setToasts(prev => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  };

  const remove = id => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const value = {
    success: msg => show(msg, "success"),
    error: msg => show(msg, "error"),
    warning: msg => show(msg, "warning"),
    info: msg => show(msg, "info"),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}

      {/* 🔔 TOAST STACK */}
      <div className="fixed top-5 right-5 z-[9999] space-y-2">
        {toasts.map(t => (
          <Toast
            key={t.id}
            message={t.message}
            type={t.type}
            onClose={() => remove(t.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
