"use client";

import React, { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { api } from "@/utils/api";
import PrimaryButton from "@/components/ui/PrimaryButton";

export default function ClosingReasonTab() {
  const [reasons, setReasons] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  /* ---------------- FETCH ---------------- */
  const fetchReasons = async () => {
    try {
      setLoading(true);
      const res = await api.get("/lead-closing-reasons");

      if (res.data?.status === "success") {
        setReasons(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch closing reasons", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReasons();
  }, []);

  /* ---------------- ACTIONS ---------------- */

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", description: "" });
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      name: item.name,
      description: item.description || "",
    });
    setShowModal(true);
  };

  const saveReason = async () => {
    if (!form.name) return;

    try {
      if (editing) {
        await api.put(`/lead-closing-reasons/${editing.id}`, {
          name: form.name,
          description: form.description,
        });
      } else {
        await api.post("/lead-closing-reasons", {
          name: form.name,
          description: form.description,
        });
      }

      setShowModal(false);
      fetchReasons();
    } catch (err) {
      console.error("Save closing reason failed", err);
    }
  };

  const deleteReason = async (id) => {
    if (!confirm("Delete this closing reason?")) return;

    try {
      await api.delete(`/lead-closing-reasons/${id}`);
      fetchReasons();
    } catch (err) {
      console.error("Delete closing reason failed", err);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-2 p-6">
      {/* HEADER ACTION */}
      <div className="flex justify-end">
        <PrimaryButton name={'+ Add Closing Reason'} onClick={openCreate} />
      </div>

      {/* TABLE */}
      {loading ? (
        <div className="text-sm text-gray-500">Loading...</div>
      ) : reasons.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-sm text-gray-500 text-center">
          No closing reasons defined
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs text-gray-600">
                  Reason
                </th>
                <th className="px-4 py-2 text-left text-xs text-gray-600">
                  Description
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
              {reasons.map((r) => (
                <tr key={r.id} className="border-gray-200">
                  <td className="px-4 py-2 font-medium">
                    {r.name}
                  </td>

                  <td className="px-4 py-2 text-gray-500">
                    {r.description || "—"}
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
                        onClick={() => deleteReason(r.id)}
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
          title={
            editing ? "Edit Closing Reason" : "Create Closing Reason"
          }
          onClose={() => setShowModal(false)}
        >
          <div className="space-y-3 p-6">
            <div>
              <label className="text-xs text-gray-500">
                Reason Name *
              </label>
              <input
                className="soft-input mt-1"
                placeholder="e.g. Fees Issue, Not Interested"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-xs text-gray-500">
                Description
              </label>
              <textarea
                rows={3}
                className="soft-input mt-1"
                placeholder="Optional description"
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
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
              
              <PrimaryButton name={'Save'} onClick={saveReason} />
             
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
