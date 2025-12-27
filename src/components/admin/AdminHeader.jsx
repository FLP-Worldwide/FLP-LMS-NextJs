// src/components/admin/AdminHeader.jsx
"use client";

import React, { useState } from "react";
import {
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { signOut, useSession } from "next-auth/react";
import { useAdmin } from "@/context/AdminContext";
import SearchPopup from "./SearchPopup";

export default function AdminHeader() {
  const { data: session } = useSession();
  const { dashboard } = useAdmin();
  const [openSearch, setOpenSearch] = useState(false);

  async function handleLogout() {
    localStorage.removeItem("erp_mode");
    await signOut({ callbackUrl: "/" });
  }

  const instituteName = dashboard?.institute?.name + " " + dashboard?.institute?.city + " "+ dashboard?.institute?.state;
  const planName = dashboard?.subscription?.plan?.name;
  const userName = dashboard?.user?.name;
  const userEmail = dashboard?.user?.email;

  return (
    <>
      <header className="sticky top-0 z-40 bg-white">
        <div className="max-w-full mx-auto px-6 py-3 flex items-center justify-between gap-4 border-b border-gray-100">

          {/* LEFT */}
          <div className="flex items-center gap-4">
            {/* <div className="text-lg font-semibold tracking-tight">
              Admin Panel
            </div> */}

            {instituteName && (
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                School: {dashboard?.institute?.schoolId}, {instituteName}
              </span>
            )}

            {planName && (
              <span className="px-2 py-1 text-xs  text-blue-700">
                You are currently on {planName} Plan, <span className="underline">Upgread</span> for more features.
              </span>
            )}
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            {/* SEARCH */}
            <button
              onClick={() => setOpenSearch(true)}
              className="p-2 rounded-md hover:bg-gray-50 transition"
              title="Search"
            >
              <SearchOutlined style={{ fontSize: 18 }} />
            </button>

            {/* NOTIFICATIONS */}
            <button
              className="p-2 rounded-md hover:bg-gray-50 transition"
              title="Notifications"
            >
              <BellOutlined style={{ fontSize: 18 }} />
            </button>

            {/* USER */}
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-600 w-9 h-9 flex items-center justify-center text-white shadow-sm">
                <UserOutlined />
              </div>

              <div className="hidden md:flex flex-col text-right">
                <span className="text-sm font-medium">
                  {userName || "Admin"}
                </span>
                <span className="text-xs text-gray-500">
                  {userEmail || session?.user?.email}
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

      {/* SEARCH POPUP */}
      <SearchPopup open={openSearch} onClose={() => setOpenSearch(false)} />
    </>
  );
}
