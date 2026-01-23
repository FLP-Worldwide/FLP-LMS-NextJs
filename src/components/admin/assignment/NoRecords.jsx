import React from "react";

export default function NoRecords({ label }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-gray-500">
      <div className="mb-3">
        <img
          src="/empty-box.svg"
          alt="No Records"
          className="h-20 opacity-80"
        />
      </div>
      <p className="text-sm">{label}</p>
    </div>
  );
}
