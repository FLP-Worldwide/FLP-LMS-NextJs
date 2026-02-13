"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/utils/api";

const getExamStatus = (exam) => {
  if (exam.status === "cancelled") return "cancelled";

  if (exam.status === "scheduled") {
    const today = new Date();
    const examDate = new Date(exam.exam_date);

    today.setHours(0,0,0,0);
    examDate.setHours(0,0,0,0);

    if (examDate < today) return "completed";
    if (examDate.getTime() === today.getTime()) return "today";
    return "upcoming";
  }

  return exam.status;
};


export default function ExamDashboardPage() {
  /* ================= DROPDOWNS ================= */
  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);

  /* ================= CARD 1 ================= */
  const [courseId, setCourseId] = useState("");
  const [batchRows, setBatchRows] = useState([]);

  /* ================= CARD 2 ================= */
  const [examDate, setExamDate] = useState("");
  const [historyRows, setHistoryRows] = useState([]);

  /* ================= CARD 3 ================= */
  const [classId, setClassId] = useState("");
  const [summaryRows, setSummaryRows] = useState([]);

  /* ================= INIT ================= */
  useEffect(() => {
    fetchCourses();
    fetchClasses();
  }, []);

  const fetchCourses = async () => {
    const res = await api.get("/courses");
    setCourses(res.data?.data || []);
  };

  const fetchClasses = async () => {
    const res = await api.get("/classes");
    setClasses(res.data?.data || []);
  };

  /* ================= CARD 1 API ================= */
  const fetchBatchWise = async () => {
    if (!courseId) return;

    const res = await api.get("/exams", {
      params: { course_id: courseId },
    });

    const exams = res.data?.data || [];

    const rows = exams.map((e) => ({
      id: e.id,
      batch: e.batch?.name || "-",
      examDate: e.exam_date,
      room: e.room || "-",
      subjects: e.total_subjects,
      attendanceStatus: e.attendance?.status || "NOT_MARKED",
      attendanceCount: e.attendance?.marked_count || 0,
      totalStudents: e.attendance?.total_students || 0,
      marksEntered: e.marks_entered || 0,
      totalSubjects: e.total_subjects || 0,
      status: getExamStatus(e),
    }));

    setBatchRows(rows);
  };



  /* ================= CARD 2 API ================= */
  const fetchHistory = async () => {
    if (!examDate) return;

    const res = await api.get("/exams", {
      params: { exam_date: examDate },
    });

    setHistoryRows(res.data?.data || []);
  };


  /* ================= CARD 3 API ================= */
  const fetchSubjectSummary = async () => {
  if (!classId) return;

  const res = await api.get("/exams", {
    params: { class_id: classId },
  });

  const exams = res.data?.data || [];

  const rows = exams.map((e) => ({
    id: e.id,
    subject: e.subjects?.map((s) => s.name).join(", ") || "-",
    totalTests: e.total_subjects || 0,
    attendanceCount: e.attendance?.marked_count || 0,
    totalStudents: e.attendance?.total_students || 0,
    marksEntered: e.marks_entered || 0,
    totalSubjects: e.total_subjects || 0,
    lastExam: e.exam_date,
    status: getExamStatus(e), // 🔥 important
  }));



  setSummaryRows(rows);
};






  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Exam Dashboard</h2>

      {/* ================= TOP GRID ================= */}
      <div className="grid grid-cols-12 gap-4">
        {/* ===== CARD 1 ===== */}
        <div className="col-span-6 bg-white rounded-xl border border-gray-200 min-h-[360px]">
          <div className="p-3 border-b border-gray-200 flex gap-3 items-end">
            <div>
              <label className="text-xs text-gray-500">Category / Course</label>
              <select
                className="soft-select w-56"
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
              >
                <option value="">Select Course</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <button className="soft-btn-outline" onClick={fetchBatchWise}>
              Search
            </button>
          </div>

          <table className="w-full text-sm">
            <thead className="bg-blue-50">
              <tr>
                <th>Batch</th>
                <th>Exam Date</th>
                {/* <th>Room</th> */}
                <th>Subjects</th>
                <th>Attendance</th>
                <th>Marks</th>
                <th>Status</th>
                <th className="text-right">Actions</th>

              </tr>
            </thead>
            <tbody>
              {batchRows.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-10 text-center text-gray-400">
                    No data
                  </td>
                </tr>
              ) : (
                batchRows.map((r) => (
                  <tr key={r.id} className="border-t border-gray-200">
                    <td className="p-3">{r.batch}</td>
                    <td className="p-3">{r.examDate}</td>
                    {/* <td className="p-3">{r.room}</td> */}
                    <td className="p-3">{r.subjects}</td>
                    <td className="p-3">
                      {r.attendanceStatus === "FULL" ? (
                        <span className="text-green-600 text-xs">Full</span>
                      ) : r.attendanceStatus === "NOT_MARKED" ? (
                        <span className="text-gray-500 text-xs">Not Marked</span>
                      ) : (
                        <span className="text-orange-600 text-xs">Partial</span>
                      )}
                    </td>

                    <td className="p-3">
                      {r.marksEntered}/{r.totalSubjects}
                    </td>

                    <td className="p-3">
                      {r.status === "cancelled" ? (
                        <span className="text-red-600 text-xs font-semibold">
                          Cancelled
                        </span>
                      ) : r.status === "completed" ? (
                        <span className="text-green-600 text-xs">
                          Completed
                        </span>
                      ) : r.status === "today" ? (
                        <span className="text-blue-600 text-xs">
                          Today
                        </span>
                      ) : (
                        <span className="text-gray-500 text-xs">
                          Upcoming
                        </span>
                      )}
                    </td>

                    <td className="p-3 text-right">
                      <button className="soft-btn-outline">
                        View Result
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>

        {/* ===== CARD 2 ===== */}
        <div className="col-span-6 bg-white rounded-xl border border-gray-200 min-h-[360px]">
          <div className="p-3 border-b border-gray-200 flex gap-3 items-end">
            <div>
              <label className="text-xs text-gray-500">Exam Date</label>
              <input
                type="date"
                className="soft-input"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
              />
            </div>

            <button className="soft-btn-outline" onClick={fetchHistory}>
              Search
            </button>
          </div>

          <table className="w-full text-sm">
            <thead className="bg-blue-50">
              <tr>
                <th>Exam Date</th>
                <th>Time</th>
                <th>Course</th>
                <th>Batch</th>
                {/* <th>Room</th> */}
                <th>Subjects</th>
                <th>Status</th>

              </tr>
            </thead>
            <tbody>
              {historyRows.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-10 text-center text-gray-400">
                    No history
                  </td>
                </tr>
              ) : (
                historyRows.map((e) => (
                  <tr key={e.id} className="border-t border-gray-200">
                    <td className="p-3">{e.exam_date}</td>
                    <td className="p-3">
                      {e.start_time} - {e.end_time}
                    </td>
                    <td className="p-3">{e.course?.name}</td>
                    <td className="p-3">{e.batch?.name}</td>
                    {/* <td className="p-3">{e.room}</td> */}
                    <td className="p-3">
                      {e.subjects?.map(s => s.name).join(", ")}
                    </td>
                    <td className="p-3">
                      {e.status === "cancelled" ? (
                        <span className="text-red-600 text-xs font-semibold">
                          Cancelled
                        </span>
                      ) : e.attendance?.status === "FULL" ? (
                        <span className="text-green-600 text-xs">
                          Attendance Full
                        </span>
                      ) : e.attendance?.status === "NOT_MARKED" ? (
                        <span className="text-gray-500 text-xs">
                          Not Marked
                        </span>
                      ) : (
                        <span className="text-orange-600 text-xs">
                          Partial
                        </span>
                      )}
                    </td>

                  </tr>
                ))

              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= CARD 3 ================= */}
      <div className="bg-white rounded-xl border border-gray-200 min-h-[300px]">
        <div className="p-3 border-b border-gray-200 flex gap-3 items-end">
          <div>
            <label className="text-xs text-gray-500">Standard / Class</label>
            <select
              className="soft-select w-56"
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
            >
              <option value="">Select Class</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <button className="soft-btn-outline" onClick={fetchSubjectSummary}>
            Search
          </button>
        </div>

        <table className="w-full text-sm ">
          <thead className="bg-blue-50 ">
            <tr className="">
              <th className="text-left">Subject</th>
              <th className="text-left">Total Tests</th>
              <th className="text-left">Attendance</th>
              <th className="text-left">Marks</th>
              <th className="text-left">Last Exam</th>
              <th className="text-left">Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>


          <tbody>
            {summaryRows.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-10 text-center text-gray-400">
                  No subject data
                </td>
              </tr>
            ) : (
              summaryRows.map((s, i) => (
                <tr key={i} className="border-t border-gray-200">
                  <td className="p-3">{s.subject}</td>

                  <td className="p-3">{s.totalTests}</td>

                  <td className="p-3">
                    {s.attendance}/{s.totalTests}
                  </td>

                  <td className="p-3">
                    {s.marks}/{s.totalTests}
                  </td>

                  <td className="p-3">{s.lastExam}</td>

                  <td className="p-3">
                    {s.status === "cancelled" ? (
                      <span className="text-red-600 text-xs font-semibold">
                        Cancelled
                      </span>
                    ) : s.status === "completed" ? (
                      <span className="text-green-600 text-xs">
                        Completed
                      </span>
                    ) : s.status === "today" ? (
                      <span className="text-blue-600 text-xs">
                        Today
                      </span>
                    ) : (
                      <span className="text-gray-500 text-xs">
                        Upcoming
                      </span>
                    )}
                  </td>


                  <td className="p-3 text-right">
                    <button className="soft-btn-outline">
                      View Result
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>


        </table>
      </div>
    </div>
  );
}
