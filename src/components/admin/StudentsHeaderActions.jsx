"use client";

import { useState } from "react";
import { SettingOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import PrimaryButton from "../ui/PrimaryButton";
import { api } from "@/utils/api";

export default function StudentsHeaderActions() {

  const [open, setOpen] = useState(false);
  const router = useRouter();

  const menuItems = [
    { name: "Quick Student Upload", path: "/admin/students/quick-upload" },

    { name: "Student Bulk Update", path: "/admin/students/student-bulk-update" },

    { name: "Upload Student", path: "/admin/students/upload-student" },
    
    { name: "Export Student", type: "export" },

    { name: "Registered Student", path: "/admin/students/register-students" },

    { name: "Archive Student", path: "/admin/students/archive-students" },

    { name: "Archived Status Report", path: "/admin/students/archive-report" },

    { name: "Inactive Student Report", path: "/admin/students/inactive-student-report" },

    { name: "Additional Form Field", path: "/admin/students/additional-students-info" },
    
    { name: "Sibling Mapping", path: "/admin/students/sibling-mapping" },
    
    { name: "Export Student Profile Photos", path: "/admin/students/export-photos" },
  ];

  const exportStudents = async () => {
    try {
      const res = await api.get("/reports/students/export/all", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "students-export.xlsx");

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Export failed");
    }
  };

  const handleAction = (item) => {
    setOpen(false);

    if (item.type === "export") {
      exportStudents();
      return;
    }

    router.push(item.path);
  };



  return (
    <div className="flex items-center gap-2 relative">

      {/* MORE BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="px-4 py-1 rounded-lg border border-gray-200 text-sm gap-1.5 flex hover:bg-gray-100 transition"
      >
        More
        <SettingOutlined className="text-xs text-gray-500" />
      </button>

      {/* ADD STUDENT BUTTON */}
      <div className="flex items-center gap-3">
        <a href="/admin/students/admission/new">
          <PrimaryButton name="Add Student" />
        </a>
      </div>

      {/* DROPDOWN */}
      {open && (
        <div
          className="absolute right-0 top-11 w-64 bg-white border border-gray-200
                     rounded-lg shadow-lg z-30"
        >
          {menuItems.map((item, index) => (
            <button
              key={index}
             onClick={() => handleAction(item)}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 border-b border-gray-200 last:border-none"
            >
              {item.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}