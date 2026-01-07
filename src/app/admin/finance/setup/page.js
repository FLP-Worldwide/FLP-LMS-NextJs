"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import SubMenu from "@/components/ui/SubMenu";

import PayeeTab from "@/components/admin/finance/PayeeTab";
import PayerTab from "@/components/admin/finance/PayerTab";
import CategoryTab from "@/components/admin/finance/CategoryTab";
import AccountTab from "@/components/admin/finance/AccountTab";

const financeMenus = [
  { label: "Payee", href: "/admin/finance/setup" },
  { label: "Payer", href: "/admin/finance/setup?type=payer" },
  { label: "Category", href: "/admin/finance/setup?type=category" },
  { label: "Account", href: "/admin/finance/setup?type=account" },
];

export default function FinanceSetupPage() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "payee";

  return (
    <div className="space-y-2">
      {/* HEADER */}
      <div>
        <h2 className="text-xl font-semibold">Finance Setup</h2>
        <p className="text-sm text-gray-500">
          Manage payees, payers, categories and accounts
        </p>
      </div>

      {/* SUB MENU */}
      <SubMenu items={financeMenus} />

      {/* TAB CONTENT */}
      {type === "payee" && <PayeeTab />}
      {type === "payer" && <PayerTab />}
      {type === "category" && <CategoryTab />}
      {type === "account" && <AccountTab />}
    </div>
  );
}
