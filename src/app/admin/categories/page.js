// src/app/admin/categories/page.jsx
"use client";

import React, { useState } from "react";

const initialCategories = [
  { id: 1, name: "Home Decor", parentId: null, createdAt: "2025-11-01" },
  { id: 2, name: "Handicrafts", parentId: null, createdAt: "2025-11-10" },
  { id: 3, name: "Wooden Bowls", parentId: 1, createdAt: "2025-11-18" },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState(initialCategories);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState("");
  const [editing, setEditing] = useState(null);

  const resetForm = () => {
    setName("");
    setParentId("");
    setEditing(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setShowModal(true);
  };

  const handleSave = () => {
    if (!name.trim()) return alert("Category name required");
    if (editing) {
      setCategories((prev) => prev.map((c) => (c.id === editing.id ? { ...c, name, parentId: parentId || null } : c)));
    } else {
      const newCat = {
        id: Date.now(),
        name: name.trim(),
        parentId: parentId || null,
        createdAt: new Date().toISOString().slice(0, 10),
      };
      setCategories((prev) => [newCat, ...prev]);
    }
    setShowModal(false);
    resetForm();
  };

  const handleEdit = (cat) => {
    setEditing(cat);
    setName(cat.name);
    setParentId(cat.parentId ?? "");
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (!confirm("Delete category?")) return;
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const findParentName = (id) => categories.find((c) => c.id === id)?.name || "—";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Categories</h2>
          <p className="text-sm text-gray-500">Manage product categories and parent relationships.</p>
        </div>
        <div>
          <button
            onClick={handleOpenCreate}
            className="px-3 py-2 rounded-md bg-emerald-600 text-white text-sm hover:bg-emerald-700 transition"
          >
            + Add Category
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-xs border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold">Category List</h3>
          <div className="text-sm text-gray-500">{categories.length} total</div>
        </div>

        <div className="overflow-x-auto rounded-md">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-2 px-4 text-xs font-medium text-gray-600">Name</th>
                <th className="py-2 px-4 text-xs font-medium text-gray-600">Parent</th>
                <th className="py-2 px-4 text-xs font-medium text-gray-600">Created</th>
                <th className="py-2 px-4 text-xs font-medium text-gray-600">Actions</th>
              </tr>
            </thead>

            <tbody className="border-t border-gray-300 divide-y divide-gray-200">
              {categories.map((c) => (
                <tr key={c.id}>
                  <td className="py-2 px-4 text-sm font-medium">{c.name}</td>
                  <td className="py-2 px-4 text-sm text-gray-700">{c.parentId ? findParentName(c.parentId) : "—"}</td>
                  <td className="py-2 px-4 text-sm">{c.createdAt}</td>
                  <td className="py-2 px-4 text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(c)}
                        className="px-3 py-1 rounded-md border border-gray-200 text-sm hover:bg-gray-50 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="px-3 py-1 rounded-md border border-red-200 text-sm text-red-600 hover:bg-red-50 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-end">
          <div className="text-sm text-gray-500">1</div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-xl shadow-xl p-6">
            <h3 className="text-lg font-semibold mb-2">{editing ? "Edit Category" : "Add Category"}</h3>

            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600">Name</label>
                <input
                  className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Parent category (optional)</label>
                <select
                  className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                  value={parentId}
                  onChange={(e) => setParentId(e.target.value)}
                >
                  <option value="">— none —</option>
                  {categories
                    .filter((c) => !editing || c.id !== editing.id) // don't allow self parent
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button onClick={() => setShowModal(false)} className="px-3 py-1 rounded-md border border-gray-200">
                  Cancel
                </button>
                <button onClick={handleSave} className="px-3 py-1 rounded-md bg-emerald-600 text-white">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
