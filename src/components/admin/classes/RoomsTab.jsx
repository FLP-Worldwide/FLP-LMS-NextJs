"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { EditOutlined } from "@ant-design/icons";
import { api } from "@/utils/api";

export default function RoomsTab() {
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  /* ================= FETCH ================= */
  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await api.get("/rooms");
      setRooms(res.data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  /* ================= ACTIONS ================= */

  const openCreate = () => {
    setForm({ name: "", description: "" });
    setEditing(false);
    setCurrentId(null);
    setShowModal(true);
  };

  const openEdit = room => {
    setForm({
      name: room.name || "",
      description: room.description || "",
    });
    setCurrentId(room.id);
    setEditing(true);
    setShowModal(true);
  };

  const saveRoom = async () => {
    if (!form.name.trim()) return;

    try {
      if (editing) {
        await api.put(`/rooms/${currentId}`, form);
      } else {
        await api.post("/rooms", form);
      }

      setShowModal(false);
      fetchRooms();
    } catch (err) {
      console.error(err);
      alert("Failed to save room");
    }
  };

  return (
    <div className="space-y-2 p-2">
      {/* HEADER ACTION */}
      <div className="flex justify-end">
        <PrimaryButton name="+ Add Room" onClick={openCreate} />
      </div>

      {/* TABLE */}
      {loading ? (
        <div className="text-sm text-gray-500">Loading...</div>
      ) : rooms.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-sm text-gray-500 text-center">
          No rooms defined
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs text-gray-600">#</th>
                <th className="px-4 py-2 text-left text-xs text-gray-600">
                  Room Code
                </th>
                <th className="px-4 py-2 text-left text-xs text-gray-600">
                  Room Name
                </th>
                <th className="px-4 py-2 text-left text-xs text-gray-600">
                  Description
                </th>
                <th className="px-4 py-2 text-right text-xs text-gray-600">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {rooms.map((room, index) => (
                <tr key={room.id}>
                    <td className="px-4 py-2">{index + 1}</td>
                    
                  <td className="px-4 py-2 text-gray-500">
                    {room.code}
                  </td>
                  <td className="px-4 py-2 font-medium">
                    {room.name}
                  </td>

                  <td className="px-4 py-2 text-gray-500">
                    {room.description || "—"}
                  </td>

                 

                  <td className="px-4 py-2 text-right">
                    <button
                      onClick={() => openEdit(room)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit"
                    >
                      <EditOutlined />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <Modal
          title={editing ? "Edit Room" : "Create Room"}
          onClose={() => setShowModal(false)}
        >
          <div className="space-y-3 p-6">
            {/* ROOM NAME */}
            <div>
              <label className="text-xs text-gray-500">
                Room Name *
              </label>
              <input
                className="soft-input mt-1"
                placeholder="e.g. Room A1"
                value={form.name}
                onChange={e =>
                  setForm({ ...form, name: e.target.value })
                }
              />
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="text-xs text-gray-500">
                Description
              </label>
              <textarea
                className="soft-input mt-1"
                placeholder="Optional description"
                value={form.description}
                onChange={e =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button
                onClick={() => setShowModal(false)}
                className="soft-btn-outline"
              >
                Cancel
              </button>

              <PrimaryButton name="Save" onClick={saveRoom} />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}