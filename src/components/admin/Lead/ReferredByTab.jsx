"use client";

import React, { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { api } from "@/utils/api";

export default function ReferredByTab() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  /* MODAL */
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
  });

  /* FETCH */
  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/lead-referredby");

      if (res.data?.status === "success") {
        setMembers(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch referred by list", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  /* HANDLERS */
  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", phone: "" });
    setShowModal(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setForm({
      name: row.name,
      phone: row.phone || "",
    });
    setShowModal(true);
  };

  const saveMember = async () => {
    if (!form.name) return;

    try {
      if (editing) {
        await api.put(`/lead-referredby/${editing.id}`, {
          name: form.name,
          phone: form.phone,
        });
      } else {
        await api.post("/lead-referredby", {
          name: form.name,
          phone: form.phone,
        });
      }

      setShowModal(false);
      fetchMembers();
    } catch (err) {
      console.error("Save referred by failed", err);
    }
  };

  const deleteMember = async (id) => {
    if (!confirm("Delete this person?")) return;

    try {
      await api.delete(`/lead-referredby/${id}`);
      fetchMembers();
    } catch (err) {
      console.error("Delete referred by failed", err);
    }
  };

  /* UI */
  return (
    <div className="space-y-4">
      {/* HEADER ACTION */}
      <div className="flex justify-end">
        <PrimaryButton
          name="+ Add Team Member"
          onClick={openCreate}
        />
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="text-sm text-gray-500">Loading...</div>
      ) : members.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-sm text-gray-500 text-center">
          No referred by members found
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {members.map((m) => (
            <div
              key={m.id}
              className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-sm">
                    {m.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {m.phone || "No phone"}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(m)}
                    className="text-blue-600"
                  >
                    <EditOutlined />
                  </button>
                  <button
                    onClick={() => deleteMember(m.id)}
                    className="text-rose-600"
                  >
                    <DeleteOutlined />
                  </button>
                </div>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <div>
                  <div className="text-xs text-gray-500">
                    Total Leads
                  </div>
                  <div className="text-lg font-semibold text-blue-600">
                    {m.total_leads ?? 0}
                  </div>
                </div>

                <span className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-700">
                  Active
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <Modal
          title={editing ? "Edit Team Member" : "Add Team Member"}
          onClose={() => setShowModal(false)}
        >
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500">
                Name *
              </label>
              <input
                className="soft-input mt-1"
                placeholder="Sales person name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-xs text-gray-500">
                Phone (optional)
              </label>
              <input
                className="soft-input mt-1"
                placeholder="Mobile number"
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
              />
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <PrimaryButton
                variant="outline"
                name="Cancel"
                onClick={() => setShowModal(false)}
              />
              <PrimaryButton
                name="Save"
                onClick={saveMember}
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
