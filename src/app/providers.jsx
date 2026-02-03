"use client";

import { SessionProvider } from "next-auth/react";
import AuthSync from "../context/AuthSync";
import { ToastProvider } from "@/components/ui/ToastProvider";

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <ToastProvider>
        <AuthSync />
        {children}
      </ToastProvider>
    </SessionProvider>
  );
}
