"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { api } from "@/utils/api";

export default function CategoryTab() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    type: "",
  });

  /* ---------------- FETCH ---------------- */
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get("/finance/category");
      setCategories(res.data.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  /* ---------------- SAVE ---------------- */
  const saveCategory = async () => {
    try {
      if (editingId) {
        await api.patch(`/finance/category/${editingId}`, form);
      } else {
        await api.post("/finance/category", form);
      }
      setShowModal(false);
      fetchCategories();
    } catch (e) {
      alert("Failed to save category");
    }
  };

  /* ---------------- DELETE ---------------- */
  const deleteCategory = async (id) => {
    if (!confirm("Delete category?")) return;
    await api.delete(`/finance/category/${id}`);
    fetchCategories();
  };

  return (
    <>
      <div className="flex justify-end">
        <PrimaryButton name="+ Add Category" onClick={() => {
          setForm({ name: "", description: "", type: "" });
          setEditingId(null);
          setShowModal(true);
        }} />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Type</th>
              <th className="px-4 py-2 text-left">Description</th>
              <th className="px-4 py-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {categories.map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-2">{c.name}</td>
                <td className="px-4 py-2">{c.type}</td>
                <td className="px-4 py-2 text-gray-500">{c.description || "—"}</td>
                <td className="px-4 py-2 text-right">
                  <EditOutlined
                    className="mr-3 text-blue-600 cursor-pointer"
                    onClick={() => {
                      setForm(c);
                      setEditingId(c.id);
                      setShowModal(true);
                    }}
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

      {showModal && (
        <Modal title="Add Category" onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            <div>
              <label className="soft-label">Category Name *</label>
              <input
                className="soft-input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div>
              <label className="soft-label">Description</label>
              <input
                className="soft-input"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div>
              <label className="soft-label">Category Type *</label>
              <select
                className="soft-select"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="">Select</option>
                <option>Expense</option>
                <option>Income</option>
              </select>
            </div>

            <div className="flex justify-end gap-2">
              <button className="soft-btn-outline" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <PrimaryButton name="Save" onClick={saveCategory} />
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
