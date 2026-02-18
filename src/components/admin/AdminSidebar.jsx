"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  RightOutlined,
  DownOutlined,
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

  useEffect(() => {
  if (!pathname) return;

  // find parent menu whose child matches current path
  const parent = nav.find(
    (item) =>
      item.children &&
      item.children.some((child) => child.href === pathname)
  );

  if (parent) {
    setOpenKeys([parent.key]);
  }
}, [pathname, nav]);



  return (  
    <aside
      className={`sticky top-0 h-screen ${
        collapsed ? "w-20" : "w-64"
      } transition-all duration-200 flex-shrink-0`}
    >
      <div className="h-full bg-gray-800 text-white shadow-sm flex flex-col p-4">


        {/* BRAND */}
        <div className="flex items-center justify-between mb-4">
          {!collapsed && (
            <div>
              <div className="font-semibold">FLP ERP</div>
              <div className="text-xs text-gray-50 capitalize ">
                {mode.replace("_", " ")} Admin
              </div>
            </div>
          )}

          <button onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </button>
        </div>

        {/* NAV */}
        <nav className="flex-1 overflow-y-auto erp-scroll space-y-1">

          {nav.map((item) => {
            const isOpen = openKeys.includes(item.key);

            if (!item.children) {
              return (
                <Link key={item.key} href={item.href}>
                  <div
                    className={`px-3 py-2 rounded-lg text-xs flex gap-3 hover:bg-gray-50 hover:text-black 
                    ${
                      pathname === item.href
                        ? "bg-blue-50 text-blue-700"
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
                  className="w-full px-3 py-2 flex justify-between rounded-lg hover:bg-gray-50 hover:text-black"
                >
                  <div className="flex gap-3 text-xs">
                    {item.icon}
                    {!collapsed && item.label}
                  </div>

                  {!collapsed &&
                    (isOpen ? (
                      <DownOutlined className="text-[10px]" />
                    ) : (
                      <RightOutlined className="text-[10px]" />
                    ))}
                </button>

                {!collapsed && isOpen && (
                  <div className="ml-9 space-y-1">
                    {item.children.map((sub) => (
                      <Link key={sub.key} href={sub.href}>
                        <div
                          className={`px-3 py-1.5 text-xs rounded
                          ${
                            pathname === sub.href
                              ? "bg-blue-50 text-blue-700"
                              : "hover:bg-gray-50 hover:text-black"
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
