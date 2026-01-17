"use client";

import React, { useEffect, useState } from "react";
import Modal from "@/components/fees/Modal";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecodaryButton";
import MultiSelectDropdown from "@/components/ui/MultiSelectDropdown";
import { api } from "@/utils/api";

/* ================= CONSTANTS ================= */

const FINE_TYPES = [
  { label: "Fixed Amount", value: "FIXED_AMOUNT" },
  { label: "Fixed Percentage", value: "FIXED_PERCENTAGE" },
  { label: "Daywise", value: "DAYWISE" },
  { label: "Slab Amount", value: "SLAB_AMOUNT" },
  { label: "Slab Percentage", value: "SLAB_PERCENTAGE" },
];

/* ================= PAGE ================= */

export default function FineManagementTab() {
  /* ================= STATE ================= */

  const [fines, setFines] = useState([]);
  const [feeTypes, setFeeTypes] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editingFine, setEditingFine] = useState(null);

  const [form, setForm] = useState({
    fine_name: "",
    fine_type: "FIXED_AMOUNT",
    amount: "",
    fees_type_ids: [],
  });

  const [loading, setLoading] = useState(false);

  /* ================= FETCH ================= */

  useEffect(() => {
    fetchFines();
    fetchFeeTypes();
  }, []);

  const fetchFines = async () => {
    const res = await api.get("/fees/fine/manage");
    setFines(res.data?.data || []);
  };

  const fetchFeeTypes = async () => {
    const res = await api.get("/fees/types");
    setFeeTypes(res.data?.data || []);
  };

  /* ================= ACTIONS ================= */

  const openAddModal = () => {
    setEditingFine(null);
    setForm({
      fine_name: "",
      fine_type: "FIXED_AMOUNT",
      amount: "",
      fees_type_ids: [],
    });
    setShowModal(true);
  };

  const openEditModal = (fine) => {
    setEditingFine(fine);
    setForm({
      fine_name: fine.fine_name,
      fine_type: fine.fine_type,
      amount: fine.amount,
      fees_type_ids: fine.fee_types.map((f) => f.id),
    });
    setShowModal(true);
  };

  const saveFine = async () => {
    if (!form.fine_name || !form.amount || !form.fees_type_ids.length) {
      alert("All required fields are mandatory");
      return;
    }

    setLoading(true);

    try {
      if (editingFine) {
        await api.put(`/fees/fine/manage/${editingFine.id}`, form);
      } else {
        await api.post("/fees/fine/manage", form);
      }

      setShowModal(false);
      fetchFines();
    } catch (e) {
      alert("Failed to save fine");
    } finally {
      setLoading(false);
    }
  };

  const deleteFine = async (id) => {
    if (!confirm("Are you sure you want to delete this fine?")) return;
    await api.delete(`/fees/fine/manage/${id}`);
    fetchFines();
  };

  /* ================= UI ================= */

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">

      {/* HEADER */}
      <div className="flex justify-between mb-4">
        <h3 className="text-sm font-semibold">Fine Management</h3>
        <PrimaryButton name="+ Add Fine" onClick={openAddModal} />
      </div>

      {/* TABLE */}
      {fines.length === 0 ? (
        <div className="text-center text-xs text-gray-500 py-10">
          Please click on <b>Add Fine</b> to create fine template
        </div>
      ) : (
        <table className="w-full text-xs border-collapse">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-3 py-2 text-left">#</th>
              <th className="px-3 py-2 text-left">Fine Name</th>
              <th className="px-3 py-2 text-left">Fine Type</th>
              <th className="px-3 py-2 text-left">Amount</th>
              <th className="px-3 py-2 text-left">Fee Types</th>
              <th className="px-3 py-2 text-left">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {fines.map((fine, i) => (
              <tr key={fine.id}>
                <td className="px-3 py-2">{i + 1}</td>
                <td className="px-3 py-2">{fine.fine_name}</td>
                <td className="px-3 py-2">{fine.fine_type}</td>
                <td className="px-3 py-2">₹{fine.amount}</td>
                <td className="px-3 py-2">
                  {fine.fee_types.map((f) => f.name).join(", ")}
                </td>
                <td className="px-3 py-2 flex gap-2">
                  <SecondaryButton
                    name="Edit"
                    onClick={() => openEditModal(fine)}
                  />
                  <button
                    className="text-red-600 text-xs"
                    onClick={() => deleteFine(fine.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ================= ADD / EDIT MODAL ================= */}

      {showModal && (
        <Modal
          title={editingFine ? "Edit Fine" : "Add Fine"}
          onClose={() => setShowModal(false)}
        >
          {/* Fine Name */}
          <label className="text-xs font-medium">
            Fine Name<span className="text-red-500">*</span>
          </label>
          <input
            className="soft-input mt-1"
            placeholder="Enter Fine Name"
            value={form.fine_name}
            onChange={(e) =>
              setForm({ ...form, fine_name: e.target.value })
            }
          />

          {/* Fine Type */}
          <label className="text-xs font-medium mt-3 block">
            Fine Type<span className="text-red-500">*</span>
          </label>
          <select
            className="soft-select mt-1"
            value={form.fine_type}
            onChange={(e) =>
              setForm({ ...form, fine_type: e.target.value })
            }
          >
            {FINE_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>

          {/* Amount */}
          <label className="text-xs font-medium mt-3 block">
            Add Amount<span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            className="soft-input mt-1"
            placeholder="Enter Amount"
            value={form.amount}
            onChange={(e) =>
              setForm({ ...form, amount: e.target.value })
            }
          />

          {/* Fee Types */}
          <label className="text-xs font-medium mt-3 block">
            Fee Types<span className="text-red-500">*</span>
          </label>
          <MultiSelectDropdown
            options={feeTypes}
            value={form.fees_type_ids}
            onChange={(ids) =>
              setForm({ ...form, fees_type_ids: ids })
            }
            placeholder="Select Fee Types"
          />

          {/* FOOTER */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setShowModal(false)}
              className="soft-btn-outline"
            >
              Cancel
            </button>
            <PrimaryButton
              name={loading ? "Saving..." : "Save"}
              onClick={saveFine}
              disabled={loading}
            />
          </div>
        </Modal>
      )}
    </div>
  );
}
