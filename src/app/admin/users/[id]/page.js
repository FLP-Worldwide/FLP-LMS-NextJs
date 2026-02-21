"use client";

import React, { useEffect, useMemo, useState } from "react";
import { api } from "@/utils/api";
import { useParams } from "next/navigation";
/* ================= CONSTANT ================= */
const ATTENDANCE_STYLE = {
  P: "bg-green-100 text-green-700",
  A: "bg-red-100 text-red-600",
  LP: "bg-blue-100 text-blue-600",
  HP: "bg-purple-100 text-purple-600",
  L: "bg-gray-100 text-gray-600",
  S: "bg-yellow-50 text-yellow-600",
  H: "bg-orange-100 text-orange-600",
  "-": "bg-gray-50 text-gray-400",
};
const CELL_BG = {
  P: "bg-green-50",
  A: "bg-red-50",
  LP: "bg-blue-50",
  HP: "bg-purple-50",
  L: "bg-gray-50",
  H: "bg-orange-50",
  S: "bg-yellow-50",
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

  const startWeekDay = firstDay.getDay();
  const cells = [];

  for (let i = 0; i < startWeekDay; i++) cells.push(null);
  for (let d = 1; d <= lastDate; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);

  return cells;
};

/* ================= PAGE ================= */
export default function ViewTeacherDetailPage() {
  const params = useParams();
  const staffId = params?.id;

  const [selectedDate, setSelectedDate] = useState(null);
  const [updating, setUpdating] = useState(false);

  const today = new Date();

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const [staff, setStaff] = useState({});
  const [attendance, setAttendance] = useState({});


  const [summary, setSummary] = useState({
    P: 0,
    A: 0,
    LP: 0,
    L: 0,
    HP: 0,
  });

  /* ================= API ================= */
  useEffect(() => {
    if (!staffId) return;

    const loadAttendance = async () => {
      try {
        const res = await api.get(
          `/staff/${staffId}/attendance`,
          {
            params: {
              month: String(month + 1).padStart(2, "0"),
              year,
            },
          }
        );

        const data = res.data;

        setStaff(data.staff || {});

        // Map attendance
        const map = {};
        (data.attendance || []).forEach((a) => {
          map[a.date] = a.status;
        });

        setAttendance(map);

        // If backend sends summary use it
        if (data.summary) {
          setSummary(data.summary);
        }
      } catch (err) {
        console.error("Failed to load attendance", err);
      }
    };

    loadAttendance();
  }, [staffId, year, month]);



  const daysGrid = useMemo(
    () => getMonthDaysGrid(year, month),
    [year, month]
  );

  const updateAttendance = async (status) => {
    if (!selectedDate) return;

    try {
      setUpdating(true);

      await api.put(`/staff/attendance/${staffId}`, {
        date: selectedDate,
        status,
      });

      // Update UI
      setAttendance((prev) => ({
        ...prev,
        [selectedDate]: status,
      }));

      setSelectedDate(null);
    } catch (err) {
      console.error("Update failed", err);
    } finally {
      setUpdating(false);
    }
  };



  return (
    <div className="space-y-6 p-6">
      {/* ================= STAFF INFO ================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          ["Name", staff.name],
          ["Department", staff.department],
          ["Designation", staff.designation],
          ["Contact", `${staff.phone}\n${staff.email}`],
        ].map(([label, value]) => (
          <div
            key={label}
            className="bg-white border border-gray-200 rounded-xl p-4"
          >
            <div className="text-xs text-gray-500">{label}</div>
            <div className="font-semibold whitespace-pre-line">
              {value || "-"}
            </div>
          </div>
        ))}
      </div>

      {/* ================= FILTER ================= */}
      <div className="flex gap-3">
        <div className="w-50">
        <select
          className="soft-select "
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <option key={i} value={i}>
              {new Date(0, i).toLocaleString("en", { month: "long" })}
            </option>
          ))}
        </select>

        </div>
        <div className="w-50">

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
      </div>

        {selectedDate && (
          <div className="mb-3 flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-4 py-2">
            <div className="text-sm font-semibold">
              Update Attendance: {selectedDate}
            </div>

            <div className="flex gap-2">
              {["P", "A", "LP", "HP", "L", "H"].map((s) => (
                <button
                  key={s}
                  disabled={updating}
                  onClick={() => updateAttendance(s)}
                  className={`px-3 py-1 rounded text-sm font-semibold ${
                    ATTENDANCE_STYLE[s]
                  }`}
                >
                  {s}
                </button>
              ))}

              <button
                onClick={() => setSelectedDate(null)}
                className="px-3 py-1 text-sm text-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        )}


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
              const status = attendance?.[key] || null;


              return (
                <div
                  key={idx}
                  onClick={() => {
                    const today = new Date();
                    today.setHours(0,0,0,0);

                    const current = new Date(date);
                    current.setHours(0,0,0,0);

                    if (current <= today) {

                      setSelectedDate(getLocalDateKey(date));
                    }
                  }}
                  className={`h-24 border border-gray-200 p-2 cursor-pointer
                    ${CELL_BG[status] || ""}
                    hover:bg-gray-50`}
                  > 

                  <div className="text-sm">{date.getDate()}</div>

                  {status && (
                    <div
                      className={`mt-2 inline-flex items-center justify-center px-2 py-1 rounded text-sm font-semibold ${ATTENDANCE_STYLE[status]}`}
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
        <div className="space-y-4 p-6">
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
