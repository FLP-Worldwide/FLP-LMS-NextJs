"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/utils/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DollarOutlined } from "@ant-design/icons";

export default function TeacherStaffPage() {
  const router = useRouter();

  const [teachers, setTeachers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ROLES ================= */
  const fetchRoles = async () => {
    const res = await api.get("/settings/roles");

    if (res.data?.status === "success") {
      const active = res.data.data.filter((r) => r.is_active);
      setRoles(active);
      setRole(active[0]?.slug || "");
    }
  };

  /* ================= FETCH TEACHERS ================= */
  const fetchTeachers = async (roleSlug) => {
    if (!roleSlug) return;

    setLoading(true);
    try {
      const res = await api.get("/staff/all", {
        params: { role: roleSlug },
      });

      setTeachers(res.data?.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    fetchTeachers(role);
  }, [role]);

  return (
    <div className="space-y-4 p-6">

      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between">

        <div>
          <h2 className="text-xl font-semibold">
            Teachers / Staff
          </h2>
          <p className="text-sm text-gray-500">
            Filter teachers based on role and view list.
          </p>
        </div>

        <div className="flex gap-3 items-center">

          {/* ROLE FILTER */}
          <select
            className="soft-select w-48"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">Select Role</option>
            {roles.map((r) => (
              <option key={r.id} value={r.slug}>
                {r.name}
              </option>
            ))}
          </select>

        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">

        <div className="overflow-x-auto">
          <table className="w-full text-sm">

            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Designation</th>
                <th className="px-4 py-2 text-left">Department</th>
                <th className="px-4 py-2 text-left">Phone</th>

                <th className="px-4 py-2 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">

              {!loading && teachers.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50">

                  <td className="px-4 py-2 font-medium">
                    {t.name}
                  </td>

                  <td className="px-4 py-2">
                    {t.email || "—"}
                  </td>

                  <td className="px-4 py-2">
                    <span className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-700">
                      {t.designation}
                    </span>
                  </td>

                  <td className="px-4 py-2">
                    {t.department || "—"}
                  </td>

                  <td className="px-4 py-2">
                    {t.phone || "—"}
                  </td>

                

                  <td className="px-4 py-2 text-right">
                    <div className="flex justify-end gap-3">

                      <Link
                        href={`/admin/payroll/make-payment/${t.user_id}/payment`}
                        className="text-blue-600"
                      >
                        <DollarOutlined /> Make Paymnent
                      </Link>


                    </div>
                  </td>

                </tr>
              ))}

              {!loading && teachers.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="py-6 text-center text-gray-500"
                  >
                    No staff found for selected role
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