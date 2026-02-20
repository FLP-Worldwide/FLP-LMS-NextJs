"use client";

import React, { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { api } from "@/utils/api";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { useToast } from "@/components/ui/ToastProvider";

export default function AcademicYearTab() {
  const toast = useToast();
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    start_year: "",
    start_date: "",
    end_date: "",
    description: "",
  });

  /* ================= FETCH ================= */
  const fetchYears = async () => {
    try {
      setLoading(true);
      const res = await api.get("/academic-years");

      if (res.data?.status === "success") {
        setYears(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch academic years", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchYears();
  }, []);

  /* ================= ACTIONS ================= */

  const openCreate = () => {
    setEditing(null);
    setForm({
      start_year: "",
      start_date: "",
      end_date: "",
      description: "",
    });
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      start_year: item.start_year || "",
      start_date: item.start_date || "",
      end_date: item.end_date || "",
      description: item.description || "",
    });
    setShowModal(true);
  };

  const saveYear = async () => {
    if (!form.start_year || !form.start_date || !form.end_date) {
      toast.error("Start year, start date and end date are required");
      return;
    }

    try {
      const payload = {
        start_year: form.start_year,
        start_date: form.start_date,
        end_date: form.end_date,
        description: form.description,
        is_active: true,
      };

      if (editing) {
        await api.put(`/academic-years/${editing.id}`, payload);
        toast.success("Academic year updated successfully");
      } else {
        await api.post("/academic-years", payload);
        toast.success("Academic year created successfully");
      }

      setShowModal(false);
      fetchYears();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to save academic year"
      );
    }
  };

  const deleteYear = async (id) => {
    if (!confirm("Delete this academic year?")) return;

    try {
      await api.delete(`/academic-years/${id}`);
      toast.success("Academic year deleted");
      fetchYears();
    } catch (err) {
      console.error("Delete academic year failed", err);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="space-y-2 p-2">
      {/* HEADER ACTION */}
      <div className="flex justify-end">
        <PrimaryButton
          name="+ Add Academic Year"
          onClick={openCreate}
        />
      </div>

      {/* TABLE */}
      {loading ? (
        <div className="text-sm text-gray-500">Loading...</div>
      ) : years.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-sm text-gray-500 text-center">
          No academic years defined
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs text-gray-600">
                  Academic Year
                </th>
                <th className="px-4 py-2 text-left text-xs text-gray-600">
                  Duration
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
              {years.map((y) => (
                <tr key={y.id}>
                  <td className="px-4 py-2 font-medium">
                    {y.start_year}-{Number(y.start_year) + 1}
                  </td>

                  <td className="px-4 py-2 text-gray-600 text-xs">
                    {y.start_date} to {y.end_date}
                  </td>

                  <td className="px-4 py-2">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        y.is_active
                          ? "bg-green-50 text-green-600"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {y.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="px-4 py-2 text-right">
                    <div className="inline-flex gap-3">
                      <button
                        onClick={() => openEdit(y)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <EditOutlined />
                      </button>

                      <button
                        onClick={() => deleteYear(y.id)}
                        className="text-rose-600 hover:text-rose-800"
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
            editing ? "Edit Academic Year" : "Create Academic Year"
          }
          onClose={() => setShowModal(false)}
        >
          <div className="space-y-4 p-6">
            {/* Start Year */}
            <div>
              <label className="text-xs text-gray-500">
                Start Year *
              </label>
              <input
                type="number"
                className="soft-input mt-1"
                placeholder="e.g. 2025"
                value={form.start_year}
                onChange={(e) =>
                  setForm({
                    ...form,
                    start_year: e.target.value,
                  })
                }
              />
            </div>

            {/* Start Date */}
            <div>
              <label className="text-xs text-gray-500">
                Start Date *
              </label>
              <input
                type="date"
                className="soft-input mt-1"
                value={form.start_date}
                onChange={(e) =>
                  setForm({
                    ...form,
                    start_date: e.target.value,
                  })
                }
              />
            </div>

            {/* End Date */}
            <div>
              <label className="text-xs text-gray-500">
                End Date *
              </label>
              <input
                type="date"
                className="soft-input mt-1"
                value={form.end_date}
                onChange={(e) =>
                  setForm({
                    ...form,
                    end_date: e.target.value,
                  })
                }
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-xs text-gray-500">
                Description
              </label>
              <textarea
                className="soft-input mt-1"
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
              />
            </div>

            {/* Preview */}
            {form.start_year && (
              <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                Academic Year:{" "}
                <b>
                  {form.start_year}-
                  {Number(form.start_year) + 1}
                </b>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-3">
              <button
                onClick={() => setShowModal(false)}
                className="soft-btn-outline"
              >
                Cancel
              </button>

              <PrimaryButton
                name="Save"
                onClick={saveYear}
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}