"use client";

import { FileSpreadsheet } from "lucide-react";
import { api } from "@/utils/api";

export default function ExcelDownloadButtonFunc({
  route,
  label,
  name,
  className = "",
}) {


const handleDownloadReport = async () => {
    try {
      const response = await api.get(
        route,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(
        new Blob([response.data])
      );

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${name}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed", error);
    }
  };
  
  return (
    <button
      onClick={handleDownloadReport}
      className={`group flex items-center gap-2 
                  border border-gray-200 rounded-lg 
                  px-2 py-1 overflow-hidden
                  transition-all duration-300
                  hover:bg-green-50 hover:shadow-sm
                  ${className}`}
    >
      <FileSpreadsheet className="text-green-600 text-sm shrink-0" />

      <span
        className="max-w-0 opacity-0 overflow-hidden whitespace-nowrap
                   group-hover:max-w-xs group-hover:opacity-100
                   transition-all duration-300 text-sm text-green-700"
      >
        {label}
      </span>
    </button>
  );
}
