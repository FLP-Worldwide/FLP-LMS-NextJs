"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import SubMenu from "@/components/ui/SubMenu";
import ConcessionSetupTab from "./ConcessionSetupTab";
import AssignConcessionTab from "./AssignConcessionTab";

const menus = [
  { label: "Concession Setup", href: "/admin/fees/concession" },
  { label: "Assign Concession", href: "/admin/fees/concession?type=assign" },
];

export default function Page() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "setup";

  return (
    <>
      {/* TOP TABS */}
      <SubMenu items={menus} />

      {/* TAB CONTENT */}
      <div className="mt-4">
        {type === "setup" && <ConcessionSetupTab />}
        {type === "assign" && <AssignConcessionTab />}
      </div>
    </>
  );
}
