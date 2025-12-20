// src/components/admin/AdminHeader.jsx
"use client";

import React from "react";
import { BellOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { signOut, useSession } from "next-auth/react";

export default function AdminHeader() {
  const { data: session } = useSession();

  async function handleLogout() {
    // clear ERP mode
    localStorage.removeItem("erp_mode");

    // sign out from next-auth
    await signOut({
      callbackUrl: "/", // redirect to login
    });
  }

  return (
    <header className="sticky top-0 z-40 bg-white">
      <div className="max-w-full mx-auto px-6 py-3 flex items-center justify-between gap-4 border-b border-gray-100">
        
        {/* LEFT */}
        <div className="flex items-center gap-6">
          <div className="text-lg font-semibold tracking-tight">
            Admin Panel
          </div>

          <div className="hidden lg:block">
            <div className="relative">
              <input
                type="search"
                placeholder="Search users, classes, students..."
                className="pl-4 pr-10 py-2 w-96 rounded-md border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100 shadow-sm"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M21 21l-4.35-4.35"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="11"
                    cy="11"
                    r="6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button
            className="p-2 rounded-md hover:bg-gray-50 transition"
            title="Notifications"
          >
            <BellOutlined style={{ fontSize: 18, color: "#374151" }} />
          </button>

          {/* USER INFO */}
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-emerald-600 w-9 h-9 flex items-center justify-center text-white shadow-sm">
              <UserOutlined />
            </div>

            <div className="hidden md:flex flex-col text-right">
              <span className="text-sm font-medium capitalize">
                {session?.role?.replace("_", " ") || "Admin"}
              </span>
              <span className="text-xs text-gray-500">
                {session?.user?.email || ""}
              </span>
            </div>
          </div>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="p-2 rounded-md hover:bg-red-50 text-red-600 transition"
            title="Logout"
          >
            <LogoutOutlined style={{ fontSize: 18 }} />
          </button>
        </div>
      </div>
    </header>
  );
}
