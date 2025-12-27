"use client";

import React, { useState } from "react";
import Modal from "@/components/fees/Modal";
import { CLASSES ,MONTHS } from "@/constants/academic";

/* ---------------- INITIAL DATA ---------------- */

const initialFeeTypes = [
  {
    id: 1,
    name: "Tuition Fees",
    structures: [],
  },
];

export default function FeesStructurePage() {
  const [feeTypes, setFeeTypes] = useState(initialFeeTypes);
  const [selectedFeeId, setSelectedFeeId] = useState(initialFeeTypes[0].id);

  const selectedFee = feeTypes.find((f) => f.id === selectedFeeId);

  const [showFeeModal, setShowFeeModal] = useState(false);
  const [showClassModal, setShowClassModal] = useState(false);
  const [showInstallmentModal, setShowInstallmentModal] = useState(false);

  const [newFeeName, setNewFeeName] = useState("");
  const [classForm, setClassForm] = useState({
    className: "",
    amount: "",
  });

  const [activeStructure, setActiveStructure] = useState(null);
  const [installmentForm, setInstallmentForm] = useState({
    name: "",
    amount: "",
    month: "",
  });

  /* ---------------- HANDLERS ---------------- */

  const createFeeType = () => {
    if (!newFeeName.trim()) return;

    const id = Date.now();

    setFeeTypes((prev) => [
      ...prev,
      { id, name: newFeeName, structures: [] },
    ]);

    setSelectedFeeId(id);
    setNewFeeName("");
    setShowFeeModal(false);
  };

  const addClassStructure = () => {
    if (!classForm.className || !classForm.amount) return;

    setFeeTypes((prev) =>
      prev.map((f) =>
        f.id === selectedFeeId
          ? {
              ...f,
              structures: [
                ...f.structures,
                {
                  id: Date.now(),
                  class: classForm.className,
                  amount: Number(classForm.amount),
                  installments: [],
                },
              ],
            }
          : f
      )
    );

    setClassForm({ className: "", amount: "" });
    setShowClassModal(false);
  };

  const addInstallment = () => {
    if (!installmentForm.name || !installmentForm.amount || !installmentForm.month)
      return;

    setFeeTypes((prev) =>
      prev.map((f) =>
        f.id === selectedFeeId
          ? {
              ...f,
              structures: f.structures.map((s) =>
                s.id === activeStructure.id
                  ? {
                      ...s,
                      installments: [...s.installments, installmentForm],
                    }
                  : s
              ),
            }
          : f
      )
    );

    setInstallmentForm({ name: "", amount: "", month: "" });
    setShowInstallmentModal(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* LEFT – FEES TYPES */}
      <div className="lg:col-span-4 bg-white rounded-xl border border-gray-200 p-3 space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-semibold">Fees Types</h3>
          <button
            onClick={() => setShowFeeModal(true)}
            className="soft-btn-outline text-blue-600"
          >
            + Add
          </button>
        </div>

        {feeTypes.map((f) => (
          <button
            key={f.id}
            onClick={() => setSelectedFeeId(f.id)}
            className={`w-full text-left px-3 py-2 rounded-md border transition ${
              selectedFeeId === f.id
                ? "bg-blue-50 border-blue-300"
                : "border-gray-200 hover:bg-gray-50"
            }`}
          >
            <div className="text-sm font-medium">{f.name}</div>
            <div className="text-xs text-gray-500">
              {f.structures.length} classes
            </div>
          </button>
        ))}
      </div>

      {/* RIGHT – STRUCTURE */}
      <div className="lg:col-span-8 space-y-3">
        {/* HEADER */}
        <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 flex justify-between items-center">
          <div>
            <h2 className="text-sm font-semibold">{selectedFee.name}</h2>
            <p className="text-xs text-gray-500">
              Class-wise fee structure & installments
            </p>
          </div>
          <button
            onClick={() => setShowClassModal(true)}
            className="soft-btn bg-blue-600 hover:bg-blue-700"
          >
            + Add Class
          </button>
        </div>

        {/* STRUCTURES */}
        {selectedFee.structures.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center text-xs text-gray-500">
            No class fees defined
          </div>
        )}

        {selectedFee.structures.map((s) => (
          <div
            key={s.id}
            className="bg-white rounded-xl border border-gray-200 p-3"
          >
            <div className="flex justify-between items-center mb-2">
              <div>
                <h4 className="text-sm font-semibold">{s.class}</h4>
                <div className="text-xs text-gray-500">
                  Total ₹{s.amount}
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveStructure(s);
                  setShowInstallmentModal(true);
                }}
                className="soft-btn-outline text-blue-600"
              >
                + Installment
              </button>
            </div>

            {s.installments.length > 0 ? (
              <table className="w-full text-xs border-collapse">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-2 py-1 text-left">Name</th>
                    <th className="px-2 py-1 text-left">Amount</th>
                    <th className="px-2 py-1 text-left">Month</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {s.installments.map((i, idx) => (
                    <tr key={idx}>
                      <td className="px-2 py-1">{i.name}</td>
                      <td className="px-2 py-1">₹{i.amount}</td>
                      <td className="px-2 py-1">{i.month}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-xs text-gray-400">
                No installments added
              </div>
            )}
          </div>
        ))}
      </div>

      {/* MODALS */}
      {showFeeModal && (
        <Modal title="Create Fee Type" onClose={() => setShowFeeModal(false)}>
          <input
            className="soft-input"
            placeholder="Fee Type Name"
            value={newFeeName}
            onChange={(e) => setNewFeeName(e.target.value)}
          />
          <div className="flex justify-end mt-4">
            <button
              onClick={createFeeType}
              className="soft-btn bg-blue-600 hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </Modal>
      )}

      {showClassModal && (
        <Modal title="Add Class Fees" onClose={() => setShowClassModal(false)}>
          <select
            className="soft-select"
            value={classForm.className}
            onChange={(e) =>
              setClassForm({ ...classForm, className: e.target.value })
            }
          >
            <option value="">Select Class</option>
            {CLASSES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <input
            className="soft-input mt-3"
            placeholder="Total Amount"
            type="number"
            value={classForm.amount}
            onChange={(e) =>
              setClassForm({ ...classForm, amount: e.target.value })
            }
          />

          <div className="flex justify-end mt-4">
            <button
              onClick={addClassStructure}
              className="soft-btn bg-blue-600 hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </Modal>
      )}

      {showInstallmentModal && (
        <Modal
          title="Add Installment"
          onClose={() => setShowInstallmentModal(false)}
        >
          <input
            className="soft-input"
            placeholder="Installment Name"
            value={installmentForm.name}
            onChange={(e) =>
              setInstallmentForm({ ...installmentForm, name: e.target.value })
            }
          />
          <input
            className="soft-input mt-3"
            placeholder="Amount"
            type="number"
            value={installmentForm.amount}
            onChange={(e) =>
              setInstallmentForm({
                ...installmentForm,
                amount: e.target.value,
              })
            }
          />
          <select
            className="soft-select mt-3"
            value={installmentForm.month}
            onChange={(e) =>
                setInstallmentForm({
                ...installmentForm,
                month: e.target.value,
                })
            }
            >
            <option value="">Select Due Month</option>
            {MONTHS.map((m) => (
                <option key={m} value={m}>
                {m}
                </option>
            ))}
            </select>


          <div className="flex justify-end mt-4">
            <button
              onClick={addInstallment}
              className="soft-btn bg-blue-600 hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
