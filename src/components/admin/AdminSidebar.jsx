"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ArrowDownOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { usePathname } from "next/navigation";
import { schoolNav, coachingNav, superAdminNav } from "./MenuConfig";

export default function AdminSidebar() {
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState([]);
  const [mode, setMode] = useState("school"); // school | coaching | super

  // 🔒 ERP MODE – READ ONLY (set at login)
  useEffect(() => {
    const storedMode = localStorage.getItem("erp_mode");

    if (storedMode) {
      setMode(storedMode);
    }
  }, []);

  // Select nav based on locked mode
  const nav =
    mode === "school"
      ? schoolNav
      : mode === "coaching"
      ? coachingNav
      : superAdminNav;

  function toggle(key) {
    setOpenKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }

  return (
    <aside
      className={`h-screen ${
        collapsed ? "w-20" : "w-64"
      } transition-all duration-200`}
    >
      <div className="h-full bg-white shadow-sm flex flex-col p-4">

        {/* BRAND */}
        <div className="flex items-center justify-between mb-4">
          {!collapsed && (
            <div>
              <div className="font-semibold">FLP ERP</div>
              <div className="text-xs text-gray-500 capitalize">
                {mode.replace("_", " ")} Admin
              </div>
            </div>
          )}

          <button onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </button>
        </div>

        {/* NAV */}
        <nav className="flex-1 overflow-auto space-y-1">
          {nav.map((item) => {
            const isOpen = openKeys.includes(item.key);

            if (!item.children) {
              return (
                <Link key={item.key} href={item.href}>
                  <div
                    className={`px-3 py-2 rounded-lg text-sm flex gap-3 hover:bg-gray-50
                    ${
                      pathname === item.href
                        ? "bg-emerald-50 text-emerald-700"
                        : ""
                    }`}
                  >
                    {item.icon}
                    {!collapsed && item.label}
                  </div>
                </Link>
              );
            }

            return (
              <div key={item.key}>
                <button
                  onClick={() => toggle(item.key)}
                  className="w-full px-3 py-2 flex justify-between rounded-lg hover:bg-gray-50"
                >
                  <div className="flex gap-3 text-sm">
                    {item.icon}
                    {!collapsed && item.label}
                  </div>

                  {!collapsed &&
                    (isOpen ? (
                      <ArrowDownOutlined />
                    ) : (
                      <ArrowRightOutlined />
                    ))}
                </button>

                {!collapsed && isOpen && (
                  <div className="ml-9 space-y-1">
                    {item.children.map((sub) => (
                      <Link key={sub.key} href={sub.href}>
                        <div
                          className={`px-3 py-1.5 text-sm rounded
                          ${
                            pathname === sub.href
                              ? "bg-emerald-50 text-emerald-700"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          {sub.label}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="text-xs text-gray-400 pt-3">
          v1.0 • {mode === "school"
            ? "School ERP"
            : mode === "coaching"
            ? "Coaching ERP"
            : "Super Admin ERP"}
        </div>
      </div>
    </aside>
  );
}
