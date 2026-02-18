"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { api } from "@/utils/api";

export default function LeaveCategoryPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
  });

  /* ================= FETCH ================= */
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get("/leave/categories");
      setCategories(Array.isArray(res.data?.data) ? res.data.data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  /* ================= SAVE ================= */
  const saveCategory = async () => {
    if (!form.title.trim()) {
      alert("Title is required");
      return;
    }

    if (editingId) {
      await api.patch(`/leave/categories/${editingId}`, form);
    } else {
      await api.post("/leave/categories", form);
    }

    setShowModal(false);
    setEditingId(null);
    setForm({ title: "" });
    fetchCategories();
  };

  /* ================= EDIT ================= */
  const openEdit = (c) => {
    setForm({ title: c.title });
    setEditingId(c.id);
    setShowModal(true);
  };

  /* ================= DELETE ================= */
  const deleteCategory = async (id) => {
    if (!confirm("Delete this leave category?")) return;
    await api.delete(`/leave/categories/${id}`);
    fetchCategories();
  };

  return (
    <div className="space-y-2 p-6">

      {/* ================= HEADER ACTION ================= */}
      <div className="flex justify-end">
        <PrimaryButton
          name="+ Add Category"
          onClick={() => {
            setForm({ title: "" });
            setEditingId(null);
            setShowModal(true);
          }}
        />
      </div>

      {/* ================= TABLE ================= */}
      {loading ? (
        <div className="text-sm text-gray-500">Loading...</div>
      ) : categories.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-sm text-gray-500 text-center">
          No leave categories added
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Category Title</th>
                <th className="px-4 py-2 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {categories.map((c) => (
                <tr key={c.id}>
                  <td className="px-4 py-2 font-medium">
                    {c.title}
                  </td>

                  <td className="px-4 py-2 text-right">
                    <EditOutlined
                      className="mr-3 text-blue-600 cursor-pointer"
                      onClick={() => openEdit(c)}
                    />
                    <DeleteOutlined
                      className="text-rose-600 cursor-pointer"
                      onClick={() => deleteCategory(c.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= MODAL ================= */}
      {showModal && (
        <Modal
          title={editingId ? "Edit Leave Category" : "Add Leave Category"}
          onClose={() => setShowModal(false)}
        >
          <div className="space-y-4 p-6">
            <div>
              <label className="soft-label">
                Category Title <span className="text-red-500">*</span>
              </label>
              <input
                className="soft-input"
                value={form.title}
                onChange={(e) =>
                  setForm({ title: e.target.value })
                }
                placeholder="e.g. Casual Leave"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                className="soft-btn-outline"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <PrimaryButton name="Save" onClick={saveCategory} />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
