"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import SubMenu from "@/components/ui/SubMenu";
import { Settings } from "lucide-react";
import StandardTab from "@/components/admin/classes/StandardTab";
import { useRouter } from "next/navigation";
import SubjectTab from "@/components/admin/classes/SubjectTab";
import TopicsTab from "@/components/admin/classes/TopicsTab";
import RoutinTab from "@/components/admin/classes/RoutinTab";
import RoomsTab from "@/components/admin/classes/RoomsTab";
import AcademicYearTab from "@/components/admin/Lead/AcademicYearTab";


const leadMenus = [
  { label: "Academic Year", href: "/admin/classes/setup" },
  { label: "Classroom", href: "/admin/classes/setup?type=classroom" },

  // { label: "Standard", href: "/admin/classes/setup?type=standard" },
  // { label: "Subject", href: "/admin/classes/setup?type=subject" },
  // { label: "Topics", href: "/admin/classes/setup?type=topics" },
];

export default function ClassesSetupPage() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "academic-year";
  const router = useRouter();
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
        <div>
           <button
              className="p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
              onClick={() => {
                router.push("setup/setting")
              }}
            >
              <Settings size={18} />
            </button>
        </div>
      </div>

      {/* SUB MENU */}
      <SubMenu items={leadMenus} />

      {/* TAB CONTENT */}
      {type === "academic-year" && <AcademicYearTab />}
      {type === "classroom" && <RoomsTab />}
      {type === "standard" && <StandardTab />}
      {type === "subject" && <SubjectTab />}
      {type === "topics" && <TopicsTab />}
      {type === "routin" && <RoutinTab />}

    </div>
  );
}
