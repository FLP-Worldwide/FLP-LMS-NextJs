"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { api } from "@/utils/api";

export default function SubjectTab() {
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [form, setForm] = useState({
    class_id: "",
    name: "",
    short_code: "",
    type: "Scholastic",
    is_active: true,
  });

  /* ================= FETCH ================= */
  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const res = await api.get("/subjects");
      setSubjects(res.data?.data || []);
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    const res = await api.get("/classes");
    setClasses(res.data?.data || []);
  };

  useEffect(() => {
    fetchSubjects();
    fetchClasses();
  }, []);

  /* ================= ACTIONS ================= */
  const openCreate = () => {
    setForm({
      class_id: "",
      name: "",
      short_code: "",
      type: "Scholastic",
      is_active: true,
    });
    setEditing(false);
    setCurrentId(null);
    setShowModal(true);
  };

  const openEdit = item => {
    setForm({
      class_id: item.class_id,
      name: item.name,
      short_code: item.short_code || "",
      type: item.type,
      is_active: !!item.is_active,
    });
    setCurrentId(item.id);
    setEditing(true);
    setShowModal(true);
  };

  const saveSubject = async () => {
    if (!form.class_id || !form.name.trim()) return;

    try {
      if (editing) {
        await api.put(`/subjects/${currentId}`, form);
      } else {
        await api.post("/subjects", form);
      }
      setShowModal(false);
      fetchSubjects();
    } catch (e) {
      console.error(e);
      alert("Failed to save subject");
    }
  };

  const deleteSubject = async id => {
    if (!confirm("Delete this subject?")) return;

    try {
      await api.delete(`/subjects/${id}`);
      fetchSubjects();
    } catch (e) {
      console.error(e);
      alert("Failed to delete subject");
    }
  };

  return (
    <div className="space-y-2 p-2">
      {/* HEADER ACTION */}
      <div className="flex justify-end">
        <PrimaryButton name="+ Add Subject" onClick={openCreate} />
      </div>

      {/* TABLE */}
      {loading ? (
        <div className="text-sm text-gray-500">Loading...</div>
      ) : subjects.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-sm text-gray-500 text-center">
          No subjects defined
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs text-gray-600">
                  #
                </th>
                <th className="px-4 py-2 text-left text-xs text-gray-600">
                  Class
                </th>
                <th className="px-4 py-2 text-left text-xs text-gray-600">
                  Subject Name
                </th>
                <th className="px-4 py-2 text-left text-xs text-gray-600">
                  Code
                </th>
                <th className="px-4 py-2 text-left text-xs text-gray-600">
                  Type
                </th>
                <th className="px-4 py-2 text-left text-xs text-gray-600">
                  Status
                </th>
                <th className="px-4 py-2 text-right text-xs text-gray-600">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {subjects.map((s, index) => (
                <tr key={s.id} className="border-gray-200">
                  <td className="px-4 py-2">{index + 1}</td>

                  <td className="px-4 py-2">
                    {s.class?.name || s.class_name || "—"}
                  </td>

                  <td className="px-4 py-2 font-medium">
                    {s.name}
                  </td>

                  <td className="px-4 py-2">
                    {s.short_code || "—"}
                  </td>

                  <td className="px-4 py-2">
                    {s.type}
                  </td>

                  <td className="px-4 py-2">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        s.is_active
                          ? "bg-blue-50 text-blue-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {s.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="px-4 py-2 text-right">
                    <div className="inline-flex gap-3">
                      <button
                        onClick={() => openEdit(s)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <EditOutlined />
                      </button>
                      <button
                        onClick={() => deleteSubject(s.id)}
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
          title={editing ? "Edit Subject" : "Create Subject"}
          onClose={() => setShowModal(false)}
        >
          <div className="space-y-3 p-6">
            <div>
              <label className="text-xs text-gray-500">
                Class *
              </label>
              <select
                className="soft-input mt-1"
                value={form.class_id}
                onChange={e =>
                  setForm({ ...form, class_id: e.target.value })
                }
              >
                <option value="">Select Class</option>
                {classes.map(cls => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-500">
                Subject Name *
              </label>
              <input
                className="soft-input mt-1"
                placeholder="e.g. Mathematics"
                value={form.name}
                onChange={e =>
                  setForm({ ...form, name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-xs text-gray-500">
                Subject Short Code
              </label>
              <input
                className="soft-input mt-1"
                placeholder="Optional (e.g. MATH)"
                value={form.short_code}
                onChange={e =>
                  setForm({ ...form, short_code: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-xs text-gray-500">
                Subject Type *
              </label>
              <select
                className="soft-input mt-1"
                value={form.type}
                onChange={e =>
                  setForm({ ...form, type: e.target.value })
                }
              >
                <option value="Scholastic">Scholastic</option>
                <option value="Co-Scholastic">
                  Co-Scholastic
                </option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={e =>
                  setForm({
                    ...form,
                    is_active: e.target.checked,
                  })
                }
              />
              <span className="text-sm text-gray-600">
                Active
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button
                onClick={() => setShowModal(false)}
                className="soft-btn-outline"
              >
                Cancel
              </button>

              <PrimaryButton name="Save" onClick={saveSubject} />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
