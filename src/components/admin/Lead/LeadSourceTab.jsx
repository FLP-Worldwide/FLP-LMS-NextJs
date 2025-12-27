"use client";

import React, { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { api } from "@/utils/api";
import PrimaryButton from "@/components/ui/PrimaryButton";

export default function LeadSourceTab() {
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", description: "" });

  /* FETCH */
  const fetchSources = async () => {
    try {
      setLoading(true);
      const res = await api.get("/lead-setup");
      if (res.data?.status === "success") {
        setSources(res.data.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSources();
  }, []);

  /* ACTIONS */
  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", description: "" });
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({ name: item.name, description: item.description || "" });
    setShowModal(true);
  };

  const save = async () => {
    if (!form.name) return;

    if (editing) {
      await api.put(`/lead-setup/${editing.id}`, form);
    } else {
      await api.post("/lead-setup", form);
    }

    setShowModal(false);
    fetchSources();
  };

  const remove = async (id) => {
    if (!confirm("Delete this lead source?")) return;
    await api.delete(`/lead-setup/${id}`);
    fetchSources();
  };

  /* UI */
  return (
    <>
      <div className="flex justify-end">
       <PrimaryButton name={'+ Add Lead Source'} onClick={openCreate} />
      </div>

      {loading ? (
        <div className="text-sm text-gray-500">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {sources.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-xl border border-gray-200 p-4"
            >
              <div className="flex justify-between">
                <div>
                  <h3 className="font-semibold text-sm">{s.name}</h3>
                  <p className="text-xs text-gray-500">
                    {s.description || "—"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(s)} className="text-blue-600">
                    <EditOutlined />
                  </button>
                  <button
                    onClick={() => remove(s.id)}
                    className="text-rose-600"
                  >
                    <DeleteOutlined />
                  </button>
                </div>
              </div>

              <div className="mt-4 flex justify-between">
                <div>
                  <div className="text-xs text-gray-500">Total Leads</div>
                  <div className="text-lg font-semibold text-blue-600">
                    32
                  </div>
                </div>
                <div className="text-sm font-medium text-blue-600">
                  {s.is_active ? "Active" : "Inactive"}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <Modal
          title={editing ? "Edit Lead Source" : "Create Lead Source"}
          onClose={() => setShowModal(false)}
        >
          <div className="space-y-3">
            <input
              className="soft-input"
              placeholder="Source Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
            <textarea
              className="soft-input"
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="soft-btn-outline"
              >
                Cancel
              </button>
             
              <PrimaryButton name={'Save'} onClick={save} />
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
