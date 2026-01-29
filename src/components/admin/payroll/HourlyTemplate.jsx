"use client";

import React, { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { api } from "@/utils/api";
import PrimaryButton from "@/components/ui/PrimaryButton";

export default function HourlyTemplate() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
const [hourlyRate, setHourlyRate] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", description: "" });

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const res = await api.get("/payroll/salary-templates", {
        params: { type: "hourly" },
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

const openCreate = () => {
  setEditing(null);
  setForm({ name: "", description: "" });
  setHourlyRate(0);
  setShowModal(true);
};


const openEdit = async (item) => {
  const res = await api.get(
    `/payroll/salary-templates/${item.id}`
  );

  const data = res.data.data;

  setEditing(data);
  setForm({ name: data.name || "" });
  setHourlyRate(data.salary?.hourly_rate || 0);
  setShowModal(true);
};

  
const save = async () => {
  if (!form.name || !hourlyRate) return;

  const payload = {
    name: form.name,
    type: "hourly",
    salary: {
      hourly_rate: Number(hourlyRate),
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
    if (!confirm("Delete this hourly salary template?")) return;
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
                  Hourly Rate (Rs)
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
                  {/* TEMPLATE NAME */}
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

                   <td className="px-4 py-2 text-blue-600 font-medium">
                    {t.salary?.hourly_rate || "—"}
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

                  {/* ACTIONS */}
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


      {showModal && (
          <Modal
            title={
              editing
                ? "Edit Hourly Salary Template"
                : "Create Hourly Salary Template"
            }
            onClose={() => setShowModal(false)}
            className="max-w-lg"
          >
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium">
                  Hourly Template *
                </label>
                <input
                  className="soft-input"
                  placeholder="Enter hourly template"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-xs font-medium">
                  Hourly Rates (Rs) *
                </label>
               <input
                  className="soft-input"
                  placeholder="Enter hourly rates"
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                />

              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="soft-btn-outline"
              >
                Cancel
              </button>
              <PrimaryButton name="Add Hourly Template" onClick={save} />
            </div>
          </Modal>
        )}

    </>
  );
}
