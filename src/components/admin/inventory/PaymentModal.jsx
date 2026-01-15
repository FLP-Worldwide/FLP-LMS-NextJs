"use client";

import { useState } from "react";
import { api } from "@/utils/api";

export default function PaymentModal({
  purchaseId,
  editPayment,
  onClose,
  onSaved,
}) {
  const [form, setForm] = useState({
    payment_date: editPayment?.payment_date || "",
    payment_mode: editPayment?.payment_mode || "",
    amount: editPayment?.amount || "",
    reference_no: editPayment?.reference_no || "",
    note: editPayment?.note || "",
  });

const [error, setError] = useState("");
const [loading, setLoading] = useState(false);

const submit = async () => {
  try {
    setError("");
    setLoading(true);

    const payload = {
      inventory_purchase_id: purchaseId,
      ...form,
    };

    let res;

    if (editPayment) {
      res = await api.post(
        `/inventory/purchase/payment/${editPayment.id}`,
        payload
      );
    } else {
      res = await api.post("/inventory/purchase/payment", payload);
    }

    // Backend logical error handling
    if (res.data?.status === "error") {
      setError(res.data.message || "Something went wrong");
      return;
    }

    onSaved();
  } catch (err) {
    // Laravel validation or server error
    setError(
      err?.response?.data?.message ||
        "Unable to save payment. Please try again."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-[600px]">
        {/* HEADER */}
        <div className="px-6 py-4 border-b flex justify-between">
          <h3 className="text-lg font-medium">
            {editPayment ? "Update Payment" : "Add Payment"}
          </h3>
          <button onClick={onClose}>✕</button>
        </div>

        {/* BODY */}
        <div className="p-6 grid grid-cols-2 gap-4">
          <div>
            <label className="soft-label">Date *</label>
            <input
              type="date"
              className="soft-input"
              value={form.payment_date}
              onChange={(e) =>
                setForm({ ...form, payment_date: e.target.value })
              }
            />
          </div>

          <div>
            <label className="soft-label">Reference No.</label>
            <input
              className="soft-input"
              value={form.reference_no}
              onChange={(e) =>
                setForm({ ...form, reference_no: e.target.value })
              }
            />
          </div>

          <div>
            <label className="soft-label">Payment Method *</label>
            <select
              className="soft-select"
              value={form.payment_mode}
              onChange={(e) =>
                setForm({ ...form, payment_mode: e.target.value })
              }
            >
              <option value="">Select Payment Method</option>
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
              <option value="bank">Bank</option>
              <option value="cheque">Cheque</option>
              <option value="card">Card</option>
            </select>
          </div>

          <div>
            <label className="soft-label">Amount (Rs) *</label>
            <input
              className="soft-input"
              type="number"
              value={form.amount}
              onChange={(e) =>
                setForm({ ...form, amount: e.target.value })
              }
            />
          </div>

          <div className="col-span-2">
            <label className="soft-label">Note</label>
            <textarea
              className="soft-input"
              rows={2}
              value={form.note}
              onChange={(e) =>
                setForm({ ...form, note: e.target.value })
              }
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t flex justify-end gap-3">
          <button onClick={onClose} className="text-gray-600">
            Cancel
          </button>
          <button
            onClick={submit}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg"
          >
            {editPayment ? "Update" : "Add"}
          </button>
        </div>
        {error && (
          <div className="mx-6 mb-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </div>
        )}
      </div>
      
    </div>
  );
}
