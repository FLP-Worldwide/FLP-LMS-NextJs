"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/utils/api";
import { FileSpreadsheet } from "lucide-react";

/* ===== ASSETS TABS ===== */
import LocationTab from "@/components/admin/assets/LocationTab";

export default function AssetsSetupPage() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "location";

  /* ================= DOWNLOAD LOCATION REPORT ================= */
  const handleDownloadLocationReport = async () => {
    try {
      const response = await api.get(
        "/reports/assets/locations/export",
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(
        new Blob([response.data])
      );

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "location-report.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed", error);
    }
  };

  return (
    <div className="space-y-2 p-6">

      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">
            Location Setup
          </h2>
          <p className="text-sm text-gray-500">
            Manage asset locations, suppliers, purchases and assignments
          </p>
        </div>

        {/* DOWNLOAD BUTTON */}
        <button
          onClick={handleDownloadLocationReport}
          className="group relative bg-green-50 border border-green-200 rounded-lg p-2 hover:bg-green-100 transition"
        >
          <FileSpreadsheet className="text-green-600 w-5 h-5" />

          {/* Tooltip */}
          <span className="absolute hidden group-hover:block -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded">
            Download Location Report
          </span>
        </button>
      </div>

      {/* ================= TAB CONTENT ================= */}
      {type === "location" && <LocationTab />}
    </div>
  );
}
