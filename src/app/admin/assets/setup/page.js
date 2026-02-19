"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import SubMenu from "@/components/ui/SubMenu";

import ItemsCategoryTab from "@/components/admin/assets/ItemCategory";

export default function AssetsSetupPage() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "items";

  return (
    <div className="space-y-2 p-6">
      {/* ================= HEADER ================= */}
      <div>
        <h2 className="text-xl font-semibold">Assets Setup</h2>
        <p className="text-sm text-gray-500">
          Manage asset and category, suppliers, purchases and assignments
        </p>
      </div>

      {type === "items" && <ItemsCategoryTab />}
    </div>
  );
}
