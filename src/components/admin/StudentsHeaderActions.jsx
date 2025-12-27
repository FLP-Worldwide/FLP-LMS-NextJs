import { useState } from "react";
import { DownOutlined, SettingOutlined } from "@ant-design/icons";
export default function StudentsHeaderActions() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center gap-2 relative">
      {/* MORE BUTTON */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="px-3 py-2 rounded-lg border border-gray-200 text-sm gap-1.5 flex
                   hover:bg-gray-50 transition"
      >
        More
        <SettingOutlined className="text-xs text-gray-500" />
      </button>

      {/* DROPDOWN */}
      {open && (
        <div
          className="absolute right-0 top-11 w-48 bg-white border border-gray-200
                     rounded-lg shadow-lg z-30"
        >
          <button
            onClick={() => setOpen(false)}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
          >
            Import Students
          </button>
          <button
            onClick={() => setOpen(false)}
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

      {/* SETTINGS */}

    </div>
  );
}
