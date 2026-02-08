"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { api } from "@/utils/api";

const STATUS = {
  0: "NM",
  1: "P",
  2: "A",
  3: "L",
};

const STATUS_STYLE = {
  0: "border-gray-300 text-gray-500",
  1: "bg-green-500 text-white",
  2: "bg-red-500 text-white",
  3: "bg-yellow-400 text-white",
};

export default function ExamAttendancePage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [exam, setExam] = useState(null);
  const [students, setStudents] = useState([]);

  /* ================= FETCH EXAM ================= */
  console.log("Fetching attendance for exam ID:", id);
  useEffect(() => {
    if (!id) return;

    const fetchExam = async () => {
        try {
        setLoading(true);

        const res = await api.get(`/exams/${id}`);
        const data = res.data.data;

        setExam(data.exam);

        setStudents(
            (data.students || []).map((s) => ({
            student_id: s.id,
            name: s.name,
            roll_no: s.roll_no,
            attendance: s.attendance ?? 0,
            }))
        );
        } catch (e) {
        console.error("Failed to load exam attendance", e);
        } finally {
        setLoading(false);
        }
    };

    fetchExam();
    }, [id]);


  /* ================= COUNTS ================= */
  const presentCount = students.filter((s) => s.attendance === 1).length;
  const absentCount = students.filter((s) => s.attendance === 2).length;
  const leaveCount = students.filter((s) => s.attendance === 3).length;

  /* ================= MARK ================= */
  const markAttendance = (studentId, value) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.student_id === studentId
          ? { ...s, attendance: value }
          : s
      )
    );
  };

  /* ================= SUBMIT ================= */
  const submitAttendance = async () => {
    await api.post("/exams/mark-attendance", {
      exam_id: id,
      batch_id: exam.batch_id,
      course_id: exam.course_id,
      class_id: exam.class_id,
      students: students.map((s) => ({
        student_id: s.student_id,
        attendance: s.attendance,
      })),
    });

    router.refresh();
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="space-y-4">
      {/* ================= HEADER ================= */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 flex justify-between">
        <div className="space-y-1 text-sm">
          <div>
            <b>Category / Course:</b> {exam.course}
          </div>
          <div>
            <b>Batch:</b> {exam.batch}
          </div>
          <div>
            <b>Class:</b> {exam.class}
          </div>
          <div>
            <b>Total Students:</b> {students.length}
          </div>
        </div>

        <div className="flex gap-4">
          <Stat label="Leave" value={leaveCount} color="yellow" />
          <Stat label="Absent" value={absentCount} color="red" />
          <Stat label="Present" value={presentCount} color="green" />
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-blue-50">
            <tr>
              <th className="p-3 text-left">Student ID</th>
              <th className="p-3 text-left">Student Name</th>
              <th className="p-3 text-center">Mark Attendance</th>
            </tr>
          </thead>

          <tbody>
            {students.map((s) => (
              <tr key={s.student_id} className="border-t border-gray-200">
                <td className="p-3">{s.roll_no}</td>
                <td className="p-3">{s.name}</td>
                <td className="p-3">
                  <div className="flex justify-center gap-2">
                    {[3, 2, 1].map((v) => (
                      <button
                        key={v}
                        onClick={() => markAttendance(s.student_id, v)}
                        className={`w-8 h-8 rounded border  border-gray-200 text-xs font-semibold
                          ${
                            s.attendance === v
                              ? STATUS_STYLE[v]
                              : "border-gray-300 text-gray-500"
                          }`}
                      >
                        {STATUS[v]}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= ACTIONS ================= */}
      <div className="flex justify-between pt-4">
        <button
          className="soft-btn-outline"
          onClick={() => router.back()}
        >
          Back
        </button>

        <PrimaryButton
          name="Mark Attendance"
          onClick={submitAttendance}
        />
      </div>
    </div>
  );
}

/* ================= STAT CARD ================= */
function Stat({ label, value, color }) {
  const colors = {
    green: "text-green-600 border-green-500",
    red: "text-red-600 border-red-500",
    yellow: "text-yellow-600 border-yellow-500",
  };

  return (
    <div className={`px-4 py-2 border rounded-lg text-center ${colors[color]}`}>
      <div className="text-xs">{label}</div>
      <div className="text-lg font-bold">{value}</div>
    </div>
  );
}
