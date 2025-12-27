"use client";

import { SessionProvider } from "next-auth/react";
import AuthSync from "../context/AuthSync";
export default function Providers({ children }) {
  return <SessionProvider>
    <AuthSync />
    {children}
    </SessionProvider>;
}
