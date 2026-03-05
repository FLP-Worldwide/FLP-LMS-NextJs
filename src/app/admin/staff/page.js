"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import { api } from "@/utils/api";
import { EditOutlined } from "@ant-design/icons";

export default function StaffPage() {
  const [staff, setStaff] = useState([]);
  const [roles, setRoles] = useState([]);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
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
    if (!confirm("Delete staff member?" + id)) return;
    await api.delete(`/staff/${id}`);
    fetchStaff();
    setStaff(prev => prev.filter(s => s.id !== id));
  };


  const downloadTemplate = async () => {
    try {
      const res = await api.get("/reports/teachers/bulk-template", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", "teachers.xlsx");

      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
      alert("Failed to download template");
    }
  };

  const uploadBulkTeachers = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      await api.post("/reports/teachers/bulk-upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Teachers uploaded successfully");
      fetchStaff(role);
    } catch (err) {
      console.error(err);
      alert("Bulk upload failed");
    }
  };

  return (
    <div className="space-y-4 p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Teachers</h2>
          <p className="text-sm text-gray-500">
            Manage school teachers members.
          </p>
        </div>
        <div className="flex gap-2 items-center">
        <div>
          <select
            className="soft-select w-48"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">Select Role</option>
            {roles.map(r => (
              <option key={r.id} value={r.slug}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

       <div className="flex gap-3 relative">

        {/* ADD TEACHER */}
        <Link
          href="/admin/staff/create"
          className="bg-blue-800 px-4 py-1 text-white text-sm rounded-lg border border-blue-900 hover:bg-blue-900"
        >
          + Add Teacher
        </Link>

        {/* BULK MENU BUTTON */}
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="soft-btn-outline text-sm"
        >
          Bulk Actions ▾
        </button>

        {/* DROPDOWN */}
        {showMenu && (
          <div className="absolute right-0 top-9 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-50">

            <button
              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              onClick={downloadTemplate}
            >
              Download Excel
            </button>

            <button
              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              onClick={() => document.getElementById("teacherUpload").click()}
            >
              Upload Bulk
            </button>
            <input
              type="file"
              accept=".xlsx"
              id="teacherUpload"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) uploadBulkTeachers(file);
              }}
            />

          </div>
        )}

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
                 
                 
                  <td className="px-4 py-2 text-right">
                    <div className="flex justify-end gap-3">
                      <Link
                        href={`/admin/staff/${s.user_id}/edit`}
                        className="text-blue-600"
                      >
                        <EditOutlined />
                      </Link>


                      {/* <Link
                        href={`/admin/staff/${s.user_id}`}
                        className="text-sky-600"
                      >
                        <EyeOutlined />
                      </Link> */}
                      <button
                        onClick={() => handleDelete(s.user_id)}
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
