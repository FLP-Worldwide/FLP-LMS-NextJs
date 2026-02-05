"use client";

import React, { useEffect, useState } from "react";
import PrimaryButton from "@/components/ui/PrimaryButton";
import Modal from "@/components/ui/Modal";
import { api } from "@/utils/api";

export default function CreateExamPage() {
  /* ================= FILTER ================= */
  const [filters, setFilters] = useState({
    course_id: "",
    batch_id: "",
  });

  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);

  /* ================= EXAM LIST ================= */
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= MODAL ================= */
  const [showModal, setShowModal] = useState(false);

  /* ================= EXAM FORM ================= */
  const [examDate, setExamDate] = useState("");
  const [startHour, setStartHour] = useState("12");
  const [startMinute, setStartMinute] = useState("00");
  const [endHour, setEndHour] = useState("1");
  const [endMinute, setEndMinute] = useState("00");

  const [subjects, setSubjects] = useState([]);
  const [subjectList, setSubjectList] = useState([]);
  // const [topics, setTopics] = useState([]);

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
    const res = await api.get("/batches", {
      params: { course_id: courseId },
    });
    setBatches(res.data?.data || []);
  };

  const fetchSubjects = async (batchId) => {
    const res = await api.get("/classes", {
      params: { batch_id: batchId },
    });
    setSubjectList(res.data?.data || []);
  };

  const fetchTopics = async (index) => {
    if (!filters.batch_id) return;

    const res = await api.get("/subjects", {
      params: { class_id: filters.batch_id },
    });

    const updated = [...subjects];
    updated[index] = {
      ...updated[index],
      topics: res.data?.data || [],
    };

    setSubjects(updated);
  };



  /* ================= FETCH EXAMS ================= */
  const fetchExams = async () => {
    if (!filters.course_id || !filters.batch_id) return;

    setLoading(true);
    const res = await api.get("/exams", {
      params: {
        course_id: filters.course_id,
        batch_id: filters.batch_id,
      },
    });
    setExams(res.data?.data || []);
    setLoading(false);
  };

  /* ================= SUBJECT ROW ================= */
  const addSubjectRow = () => {
    setSubjects([
      ...subjects,
      {
        subject_id: "",
        marks: "",
        topic_id: "",
        description: "",
        room_no: "",
        topics: [],
      },
    ]);
  };

  const updateSubject = (index, key, value) => {
    const updated = [...subjects];
    updated[index][key] = value;
    setSubjects(updated);
  };

  const removeSubject = (index) => {
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  /* ================= SAVE ================= */
  const saveExam = async () => {
    if (!examDate) return alert("Please select exam date");
    if (subjects.length === 0) return alert("Please add subject");

    await api.post("/exams", {
      course_id: filters.course_id,
      batch_id: filters.batch_id,
      exam_date: examDate,
      start_time: `${startHour}:${startMinute}`,
      end_time: `${endHour}:${endMinute}`,
      subjects,
    });

    setShowModal(false);
    fetchExams(); // 🔥 refresh list
  };

  return (
    <div className="space-y-4">
      {/* ================= COURSE / BATCH ================= */}
      <div className="grid grid-cols-5 gap-4 bg-white p-4 rounded-xl border border-gray-200">
        <select
          className="soft-select"
          value={filters.course_id}
          onChange={(e) => {
            setFilters({ course_id: e.target.value, batch_id: "" });
            fetchBatches(e.target.value);
            setExams([]);
          }}
        >
          <option value="">Category / Course*</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

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
            <PrimaryButton
            name="Find Exam"
            onClick={() => {
                if (!filters.course_id || !filters.batch_id) {
                alert("Please select Course and Batch");
                return;
                }
                fetchExams();
            }}
            />

        <PrimaryButton
          name="Add Exam"
          onClick={() => {
            if (!filters.course_id || !filters.batch_id) {
              alert("Select Course and Batch first");
              return;
            }
            setSubjects([]);
            setExamDate("");
            setShowModal(true);
          }}
        />
      </div>

      {/* ================= EXAM LIST ================= */}
      <div className="bg-white rounded-xl border border-gray-200">
        {loading && (
          <div className="p-6 text-center text-gray-400">Loading...</div>
        )}

        {!loading && exams.length === 0 && (
          <div className="p-6 text-center text-gray-400">
            No exam found
          </div>
        )}

        {!loading &&
            exams.map((exam) => {
                const totalMarks = exam.subjects.reduce(
                (sum, s) => sum + Number(s.marks || 0),
                0
                );

                return (
                <div
                    key={exam.id}
                    className="bg-white rounded-xl border border-gray-200 p-4 space-y-3"
                >
                    {/* ================= HEADER ================= */}
                    <div className="flex justify-between items-start">
                    <div>
                        <div className="text-sm font-semibold">
                        Course - {exam.course?.name} — (Batch - {exam.batch?.name})
                        </div>
                        <div className="text-xs text-gray-500">
                        Exam Date: {exam.exam_date}
                        </div>
                    </div>

                    <div className="text-sm text-right">
                        <div>
                        <span className="text-xs text-gray-500">Start:</span>{" "}
                        {exam.start_time?.slice(0, 5)}
                        </div>
                        <div>
                        <span className="text-xs text-gray-500">End:</span>{" "}
                        {exam.end_time?.slice(0, 5)}
                        </div>
                    </div>
                    </div>

                    {/* ================= SUBJECT TABLE ================= */}
                    <table className="w-full text-sm border border-gray-200">
                    <thead className="bg-blue-50">
                        <tr>
                        <th className="p-2 text-left">Class</th>
                        <th className="p-2 text-left">Subject</th>
                        <th className="p-2 text-left">Marks</th>
                        <th className="p-2 text-left">Room</th>
                        <th className="p-2 text-left">Topic/ID</th>
                        </tr>
                    </thead>

                    <tbody>
                        {exam.subjects.map((s, idx) => (
                        <tr key={idx} className="border-t">
                            <td className="p-2">{exam.class.name}</td>
                           <td className="p-2">{s.name || "--"}</td>
                            <td className="p-2">{s.marks}</td>
                            <td className="p-2">—</td>
                            <td className="p-2">—</td>
                        </tr>
                        ))}

                        {/* TOTAL */}
                        <tr className="bg-gray-50 font-semibold">
                        <td className="p-2">Total</td>
                        <td />
                        <td className="p-2">{totalMarks}</td>
                        <td colSpan="2" />
                        </tr>
                    </tbody>
                    </table>
                </div>
                );
            })}

      </div>

      {/* ================= ADD EXAM MODAL ================= */}
      {showModal && (
        <Modal title="Add Exam" onClose={() => setShowModal(false)}>
            <div className="space-y-5">

            {/* ================= DATE & TIME ================= */}
            <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                Exam Schedule
                </h4>

                <div className="grid grid-cols-3 gap-4">
                {/* Date */}
                <div>
                    <label className="text-xs text-gray-500">
                    Select Date<span className="text-red-500">*</span>
                    </label>
                    <input
                    type="date"
                    className="soft-input w-full"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    />
                </div>

                {/* Start Time */}
                <div>
                    <label className="text-xs text-gray-500">Start Time</label>
                    <div className="flex gap-2">
                    <select
                        className="soft-select w-full"
                        value={startHour}
                        onChange={(e) => setStartHour(e.target.value)}
                    >
                        <option>09</option>
                        <option>10</option>
                        <option>11</option>
                        <option>12</option>
                        <option>13</option>
                        <option>14</option>
                        <option>15</option>
                        <option>16</option>
                        <option>17</option>
                        <option>18</option>
                        <option>19</option>
                        <option>20</option>
                    </select>
                    <select
                        className="soft-select w-full"
                        value={startMinute}
                        onChange={(e) => setStartMinute(e.target.value)}
                    >
                        <option>00</option>
                        <option>15</option>
                        <option>30</option>
                        <option>45</option>
                    </select>
                    </div>
                </div>

                {/* End Time */}
                <div>
                    <label className="text-xs text-gray-500">End Time</label>
                    <div className="flex gap-2">
                    <select
                        className="soft-select w-full"
                        value={endHour}
                        onChange={(e) => setEndHour(e.target.value)}
                    >

                        <option>10</option>
                        <option>11</option>
                        <option>12</option>
                        <option>13</option>
                        <option>14</option>
                        <option>15</option>
                        <option>16</option>
                        <option>17</option>
                        <option>18</option>
                        <option>19</option>
                        <option>20</option>
                        <option>21</option>
                    </select>
                    <select
                        className="soft-select w-full"
                        value={endMinute}
                        onChange={(e) => setEndMinute(e.target.value)}
                    >
                        <option>00</option>
                        <option>15</option>
                        <option>30</option>
                        <option>45</option>
                    </select>
                    </div>
                </div>
                </div>
            </div>

            {/* ================= SUBJECT SECTION ================= */}
            <div className="border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                <h4 className="text-sm font-semibold text-gray-700">
                    Exam Subjects
                </h4>
                <button
                    onClick={addSubjectRow}
                    className="text-blue-600 text-sm"
                >
                    + Add Subject
                </button>
                </div>

                {/* Subject Rows */}
                {subjects.map((s, i) => (
                <div
                    key={i}
                    className="grid grid-cols-12 gap-2 items-end border-b pb-3 last:border-0"
                >
                    {/* Subject */}
                    <div className="col-span-3">
                    <label className="text-xs text-gray-500">
                        Subject<span className="text-red-500">*</span>
                    </label>
                    <select
                        className="soft-input w-full"
                        value={s.subject_id}
                        onChange={(e) => {
                          const subjectId = e.target.value;

                          updateSubject(i, "subject_id", subjectId);
                          updateSubject(i, "topic_id", ""); // reset topic

                          fetchTopics(i); // ✅ pass row index
                        }}
                      >

                        <option value="">Select Subject</option>
                        {subjectList.map((sub) => (
                        <option key={sub.id} value={sub.id}>
                            {sub.name}
                        </option>
                        ))}
                    </select>
                    </div>

                    {/* Marks */}
                    <div className="col-span-2">
                    <label className="text-xs text-gray-500">
                        Marks<span className="text-red-500">*</span>
                    </label>
                    <input
                        className="soft-input w-full"
                        placeholder="Marks"
                        value={s.marks}
                        onChange={(e) =>
                        updateSubject(i, "marks", e.target.value)
                        }
                    />
                    </div>

                    {/* Topic */}
                    <div className="col-span-2">
                    <label className="text-xs text-gray-500">Topic</label>
                   <select
                      className="soft-input w-full"
                      value={s.topic_id}
                      onChange={(e) =>
                        updateSubject(i, "topic_id", e.target.value)
                      }
                    >
                      <option value="">Select Topic</option>

                      {s.topics?.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>


                    </div>

                    {/* Description */}
                    <div className="col-span-3">
                    <label className="text-xs text-gray-500">
                        Description
                    </label>
                    <input
                        className="soft-input w-full"
                        placeholder="Description"
                        value={s.description}
                        onChange={(e) =>
                        updateSubject(i, "description", e.target.value)
                        }
                    />
                    </div>

                    {/* Room */}
                    <div className="col-span-1">
                    <label className="text-xs text-gray-500">Room</label>
                    <input
                        className="soft-input w-full"
                        placeholder="A1"
                        value={s.room_no}
                        onChange={(e) =>
                        updateSubject(i, "room_no", e.target.value)
                        }
                    />
                    </div>

                    {/* Remove */}
                    <div className="col-span-1 flex justify-center">
                    <button
                        onClick={() => removeSubject(i)}
                        className="text-red-500 text-lg"
                    >
                        ×
                    </button>
                    </div>
                </div>
                ))}

                {subjects.length === 0 && (
                <div className="text-xs text-gray-400 text-center py-6">
                    No subjects added yet
                </div>
                )}
            </div>

            {/* ================= ACTIONS ================= */}
            <div className="flex justify-end gap-3 pt-2">
                <button
                className="soft-btn-outline"
                onClick={() => setShowModal(false)}
                >
                Cancel
                </button>
                <PrimaryButton name="Save Exam" onClick={saveExam} />
            </div>
            </div>
        </Modal>
        )}

    </div>
  );
}
