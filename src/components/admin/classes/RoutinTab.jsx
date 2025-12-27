"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { api } from "@/utils/api";
import { SECTIONS, DAYS } from "@/constants/sections";

export default function RoutineTab() {
  const [loading, setLoading] = useState(true);
  const [routines, setRoutines] = useState([]);

  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [rooms, setRooms] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [showRoomModal, setShowRoomModal] = useState(false);

  const [editing, setEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [form, setForm] = useState({
    class_id: "",
    section: "",
    subject_id: "",
    days: [],
    teacher: "",
    start_time: "12:00 AM",
    end_time: "01:00 AM",
    room_id: "",
  });

  const [roomForm, setRoomForm] = useState({
    name: "",
    number: "",
    floor: "",
  });

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

  /* ================= ACTIONS ================= */
  const openCreate = () => {
    setForm({
      class_id: "",
      section: "",
      subject_id: "",
      days: [],
      teacher: "",
      start_time: "12:00 AM",
      end_time: "01:00 AM",
      room_id: "",
    });
    setEditing(false);
    setCurrentId(null);
    setShowModal(true);
  };

  const openEdit = r => {
    setForm({
      class_id: String(r.class.id),
      section: r.section,
      subject_id: String(r.subject.id),
      days: r.days || [],
      teacher: r.teacher || "",
      start_time: r.start_time,
      end_time: r.end_time,
      room_id: r.room_id ? String(r.room_id) : "",
    });
    setEditing(true);
    setCurrentId(r.id);
    setShowModal(true);
  };


    const saveRoutine = async () => {
    const payload = {
        class_id: form.class_id,
        section: form.section,
        subject_id: form.subject_id,
        teacher: form.teacher,
        room_id: form.room_id,

        day: form.days,                // array like ["Monday"]

        start_time: form.start_time,   // "12 PM"
        end_time: form.end_time,       // "1 PM"
    };

    console.log("Routine payload:", payload); // 👈 IMPORTANT

    try {
        if (editing) {
        await api.put(`/class-routines/${currentId}`, payload);
        } else {
        await api.post("/class-routines", payload);
        }
        setShowModal(false);
        fetchAll();
    } catch (e) {
        console.error(e.response?.data || e);
        alert("Failed to save routine");
    }
    };


  const toggleDay = day => {
    setForm(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day],
    }));
  };

  const saveRoom = async () => {
    await api.post("/rooms", roomForm);
    setRoomForm({ name: "", number: "", floor: "" });
    setShowRoomModal(false);
    fetchAll();
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-end">
        <PrimaryButton name="+ Add Routine" onClick={openCreate} />
      </div>

      {/* TABLE */}
      {loading ? (
        <div className="text-sm text-gray-500">Loading...</div>
      ) : routines.length === 0 ? (
        <div className="bg-white border rounded-xl p-6 text-center text-gray-500">
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
                <th className="px-4 py-2 text-left">Room</th>
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
                  <td className="px-4 py-2">{r.teacher || "—"}</td>
                  <td className="px-4 py-2">{r.start_time} - {r.end_time}</td>
                  <td className="px-4 py-2">{r.room.name+" ("+r.room.floor+")" || "—"}</td>
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

      {/* ROUTINE MODAL */}
      {showModal && (
        <Modal title={editing ? "Edit Routine" : "Create Routine"} onClose={() => setShowModal(false)}>
          <div className="space-y-3">
            {/* CLASS */}
            <select className="soft-input" value={form.class_id}
              onChange={e => setForm({ ...form, class_id: e.target.value })}>
              <option value="">Standard*</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>

            {/* SECTION */}
            <select className="soft-input" value={form.section}
              onChange={e => setForm({ ...form, section: e.target.value })}>
              <option value="">Section*</option>
              {SECTIONS.map(s => <option key={s}>{s}</option>)}
            </select>

            {/* SUBJECT */}
            <select className="soft-input" value={form.subject_id}
              onChange={e => setForm({ ...form, subject_id: e.target.value })}>
              <option value="">Subject*</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>

            {/* DAYS */}
            <div className="border rounded-lg p-2">
              {DAYS.map(d => (
                <label key={d} className="inline-flex items-center mr-3 text-sm">
                  <input type="checkbox"
                    checked={form.days.includes(d)}
                    onChange={() => toggleDay(d)} />
                  <span className="ml-1">{d}</span>
                </label>
              ))}
            </div>

            <input className="soft-input" placeholder="Teacher"
              value={form.teacher}
              onChange={e => setForm({ ...form, teacher: e.target.value })} />

            <input className="soft-input" value={form.start_time}
              onChange={e => setForm({ ...form, start_time: e.target.value })} />

            <input className="soft-input" value={form.end_time}
              onChange={e => setForm({ ...form, end_time: e.target.value })} />

            <select className="soft-input" value={form.room_id}
              onChange={e => setForm({ ...form, room_id: e.target.value })}>
              <option value="">Room</option>
              {rooms.map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>

            <button className="text-blue-600 text-sm" onClick={() => setShowRoomModal(true)}>
              <PlusOutlined /> Add Room
            </button>

            <div className="flex justify-end gap-2 pt-3">
              <button className="soft-btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <PrimaryButton name="Save" onClick={saveRoutine} />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
