"use client";

import React, { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecodaryButton";
import MultiSelectDropdown from "@/components/ui/MultiSelectDropdown";
import { api } from "@/utils/api";
import { Pencil, Trash2 } from "lucide-react";

export default function ConcessionSetupTab() {
  /* ================= STATE ================= */
  const [concessions, setConcessions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [feeTypes, setFeeTypes] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    name: "",
    course_id: "",
    batch_ids: [],
    fee_type_ids: [],
    type: "AMOUNT",
    amount: "",
  });

  /* ================= FETCH ================= */

  useEffect(() => {
    fetchConcessions();
    fetchCourses();
    fetchFeeTypes();
  }, []);

  const fetchConcessions = async () => {
    const res = await api.get("/fees/concessions");
    setConcessions(res.data?.data || []);
  };

  const fetchCourses = async () => {
    const res = await api.get("/courses");
    setCourses(res.data?.data || []);
  };

  const fetchBatches = async (courseId) => {
    if (!courseId) return;
    const res = await api.get(`/batches?course_id=${courseId}`);
    setBatches(res.data?.data || []);
  };

  const fetchFeeTypes = async () => {
    const res = await api.get("/fees/types");
    setFeeTypes(res.data?.data || []);
  };

  /* ================= SAVE ================= */

  const saveConcession = async () => {
    const payload = {
      name: form.name,
      course_id: form.course_id,
      batch_ids: form.batch_ids,
      fee_type_ids: form.fee_type_ids,
      type: form.type,
      amount: form.amount,
    };

    if (editing) {
      await api.put(`/fees/concessions/${editing.id}`, payload);
    } else {
      await api.post("/fees/concessions", payload);
    }

    closeModal();
    fetchConcessions();
  };

  const deleteConcession = async (id) => {
    await api.delete(`/fees/concessions/${id}`);
    fetchConcessions();
  };

  const openEdit = (c) => {
    setEditing(c);
    setForm({
      name: c.name,
      course_id: c.course_id,
      batch_ids: c.batches?.map((b) => b.id) || [],
      fee_type_ids: c.fee_types?.map((f) => f.id) || [],
      type: c.type,
      amount: c.amount,
    });
    fetchBatches(c.course_id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
    setForm({
      name: "",
      course_id: "",
      batch_ids: [],
      fee_type_ids: [],
      type: "AMOUNT",
      amount: "",
    });
    setBatches([]);
  };

  /* ================= UI ================= */

  return (
    <div className="space-y-4 p-6">
      {/* TOP BAR */}
      <div className="flex justify-between items-center">
        <div>
        <input
          className="soft-input w-80"
          placeholder="Search By Concession Name"
        />
        </div>
        <PrimaryButton
          name="+ Add Concession"
          onClick={() => setShowModal(true)}
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-blue-50">
            <tr>
              <th className="p-3 text-left">Concession Name</th>
              <th className="p-3 text-left">Category/Course</th>
              <th className="p-3 text-left">Fee Types</th>
              <th className="p-3 text-left">Fixed Perc. / Amount (Rs)</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {concessions.length === 0 && (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-400">
                  No concessions found
                </td>
              </tr>
            )}

            {concessions.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="p-3">{c.name}</td>
                <td className="p-3">{c.course?.name}</td>
                <td className="p-3">
                  {c.fee_types?.map((f) => f.name).join(", ")}
                </td>
                <td className="p-3">
                  {c.type === "AMOUNT"
                    ? `(Rs) ${c.amount}`
                    : `${c.amount}%`}
                </td>
                <td className="p-3 flex gap-3">
                  <button onClick={() => openEdit(c)}>
                    <Pencil size={16} className="text-blue-600" />
                  </button>
                  <button onClick={() => deleteConcession(c.id)}>
                    <Trash2 size={16} className="text-red-500" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <Modal
          title={editing ? "Edit Concession" : "Add Concession"}
          onClose={closeModal}
        >
          <div className="space-y-4 p-6">
            {/* NAME */}
            <div>
              <label className="text-xs font-medium">
                Concession Name<span className="text-red-500">*</span>
              </label>
              <input
                className="soft-input mt-1"
                placeholder="Enter Concession Name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />
            </div>

            {/* COURSE + BATCH */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium">
                  Select Category/Course<span className="text-red-500">*</span>
                </label>
                <select
                  className="soft-select mt-1"
                  value={form.course_id}
                  onChange={(e) => {
                    setForm({
                      ...form,
                      course_id: e.target.value,
                      batch_ids: [],
                    });
                    fetchBatches(e.target.value);
                  }}
                >
                  <option value="">Select Category/Course</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium">
                  Select Batch<span className="text-red-500">*</span>
                </label>
                <MultiSelectDropdown
                  options={batches}
                  value={form.batch_ids}
                  onChange={(ids) =>
                    setForm({ ...form, batch_ids: ids })
                  }
                  placeholder="Select Batch"
                />
              </div>
            </div>

            {/* FEE TYPE + TYPE */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium">
                  Select Fee Type(s)<span className="text-red-500">*</span>
                </label>
                <MultiSelectDropdown
                  options={feeTypes}
                  value={form.fee_type_ids}
                  onChange={(ids) =>
                    setForm({ ...form, fee_type_ids: ids })
                  }
                  placeholder="Select Fee Type"
                />
              </div>

              <div>
                <label className="text-xs font-medium">
                  Type<span className="text-red-500">*</span>
                </label>
                <select
                  className="soft-select mt-1"
                  value={form.type}
                  onChange={(e) =>
                    setForm({ ...form, type: e.target.value })
                  }
                >
                  <option value="AMOUNT">Amount</option>
                  <option value="PERCENTAGE">Percentage</option>
                </select>
              </div>
            </div>

            {/* AMOUNT */}
            <div>
              <label className="text-xs font-medium">
                Amount in (Rs)<span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                className="soft-input mt-1"
                value={form.amount}
                onChange={(e) =>
                  setForm({ ...form, amount: e.target.value })
                }
              />
            </div>

            {/* FOOTER */}
            <div className="flex justify-end gap-3 pt-4">
              <SecondaryButton name="Cancel" onClick={closeModal} />
              <PrimaryButton
                name={editing ? "Update Concession" : "Add Concession"}
                onClick={saveConcession}
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
