"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import SubMenu from "@/components/ui/SubMenu";

import StandardTab from "@/components/admin/classes/StandardTab";

import SubjectTab from "@/components/admin/classes/SubjectTab";
import TopicsTab from "@/components/admin/classes/TopicsTab";
import RoutinTab from "@/components/admin/classes/RoutinTab";


const leadMenus = [
  { label: "Standard", href: "/admin/classes/setup" },

  { label: "Subject", href: "/admin/classes/setup?type=subject" },
  { label: "Routin", href: "/admin/classes/setup?type=routin" },
  { label: "Topics", href: "/admin/classes/setup?type=topics" },
  // { label: "Topics", href: "/admin/classes/setup?type=topics" },
];

export default function ClassesSetupPage() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "standard";

  return (
    <div className="space-y-2 p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Classes Setup</h2>
          <p className="text-sm text-gray-500">
            Manage all classes related configurations
          </p>
        </div>
      </div>

      {/* SUB MENU */}
      <SubMenu items={leadMenus} />

      {/* TAB CONTENT */}
      {type === "standard" && <StandardTab />}

      {type === "subject" && <SubjectTab />}
      {type === "topics" && <TopicsTab />}
      {type === "routin" && <RoutinTab />}

    </div>
  );
}
