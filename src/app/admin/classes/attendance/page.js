"use client";

import { useEffect, useState } from "react";
import { api } from "@/utils/api";
import { useRouter } from "next/navigation";
import { Users, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { useToast } from "@/components/ui/ToastProvider";

export default function Page() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    fetchTodayClasses();
  }, []);

  const fetchTodayClasses = async () => {
    try {
      const res = await api.get("/class-routines/schedule/today-classes");
      setClasses(res.data?.data || []);
    } catch (err) {
      toast.error("Failed to load attendance list");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAttendance = (routineId) => {
    router.push(`/admin/classes/attendance/${routineId}`);
  };

  return (
    <div className="space-y-6 p-6">

      {/* ===== HEADER ===== */}
      <div>
        <h2 className="text-lg font-semibold">
          Today’s Scheduled Classes
        </h2>
      </div>

      {/* ===== TABLE ===== */}
      {loading ? (
        <div className="text-sm text-gray-500">Loading...</div>
      ) : classes.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center text-gray-500">
          No classes scheduled today
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">Course</th>
                <th className="px-4 py-3 text-left">Batch</th>
                <th className="px-4 py-3 text-left">Class</th>
                <th className="px-4 py-3 text-left">Subject</th>
                <th className="px-4 py-3 text-left">Teacher</th>
                <th className="px-4 py-3 text-left">Time</th>
                <th className="px-4 py-3 text-left">Students</th>
                <th className="px-4 py-3 text-left">Attendance</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {classes.map((item) => (
                <tr key={item.routine_id} className="hover:bg-gray-50">

                  <td className="px-4 py-3">
                    {item.course?.name}
                  </td>

                  <td className="px-4 py-3">
                    {item.batch?.name}
                  </td>

                  <td className="px-4 py-3">
                    {item.class?.name}
                  </td>

                  <td className="px-4 py-3">
                    {item.subject?.name}
                  </td>

                  <td className="px-4 py-3">
                    {item.teacher?.name}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock size={14} className="text-gray-400" />
                      {item.start_time} - {item.end_time}
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    {item.attendance_marked} / {item.total_students}
                  </td>

                  <td className="px-4 py-3">
                    {item.attendance_status === "marked" ? (
                      <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-600 flex items-center gap-1 w-fit">
                        <CheckCircle2 size={14} />
                        Completed
                      </span>
                    ) : item.attendance_status === "partial" ? (
                      <span className="px-3 py-1 text-xs rounded-full bg-amber-100 text-amber-600 flex items-center gap-1 w-fit">
                        <AlertCircle size={14} />
                        Partial
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-xs rounded-full bg-gray-200 text-gray-600 w-fit">
                        Not Marked
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-right">
                    {item.attendance_status !== "completed" ? (
                      <PrimaryButton
                        name="Mark Attendance"
                        onClick={() =>
                          handleMarkAttendance(item.routine_id)
                        }
                      />
                    ) : (
                      <span className="text-green-600 text-sm">
                        ✔ Done
                      </span>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
