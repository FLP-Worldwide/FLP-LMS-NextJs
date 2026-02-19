"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { api } from "@/utils/api";
import ExcelDownloadButton from "@/components/ui/ExcelDownloadButton";

/* ---------------- FORM ---------------- */
const emptyForm = {
  asset_category_id: "",
  asset_id: "",
  quantity: "",
  assign_date: "",
  due_date: "",
  return_date: "",
  role: "",
  checkout_by: "",
  note: "",
};

export default function AssetAssignmentPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState([]);
  const [assets, setAssets] = useState([]);
  const [users, setUsers] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [roles, setRoles] = useState([]);

  /* =====================================================
     FETCH
  ===================================================== */
  useEffect(() => {
    api.get("/settings/roles").then(res => {
      if (res.data?.status === "success") {
        setRoles(res.data.data.filter(r => r.is_active));
      }
    });
  }, []);


  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const res = await api.get("/asset-assignments");
      setList(res.data?.data || []);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    const res = await api.get("/asset-categories");
    setCategories(res.data?.data || []);
  };

  const fetchAssets = async (categoryId) => {
    if (!categoryId) return setAssets([]);
    const res = await api.get(`/assets?category_id=${categoryId}`);
    setAssets(res.data?.data || []);
  };

  const fetchUsers = async (role) => {
    if (!role) return setUsers([]);
    const res = await api.get(`/staff/all?role=${role}`);
    setUsers(res.data?.data || []);
  };

  useEffect(() => {
    fetchAssignments();
    fetchCategories();
  }, []);

  /* =====================================================
     SAVE
  ===================================================== */

  const saveAssignment = async () => {
    try {
      if (editingId) {
        await api.patch(`/asset-assignments/${editingId}`, form);
      } else {
        await api.post("/asset-assignments", form);
      }

      setShowModal(false);
      setForm(emptyForm);
      setEditingId(null);
      fetchAssignments();
    } catch {
      alert("Failed to save assignment");
    }
  };

  /* =====================================================
     DELETE
  ===================================================== */

  const deleteAssignment = async (id) => {
    if (!confirm("Delete assignment?")) return;
    await api.delete(`/asset-assignments/${id}`);
    fetchAssignments();
  };


  const handleDownloadReport = async () => {
    try {
      const response = await api.get(
        "/reports/assets/assignments/export",
        {
          responseType: "blob",
          params: {
            role: form.role || null,
          },
        }
      );

      const url = window.URL.createObjectURL(
        new Blob([response.data])
      );

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "checkout-report.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed", error);
    }
  };


  /* =====================================================
     EDIT
  ===================================================== */

  const openEdit = async (row) => {
    setForm({
      asset_category_id: row.asset_category_id,
      asset_id: row.asset_id,
      quantity: row.quantity,
      assign_date: row.assign_date,
      due_date: row.due_date,
      return_date: row.return_date,
      role: row.role,
      checkout_by: row.checkout_by?.id || "",
      note: row.note || "",
    });

    await fetchAssets(row.asset_category_id);
    await fetchUsers(row.role);

    setEditingId(row.id);
    setShowModal(true);
  };

  /* =====================================================
     UI
  ===================================================== */

  return (
    <>
      <div className="space-y-2 p-6">
      {/* ACTION BAR */}
       
        
      <div className="flex justify-end mb-4 gap-2">
        <ExcelDownloadButton
          onClick={handleDownloadReport}
          label="Download Report"
        />
        <PrimaryButton name="+ Asset Assignment" onClick={() => setShowModal(true)} />
      </div>

      {/* TABLE */}
      {loading ? (
        <div className="text-sm text-gray-500">Loading...</div>
      ) : list.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center text-gray-500">
          No asset assignments
        </div>
      ) : (
        <table className="w-full text-sm bg-white border border-gray-200 rounded-xl">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Asset</th>
              <th className="px-4 py-2 text-left">Assign Qty</th>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-left">Check out By</th>
              <th className="px-4 py-2 text-left">Assign Date</th>
              <th className="px-4 py-2 text-left">Return Date</th>
              <th className="px-4 py-2 text-left">Due Date</th>
              <th className="px-4 py-2 text-left">Note</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {list.map((row) => (
              <tr key={row.id} className="border-gray-200">
                <td className="px-4 py-2">{row.asset?.name}</td>
                <td className="px-4 py-2">{row.quantity}</td>
                <td className="px-4 py-2">{row.role}</td>
                <td className="px-4 py-2">{row.checkout_by?.first_name}</td>
                <td className="px-4 py-2">{row.assign_date}</td>
                <td className="px-4 py-2">{row.return_date}</td>
                <td className="px-4 py-2">{row.due_date}</td>
                <td className="px-4 py-2">{row.note}</td>
                <td className="px-4 py-2">
                  <EditOutlined
                    className="mr-3 text-blue-600 cursor-pointer"
                    onClick={() => openEdit(row)}
                  />
                  <DeleteOutlined
                    className="text-rose-600 cursor-pointer"
                    onClick={() => deleteAssignment(row.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* =====================================================
         MODAL
      ===================================================== */}
      {showModal && (
        <Modal
          title={editingId ? "Edit Asset Assignment" : "Add Asset Assignment"}
          onClose={() => setShowModal(false)}
        >
          <div className="grid grid-cols-2 gap-4">

            {/* CATEGORY */}
            <div>
              <label className="soft-label">Category Name *</label>
              <select
                className="soft-input"
                value={form.asset_category_id}
                onChange={(e) => {
                  setForm({
                    ...form,
                    asset_category_id: e.target.value,
                    asset_id: "",
                  });
                  fetchAssets(e.target.value);
                }}
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* ASSET */}
            <div>
              <label className="soft-label">Asset *</label>
              <select
                className="soft-input"
                value={form.asset_id}
                onChange={(e) =>
                  setForm({ ...form, asset_id: e.target.value })
                }
              >
                <option value="">Select Asset</option>
                {assets.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>

            {/* QTY */}
            <div>
              <label className="soft-label">Assign Quantity *</label>
              <input
                className="soft-input"
                placeholder="Enter Assign Quantity"
                value={form.quantity}
                onChange={(e) =>
                  setForm({ ...form, quantity: e.target.value })
                }
              />
            </div>

            {/* DUE DATE */}
            <div>
              <label className="soft-label">Due Date</label>
              <input
                type="date"
                className="soft-input"
                value={form.due_date}
                onChange={(e) =>
                  setForm({ ...form, due_date: e.target.value })
                }
              />
            </div>

            {/* ASSIGN DATE */}
            <div>
              <label className="soft-label">Assign Date *</label>
              <input
                type="date"
                className="soft-input"
                value={form.assign_date}
                onChange={(e) =>
                  setForm({ ...form, assign_date: e.target.value })
                }
              />
            </div>

            {/* RETURN DATE */}
            <div>
              <label className="soft-label">Return Date</label>
              <input
                type="date"
                className="soft-input"
                value={form.return_date}
                onChange={(e) =>
                  setForm({ ...form, return_date: e.target.value })
                }
              />
            </div>

            {/* ROLE */}
            <div>
              <label className="soft-label">Role *</label>
              <select
                className="soft-select"
                value={form.role}
                onChange={(e) => {
                  const roleSlug = e.target.value;

                  setForm({
                    ...form,
                    role: roleSlug,
                    checkout_by: "",
                  });

                  fetchUsers(roleSlug);
                }}
              >
                <option value="">Select Role</option>

                {roles.map((r) => (
                  <option key={r.id} value={r.slug}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>


            {/* CHECKOUT BY */}
            <div>
              <label className="soft-label">Checkout By *</label>
              <select
                className="soft-input"
                value={form.checkout_by}
                onChange={(e) =>
                  setForm({ ...form, checkout_by: e.target.value })
                }
              >
                <option value="">Select user</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>

            {/* NOTE */}
            <div className="col-span-2">
              <label className="soft-label">Note</label>
              <input
                className="soft-input"
                placeholder="Enter Note"
                value={form.note}
                onChange={(e) =>
                  setForm({ ...form, note: e.target.value })
                }
              />
            </div>

          </div>

          <div className="flex justify-end gap-2 pt-6">
            <button
              className="soft-btn-outline"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
            <PrimaryButton
              name={editingId ? "Update Assignment" : "Assign"}
              onClick={saveAssignment}
            />
          </div>
        </Modal>
      )}
      </div>
    </>
  );
}
