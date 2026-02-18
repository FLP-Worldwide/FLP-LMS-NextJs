import { useState } from "react";
import { DownOutlined, SettingOutlined } from "@ant-design/icons";
import PrimaryButton from "../ui/PrimaryButton";
import { api } from "@/utils/api";

export default function StudentsHeaderActions() {
  const [open, setOpen] = useState(false);

  const handleDownloadTemplate = async () => {
  try {
    const response = await api.get("/reports/students/import/template", {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(
      new Blob([response.data])
    );

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "students-import-template.xlsx");

    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);

    setOpen(false);
  } catch (error) {
    console.error("Template download failed", error);
  }
};


  const handleExport = async () => {
    try {
      const response = await api.get("/reports/students/export", {
        responseType: "blob", // IMPORTANT
      });

      // Create file URL
      const url = window.URL.createObjectURL(
        new Blob([response.data])
      );

      const link = document.createElement("a");
      link.href = url;

      // File name (you can make dynamic)
      link.setAttribute("download", "students-list.xlsx");

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

      setOpen(false);
    } catch (error) {
      console.error("Export failed", error);
    }
  };

  return (
    <div className="flex items-center gap-2 relative">
      
      {/* MORE BUTTON */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="px-4 py-1 rounded-lg border border-gray-200 text-sm gap-1.5 flex
                   hover:bg-gray-100 transition"
      >
        More
        <SettingOutlined className="text-xs text-gray-500" />
      </button>

      <div className="flex items-center gap-3">
        <a href="/admin/students/admission/new">
          <PrimaryButton name="+ New Admission" />
        </a>
      </div>

      {/* DROPDOWN */}
      {open && (
        <div
          className="absolute right-0 top-11 w-48 bg-white border border-gray-200
                     rounded-lg shadow-lg z-30"
        >
          {/* Download Template */}
          <button
            onClick={handleDownloadTemplate}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
          >
            Download Import Template
          </button>
          
          <button
            onClick={() => setOpen(false)}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
          >
            Import Students
          </button>

          {/* ✅ EXCEL EXPORT */}
          <button
            onClick={handleExport}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
          >
            Export List
          </button>

          <button
            onClick={() => setOpen(false)}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
          >
            Siblings Maping
          </button>

          <button
            onClick={() => setOpen(false)}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
          >
            Transfer / TC
          </button>

          <button
            onClick={() => setOpen(false)}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
          >
            Archive Students Report
          </button>

          <button
            onClick={() => setOpen(false)}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
          >
            Inactive Students Report
          </button>
        </div>
      )}
    </div>
  );
}
