"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { FileExcelOutlined } from "@ant-design/icons";
import { api } from "@/utils/api";


import MonthlyTemplate from "@/components/admin/payroll/MonthlyTemplate";

export default function CreateTemplatePage() {

  const handleDownloadExcel = async () => {
  try {
    const response = await api.get("/reports/payroll/monthly-template/export", {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(
      new Blob([response.data])
    );

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "payroll-templates.xlsx");

    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Payroll template export failed", error);
    alert("Failed to download Excel");
  }
};


  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "monthly";

  return (
    <div className="space-y-2 p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
      <div>
        <h2 className="text-xl font-semibold">Payroll Template Setup</h2>
        <p className="text-sm text-gray-500">
          Create and manage salary templates for monthly and hourly payroll
        </p>
      </div>

      {/* Excel Hover Expand Button */}
      <button
        onClick={handleDownloadExcel}
        className="group flex items-center gap-2 
                  border border-gray-200 rounded-lg 
                  px-3 py-2 overflow-hidden
                  transition-all duration-300
                  hover:bg-green-50 hover:shadow-sm"
      >
        <FileExcelOutlined className="text-green-600 text-lg" />

        <span
          className="max-w-0 opacity-0 overflow-hidden whitespace-nowrap
                    group-hover:max-w-xs group-hover:opacity-100
                    transition-all duration-300 text-sm text-green-700"
        >
          Download Excel
        </span>
      </button>
    </div>



      {/* CONTENT */}
      {type === "monthly" && <MonthlyTemplate />}
    </div>
  );
}
