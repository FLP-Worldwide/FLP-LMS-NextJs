"use client";

import React, { useState } from "react";
import Modal from "@/components/ui/Modal";

/* ---------------- INITIAL TEMPLATES ---------------- */
const initialTemplates = [
  {
    id: 1,
    name: "Teacher Monthly",
    type: "monthly",
    baseSalary: 35000,
    perDayDeduction: 1000,
    overtimeRate: 200,
  },
  {
    id: 2,
    name: "Guest Faculty Hourly",
    type: "hourly",
    hourlyRate: 800,
    overtimeRate: 0,
  },
];

export default function SalaryTemplatesPage() {
  const [templates, setTemplates] = useState(initialTemplates);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const emptyForm = {
    name: "",
    type: "monthly",
    baseSalary: "",
    perDayDeduction: "",
    hourlyRate: "",
    overtimeRate: "",
  };

  const [form, setForm] = useState(emptyForm);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (tpl) => {
    setEditing(tpl);
    setForm(tpl);
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name) return alert("Template name required");

    if (editing) {
      setTemplates((prev) =>
        prev.map((t) => (t.id === editing.id ? { ...form } : t))
      );
    } else {
      setTemplates((prev) => [
        { ...form, id: Date.now() },
        ...prev,
      ]);
    }

    setShowModal(false);
  };

  return (
    <div className="space-y-6 p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Salary Templates</h2>
          <p className="text-sm text-gray-500">
            Define monthly and hourly salary structures
          </p>
        </div>

        <button onClick={openCreate} className="soft-btn">
          + Create Template
        </button>
      </div>

      {/* TEMPLATE LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((t) => (
          <div
            key={t.id}
            className="bg-white border border-gray-200 rounded-xl p-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{t.name}</h3>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
                  {t.type === "monthly" ? "Monthly" : "Hourly"}
                </span>
              </div>

              <button
                onClick={() => openEdit(t)}
                className="text-sm text-blue-600"
              >
                Edit
              </button>
            </div>

            <div className="mt-3 space-y-1 text-sm">
              {t.type === "monthly" ? (
                <>
                  <Row label="Base Salary" value={`₹${t.baseSalary}`} />
                  <Row
                    label="Per Day Deduction"
                    value={`₹${t.perDayDeduction}`}
                  />
                </>
              ) : (
                <Row
                  label="Hourly Rate"
                  value={`₹${t.hourlyRate}`}
                />
              )}

              <Row
                label="Overtime Rate"
                value={`₹${t.overtimeRate || 0}`}
              />
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {showModal && (
        <Modal
          title={editing ? "Edit Salary Template" : "Create Salary Template"}
          onClose={() => setShowModal(false)}
        >
          <div className="space-y-3 p-6">
            {/* NAME */}
            <input
              placeholder="Template Name"
              className="soft-input"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            {/* TYPE */}
            <select
              className="soft-select"
              value={form.type}
              onChange={(e) =>
                setForm({ ...form, type: e.target.value })
              }
            >
              <option value="monthly">Monthly</option>
              <option value="hourly">Hourly</option>
            </select>

            {/* MONTHLY */}
            {form.type === "monthly" && (
              <>
                <input
                  placeholder="Base Salary"
                  className="soft-input"
                  value={form.baseSalary}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      baseSalary: e.target.value,
                    })
                  }
                />

                <input
                  placeholder="Per Day Deduction"
                  className="soft-input"
                  value={form.perDayDeduction}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      perDayDeduction: e.target.value,
                    })
                  }
                />
              </>
            )}

            {/* HOURLY */}
            {form.type === "hourly" && (
              <input
                placeholder="Hourly Rate"
                className="soft-input"
                value={form.hourlyRate}
                onChange={(e) =>
                  setForm({
                    ...form,
                    hourlyRate: e.target.value,
                  })
                }
              />
            )}

            {/* OVERTIME */}
            <input
              placeholder="Overtime Rate"
              className="soft-input"
              value={form.overtimeRate}
              onChange={(e) =>
                setForm({
                  ...form,
                  overtimeRate: e.target.value,
                })
              }
            />

            {/* ACTIONS */}
            <div className="flex justify-end gap-2 pt-3">
              <button
                onClick={() => setShowModal(false)}
                className="soft-btn-outline"
              >
                Cancel
              </button>
              <button onClick={handleSave} className="soft-btn">
                Save Template
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ---------------- SMALL ROW ---------------- */

function Row({ label, value }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
