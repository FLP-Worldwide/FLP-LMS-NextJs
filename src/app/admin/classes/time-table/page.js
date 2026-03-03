"use client";

import React, { useEffect, useState } from "react";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { api } from "@/utils/api";
import { useRouter } from "next/navigation";



function getItem(data, date) {
  const formatted = formatApiDate(date);
  return data.find((s) => s.date === formatted);
}
function LegendItem({ color, label }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`w-3 h-3 rounded-full ${color}`} />
      <span className="font-medium">{label}</span>
    </div>
  );
}
function getDotColor(type) {
  switch (type) {
    case "Regular":
      return "bg-blue-500";
    case "Doubt":
      return "bg-pink-500";
    case "Extra":
      return "bg-green-500";
    case "Revision":
      return "bg-yellow-500";
    case "Exam":
      return "bg-red-500";
    default:
      return "bg-gray-400";
  }
}

export default function TimetablePage() {
  const [viewType, setViewType] = useState("BATCHWISE");

  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [teachers, setTeachers] = useState([]);
    const router = useRouter();
  const [filters, setFilters] = useState({
    course_id: "",
    batch_id: "",
    teacher_id: "",
  });

  const [weekStart, setWeekStart] = useState(getStartOfWeek(new Date()));
  const [schedule, setSchedule] = useState([]);

  /* ================= LOAD MASTER ================= */

  useEffect(() => {
    api.get("/courses").then((r) => setCourses(r.data?.data || []));
    api.get("/teachers").then((r) => setTeachers(r.data?.data || []));
  }, []);

  useEffect(() => {
    if (!filters.course_id) return;
    api
      .get("/batches", { params: { course_id: filters.course_id } })
      .then((r) => setBatches(r.data?.data || []));
  }, [filters.course_id]);

  /* ================= AUTO FETCH ON WEEK CHANGE ================= */

    useEffect(() => {
    if (
        (viewType === "BATCHWISE" &&
        filters.course_id &&
        filters.batch_id) ||
        (viewType === "TEACHERWISE" &&
        filters.teacher_id)
    ) {
        fetchSchedule();
    }
    }, [weekStart]);

  /* ================= FETCH WEEK DATA (ONE CALL) ================= */

    const fetchSchedule = async () => {
    try {
        const params = {
        week_start: formatApiDate(weekStart),
        week_end: formatApiDate(addDays(weekStart, 5)), // Monday–Saturday
        };

        if (viewType === "BATCHWISE") {
        if (!filters.course_id || !filters.batch_id) return;
        params.course_id = filters.course_id;
        params.batch_id = filters.batch_id;
        }

        if (viewType === "TEACHERWISE") {
        if (!filters.teacher_id) return;
        params.teacher_id = filters.teacher_id;
        }

        const res = await api.get(
        "/class-routines/schedule/by-date",
        { params }
        );

        setSchedule(res.data?.data || []);
    } catch (err) {
        console.error(err);
    }
    };

  /* ================= WEEK NAV ================= */

  const nextWeek = () => {
    const next = new Date(weekStart);
    next.setDate(next.getDate() + 7);
    setWeekStart(next);
  };

  const prevWeek = () => {
    const prev = new Date(weekStart);
    prev.setDate(prev.getDate() - 7);
    setWeekStart(prev);
  };

  const weekDates = getWeekDatesWithoutSunday(weekStart);

  /* ===================================================== */

  return (
    <div className="space-y-6 p-6">




      {/* ===== FILTER SECTION ===== */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-5">

        <div className="flex justify-between items-start">

            {/* LEFT SIDE (Batchwise / Teacherwise) */}
            <div className="flex gap-10 text-sm">
            <Radio
                label="Batchwise"
                active={viewType === "BATCHWISE"}
                onClick={() => setViewType("BATCHWISE")}
            />
            <Radio
                label="Teacherwise"
                active={viewType === "TEACHERWISE"}
                onClick={() => setViewType("TEACHERWISE")}
            />
            </div>

            {/* RIGHT SIDE (Dropdown Button) */}
            <ActionDropdown />

        </div>

        {viewType === "BATCHWISE" ? (
          <div className="flex gap-4 items-end flex-wrap">
            <Select
              label="Category/Course *"
              value={filters.course_id}
              options={courses}
              onChange={(v) =>
                setFilters({ ...filters, course_id: v })
              }
            />

            <Select
              label="Batch *"
              value={filters.batch_id}
              options={batches}
              onChange={(v) =>
                setFilters({ ...filters, batch_id: v })
              }
            />

            <PrimaryButton name="Go" onClick={fetchSchedule} />
          </div>
        ) : (
          <div className="flex gap-4 items-end">
            <Select
              label="Teacher *"
              value={filters.teacher_id}
              options={teachers}
              onChange={(v) =>
                setFilters({ ...filters, teacher_id: v })
              }
            />

            <PrimaryButton name="Go" onClick={fetchSchedule} />
          </div>
        )}
      </div>

      {/* ===== WEEK NAV ===== */}
      <div className="flex justify-center items-center gap-6 text-sm font-medium">
        <button onClick={prevWeek}>{"<"}</button>
        <span>
          {formatDisplayDate(weekDates[0])} -{" "}
          {formatDisplayDate(weekDates[5])}
        </span>
        <button onClick={nextWeek}>{">"}</button>
      </div>

      {/* ===== TABLE ===== */}
        <div className="bg-white  shadow-sm border border-gray-200 overflow-hidden">
            {/* ===== LEGEND ===== */}
                <div className="flex gap-6 text-sm text-gray-600 bg-white px-4 py-3 rounded-xl border border-gray-200 shadow-sm w-fit my-2 mx-2">
                    <LegendItem color="bg-blue-500" label="Regular" />
                    <LegendItem color="bg-pink-500" label="Doubt" />
                    <LegendItem color="bg-green-500" label="Extra" />
                    <LegendItem color="bg-yellow-500" label="Revision" />
                    <LegendItem color="bg-red-500" label="Exam" />
                </div>

            <table className="w-full text-sm border-collapse ">

                {/* ===== HEADER ===== */}
                <thead>
                <tr className="bg-gray-100 text-gray-700">
                    <th className="px-4 py-3 border border-gray-200 text-left font-semibold">
                    Days
                    </th>
                    {weekDates.map((d, i) => (
                    <th
                        key={i}
                        className="px-4 py-3 border border-gray-200 text-center font-semibold"
                    >
                        {d.toLocaleDateString("en-US", {
                        weekday: "long",
                        })}
                    </th>
                    ))}
                </tr>

                <tr className="bg-gray-50 text-gray-600">
                    <th className="px-4 py-2 border border-gray-200 text-left font-medium">
                    Date
                    </th>
                    {weekDates.map((d, i) => (
                    <th key={i} className="px-4 py-2 border border-gray-200 text-center font-medium">
                        {formatDisplayDate(d)}
                    </th>
                    ))}
                </tr>
                </thead>

                {/* ===== BODY ===== */}
                <tbody className="text-gray-700">

                {/* TIME */}
                <tr className="hover:bg-gray-50 transition">
                    <td className="px-2 py-1 border border-gray-200 font-medium bg-gray-50">
                    Time
                    </td>
                    {weekDates.map((d, i) => (
                    <td key={i} className="px-4 py-3 border border-gray-200 text-center">
                        {renderCell(schedule, d, "time")}
                    </td>
                    ))}
                </tr>

                {/* SUBJECT */}
                <tr className="hover:bg-gray-50 transition">
                    <td className="px-2 py-1 border border-gray-200 font-medium bg-gray-50">
                        Subject
                    </td>
                    {weekDates.map((d, i) => {
                        const item = getItem(schedule, d);
                        const dotColor = getDotColor(item?.class_type);

                        return (
                        <td key={i} className="px-4 py-3 border border-gray-200 text-center">
                            {item ? (
                            <div className="flex items-center justify-center gap-2">
                                <span className={`w-2.5 h-2.5 rounded-full ${dotColor}`} />
                                {item.subject?.name}
                            </div>
                            ) : (
                            "-"
                            )}
                        </td>
                        );
                    })}
                    </tr>

                {/* CATEGORY / COURSE */}
                <tr className="hover:bg-gray-50 transition">
                    <td className="px-2 py-1 border border-gray-200 font-medium bg-gray-50">
                    Category/Course (Batch)
                    </td>
                    {weekDates.map((d, i) => {
                    const item = getItem(schedule, d);

                    return (
                        <td key={i} className="px-4 py-3 border border-gray-200 text-center">
                        {item
                            ? `${item.course?.name} (${item.batch?.name})`
                            : "-"}
                        </td>
                    );
                    })}
                </tr>

                {/* TOPIC */}
                <tr className="hover:bg-gray-50 transition">
                    <td className="px-2 py-1 border border-gray-200 font-medium bg-gray-50">
                    Topic
                    </td>
                    {weekDates.map((d, i) => {
                    const item = getItem(schedule, d);
                    return (
                        <td key={i} className="px-4 py-3 border border-gray-200 text-center">
                        {item?.topic || "-"}
                        </td>
                    );
                    })}
                </tr>

                {/* TEACHER */}
                <tr className="hover:bg-gray-50 transition">
                    <td className="px-2 py-1 border border-gray-200 font-medium bg-gray-50">
                    Teacher
                    </td>
                    {weekDates.map((d, i) => {
                    const item = getItem(schedule, d);
                    return (
                        <td key={i} className="px-4 py-3 border border-gray-200 text-center">
                        {item?.teacher?.name || "-"}
                        </td>
                    );
                    })}
                </tr>

                </tbody>
            </table>
            </div>
    </div>
  );
}

/* ================= HELPERS ================= */

function getStartOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

function getWeekDatesWithoutSunday(start) {
  return Array.from({ length: 6 }).map((_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatApiDate(date) {
  return new Date(date).toISOString().split("T")[0];
}

function formatDisplayDate(date) {
  return new Date(date).toLocaleDateString("en-IN");
}

function renderCell(data, date, field) {
  const formatted = formatApiDate(date);
  const item = data.find((s) => s.date === formatted);
  if (!item) return "-";

  if (field === "time")
    return `${item.start_time} - ${item.end_time}`;
  if (field === "subject")
    return item.subject?.name || "-";
  if (field === "teacher")
    return item.teacher?.name || "-";

  return "-";
}

function Radio({ label, active, onClick }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input type="radio" checked={active} onChange={onClick} />
      {label}
    </label>
  );
}

function Select({ label, value, options, onChange }) {
  return (
    <div className="w-64">
      <label className="form-label">{label}</label>
      <select
        className="soft-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select</option>
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.name}
          </option>
        ))}
      </select>
    </div>
  );
}


function ActionDropdown() {
     const router = useRouter();
  const [open, setOpen] = React.useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        + Schedule
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <button
            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
            onClick={() => {
              router.push("/admin/classes/schedule/create");
            }}
          >
            Create Class
          </button>

          <button
            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
            onClick={() => {
              router.push("/admin/exam/schedule/create");
            }}
          >
            Create Exam
          </button>
        </div>
      )}
    </div>
  );
}