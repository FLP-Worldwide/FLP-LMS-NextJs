"use client";

import React from "react";
import { SearchOutlined, CloseOutlined } from "@ant-design/icons";

export default function SearchPopup({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 backdrop-blur-sm">
      <div className="mt-24 w-full max-w-xl bg-white rounded-2xl shadow-xl p-5 relative">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-lg font-semibold">Search</div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100"
          >
            <CloseOutlined />
          </button>
        </div>

        {/* INPUT */}
        <div className="relative">
          <input
            autoFocus
            type="search"
            placeholder="Search students, teachers, classes..."
            className="w-full pl-4 pr-10 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            <SearchOutlined />
          </div>
        </div>

        {/* RESULTS (placeholder) */}
        <div className="mt-4 text-sm text-gray-400">
          Start typing to search…
        </div>
      </div>
    </div>
  );
}
