"use client";

import React, { useEffect, useMemo, useState } from "react";
import { api } from "@/utils/api";
import ExcelDownloadButton from "@/components/ui/ExcelDownloadButton";
import ExcelDownloadButtonFunc from "@/components/ui/ExcelDownloadButtonFunc";

/* ---------------- CONSTANT ---------------- */
const ATTENDANCE = {
  P: "Present",
  A: "Absent",
  LP: "Late Present",
  HP: "Half Day",
  L: "Leave",
  S: "Sunday",
  H: "Holiday",
};

const getLocalDateKey = (date = new Date()) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const getWeekRange = (date = new Date()) => {
  const day = date.getDay(); // 0=Sun,1=Mon
  const diffToMonday = day === 0 ? -6 : 1 - day;

  const monday = new Date(date);
  monday.setDate(date.getDate() + diffToMonday);

  const saturday = new Date(monday);
  saturday.setDate(monday.getDate() + 5);

  return {
    from: getLocalDateKey(monday),
    to: getLocalDateKey(saturday),
  };
};


/* ---------------- DATE HELPERS ---------------- */
const getMonthDays = (month) => {
  const [year, m] = month.split("-").map(Number);
  const totalDays = new Date(year, m, 0).getDate();
  const days = [];

  for (let d = 1; d <= totalDays; d++) {
    const date = new Date(year, m - 1, d);
    const week = Math.ceil(
      (d + new Date(year, m - 1, 1).getDay()) / 7
    );

    days.push({
      key: getLocalDateKey(date), // yyyy-mm-dd
      date: d,
      day: date.toLocaleDateString("en-IN", { weekday: "short" }),
      week,
      fullDate: date,
    });
  }
  return days;
};

const todayKey = getLocalDateKey();


const isSunday = (date) => date.getDay() === 0;

const isToday = (date) =>
  getLocalDateKey(date) === todayKey;

const isFuture = (date) =>
  getLocalDateKey(date) > todayKey;



