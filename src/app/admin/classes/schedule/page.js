"use client";

import { useEffect, useState } from "react";
import { api } from "@/utils/api";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { useToast } from "@/components/ui/ToastProvider";
import {
  Users,
  Bell,
  Pencil,
  XCircle,
  Clock,
} from "lucide-react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

const isToday = (dateString) => {
  const today = new Date();
  const classDate = new Date(dateString);

  today.setHours(0, 0, 0, 0);
  classDate.setHours(0, 0, 0, 0);

  return today.getTime() === classDate.getTime();
};


export default function SchedulePage() {
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [scheduledClasses, setScheduledClasses] = useState([]);
  const router = useRouter();
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");

  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [rescheduleData, setRescheduleData] = useState(null);

  const [newDate, setNewDate] = useState("");
  const [newStartTime, setNewStartTime] = useState("");
  const [newEndTime, setNewEndTime] = useState("");

  const toast = useToast();

  useEffect(() => {
    fetchInitial();
  }, []);

  const fetchInitial = async () => {
    const res = await api.get("/courses");
    setCourses(res.data?.data || []);
  };

  const fetchBatches = async (courseId) => {
    const res = await api.get(`/batches?course_id=${courseId}`);
    setBatches(res.data?.data || []);
  };

  const fetchScheduledClasses = async () => {
    try {
      const res = await api.get(
        `/class-routines/schedule/by-date?course_id=${selectedCourse}&batch_id=${selectedBatch}&date=${scheduleDate}`
      );

      setScheduledClasses(res.data?.data || []);
    } catch (err) {
      toast.error("Failed to load scheduled classes");
    }
  };

  const handleGo = () => {
    if (!selectedCourse || !selectedBatch) {
      toast.error("Please select course, batch and date");
      return;
    }

    // ✅ Remove old data immediately
    setScheduledClasses([]);

    fetchScheduledClasses();
  };


  const cancelSingleDate = async (routineId, date) => {
    if (!confirm("Are you sure you want to cancel this class?")) return;


    try {
      const payload = {
        routine_id: routineId,
        date: date,
      };

      console.log("CANCEL PAYLOAD:", payload);

      await api.post("/class-routines/cancel-single", payload);

      toast.success("Class cancelled successfully");

      // refresh list
      fetchScheduledClasses();

    } catch (err) {
      console.error(err.response?.data);
      toast.error("Failed to cancel class");
    }
  };

  const rescheduleSingleClass = async () => {
    if (!newDate || !newStartTime || !newEndTime) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const payload = {
        routine_id: rescheduleData.id,
        date: rescheduleData.date,
        new_date: newDate,
        new_start_time: newStartTime,
        new_end_time: newEndTime,
      };

      console.log("RESCHEDULE PAYLOAD:", payload);

      await api.post("/class-routines/reschedule-single", payload);

      toast.success("Class rescheduled successfully");

      setShowRescheduleModal(false);
      fetchScheduledClasses();

    } catch (err) {
      console.error(err.response?.data);
      toast.error("Failed to reschedule class");
    }
  };


  const deleteRoutine = async (routineId) => {
    if (!confirm("Are you sure you want to delete this routine permanently?")) {
      return;
    }

    try {
      await api.delete(`/class-routines/${routineId}`);

      toast.success("Routine deleted successfully");

      // Refresh list
      fetchScheduledClasses(); // or fetchAll() if routine list page

    } catch (err) {
      console.error(err.response?.data);
      toast.error("Failed to delete routine");
    }
  };
  


  return (
    <div className="space-y-6 p-6">

      {/* ===== HEADER ===== */}
      <div className="flex justify-between items-center">

      <h2 className="text-lg font-semibold">Scheduled Classes</h2>
      <PrimaryButton name={'Add Class'} onClick={() => router.push("/admin/classes/schedule/create")} />
      </div>
      {/* ===== FILTER SECTION ===== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white border border-gray-200 rounded-xl p-4">

        {/* COURSE */}
        <div>
          <label className="text-xs text-gray-600">Select Course *</label>
          <select
            className="soft-input"
            value={selectedCourse}
            onChange={(e) => {
              setSelectedCourse(e.target.value);
              fetchBatches(e.target.value);
            }}
          >
            <option value="">Select</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* BATCH */}
        <div>
          <label className="text-xs text-gray-600">Select Batch *</label>
          <select
            className="soft-input"
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
          >
            <option value="">Select</option>
            {batches.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>

        {/* DATE */}
        <div>
          <label className="text-xs text-gray-600">Date *</label>
          <input
            type="date"
            className="soft-input"
            value={scheduleDate}
            onChange={(e) => setScheduleDate(e.target.value)}
          />
        </div>

        <div className="flex items-end">
          <PrimaryButton name="Go" onClick={handleGo} />
        </div>
      </div>

      {/* ===== TABLE STYLE CARD LIST ===== */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">

          {/* HEADER */}
          <div className="grid grid-cols-9 gap-4 px-4 py-3 text-sm font-medium text-gray-600 bg-gray-50">
            <div>Date</div>
            <div>Time</div>
            <div>Batch</div>
            <div>Class</div>
            <div>Subject</div>
            <div>Teacher</div>
            <div>Type</div>
            <div>Status</div>
            <div className="text-right">Action</div>
          </div>

          {/* ROWS */}
          <div className="divide-y">

            {scheduledClasses.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No classes scheduled
              </div>
            ) : (
              scheduledClasses.map((item) => {

                const statusColor =
                  item.status === "upcoming"
                    ? "bg-orange-500"
                    : item.status === "pending"
                    ? "bg-gray-500"
                    : "bg-green-500";

                const badgeColor =
                  item.status === "upcoming"
                    ? "bg-orange-100 text-orange-600"
                    : item.status === "cancelled" ? "bg-red-100 text-red-600"
                    : item.status === "pending"
                    ? "bg-gray-200 text-gray-600"
                    : "bg-green-100 text-green-600";

                return (
                  <div
                    key={item.id}
                    className="relative grid grid-cols-9 gap-4 px-4 py-4 text-sm items-center hover:bg-gray-50 transition"
                  >

                    {/* LEFT STATUS STRIP */}
                    <div
                      className={`absolute left-0 top-0 bottom-0 w-1 ${statusColor}`}
                    />

                    {/* DATE */}
                    <div className="font-medium text-gray-700">
                      {item.date}
                    </div>

                    {/* TIME */}
                    <div className="text-gray-600">
                      {item.start_time} - {item.end_time}
                    </div>

                    {/* BATCH */}
                    <div className="text-gray-600">
                      {item.batch?.name}
                    </div>

                    {/* CLASS */}
                    <div className="text-gray-600">
                      {item.class?.name}
                    </div>

                    {/* SUBJECT */}
                    <div>
                      <div className="font-medium text-gray-700">
                        {item.subject?.name}
                      </div>
                      <div className="text-xs text-gray-400">
                        {item.subject?.code}
                      </div>
                    </div>

                    {/* TEACHER */}
                    <div className="text-gray-600">
                      {item.teacher?.name}
                    </div>

                    {/* CLASS TYPE BADGE */}
                    <div>
                      <span className="px-2 py-1 text-xs rounded bg-blue-50 text-blue-600">
                        {item.class_type} - {item.repeat_type}
                      </span>
                    </div>

                    {/* STATUS BADGE */}
                    <div>
                      <span
                        className={`px-3 py-1 text-xs rounded font-medium ${badgeColor}`}
                      >
                        {item.status}
                      </span>
                    </div>


                   {/* ACTION */}
                    <div className="flex justify-end gap-4 text-gray-500">

                      {/* Attendance */}
                      {isToday(item.date) && (
                        <button
                          title="Attendance"
                          onClick={() =>
                            router.push(`/admin/classes/attendance/${item.id}`)
                          }
                          className="hover:text-blue-600 transition"
                        >
                          <Users size={16} />
                        </button>
                      )}


                      {/* Reminder */}
                      <button
                        title="Reminder"
                        className="hover:text-blue-600 transition"
                      >
                        <Bell size={16} />
                      </button>
                      <button
                        title="Reschedule"
                        onClick={() => {
                          setRescheduleData(item);
                          setNewDate(item.date);
                          setNewStartTime("");
                          setNewEndTime("");
                          setShowRescheduleModal(true);
                        }}
                        className="hover:text-blue-600 transition"
                      >
                        <Clock size={16} />
                      </button>

                      {/* Edit */}
                      <button
                        title="Edit"
                        className="hover:text-blue-600 transition"
                      >
                        <Pencil size={16} />
                      </button>

                      {/* Cancel */}
                      <button
                        title="Cancel"
                        onClick={() => cancelSingleDate(item.id, item.date)}
                        className="text-red-500 hover:text-red-700 transition"
                      >
                        <XCircle size={16} />
                      </button>

                      <button
                        title="Delete Routine"
                        onClick={() => deleteRoutine(item.id)}
                        className="text-red-600 hover:text-red-800 transition"
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>


                  </div>
                );
              })
            )}

          </div>
        </div>
          {showRescheduleModal && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white w-[500px] rounded-xl shadow-lg">

                {/* HEADER */}
                <div className="flex justify-between items-center px-6 py-4 border-b">
                  <h3 className="text-lg font-medium">
                    Reschedule Class
                  </h3>

                  <button
                    onClick={() => setShowRescheduleModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                {/* BODY */}
                <div className="p-6 space-y-4">

                  <div>
                    <label className="text-sm text-gray-600">New Date *</label>
                    <input
                      type="date"
                      className="soft-input"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600">Start Time *</label>
                      <input
                        type="time"
                        className="soft-input"
                        value={newStartTime}
                        onChange={(e) => setNewStartTime(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="text-sm text-gray-600">End Time *</label>
                      <input
                        type="time"
                        className="soft-input"
                        value={newEndTime}
                        onChange={(e) => setNewEndTime(e.target.value)}
                      />
                    </div>
                  </div>

                </div>

                {/* FOOTER */}
                <div className="flex justify-end gap-3 px-6 py-4 border-t">
                  <button
                    className="soft-btn-outline"
                    onClick={() => setShowRescheduleModal(false)}
                  >
                    Cancel
                  </button>

                  <PrimaryButton
                    name="Reschedule Class"
                    onClick={rescheduleSingleClass}
                  />
                </div>

              </div>
            </div>
          )}



    </div>
  );
}
