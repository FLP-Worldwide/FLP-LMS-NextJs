"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { api } from "@/utils/api"; // ✅ IMPORTANT (your axios)

export default function StandardTab() {
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [form, setForm] = useState({
    name: "",
  });

  /* ================= FETCH ================= */
  const fetchClasses = async () => {
    setLoading(true);
    try {
      const res = await api.get("/classes");
      setClasses(res.data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  /* ================= ACTIONS ================= */
  const openCreate = () => {
    setForm({ name: "" });
    setEditing(false);
    setCurrentId(null);
    setShowModal(true);
  };

  const openEdit = cls => {
    setForm({ name: cls.name });
    setCurrentId(cls.id);
    setEditing(true);
    setShowModal(true);
  };

  const saveClass = async () => {
    if (!form.name.trim()) return;

    try {
      if (editing) {
        await api.put(`/classes/${currentId}`, form);
      } else {
        await api.post("/classes", form);
      }
      setShowModal(false);
      fetchClasses();
    } catch (err) {
      console.error(err);
      alert("Failed to save class");
    }
  };

  const deleteClass = async id => {
    if (!confirm("Are you sure you want to delete this class?")) return;

    try {
      await api.delete(`/classes/${id}`);
      fetchClasses();
    } catch (err) {
      console.error(err);
      alert("Failed to delete class");
    }
  };

  return (
    <div className="space-y-2 p-6">
      {/* HEADER ACTION */}
      <div className="flex justify-end">
        <PrimaryButton name="+ Add Class" onClick={openCreate} />
      </div>

      {/* TABLE */}
      {loading ? (
        <div className="text-sm text-gray-500">Loading...</div>
      ) : classes.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-sm text-gray-500 text-center">
          No classes defined
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs text-gray-600">#</th>
                <th className="px-4 py-2 text-left text-xs text-gray-600">
                  Class ID
                </th>
                <th className="px-4 py-2 text-left text-xs text-gray-600">
                  Class Name
                </th>
                <th className="px-4 py-2 text-left text-xs text-gray-600">
                  Created At
                </th>
                <th className="px-4 py-2 text-right text-xs text-gray-600">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {classes.map((cls, index) => (
                <tr key={cls.id} className="border-gray-200">
                  <td className="px-4 py-2">{index + 1}</td>

                  <td className="px-4 py-2 font-mono text-xs">
                    {cls.class_code}
                  </td>

                  <td className="px-4 py-2 font-medium">
                    {cls.name}
                  </td>

                  <td className="px-4 py-2 text-gray-500">
                    {cls.created_at
                      ? new Date(cls.created_at).toLocaleDateString()
                      : "—"}
                  </td>

                  <td className="px-4 py-2 text-right">
                    <div className="inline-flex gap-3">
                      <button
                        onClick={() => openEdit(cls)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <EditOutlined />
                      </button>
                      <button
                        onClick={() => deleteClass(cls.id)}
                        className="text-rose-600 hover:text-rose-800"
                        title="Delete"
                      >
                        <DeleteOutlined />
                      </button>
                    </div>
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
          title={editing ? "Edit Class" : "Create Class"}
          onClose={() => setShowModal(false)}
        >
          <div className="space-y-3 p-6">
            <div>
              <label className="text-xs text-gray-500">
                Class Name *
              </label>
              <input
                className="soft-input mt-1"
                placeholder="e.g. LKG, Class 1"
                value={form.name}
                onChange={e =>
                  setForm({ ...form, name: e.target.value })
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

              <PrimaryButton name="Save" onClick={saveClass} />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
