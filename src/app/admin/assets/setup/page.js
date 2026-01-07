"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import SubMenu from "@/components/ui/SubMenu";

/* ===== ASSETS TABS ===== */
import LocationTab from "@/components/admin/assets/LocationTab";
import ItemsCategoryTab from "@/components/admin/assets/ItemCategory";

/* ===== SUB MENU ===== */
const assetsMenus = [
  {
    label: "Location",
    href: "/admin/assets/setup",
  },
  {
    label: "Assets Setup",
    href: "/admin/assets/setup?type=items",
  },
  
];

export default function AssetsSetupPage() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "location";

  return (
    <div className="space-y-2">
      {/* ================= HEADER ================= */}
      <div>
        <h2 className="text-xl font-semibold">Assets Setup</h2>
        <p className="text-sm text-gray-500">
          Manage asset locations, suppliers, purchases and assignments
        </p>
      </div>

      {/* ================= SUB MENU ================= */}
      <SubMenu items={assetsMenus} />

      {/* ================= TAB CONTENT ================= */}
      {type === "location" && <LocationTab />}
      {type === "items" && <ItemsCategoryTab />}
    </div>
  );
}
