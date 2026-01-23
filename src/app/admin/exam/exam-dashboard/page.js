"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/utils/api";

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

    const rows =
      res.data?.data.map((e) => ({
        id: e.id,
        batch: e.batch?.name,
        subject: e.subjects?.[0]?.subject?.short_code || "-",
        tests: e.subjects?.length || 0,
        att: e.subjects?.length ? 1 : 0,
        marks: e.subjects?.length ? 1 : 0,
      })) || [];

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

    const rows =
      res.data?.data.flatMap((e) =>
        e.subjects.map((s) => ({
          subject: s.subject?.short_code,
          tests: 1,
          att: 1,
          marks: 1,
        }))
      ) || [];

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
                <th className="p-3 text-left">Batch</th>
                <th className="p-3 text-left">Subject</th>
                <th className="p-3 text-left">No of test</th>
                <th className="p-3 text-left">Att. Updated</th>
                <th className="p-3 text-left">Marks Updated</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {batchRows.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-10 text-center text-gray-400">
                    No data
                  </td>
                </tr>
              ) : (
                batchRows.map((r) => (
                  <tr key={r.id} className="border-t border-gray-200">
                    <td className="p-3">{r.batch}</td>
                    <td className="p-3">{r.subject}</td>
                    <td className="p-3">{r.tests}</td>
                    <td className="p-3">{r.att}</td>
                    <td className="p-3">{r.marks}</td>
                    <td className="p-3 text-right">
                      <button className="soft-btn-outline">View Result</button>
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
                <th className="p-3 text-left">Exam Date</th>
                <th className="p-3 text-left">Course</th>
                <th className="p-3 text-left">Batch</th>
                <th className="p-3 text-left">Status</th>
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
                    <td className="p-3 ">{e.exam_date}</td>
                    <td className="p-3">{e.course?.name}</td>
                    <td className="p-3">{e.batch?.name}</td>
                    <td className="p-3">Deleted</td>
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

        <table className="w-full text-sm">
          <thead className="bg-blue-50">
            <tr>
              <th className="p-3 text-left">Subject</th>
              <th className="p-3 text-left">No of test</th>
              <th className="p-3 text-left">Att. Updated</th>
              <th className="p-3 text-left">Marks Updated</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {summaryRows.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-10 text-center text-gray-400">
                  No subject data
                </td>
              </tr>
            ) : (
              summaryRows.map((s, i) => (
                <tr key={i} className="border-t border-gray-200">
                  <td className="p-3">{s.subject}</td>
                  <td className="p-3">{s.tests}</td>
                  <td className="p-3">{s.att}</td>
                  <td className="p-3">{s.marks}</td>
                  <td className="p-3 text-right">
                    <button className="soft-btn-outline">View Result</button>
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
