"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { api } from "@/utils/api";
import { SECTIONS, DAYS } from "@/constants/sections";

import { useRouter } from "next/navigation";

export default function RoutineTab() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [routines, setRoutines] = useState([]);

  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [rooms, setRooms] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [showRoomModal, setShowRoomModal] = useState(false);

  const [editing, setEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
const [teachers, setTeachers] = useState([]);


  /* ================= FETCH ================= */
const fetchAll = async () => {
    setLoading(true);
    try {
      const [r, c, s, rm] = await Promise.all([
        api.get("/class-routines"),
        api.get("/classes"),
        api.get("/subjects"),
        api.get("/rooms"),
      ]);

      setRoutines(r.data?.data || []);
      setClasses(c.data?.data || []);
      setSubjects(s.data?.data || []);
      setRooms(rm.data?.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  

  return (
    <div className="space-y-2 p-6">
      <div className="flex justify-end">
        <PrimaryButton name="+ Add Routine" onClick={() => router.push("/admin/classes/schedule")} />
      </div>

      {/* TABLE */}
      {loading ? (
        <div className="text-sm text-gray-500">Loading...</div>
      ) : routines.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center text-gray-500">
          No routines added
        </div>
      ) : (
       <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Course</th>
                <th className="px-4 py-2 text-left">Batch</th>
                <th className="px-4 py-2 text-left">Class</th>
                <th className="px-4 py-2 text-left">Subject</th>
                <th className="px-4 py-2 text-left">Teacher</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Repeat</th>
                <th className="px-4 py-2 text-left">Time</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {routines.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 transition">

                  {/* DATE */}
                  <td className="px-4 py-3">
                    {r.base_date}
                  </td>

                  {/* COURSE */}
                  <td className="px-4 py-3">
                    {r.course?.name}
                  </td>

                  {/* BATCH */}
                  <td className="px-4 py-3">
                    {r.batch?.name}
                  </td>

                  {/* CLASS */}
                  <td className="px-4 py-3">
                    {r.class?.name}
                  </td>

                  {/* SUBJECT */}
                  <td className="px-4 py-3">
                    <div className="font-medium">{r.subject?.name}</div>
                    <div className="text-xs text-gray-400">{r.subject?.code}</div>
                  </td>

                  {/* TEACHER */}
                  <td className="px-4 py-3">
                    {r.teacher?.name || "—"}
                  </td>

                  {/* CLASS TYPE BADGE */}
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs rounded bg-blue-50 text-blue-600">
                      {r.class_type}
                    </span>
                  </td>

                  {/* REPEAT BADGE */}
                  <td className="px-4 py-3">

                    {r.repeat_type === "Weekly" && (
                      <div>
                        <span className="px-2 py-1 text-xs rounded bg-purple-50 text-purple-600">
                          Weekly
                        </span>
                        <div className="text-xs text-gray-500 mt-1">
                          {r.weekly_days?.join(", ")}
                        </div>
                      </div>
                    )}

                    {r.repeat_type === "Select Dates" && (
                      <div>
                        <span className="px-2 py-1 text-xs rounded bg-indigo-50 text-indigo-600">
                          Specific
                        </span>
                        <div className="text-xs text-gray-500 mt-1">
                          {r.specific_dates?.join(", ")}
                        </div>
                      </div>
                    )}

                    {r.repeat_type === "Does Not Repeat" && (
                      <span className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-600">
                        One Time
                      </span>
                    )}
                  </td>

                  {/* TIME */}
                  <td className="px-4 py-3">
                    {r.start_time} - {r.end_time}
                  </td>

                  {/* STATUS BADGE */}
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs rounded
                        ${r.is_active
                          ? "bg-green-50 text-green-600"
                          : "bg-red-50 text-red-600"
                        }`}
                    >
                      {r.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>

                  {/* ACTION */}
                  <td className="px-4 py-3 text-right space-x-2">

                    <button className="text-blue-600 hover:text-blue-800">
                      <EditOutlined />
                    </button>

                    <button className="text-red-500 hover:text-red-700">
                      <DeleteOutlined />
                    </button>

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
