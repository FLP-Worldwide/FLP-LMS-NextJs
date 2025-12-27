"use client";

import React, { useMemo, useState } from "react";

/* ================= CONSTANT ================= */
const ATTENDANCE_STYLE = {
  P: "bg-green-100 text-green-700",
  A: "text-red-500",
  LP: "text-blue-500",
  HP: "text-gray-700",
  L: "text-gray-400",
  S: "text-gray-300",
  H: "text-orange-500",
};

/* ================= DATE HELPERS ================= */
const getLocalDateKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const getMonthDaysGrid = (year, month) => {
  const firstDay = new Date(year, month, 1);
  const lastDate = new Date(year, month + 1, 0).getDate();

  const startWeekDay = firstDay.getDay(); // 0 = Sunday
  const cells = [];

  for (let i = 0; i < startWeekDay; i++) cells.push(null);
  for (let d = 1; d <= lastDate; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);

  return cells;
};

/* ================= PAGE ================= */
export default function ViewTeacherDetailPage() {
  /* ===== DEFAULT MONTH SET TO DATA MONTH ===== */
  const [year, setYear] = useState(2024);
  const [month, setMonth] = useState(3); // April (0-based)

  /* ================= TEACHER DATA ================= */
  const teacher = {
    name: "Neha Verma",
    department: "Mathematics",
    designation: "Teacher",
    phone: "9876543210",
    email: "neha@gmail.com",
  };

  /* ================= ATTENDANCE DATA ================= */
  const attendance = {
    "2025-04-01": "A",
    "2025-04-06": "A",
    "2025-04-23": "P",
  };

  const daysGrid = useMemo(
    () => getMonthDaysGrid(year, month),
    [year, month]
  );

  const summary = { P: 1, A: 2, LP: 0, L: 0, HP: 0 };

  return (
    <div className="space-y-6">
      {/* ================= TEACHER INFO ================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          ["Name", teacher.name],
          ["Department", teacher.department],
          ["Designation", teacher.designation],
          ["Contact", `${teacher.phone}\n${teacher.email}`],
        ].map(([label, value]) => (
          <div
            key={label}
            className="bg-white border border-gray-200 rounded-xl p-4"
          >
            <div className="text-xs text-gray-500">{label}</div>
            <div className="font-semibold whitespace-pre-line">{value}</div>
          </div>
        ))}
      </div>

      {/* ================= FILTER ================= */}
      <div className="flex gap-3">
        <select
          className="soft-select w-40"
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <option key={i} value={i}>
              {new Date(0, i).toLocaleString("en", { month: "long" })}
            </option>
          ))}
        </select>

        <select
          className="soft-select w-32"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
        >
          {[2024, 2025, 2026].map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* ================= CALENDAR + SUMMARY ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* ================= CALENDAR ================= */}
        <div className="lg:col-span-3 bg-white border border-gray-200 rounded-xl p-4">
          <div className="text-center font-semibold mb-4">
            {new Date(year, month).toLocaleString("en", {
              month: "long",
              year: "numeric",
            })}
          </div>

          {/* Week Header */}
          <div className="grid grid-cols-7 text-xs text-gray-500 mb-2">
            {[
              "Sunday",
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ].map((d) => (
              <div key={d} className="text-center">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 border border-gray-200">
            {daysGrid.map((date, idx) => {
              if (!date) {
                return (
                  <div
                    key={idx}
                    className="h-24 border border-gray-200"
                  />
                );
              }

              const key = getLocalDateKey(date);
              const status = attendance[key];

              return (
                <div
                  key={idx}
                  className="h-24 border border-gray-200 p-2"
                >
                  <div className="text-sm">{date.getDate()}</div>

                  {status && (
                    <div
                      className={`mt-2 inline-flex items-center justify-center px-2 py-1 rounded text-sm font-semibold ${
                        ATTENDANCE_STYLE[status]
                      }`}
                    >
                      {status}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= SUMMARY ================= */}
        <div className="space-y-4">
          <div className="text-sm font-semibold">Summary</div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {summary.P}
            </div>
            <div className="text-sm text-green-600">Present</div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-red-500">
              {summary.A}
            </div>
            <div className="text-sm text-red-500">Absent</div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              ["LP", "Late", "text-blue-500"],
              ["L", "Leave", "text-gray-500"],
              ["HP", "Half Day", "text-gray-700"],
            ].map(([k, label, color]) => (
              <div
                key={k}
                className="bg-white border border-gray-200 rounded-xl p-3 text-center"
              >
                <div className={`font-semibold ${color}`}>
                  {summary[k]}
                </div>
                <div className={`text-xs ${color}`}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
