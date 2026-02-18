"use client";

import { useEffect, useState } from "react";
import { api } from "@/utils/api";
import { useParams, useRouter } from "next/navigation";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { Users, Clock, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

export default function Page() {
  const { id } = useParams();
  const router = useRouter();
  const toast = useToast();

  const [routine, setRoutine] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchAttendance();
  }, [id]);

  const fetchAttendance = async () => {
    try {
      const res = await api.get(
        `/class-routines/mark-attendance?routine_id=${id}`
      );

      const data = res.data?.data; // ✅ FIXED HERE

      setRoutine(data);
      setStudents(data?.students || []);
    } catch (err) {
      toast.error("Failed to load attendance");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UPDATE STUDENT STATUS ================= */
  const updateAttendance = (studentId, status) => {
    const updated = students.map((s) =>
      s.id === studentId ? { ...s, attendance_status: status } : s
    );
    setStudents(updated);
  };

  /* ================= SAVE ================= */
  const saveAttendance = async () => {
    const payload = {
      routine_id: id,
      class_id: routine?.class?.id,
      attendance_date: routine?.date,   // ✅ REQUIRED

      students: students.map((s) => ({
        student_id: s.id,
        status: s.attendance_status || "A",   // ✅ rename to status
      })),
    };

    console.log("FINAL PAYLOAD:", payload);

    try {
      await api.post("/class-routines/mark-attendance", payload);
      toast.success("Attendance saved successfully");
      router.back();
    } catch (err) {
      console.error(err.response?.data);
      toast.error(err.response?.data?.message || "Failed to save attendance");
    }
  };


  if (loading) {
    return <div className="p-6 text-sm text-gray-500">Loading...</div>;
  }

  if (!routine) {
    return <div className="p-6 text-sm text-gray-500">No routine found</div>;
  }

  const markedCount = students.filter((s) => s.attendance_status).length;

  return (
    <div className="space-y-6">

      {/* ===== HEADER CARD ===== */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <div className="flex justify-between items-start">

          <div className="space-y-2 text-sm">
            <div className="text-lg font-semibold text-gray-800">
              {routine.subject?.name} ({routine.subject?.code})
            </div>

            <div className="text-gray-600">
              {routine.course?.name} • {routine.batch?.name} • {routine.class?.name}
            </div>

            <div className="flex items-center gap-2 text-gray-500">
              <Clock size={14} />
              {routine.start_time} - {routine.end_time}
            </div>
          </div>

          <div className="text-right space-y-2">
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <Users size={16} />
              {markedCount} / {routine.total_students} Marked
            </div>

            <span
              className={`px-3 py-1 text-xs rounded-full font-medium
                ${
                  routine.attendance_status === "completed"
                    ? "bg-green-100 text-green-600"
                    : routine.attendance_status === "partial"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-200 text-gray-600"
                }`}
            >
              {routine.attendance_status.replace("_", " ")}
            </span>
          </div>

        </div>
      </div>

      {/* ===== STUDENT TABLE ===== */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Roll No</th>
              <th className="px-4 py-3 text-left">Student Name</th>
              <th className="px-4 py-3 text-center">Attendance</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{student.roll_no}</td>

                <td className="px-4 py-3">{student.name}</td>

                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center gap-2">

                    <button
                      onClick={() => updateAttendance(student.id, "P")}
                      className={`px-3 py-1 rounded text-xs font-medium
                        ${
                          student.attendance_status === "P"
                            ? "bg-green-600 text-white"
                            : "bg-green-100 text-green-600"
                        }`}
                    >
                      P
                    </button>

                    <button
                      onClick={() => updateAttendance(student.id, "A")}
                      className={`px-3 py-1 rounded text-xs font-medium
                        ${
                          student.attendance_status === "A"
                            ? "bg-red-600 text-white"
                            : "bg-red-100 text-red-600"
                        }`}
                    >
                      A
                    </button>

                    <button
                      onClick={() => updateAttendance(student.id, "L")}
                      className={`px-3 py-1 rounded text-xs font-medium
                        ${
                          student.attendance_status === "L"
                            ? "bg-yellow-600 text-white"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                    >
                      L
                    </button>

                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===== FOOTER ===== */}
      <div className="flex justify-end gap-3">
        <button
          className="soft-btn-outline"
          onClick={() => router.back()}
        >
          Cancel
        </button>

        <PrimaryButton
          name="Save Attendance"
          onClick={saveAttendance}
        />
      </div>
    </div>
  );
}
