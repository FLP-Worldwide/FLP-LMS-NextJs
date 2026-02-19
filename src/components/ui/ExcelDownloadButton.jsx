"use client";

import { FileSpreadsheet } from "lucide-react";

export default function ExcelDownloadButton({
  onClick,
  label = "Download Report",
  className = "",
}) {
  return (
    <button
      onClick={onClick}
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
