"use client";

import { useSearchParams } from "next/navigation";
import SubMenu from "@/components/ui/SubMenu";
import InventoryCategoryTab from "@/components/admin/inventory/InventoryCategoryTab";
import InventoryItemTab from "@/components/admin/inventory/InventoryItemTab";


const inventoryMenus = [
  { label: "Category", href: "/admin/inventory/items" },
  { label: "Item Management", href: "/admin/inventory/items?type=item" },
];

export default function InventorySetupPage() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "category";

  return (
    <div className="space-y-2 p-6">
      <div>
        <h2 className="text-xl font-semibold">Inventory Setup</h2>
        <p className="text-sm text-gray-500">
          Manage categories and inventory items
        </p>
      </div>

      <SubMenu items={inventoryMenus} />

      {type === "category" && <InventoryCategoryTab />}
      {type === "item" && <InventoryItemTab />}
    </div>
  );
}
