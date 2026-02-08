"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { api } from "@/utils/api";

import { Pencil, Bell, XCircle, Users } from "lucide-react";
import AlertModal from "@/components/ui/AlertModal";
import Modal from "@/components/ui/Modal";




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

const getExamStatus = (exam) => {
  if (exam.is_today) {
    return exam.is_attendance_marked
      ? "Attendance Marked"
      : "Attendance Pending";
  }

  const today = new Date().setHours(0, 0, 0, 0);
  const examDay = new Date(exam.exam_date).setHours(0, 0, 0, 0);

  if (examDay > today) return "Upcoming";
  return "Completed";
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

  const [editExam, setEditExam] = useState(null);
  const [cancelExam, setCancelExam] = useState(null);
  const [saving, setSaving] = useState(false);


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
               {(() => {
                  const status = getExamStatus(exam);

                  return (
                    <span
                      className={`px-3 py-1 rounded-full text-xs text-white ${
                        status === "Attendance Pending"
                          ? "bg-blue-600"
                          : status === "Attendance Marked"
                          ? "bg-green-600"
                          : status === "Upcoming"
                          ? "bg-orange-500"
                          : "bg-gray-500"
                      }`}
                    >
                      {status}
                    </span>
                  );
                })()}


              </td>

              {/* Actions */}
              <td className="p-3 text-right">
                <div className="inline-flex gap-2">
                  {/* Edit */}
                  <button
                    className="soft-icon-btn"
                    title="Edit Exam"
                    onClick={() => setEditExam(exam)}
                  >
                    <Pencil size={16} />
                  </button>

                  {/* Cancel */}
                  <button
                    className="soft-icon-btn text-red-600"
                    title="Cancel Exam"
                    onClick={() => setCancelExam(exam)}
                  >
                    <XCircle size={16} />
                  </button>

                  {/* Notify */}
                  <button
                    className="soft-icon-btn"
                    title="Send Notification"
                    onClick={() => {
                      // hook notification logic here
                    }}
                  >
                    <Bell size={16} />
                  </button>

                  {/* Attendance */}
                 <button
                    className={`soft-icon-btn ${
                      exam.is_today ? "" : "opacity-40 cursor-not-allowed"
                    }`}
                    title={
                      exam.is_today
                        ? exam.is_attendance_marked
                          ? "Attendance already marked"
                          : "Mark Attendance"
                        : "Attendance allowed only on exam day"
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


                </div>
              </td>

            </tr>
          );
        })}
    </tbody>
  </table>
</div>
  {editExam && (
    <Modal
      title="Edit Exam"
      onClose={() => setEditExam(null)}
      className="max-w-2xl"
    >
     <div className="grid grid-cols-2 gap-6">
        {/* Description */}
        <div>
          <label className="soft-label">Description / Topic</label>
          <input
            className="soft-input"
            value={editExam.topic || ""}
            onChange={(e) =>
              setEditExam({ ...editExam, topic: e.target.value })
            }
          />
        </div>

        {/* Subject Marks */}
        <div className="space-y-3">
          <label className="soft-label">Marks</label>

          {editExam.subjects.map((s, i) => (
            <div key={s.id} className="flex gap-3 items-center">
              <div className="flex-1 text-sm">{s.name}</div>

              <input
                type="number"
                className="soft-input w-32"
                value={s.marks}
                onChange={(e) => {
                  const subjects = [...editExam.subjects];
                  subjects[i] = {
                    ...subjects[i],
                    marks: e.target.value,
                  };
                  setEditExam({ ...editExam, subjects });
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-6">
        <button
          className="soft-btn-outline"
          onClick={() => setEditExam(null)}
        >
          Cancel
        </button>

        <PrimaryButton
          name={saving ? "Saving..." : "Save Changes"}
          onClick={async () => {
            setSaving(true);

            await api.put(`/exams/${editExam.id}`, {
              topic: editExam.topic,
              subjects: editExam.subjects.map((s) => ({
                id: s.id,
                marks: s.marks,
              })),
            });

            setSaving(false);
            setEditExam(null);
            searchExams(); // refresh list
          }}
        />
      </div>
    </Modal>
  )}

<AlertModal
    open={!!cancelExam}
    onClose={() => setCancelExam(null)}
    onConfirm={async () => {
      setSaving(true);

      await api.post(`/exams/${cancelExam.id}/cancel`);

      setSaving(false);
      setCancelExam(null);
      searchExams();
    }}
    title="Cancel Exam?"
    message="This exam will be cancelled."
    subMessage="Students and teachers will be notified."
    confirmText="Yes, Cancel Exam"
    cancelText="No"
    type="danger"
    loading={saving}
  />


    </div>
  );
}
