"use client";

import React, { useState } from "react";

export default function ExamMarksPage() {
  const [activeTab, setActiveTab] = useState("Marks");
  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="space-y-4 p-6">
      {/* ================= TOP BAR ================= */}
      <div className="flex justify-between items-center">
        <div className="flex gap-3 items-center">
          <button
            onClick={() => setActiveTab("Schedule")}
            className={`px-4 py-1.5 rounded-md text-sm ${
              activeTab === "Schedule"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            Schedule
          </button>

          <button
            onClick={() => setActiveTab("Marks")}
            className={`px-4 py-1.5 rounded-md text-sm ${
              activeTab === "Marks"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            Marks
          </button>
        </div>

        <div className="text-sm text-gray-600 flex items-center gap-4">
          <span>
            Total Students : <b>0</b>
          </span>
          <span>{today}</span>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="border border-gray-200 rounded-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-left">Student ID</th>
              <th className="p-3 text-left">Student Name</th>
              <th className="p-3 text-center">Total Marks</th>
              <th className="p-3 text-center">Obtained Marks</th>
              <th className="p-3 text-center">Grade</th>
              <th className="p-3 text-center">Remark</th>
              <th className="p-3 text-center">Status</th>
            </tr>
          </thead>

          <tbody>
            {/* Blank Row */}
            <tr className="border-t">
              <td className="p-3">—</td>
              <td className="p-3">—</td>
              <td className="p-3 text-center">—</td>
              <td className="p-3 text-center">
                <input
                  type="number"
                  className="w-24 border border-gray-300 rounded px-2 py-1 text-sm text-center"
                  placeholder="0"
                />
              </td>
              <td className="p-3 text-center">
                <input
                  type="text"
                  className="w-16 border border-gray-300 rounded px-2 py-1 text-sm text-center"
                  placeholder="-"
                />
              </td>
              <td className="p-3 text-center">
                <input
                  type="text"
                  className="w-28 border border-gray-300 rounded px-2 py-1 text-sm"
                  placeholder="Remark"
                />
              </td>
              <td className="p-3 text-center">
                <span className="px-3 py-1 text-xs rounded-full bg-gray-200 text-gray-600">
                  Pending
                </span>
              </td>
            </tr>

            {/* Empty State */}
            <tr>
              <td
                colSpan="7"
                className="p-10 text-center text-gray-400"
              >
                No data available
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
