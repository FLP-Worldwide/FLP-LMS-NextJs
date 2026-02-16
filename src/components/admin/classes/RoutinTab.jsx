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
    <div className="space-y-2">
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
                <th className="px-4 py-2 text-left">Class</th>
                <th className="px-4 py-2 text-left">Section</th>
                <th className="px-4 py-2 text-left">Subject</th>
                <th className="px-4 py-2 text-left">Days</th>
                <th className="px-4 py-2 text-left">Teacher</th>
                <th className="px-4 py-2 text-left">Time</th>
                {/* <th className="px-4 py-2 text-left">Room</th> */}
                <th className="px-4 py-2 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {routines.map(r => (
                <tr key={r.id} className="border-gray-200">
                  <td className="px-4 py-2">{r.class.name}</td>
                  <td className="px-4 py-2">{r.section}</td>
                  <td className="px-4 py-2">{r.subject.name}</td>
                  <td className="px-4 py-2">{r.days.join(", ")}</td>
                  <td className="px-4 py-2">{r.teacher ? `${r.teacher.first_name} ${r.teacher.last_name}` : "—"}</td>
                  <td className="px-4 py-2">{r.start_time} - {r.end_time}</td>
                  {/* <td className="px-4 py-2">{r.room.name+" ("+r.room.floor+")" || "—"}</td> */}
                  <td className="px-4 py-2 text-right">
                    <button onClick={() => openEdit(r)} className="text-blue-600">
                      <EditOutlined />
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
