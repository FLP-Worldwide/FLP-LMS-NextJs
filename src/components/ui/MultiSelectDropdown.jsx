"use client";
import { useEffect, useRef, useState } from "react";

export default function MultiSelectDropdown({
  options,
  value = [],
  onChange,
  placeholder = "Select",
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const close = e => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  const toggle = id => {
    if (value.includes(id)) {
      onChange(value.filter(v => v !== id));
    } else {
      onChange([...value, id]);
    }
  };

  const selectedText =
    value.length === 0
      ? placeholder
      : options
          .filter(o => value.includes(o.id))
          .map(o => o.name)
          .join(", ");

  return (
    <div ref={ref} className="relative">
      {/* INPUT */}
      <div
        className="soft-select cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        {selectedText}
      </div>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-sm max-h-52 overflow-auto">
          {options.map(opt => (
            <div
              key={opt.id}
              onClick={() => toggle(opt.id)}
              className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 ${
                value.includes(opt.id) ? "bg-blue-50" : ""
              }`}
            >
              {opt.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
