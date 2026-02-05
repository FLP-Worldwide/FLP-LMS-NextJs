"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { api } from "@/utils/api";


const formatDateWithDay = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    weekday: "long",
  });
};

const formatTime = (time) => {
  const [h, m] = time.split(":");
  const date = new Date();
  date.setHours(h, m);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
};

const getStatus = (examDate) => {
  const today = new Date().setHours(0, 0, 0, 0);
  const examDay = new Date(examDate).setHours(0, 0, 0, 0);
  return examDay >= today ? "Upcoming" : "Completed";
};



export default function ExamSchedulePage() {
  const router = useRouter();

  /* ================= FILTER STATE ================= */
  const [filters, setFilters] = useState({
    course_id: "",
    batch_id: "",
    subject_id: "",
  });

  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= INIT ================= */
  useEffect(() => {
    fetchCourses();
  }, []);

  /* ================= API ================= */
  const fetchCourses = async () => {
    const res = await api.get("/courses");
    setCourses(res.data?.data || []);
  };

  const fetchBatches = async (courseId) => {
    if (!courseId) return;
    const res = await api.get("/batches", {
      params: { course_id: courseId },
    });
    setBatches(res.data?.data || []);
  };

  const fetchSubjects = async (batchId) => {
    if (!batchId) return;
    const res = await api.get("/subjects", {
      params: { batch_id: batchId },
    });
    setSubjects(res.data?.data || []);
  };

  const searchExams = async () => {
    setLoading(true);
    const res = await api.get("/exams", {
      params: {
        course_id: filters.course_id || undefined,
        batch_id: filters.batch_id || undefined,
        subject_id: filters.subject_id || undefined,
      },
    });
    setExams(res.data?.data || []);
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      {/* ================= FILTER ROW ================= */}
      <div className="grid grid-cols-4 gap-4 bg-white p-4 rounded-xl border border-gray-200">
        {/* Course */}
        <select
          className="soft-select"
          value={filters.course_id}
          onChange={(e) => {
            setFilters({
              course_id: e.target.value,
              batch_id: "",
              subject_id: "",
            });
            setBatches([]);
            setSubjects([]);
            fetchBatches(e.target.value);
          }}
        >
          <option value="">Category / Course*</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Batch */}
        <select
          className="soft-select"
          value={filters.batch_id}
          onChange={(e) => {
            setFilters({ ...filters, batch_id: e.target.value });
            fetchSubjects(e.target.value);
          }}
          disabled={!filters.course_id}
        >
          <option value="">Batch*</option>
          {batches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>

        {/* Subject */}
        <select
          className="soft-select"
          value={filters.subject_id}
          onChange={(e) =>
            setFilters({ ...filters, subject_id: e.target.value })
          }
          disabled={!filters.batch_id}
        >
          <option value="">Select Subject</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        {/* Search */}
        <PrimaryButton name="Search" onClick={searchExams} />
      </div>

      {/* ================= ADD EXAM ================= */}
      <div className="flex justify-end">
        <PrimaryButton
          name="Add Exam"
          onClick={() => router.push("/admin/exam/schedule/create")}
        />
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
  <table className="w-full text-sm">
    <thead className="bg-gray-50 text-gray-600">
      <tr>
        <th className="p-3 text-left">Date</th>
        <th className="p-3 text-left">Time</th>
        <th className="p-3 text-left">Batch</th>
        <th className="p-3 text-left">Subject(s)</th>
        <th className="p-3 text-left">Topic(s)</th>
        <th className="p-3 text-left">Total Marks</th>
        <th className="p-3 text-left">Room No.</th>
        <th className="p-3 text-left">Status</th>
        <th className="p-3 text-right">Action</th>
      </tr>
    </thead>

    <tbody>
      {loading && (
        <tr>
          <td colSpan="9" className="p-6 text-center text-gray-400">
            Loading...
          </td>
        </tr>
      )}

      {!loading && exams.length === 0 && (
        <tr>
          <td colSpan="9" className="p-6 text-center text-gray-400">
            No exam found
          </td>
        </tr>
      )}

      {!loading &&
        exams.map((exam) => {
         const subjectNames = exam.subjects
          .map((s) => s.name)
          .join(", ");

        const subjectMarks = exam.subjects
          .map((s) => `${s.name}: ${s.marks}`)
          .join(", ");

        const topic = exam.topic || "-";
        const room = exam.room || "-";


          const status = getStatus(exam.exam_date);

          return (
            <tr
              key={exam.id}
              className="border-t hover:bg-gray-50 transition"
            >
              {/* Date */}
              <td className="p-3">
                {formatDateWithDay(exam.exam_date)}
              </td>

              {/* Time */}
              <td className="p-3">
                {formatTime(exam.start_time)} <br />
                {formatTime(exam.end_time)}
              </td>

              {/* Batch */}
              <td className="p-3">
                {exam.batch?.name}
              </td>

              {/* Subjects */}
             <td className="p-3">{subjectNames}</td>
              <td className="p-3">{topic}</td>
              <td className="p-3">{subjectMarks}</td>
              <td className="p-3">{room}</td>


              {/* Status */}
              <td className="p-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs text-white ${
                    status === "Upcoming"
                      ? "bg-orange-500"
                      : "bg-gray-500"
                  }`}
                >
                  {status}
                </span>
              </td>

              {/* Actions */}
              <td className="p-3 text-right space-x-3">
                
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
