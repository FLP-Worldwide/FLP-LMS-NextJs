"use client";

import React, { useEffect, useState } from "react";
import Modal from "@/components/fees/Modal";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { api } from "@/utils/api";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

export default function RefundReasonTab() {
  /* ================= STATE ================= */

  const [reasons, setReasons] = useState([]);
  const [newReason, setNewReason] = useState("");

  const [editingReason, setEditingReason] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);


  /* ================= FETCH ================= */

  useEffect(() => {
    fetchReasons();
  }, []);
const deleteReason = async () => {
  if (!deleteTarget) return;

  try {
    await api.delete(`/fees/refund-reasons/${deleteTarget.id}`);

    setShowDeleteModal(false);
    setDeleteTarget(null);
    fetchReasons();
  } catch (error) {
    console.error("Delete failed", error);
    alert("Unable to delete refund reason");
  }
};

  const fetchReasons = async () => {
    const res = await api.get("/fees/refund-reasons");
    setReasons(res.data?.data || []);
  };

  /* ================= ACTIONS ================= */

  const addReason = async () => {
    if (!newReason.trim()) return;

    await api.post("/fees/refund-reasons", {
      reason: newReason,
    });

    setNewReason("");
    fetchReasons();
  };

  const openEdit = (row) => {
    setEditingReason(row);
    setEditValue(row.reason);
    setShowEditModal(true);
  };

  const updateReason = async () => {
    if (!editValue.trim()) return;

    await api.put(`/fees/refund-reasons/${editingReason.id}`, {
      reason: editValue,
    });

    setShowEditModal(false);
    setEditingReason(null);
    fetchReasons();
  };

  /* ================= UI ================= */

  return (
    <div className="bg-white rounded-xl border border-gray-200">

      {/* TOP ADD BAR */}
      <div className="p-4 flex justify-end gap-3 border-b border-gray-200">
        <input
          className="soft-input w-64"
          placeholder="Refund reason*"
          value={newReason}
          onChange={(e) => setNewReason(e.target.value)}
        />
        <PrimaryButton name="Add" onClick={addReason} />
      </div>


      {/* TABLE */}
      <table className="w-full text-sm">
        <thead className="bg-blue-50 text-gray-700">
          <tr>
            <th className="px-4 py-3 text-left">Refund Reason</th>
            <th className="px-4 py-3 text-left">Created Date</th>
            <th className="px-4 py-3 text-center">Action</th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {reasons.length === 0 ? (
            <tr>
              <td colSpan="3" className="py-10 text-center text-gray-500">
                No refund reasons added
              </td>
            </tr>
          ) : (
            reasons.map((row) => (
              <tr key={row.id}>
                <td className="px-4 py-3">{row.reason}</td>
                <td className="px-4 py-3">
                  {new Date(row.created_at).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => openEdit(row)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <EditOutlined className="w-4 h-4 inline" />
                  </button>

                  <button
                    onClick={() => {
                        setDeleteTarget(row);
                        setShowDeleteModal(true);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <DeleteOutlined />
                    </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* ================= EDIT MODAL ================= */}

      {showEditModal && (
        <Modal
          title="Edit Refund Reason"
          onClose={() => setShowEditModal(false)}
        >
          <label className="text-xs font-medium">
            Refund Reason<span className="text-red-500">*</span>
          </label>
          <input
            className="soft-input mt-1"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
          />

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setShowEditModal(false)}
              className="soft-btn-outline"
            >
              Cancel
            </button>
            <PrimaryButton name="Save" onClick={updateReason} />
          </div>
        </Modal>
      )}

      {showDeleteModal && (
  <Modal
    title="Delete Refund Reason"
    onClose={() => setShowDeleteModal(false)}
  >
    <p className="text-sm text-gray-600">
      Are you sure you want to delete
      <span className="font-medium"> “{deleteTarget?.reason}”</span>?
    </p>

    <div className="flex justify-end gap-3 mt-6">
      <button
        onClick={() => setShowDeleteModal(false)}
        className="soft-btn-outline"
      >
        Cancel
      </button>
      <button
        onClick={deleteReason}
        className="soft-btn bg-red-600 hover:bg-red-700"
      >
        Delete
      </button>
    </div>
  </Modal>
)}

    </div>
  );
}
