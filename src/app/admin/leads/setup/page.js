"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import SubMenu from "@/components/ui/SubMenu";

import LeadSourceTab from "@/components/admin/Lead/LeadSourceTab";
import ClosingReasonTab from "@/components/admin/Lead/ClosingReasonTab";
import CityAreaTab from "@/components/admin/Lead/CityAreaTab";
import ReferredByTab from "@/components/admin/Lead/ReferredByTab";
import InstituteTab from "@/components/admin/Lead/InstituteTab";
import CustomFieldTab from "@/components/admin/Lead/CustomFieldTab";
import AcademicYearTab from "@/components/admin/Lead/AcademicYearTab";

const leadMenus = [
  { label: "Academic Year", href: "/admin/leads/setup?type=academic-year" },
  { label: "Source", href: "/admin/leads/setup" },
  { label: "Closing Reason", href: "/admin/leads/setup?type=closing-reason" },
  { label: "City / Area", href: "/admin/leads/setup?type=city-area" },
  { label: "Referred By", href: "/admin/leads/setup?type=referred-by" },
  { label: "Custom Fields", href: "/admin/leads/setup?type=custom-fields" },
  { label: "Institute Name", href: "/admin/leads/setup?type=institute" },
];

export default function LeadsSetupPage() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "source";

  return (
    <div className="space-y-2 p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Leads Setup</h2>
          <p className="text-sm text-gray-500">
            Define lead sources for campaigns & enquiries
          </p>
        </div>
      </div>

      {/* SUB MENU */}
      <SubMenu items={leadMenus} />

      {/* TAB CONTENT */}
      {type === "source" && <LeadSourceTab />}
      {type === "academic-year" && <AcademicYearTab />}
      {type === "closing-reason" && <ClosingReasonTab />}
      {type === "city-area" && <CityAreaTab />}
      {type === "referred-by" && <ReferredByTab />}
      {type === "custom-fields" && <CustomFieldTab />}
      {type === "institute" && <InstituteTab />}
    </div>
  );
}
