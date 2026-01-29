"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import SubMenu from "@/components/ui/SubMenu";

import MonthlyTemplate from "@/components/admin/payroll/MonthlyTemplate";
import HourlyTemplate from "@/components/admin/payroll/HourlyTemplate";

const templateMenus = [
  { label: "Monthly Template", href: "/admin/payroll/create-template" },
  {
    label: "Hourly Template",
    href: "/admin/payroll/create-template?type=hourly",
  },
];

export default function CreateTemplatePage() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "monthly";

  return (
    <div className="space-y-2">
      {/* HEADER */}
      <div>
        <h2 className="text-xl font-semibold">Payroll Template Setup</h2>
        <p className="text-sm text-gray-500">
          Create and manage salary templates for monthly and hourly payroll
        </p>
      </div>

      {/* SUB MENU */}
      <SubMenu items={templateMenus} />

      {/* CONTENT */}
      {type === "monthly" && <MonthlyTemplate />}
      {type === "hourly" && <HourlyTemplate />}
    </div>
  );
}
