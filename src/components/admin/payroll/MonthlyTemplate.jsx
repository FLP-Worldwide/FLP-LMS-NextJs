"use client";

import React, { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { api } from "@/utils/api";
import PrimaryButton from "@/components/ui/PrimaryButton";

export default function MonthlyTemplate() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", description: "" });

  const [basicSalary, setBasicSalary] = useState(0);
const [ratePerHour, setRatePerHour] = useState(0);

const [allowances, setAllowances] = useState([
  { name: "", amount: 0 },
]);

const [deductions, setDeductions] = useState([
  { name: "", amount: 0 },
]);

const totalAllowance = allowances.reduce(
  (sum, a) => sum + Number(a.amount || 0),
  0
);

const totalDeduction = deductions.reduce(
  (sum, d) => sum + Number(d.amount || 0),
  0
);

const grossSalary = Number(basicSalary || 0) + totalAllowance;
const netSalary = grossSalary - totalDeduction;


  /* FETCH */
  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const res = await api.get("/payroll/salary-templates", {
        params: { type: "monthly" },
      });

      if (res.data?.status === "success") {
        setTemplates(res.data.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  /* ACTIONS */
  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", description: "" });
    setShowModal(true);
  };

const openEdit = async (item) => {
  try {
    setLoading(true);

    const res = await api.get(
      `/payroll/salary-templates/${item.id}`
    );

    const data = res.data.data;

    setEditing(data);

    // BASIC FORM
    setForm({
      name: data.name || "",
      description: data.description || "",
    });

    // SALARY
    setBasicSalary(data.salary?.basic || 0);
    setRatePerHour(data.salary?.rate_per_hour || 0);

    // ALLOWANCES
    setAllowances(
      data.allowances?.length
        ? data.allowances
        : [{ name: "", amount: 0 }]
    );

    // DEDUCTIONS
    setDeductions(
      data.deductions?.length
        ? data.deductions
        : [{ name: "", amount: 0 }]
    );

    setShowModal(true);
  } finally {
    setLoading(false);
  }
};

    const save = async () => {
    if (!form.name) return;

    const payload = {
      name: form.name,
      type: "monthly",

      salary: {
        basic: Number(basicSalary || 0),
        rate_per_hour: Number(ratePerHour || 0),
      },

      allowances: allowances
        .filter(a => a.name && a.amount)
        .map(a => ({
          name: a.name,
          amount: Number(a.amount),
        })),

      deductions: deductions
        .filter(d => d.name && d.amount)
        .map(d => ({
          name: d.name,
          amount: Number(d.amount),
        })),

      summary: {
        gross_salary: Number(grossSalary || 0),
        total_deduction: Number(totalDeduction || 0),
        net_salary: Number(netSalary || 0),
      },
    };

    if (editing) {
      await api.put(
        `/payroll/salary-templates/${editing.id}`,
        payload
      );
    } else {
      await api.post(
        "/payroll/salary-templates",
        payload
      );
    }

    setShowModal(false);
    fetchTemplates();
  };



  const remove = async (id) => {
    if (!confirm("Delete this monthly salary template?")) return;
    api.delete(`/payroll/salary-templates/${id}`);

    fetchTemplates();
  };

  return (
    <>
      <div className="flex justify-end">
        <PrimaryButton
          name="+ Add Salary Template"
          onClick={openCreate}
        />
      </div>

      {loading ? (
        <div className="text-sm text-gray-500">Loading...</div>
      ) : templates.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-sm text-gray-500 text-center">
          No salary templates found
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs text-gray-600">
                  Template Name
                </th>
                <th className="px-4 py-2 text-left text-xs text-gray-600">
                  Description
                </th>
                <th className="px-4 py-2 text-left text-xs text-gray-600">
                  Employees Using
                </th>
                <th className="px-4 py-2 text-left text-xs text-gray-600">
                  Gross Salary
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
              {templates.map((t) => (
                <tr key={t.id} className="border-gray-200">
                  {/* NAME */}
                  <td className="px-4 py-2 font-medium">
                    {t.name}
                  </td>

                  {/* DESCRIPTION */}
                  <td className="px-4 py-2 text-gray-500">
                    {t.description || "—"}
                  </td>

                  {/* EMPLOYEES */}
                  <td className="px-4 py-2 text-blue-600 font-medium">
                    0
                  </td>
                  {/* EMPLOYEES */}
                  <td className="px-4 py-2 text-blue-600 font-medium">
                    {t.summary?.gross_salary || "—"}
                  </td>

                  {/* STATUS */}
                  <td className="px-4 py-2">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        t.is_active
                          ? "bg-blue-50 text-blue-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {t.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>

                  {/* ACTION */}
                  <td className="px-4 py-2 text-right">
                    <div className="inline-flex gap-3">
                      <button
                        onClick={() => openEdit(t)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <EditOutlined />
                      </button>

                      <button
                        onClick={() => remove(t.id)}
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
            editing
              ? "Edit Monthly Salary Template"
              : "Create Monthly Salary Template"
          }
          onClose={() => setShowModal(false)}
          className="max-w-6xl"
        >
          <div className="grid grid-cols-3 gap-6">
            {/* LEFT FORM */}
            <div className="col-span-2 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium">
                    Monthly Salary Template *
                  </label>
                  <input
                    className="soft-input"
                    placeholder="Enter Monthly Salary Template"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="text-xs font-medium">
                    Basic Salary Amount (Rs) *
                  </label>
                 <input
                    className="soft-input"
                    placeholder="Enter Basic Salary Amount"
                    type="number"
                    value={basicSalary}
                    onChange={(e) => setBasicSalary(e.target.value)}
                  />

                </div>
              </div>

              <div>
                <label className="text-xs font-medium">
                  Rate (Per Hour) *
                </label>
               <input
                  className="soft-input"
                  placeholder="Enter Amount"
                  type="number"
                  value={ratePerHour}
                  onChange={(e) => setRatePerHour(e.target.value)}
                />

              </div>

              {/* ADD ALLOWANCE */}
              <div className="border  border-gray-200 rounded-lg p-4 space-y-3">
                <div className="text-sm font-medium">Add Allowance</div>

                {allowances.map((a, i) => (
                  <div key={i} className="grid grid-cols-2 gap-4">
                    <input
                      className="soft-input"
                      placeholder="Enter Allowance Name"
                      value={a.name}
                      onChange={(e) => {
                        const copy = [...allowances];
                        copy[i].name = e.target.value;
                        setAllowances(copy);
                      }}
                    />
                    <input
                      className="soft-input"
                      placeholder="Enter Allowance Amount"
                      type="number"
                      value={a.amount}
                      onChange={(e) => {
                        const copy = [...allowances];
                        copy[i].amount = e.target.value;
                        setAllowances(copy);
                      }}
                    />
                  </div>
                ))}

                <button
                  className="text-sm text-blue-600"
                  onClick={() =>
                    setAllowances([...allowances, { name: "", amount: 0 }])
                  }
                >
                  + Add Allowance
                </button>
              </div>


              {/* ADD DEDUCTION */}
             <div className="border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="text-sm font-medium">Add Deduction</div>

              {deductions.map((d, i) => (
                <div key={i} className="grid grid-cols-2 gap-4">
                  <input
                    className="soft-input"
                    placeholder="Enter Deduction Name"
                    value={d.name}
                    onChange={(e) => {
                      const copy = [...deductions];
                      copy[i].name = e.target.value;
                      setDeductions(copy);
                    }}
                  />
                  <input
                    className="soft-input"
                    placeholder="Enter Deduction Amount"
                    type="number"
                    value={d.amount}
                    onChange={(e) => {
                      const copy = [...deductions];
                      copy[i].amount = e.target.value;
                      setDeductions(copy);
                    }}
                  />
                </div>
              ))}

              <button
                className="text-sm text-blue-600"
                onClick={() =>
                  setDeductions([...deductions, { name: "", amount: 0 }])
                }
              >
                + Add Deduction
              </button>
            </div>

            </div>

            {/* RIGHT SUMMARY */}
            <div className="border border-gray-200 rounded-xl p-4 h-fit">
              <h4 className="font-semibold text-sm mb-4">
                Total Salary Details
              </h4>

              <div className="flex justify-between text-sm mb-2">
                <span>Gross Salary (Rs)</span>
                <span>{grossSalary}</span>
              </div>

              <div className="flex justify-between text-sm mb-2">
                <span>Total Deduction (Rs)</span>
                <span>{totalDeduction}</span>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg flex justify-between font-semibold">
                <span>Net Salary (Rs)</span>
                <span>{netSalary}</span>
              </div>

            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 mt-6">
            <button
              onClick={() => setShowModal(false)}
              className="soft-btn-outline"
            >
              Cancel
            </button>
            <PrimaryButton name="Add Salary Template" onClick={save} />
          </div>
        </Modal>
      )}

    </>
  );
}
