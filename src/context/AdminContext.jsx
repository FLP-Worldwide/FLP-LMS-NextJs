"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useSession } from "next-auth/react";
import { api } from "@/utils/api";

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const { data: session, status } = useSession();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // wait until NextAuth resolves session
    if (status === "loading") return;

    // if user is not authenticated
    if (!session?.accessToken) {
      setDashboard(null);
      setLoading(false);
      return;
    }

    async function loadDashboard() {
      setLoading(true);

      try {
        // 🔥 Axios automatically adds Bearer token
        const res = await api.get("/dashboard");

        setDashboard(res.data.data);
      } catch (error) {
        // 401 is handled globally in api interceptor
        console.error("Dashboard load failed", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [session?.accessToken, status]);

  return (
    <AdminContext.Provider
      value={{
        dashboard,
        loading,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);

  if (!context) {
    throw new Error("useAdmin must be used inside AdminProvider");
  }

  return context;
}
