"use client";

import React, { useEffect, useState } from "react";
import PrimaryButton from "@/components/ui/PrimaryButton";
import Modal from "@/components/ui/Modal";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import { api } from "@/utils/api";
import { useRouter } from "next/navigation";
import { FileExcelOutlined } from "@ant-design/icons";

export default function ManageSalaryPage() {
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState(null);
  const handleDownloadExcel = async () => {
    try {
      const response = await api.get("/reports/payroll/manage-salary/export", {
        responseType: "blob",
        params: { role }, // optional filter by role
      });

      const url = window.URL.createObjectURL(
        new Blob([response.data])
      );

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "manage-salary.xlsx");

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Manage salary export failed", error);
      alert("Failed to download Excel");
    }
  };

  /* ================= STATE ================= */
  const [roles, setRoles] = useState([]);
  const [role, setRole] = useState("");
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(false);

  /* EDIT MODAL */
  const [showModal, setShowModal] = useState(false);
  const [salaryType, setSalaryType] = useState("monthly");
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");

  /* ================= FETCH ROLES ================= */
  const fetchRoles = async () => {
    const res = await api.get("/settings/roles");
    if (res.data?.status === "success") {
      const activeRoles = res.data.data.filter(r => r.is_active);
      setRoles(activeRoles);
      setRole(activeRoles[0]?.slug || "");
    }
  };

  /* ================= FETCH USERS ================= */
  const fetchUsers = async (roleSlug) => {
    if (!roleSlug) return;

    try {
      setLoading(true);
      const res = await api.get("/staff/all", {
        params: { role: roleSlug },
      });

      if (res.data?.status === "success") {
        setUsers(res.data.data);
      } else {
        setUsers([]);
      }
    } finally {
      setLoading(false);
    }
  };

  /* ================= FETCH TEMPLATES ================= */
  const fetchTemplates = async (type) => {
    try {
      const res = await api.get("/payroll/salary-templates", {
        params: { type },
      });

      if (res.data?.status === "success") {
        setTemplates(res.data.data);
        setSelectedTemplate(res.data.data?.[0]?.id || "");
      }
    } finally {
      setLoading(false);
    }
  };

  const saveManageSalary = async () => {
  if (!selectedUser || !selectedTemplate) {
    alert("Please select template");
    return;
  }

  const payload = {
    user_id: selectedUser.user_id,
    salary_type: salaryType,
    salary_template_id: selectedTemplate,
  };

  try {
    await api.post("/payroll/assign-salary-template", payload);

    alert("Salary template assigned successfully");
    setShowModal(false);

    // refresh list so salary_type updates
    fetchUsers(role);
  } catch (e) {
    console.error(e);
    alert("Failed to assign salary template");
  }
};


  /* ================= EFFECTS ================= */
  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    fetchUsers(role);
  }, [role]);

  /* ================= ACTIONS ================= */
  const openEdit = (user) => {
    setSelectedUser(user);
    setSalaryType("monthly");
    fetchTemplates("monthly");
    setShowModal(true);
  };


  const handleSalaryTypeChange = (value) => {
    setSalaryType(value);
    setSelectedTemplate("");
    fetchTemplates(value);
  };

  /* ================= UI ================= */
  return (
    <div className="space-y-4 p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Manage Salary</h2>
          <p className="text-sm text-gray-500">
            Assign salary templates to staff & faculty
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Excel Hover Expand Button */}
          <div>
          <button
            onClick={handleDownloadExcel}
            className="group flex items-center gap-2 
                      border border-gray-200 rounded-lg 
                      px-3 py-2 overflow-hidden
                      transition-all duration-300
                      hover:bg-green-50 hover:shadow-sm"
          >
            <FileExcelOutlined className="text-green-600 text-lg" />

            <span
              className="max-w-0 opacity-0 overflow-hidden whitespace-nowrap
                        group-hover:max-w-xs group-hover:opacity-100
                        transition-all duration-300 text-sm text-green-700"
            >
              Download Excel
            </span>
          </button>
          </div>
          {/* ROLE FILTER */}
          <select
            className="soft-input w-48"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            {roles.map((r) => (
              <option key={r.id} value={r.slug}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
      </div>


      {/* TABLE */}
      {loading ? (
        <div className="text-sm text-gray-500">Loading...</div>
      ) : users.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-sm text-gray-500 text-center">
          No users found
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs text-gray-600">
                  Name
                </th>
                <th className="px-4 py-2 text-left text-xs text-gray-600">
                  Role
                </th>
                <th className="px-4 py-2 text-left text-xs text-gray-600">
                  Phone
                </th>
                <th className="px-4 py-2 text-left text-xs text-gray-600">
                  Salary Type
                </th>
                <th className="px-4 py-2 text-right text-xs text-gray-600">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-2 font-medium">
                    {u.name}
                  </td>

                  <td className="px-4 py-2 text-gray-500">
                    {u.type || "—"}/{u.designation || "—"}
                  </td>

                  <td className="px-4 py-2 text-gray-500">
                    {u.phone || "—"}
                  </td>

                  <td className="px-4 py-2">
                    <span className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-700">
                      {u.salary_template?.salary_type || "Not Assigned"}
                    </span>
                  </td>

                  <td className="px-4 py-2 text-right">
                    <div className="inline-flex gap-3">
                      <button
                        onClick={() =>
                          router.push("/admin/payroll/salary-manage/view/" + u.user_id)
                        }
                        className="text-blue-600"
                        title="View Salary"
                      >
                        <EyeOutlined />
                      </button>

                     <button
                      onClick={() => openEdit(u)}
                      className="text-blue-600"
                      title="Edit Salary"
                    >
                      <EditOutlined />
                    </button>

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* EDIT MODAL */}
      {showModal && (
        <Modal
          title="Update Manage Salary"
          onClose={() => setShowModal(false)}
          className="max-w-lg"
        >
          <div className="space-y-4 p-6">
            {/* SALARY TYPE */}
            <div>
              <label className="text-xs font-medium">
                Salary *
              </label>
              <select
                className="soft-select"
                value={salaryType}
                onChange={(e) =>
                  handleSalaryTypeChange(e.target.value)
                }
              >
                <option value="monthly">Monthly</option>
                <option value="hourly">Hourly</option>
              </select>
            </div>

            {/* TEMPLATE */}
            <div>
              <label className="text-xs font-medium">
                Template *
              </label>
              <select
                className="soft-select"
                value={selectedTemplate}
                onChange={(e) =>
                  setSelectedTemplate(e.target.value)
                }
              >
                <option value="">Select Template</option>
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t mt-6">
            <PrimaryButton
              name="Update Manage Salary"
              onClick={saveManageSalary}
            />

          </div>
        </Modal>
      )}
    </div>
  );
}
