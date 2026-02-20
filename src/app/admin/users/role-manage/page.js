"use client";

import React, { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { api } from "@/utils/api";
import { useRouter } from "next/navigation";
import SecondaryButton from "@/components/ui/SecodaryButton";
export default function RolesPage() {
  const router = useRouter();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    name: "",
    is_active: true,
  });

  /* ================= FETCH ROLES ================= */
  const fetchRoles = async () => {
    try {
      setLoading(true);
      const res = await api.get("/settings/roles");
      if (res.data?.status === "success") {
        setRoles(res.data.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  /* ================= ACTIONS ================= */
  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", is_active: true });
    setShowModal(true);
  };

  const openEdit = (role) => {
    setEditing(role);
    setForm({
      name: role.name,
      is_active: role.is_active,
    });
    setShowModal(true);
  };

  const save = async () => {
    if (!form.name) return;

    if (editing) {
      await api.put(`/settings/roles/${editing.id}`, {
        name: form.name,
        is_active: form.is_active,
      });
    } else {
      await api.post("/settings/roles", {
        name: form.name,
      });
    }

    setShowModal(false);
    fetchRoles();
  };

  const remove = async (id) => {
    if (!confirm("Delete this role?")) return;
    await api.delete(`/settings/roles/${id}`);
    fetchRoles();
  };

  return (
    <div className="space-y-4 p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div className="gap-2 space-y-2">

        <button onClick={()=> router.push('user')} className="bg-blue-800 text-white text-sm py-1 px-4 underline" >
          Users
        </button>
        
          <h2 className="text-xl font-semibold">Roles</h2>
          <p className="text-sm text-gray-500">
            Manage system roles and permissions
          </p>
        </div>

        <PrimaryButton
          name="+ Add Role"
          onClick={openCreate}
        />
      </div>

      {/* TABLE */}
      {loading ? (
        <div className="text-sm text-gray-500">Loading...</div>
      ) : roles.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-sm text-gray-500 text-center">
          No roles found
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs text-gray-600">
                  Role Name
                </th>
                <th className="px-4 py-2 text-left text-xs text-gray-600">
                  Slug
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
              {roles.map((r) => (
                <tr key={r.id} className="border-gray-200">
                  <td className="px-4 py-2 font-medium">
                    {r.name}
                  </td>

                  <td className="px-4 py-2 text-gray-500">
                    {r.slug}
                  </td>

                  <td className="px-4 py-2">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        r.is_active
                          ? "bg-blue-50 text-blue-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {r.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="px-4 py-2 text-right">
                    <div className="inline-flex gap-3">
                      <button
                        onClick={() => openEdit(r)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <EditOutlined />
                      </button>

                      <button
                        onClick={() => remove(r.id)}
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
          title={editing ? "Edit Role" : "Create Role"}
          onClose={() => setShowModal(false)}
          className="max-w-md"
        >
          <div className="space-y-4 p-6">
            <div>
              <label className="text-xs font-medium">
                Role Name *
              </label>
              <input
                className="soft-input"
                placeholder="Enter role name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />
            </div>

            {editing && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      is_active: e.target.checked,
                    })
                  }
                />
                <span className="text-sm">
                  Active
                </span>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-6 border-t border-gray-200 mt-6">
            <button
              onClick={() => setShowModal(false)}
              className="soft-btn-outline"
            >
              Cancel
            </button>
            <PrimaryButton
              name={editing ? "Update Role" : "Add Role"}
              onClick={save}
            />
          </div>
        </Modal>
      )}
    </div>
  );
}
