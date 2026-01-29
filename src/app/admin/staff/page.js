"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import { api } from "@/utils/api";

export default function StaffPage() {
  const [staff, setStaff] = useState([]);
  const [roles, setRoles] = useState([]);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ROLES ================= */
  const fetchRoles = async () => {
    const res = await api.get("/settings/roles");
    if (res.data?.status === "success") {
      const active = res.data.data.filter(r => r.is_active);
      setRoles(active);
      setRole(active[0]?.slug || "");
    }
  };

  /* ================= FETCH STAFF ================= */
  const fetchStaff = async (roleSlug) => {
    if (!roleSlug) return;

    setLoading(true);
    try {
      const res = await api.get("/staff/all", {
        params: { role: roleSlug },
      });
      setStaff(res.data?.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    fetchStaff(role);
  }, [role]);

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!confirm("Delete staff member?")) return;
    await api.delete(`/staff/${id}`);
    setStaff(prev => prev.filter(s => s.id !== id));
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
        <div className="flex gap-2 items-center">
        <div>
          <select
            className="soft-select w-48"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            {roles.map(r => (
              <option key={r.id} value={r.slug}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3">
          {/* ROLE FILTER */}
          

          <Link
            href="/admin/staff/create"
            className="bg-blue-800 px-4 py-1 text-white text-sm rounded-lg border border-blue-900 hover:bg-blue-900"
          >
            + Add Staff
          </Link>
        </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Role/Designation</th>
                <th className="py-2 px-4  text-left"> Department </th>
                <th className="px-4 py-2 text-left">Phone</th>
                <th className="px-4 py-2 text-left">Credentials</th>
                <th className="px-4 py-2 text-left">Last Login</th>
                <th className="px-4 py-2 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {!loading && staff.map(s => (
                <tr key={s.id}>
                  <td className="px-4 py-2 font-medium">{s.name}</td>
                  <td className="px-4 py-2">{s.email || "—"}</td>
                  <td className="px-4 py-2">
                    <span className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-700">
                      {s.type}/{s.designation}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <span className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-700">
                      {s.department || s.designation}
                    </span>
                  </td>
                  <td className="px-4 py-2">{s.phone}</td>
                  <td className="px-4 py-2">
                    <span className="text-xs">username - {s.credentials?.username}</span>
                    <br />
                    <span className="text-xs">password - {s.credentials?.password}</span>
                  </td>
                  <td className="px-4 py-2">{s.last_login}</td>
                  <td className="px-4 py-2 text-right">
                    <div className="flex justify-end gap-3">
                      <Link
                        href={`/admin/staff/${s.id}`}
                        className="text-sky-600"
                      >
                        <EyeOutlined />
                      </Link>
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="text-red-500"
                      >
                        <DeleteOutlined />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!loading && staff.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-gray-500">
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
