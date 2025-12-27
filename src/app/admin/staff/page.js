"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import { api } from "@/utils/api";

export default function StaffPage() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ================= */
  useEffect(() => {
    async function fetchStaff() {
      setLoading(true);
      try {
        const res = await api.get("/teachers");
        setStaff(res.data?.data || []);
      } finally {
        setLoading(false);
      }
    }
    fetchStaff();
  }, []);

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!confirm("Delete staff member?")) return;
    try {
      await api.delete(`/teachers/${id}`);
      setStaff(prev => prev.filter(s => s.id !== id));
    } catch (e) {
      alert("Failed to delete teacher");
    }
  };

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Staff</h2>
          <p className="text-sm text-gray-500">
            Manage school teachers and staff members.
          </p>
        </div>

        <Link
          href="/admin/staff/create"
          className="px-3 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700 transition"
        >
          + Add Staff
        </Link>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl p-4 shadow-xs border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold">Staff List</h3>
          <div className="text-sm text-gray-500">
            {loading ? "Loading..." : `${staff.length} total`}
          </div>
        </div>

        <div className="overflow-x-auto rounded-md">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-2 px-4 text-xs font-medium text-gray-600">
                  Name
                </th>
                <th className="py-2 px-4 text-xs font-medium text-gray-600">
                  Email
                </th>
                <th className="py-2 px-4 text-xs font-medium text-gray-600">
                  Department
                </th>
                <th className="py-2 px-4 text-xs font-medium text-gray-600">
                  Subject
                </th>
                <th className="py-2 px-4 text-xs font-medium text-gray-600">
                  Phone
                </th>
                <th className="py-2 px-4 text-xs font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="border-t border-gray-300 divide-y divide-gray-200">
              {!loading && staff.map((s) => (
                <tr key={s.id}>
                  {/* NAME + ROLE BADGE */}
                  <td className="py-2 px-4">
                    <div className="font-medium text-sm">{s.name}</div>
                    <span className="inline-block mt-1 px-2 py-[2px] rounded-full text-[11px] bg-blue-50 text-blue-700">
                      {s.designation || "Teacher"}
                    </span>
                  </td>

                  <td className="py-2 px-4 text-sm">
                    {s.contact?.email || "—"}
                  </td>

                  <td className="py-2 px-4 text-sm">
                    {s.department || "—"}
                  </td>

                  <td className="py-2 px-4 text-sm">
                    {s.subjects?.length
                      ? s.subjects.map(sub => sub.name).join(", ")
                      : "—"}
                  </td>

                  <td className="py-2 px-4 text-sm">
                    {s.contact?.phone || "—"}
                  </td>

                  {/* ACTIONS */}
                  <td className="py-2 px-4 text-sm">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/admin/staff/${s.id}`}
                        className="text-sky-600 hover:text-sky-700"
                        title="View Details"
                      >
                        <EyeOutlined />
                      </Link>

                      <button
                        onClick={() => handleDelete(s.id)}
                        className="text-red-500 hover:text-red-600"
                        title="Delete"
                      >
                        <DeleteOutlined />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!loading && staff.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-sm text-gray-500">
                    No staff found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
