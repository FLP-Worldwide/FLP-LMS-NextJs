"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Users } from "lucide-react";
import { api } from "@/utils/api";

const formatDate = (date) =>
  new Date(date).toISOString().split("T")[0];

const formatDateLabel = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    weekday: "long",
  });

const formatTime = (time) => {
  const [h, m] = time.split(":");
  const d = new Date();
  d.setHours(h, m);
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
};

export default function ExamAttendanceListPage() {
  const router = useRouter();

  const [date, setDate] = useState(formatDate(new Date()));
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH EXAMS ================= */
  useEffect(() => {
    fetchExams();
  }, [date]);

  const fetchExams = async () => {
    try {
      setLoading(true);

      const res = await api.get("/exams", {
        params: { date },
      });

      setExams(res.data?.data || []);
    } catch (e) {
      console.error("Failed to load exams", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-6">
      {/* ================= HEADER ================= */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Exam Attendance</h2>
          <p className="text-xs text-gray-500">
            Attendance can be marked only for today’s exams
          </p>
        </div>

        {/* DATE FILTER */}
        <div>
          <input
            type="date"
            className="soft-input w-48"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Time</th>
              <th className="p-3 text-left">Course</th>
              <th className="p-3 text-left">Batch</th>
              <th className="p-3 text-left">Subject(s)</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-right">Attendance</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan="7" className="p-6 text-center text-gray-400">
                  Loading...
                </td>
              </tr>
            )}

            {!loading && exams.length === 0 && (
              <tr>
                <td colSpan="7" className="p-6 text-center text-gray-400">
                  No exams found
                </td>
              </tr>
            )}

            {!loading &&
              exams.map((exam) => {
                const status = exam.is_today
                  ? exam.is_attendance_marked
                    ? "Attendance Marked"
                    : "Attendance Pending"
                  : "Not Allowed";

                return (
                  <tr
                    key={exam.id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="p-3">
                      {formatDateLabel(exam.exam_date)}
                    </td>

                    <td className="p-3">
                      {formatTime(exam.start_time)} –{" "}
                      {formatTime(exam.end_time)}
                    </td>

                    <td className="p-3">{exam.course?.name}</td>
                    <td className="p-3">{exam.batch?.name}</td>

                    <td className="p-3">
                      {exam.subjects.map((s) => s.name).join(", ")}
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs text-white ${
                          status === "Attendance Pending"
                            ? "bg-blue-600"
                            : status === "Attendance Marked"
                            ? "bg-green-600"
                            : "bg-gray-500"
                        }`}
                      >
                        {status}
                      </span>
                    </td>

                    <td className="p-3 text-right">
                      <button
                        className={`soft-icon-btn ${
                          exam.is_today
                            ? ""
                            : "opacity-40 cursor-not-allowed"
                        }`}
                        title={
                          exam.is_today
                            ? "Mark Attendance"
                            : "Attendance allowed only for today"
                        }
                        disabled={!exam.is_today}
                        onClick={() => {
                          if (!exam.is_today) return;
                          router.push(
                            `/admin/exam/schedule/${exam.id}/attendance`
                          );
                        }}
                      >
                        <Users size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