/* ---------------- PAGE ---------------- */
export default function AttendancePage() {
  const [month, setMonth] = useState(todayKey.slice(0, 7));
  const [teacherFilter, setTeacherFilter] = useState("all");
const { from, to } = getWeekRange();

const [fromDate, setFromDate] = useState(from);
const [toDate, setToDate] = useState(to);


  const [staffList, setStaffList] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);

  const days = useMemo(() => getMonthDays(month), [month]);

  /* ---------------- FETCH ATTENDANCE ---------------- */
  useEffect(() => {
  async function fetchAttendance() {
    setLoading(true);

    let params = {};
    if (fromDate || toDate) {
      params = { from: fromDate, to: toDate };
    } else {
      params = { month };
    }

    const res = await api.get("/teacher-attendance", { params });

    const staff = [];
    const map = {};

    const data = res.data?.data || {};
    const allUsers = [
      ...(data.teachers || []),
      ...(data.staff || []),
    ];

    allUsers.forEach((row) => {
      const profile = row.profile;

      const user = {
        id: profile.id,
        name: profile.name,
        department: profile.department || "—",
        designation: profile.designation || "—",
        type: row.type, // teacher / staff
      };

      staff.push(user);

      map[user.id] = {};

      if (row.attendance && typeof row.attendance === "object") {
        Object.entries(row.attendance).forEach(([date, status]) => {
          map[user.id][date] = status;
        });
      }
    });

    setStaffList(staff);
    setAttendance(map);
    setLoading(false);
  }

  fetchAttendance();
}, [month, fromDate, toDate]);


  /* ---------------- FILTER STAFF ---------------- */
  const filteredStaff =
    teacherFilter === "all"
      ? staffList
      : staffList.filter(
          (s) => String(s.id) === teacherFilter
        );

  /* ---------------- UPDATE LOCAL ---------------- */
  const updateAttendance = (teacherId, date, value) => {
    setAttendance((prev) => ({
      ...prev,
      [teacherId]: {
        ...prev[teacherId],
        [date]: value,
      },
    }));
  };

  /* ---------------- SAVE (TODAY ONLY) ---------------- */
  const saveAttendance = async () => {
    const records = [];

    filteredStaff.forEach((staff) => {
      filteredDays.forEach((d) => {
        const dateKey = d.key;
        const status = attendance?.[staff.id]?.[dateKey];

        if (!status || status === "-" || status === "S") return;

        if (staff.type === "teacher") {
          records.push({
            teacher_id: staff.id,
            date: dateKey,
            status,
          });
        } else {
          records.push({
            user_id: staff.id,
            date: dateKey,
            status,
          });
        }
      });
    });

  if (!records.length) {
    alert("No attendance to save");
    return;
  }

  await api.post("/teacher-attendance", {
    records,
  });

  alert("Attendance updated");
};


  /* ---------------- FILTER DAYS ---------------- */
  const normalizeDate = (date) =>
    new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    ).getTime();

  const filteredDays = useMemo(() => {
    if (!fromDate && !toDate) return days;

    const fromTime = fromDate
      ? normalizeDate(new Date(fromDate))
      : null;

    const toTime = toDate
      ? normalizeDate(new Date(toDate))
      : null;

    return days.filter((d) => {
      const t = normalizeDate(d.fullDate);
      if (fromTime !== null && t < fromTime) return false;
      if (toTime !== null && t > toTime) return false;
      return true;
    });
  }, [days, fromDate, toDate]);

  

  return (
    <div className="space-y-4 p-6">
      {/* HEADER */}
      <div className="flex justify-between ">
        <div>
        <h2 className="text-xl font-semibold">Teacher Attendance</h2>
        <p className="text-sm text-gray-500">
          Month: {month} • {filteredDays.length} days
        </p>
      </div>  
        <ExcelDownloadButtonFunc
            route="/reports/attendance/export-last-3-days"
            name="Attendance-Report"
            label="Download Attendance Report"
          />
          
      </div>

      {/* FILTERS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="soft-input"
        />

        <select
          value={teacherFilter}
          onChange={(e) => setTeacherFilter(e.target.value)}
          className="soft-select"
        >
          <option value="all">All Staff</option>
          {staffList.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="soft-input"
        />

        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="soft-input"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-xs">
        <div className="overflow-x-auto">
          <table className="border-collapse min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="sticky left-0 z-20 bg-gray-50 px-4 py-3 text-xs font-medium text-gray-600 min-w-[220px]">
                  Staff
                </th>

                {filteredDays.map((d) => (
                  <th
                    key={d.key}
                    className="px-2 py-2 text-center text-xs font-medium text-gray-600 min-w-[64px]"
                  >
                    <div className="text-[11px] text-gray-400">W{d.week}</div>
                    <div className="font-semibold">{d.date}</div>
                    <div className="text-[11px]">{d.day}</div>
                  </th>
                ))}

                <th className="sticky right-0 z-20 bg-gray-50 px-6 py-3 text-xs font-medium text-gray-600 min-w-[120px] text-center">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {!loading &&
                filteredStaff.map((staff) => (
                  <tr key={staff.id}>
                    <td className="sticky left-0 z-10 bg-white px-4 py-3 border-r min-w-[220px]">
                      <div className="font-medium text-sm">{staff.name}</div>
                      <div className="text-xs text-gray-500">
                        {staff.designation} • {staff.department}
                      </div>
                    </td>

                    {filteredDays.map((d) => {
                        const dateKey = d.key;
                        const sunday = isSunday(d.fullDate);
                        // const today = isToday(d.fullDate);
                        const future = isFuture(d.fullDate);

                        const disabled = sunday || future;

                        const value = sunday
                          ? "S"
                          : attendance?.[staff.id]?.[dateKey] || "-";

                        return (
                          <td
                            key={dateKey}
                            className={`px-2 py-2 text-center transition
                              ${sunday ? "bg-gray-100" : ""}
                              ${ !sunday ? "bg-gray-100" : ""}
                            `}
                          >
                            <select
                              className={`soft-select w-[52px] text-xs text-center
                                ${disabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""}
                              `}
                              value={value}
                              disabled={disabled}
                              onChange={(e) =>
                                updateAttendance(staff.id, dateKey, e.target.value)
                              }
                            >
                              <option value="-">-</option>
                              {Object.keys(ATTENDANCE).map((k) => (
                                <option key={k} value={k}>
                                  {k}
                                </option>
                              ))}
                            </select>
                          </td>
                        );
                      })}



                    <td className="sticky right-0 z-10 bg-white px-6 py-2 border-l min-w-[120px] text-center">
                     
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* LEGEND */}
      <div className="flex justify-between gap-6 text-sm text-gray-600">
        <div>
          {Object.entries(ATTENDANCE).map(([k, v]) => (
            <span key={k}>
              <b>{k}</b> = {v}
            </span>
          ))}
          <span>
            <b>-</b> = Not Marked
          </span>
        </div>
        <div>
          <button
              onClick={saveAttendance}
              className="px-4 py-1.5 text-xs rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
              Update
          </button>
        </div>
         
      </div>
     
    </div>
  );
}
