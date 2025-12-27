"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { api } from "@/utils/api";

const emptyForm = {
  title: "Mr.",
  display_name: "",
  name: "",
  vendor_type: "Supplier",
  email: "",
  contact_no: "",
  address: "",
};

export default function PayeeTab() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  /* ---------------- FETCH ---------------- */
  const fetchPayees = async () => {
    setLoading(true);
    try {
      const res = await api.get("/finance/payee");
      setList(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayees();
  }, []);

  /* ---------------- SAVE ---------------- */
  const savePayee = async () => {
    try {
      if (editingId) {
        await api.patch(`/finance/payee/${editingId}`, form);
      } else {
        await api.post("/finance/payee", form);
      }
      setShowModal(false);
      setForm(emptyForm);
      setEditingId(null);
      fetchPayees();
    } catch (e) {
      alert("Failed to save payee");
    }
  };

  /* ---------------- DELETE ---------------- */
  const deletePayee = async (id) => {
    if (!confirm("Delete payee?")) return;
    await api.delete(`/finance/payee/${id}`);
    fetchPayees();
  };

  /* ---------------- EDIT ---------------- */
  const openEdit = (p) => {
    setForm({
      title: p.title || "Mr.",
      display_name: p.display_name || "",
      name: p.name || "",
      vendor_type: p.vendor_type || "Supplier",
      email: p.email || "",
      contact_no: p.contact_no || "",
      address: p.address || "",
    });
    setEditingId(p.id);
    setShowModal(true);
  };

  return (
    <>
      {/* ADD BUTTON */}
      <div className="flex justify-end">
        <PrimaryButton
          name="+ Add Payee"
          onClick={() => {
            setForm(emptyForm);
            setEditingId(null);
            setShowModal(true);
          }}
        />
      </div>

      {/* TABLE / EMPTY STATE */}
      {loading ? (
        <div className="text-sm text-gray-500">Loading...</div>
      ) : list.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-sm text-gray-500 text-center">
          No payee data available
        </div>
      ) : (
        <table className="w-full text-sm bg-white border border-gray-200 rounded-xl">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Vendor Type</th>
              <th className="px-4 py-2 text-left">Contact</th>
              <th className="px-4 py-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {list.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-2">{p.display_name}</td>
                <td className="px-4 py-2">{p.vendor_type}</td>
                <td className="px-4 py-2">{p.contact_no}</td>
                <td className="px-4 py-2 text-right">
                  <EditOutlined
                    className="mr-3 text-blue-600 cursor-pointer"
                    onClick={() => openEdit(p)}
                  />
                  <DeleteOutlined
                    className="text-rose-600 cursor-pointer"
                    onClick={() => deletePayee(p.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* MODAL */}
      {showModal && (
        <Modal title="Add Payee" onClose={() => setShowModal(false)}>
          <div className="grid grid-cols-3 gap-4">
            {/* TITLE */}
            <div>
              <label className="soft-label">Title</label>
              <select
                className="soft-select"
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
              >
                <option>Mr.</option>
                <option>Ms.</option>
              </select>
            </div>

            {/* DISPLAY NAME */}
            <div>
              <label className="soft-label">
                Display Payee Name <span className="text-red-500">*</span>
              </label>
              <input
                className="soft-input"
                value={form.display_name}
                onChange={(e) =>
                  setForm({ ...form, display_name: e.target.value })
                }
              />
            </div>

            {/* PAYEE NAME */}
            <div>
              <label className="soft-label">Payee Name</label>
              <input
                className="soft-input"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />
            </div>

            {/* VENDOR TYPE */}
            <div>
              <label className="soft-label">Vendor Type</label>
              <select
                className="soft-select"
                value={form.vendor_type}
                onChange={(e) =>
                  setForm({ ...form, vendor_type: e.target.value })
                }
              >
                <option>Supplier</option>
                <option>Employee</option>
              </select>
            </div>

            {/* EMAIL */}
            <div>
              <label className="soft-label">Email ID</label>
              <input
                className="soft-input"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />
            </div>

            {/* CONTACT */}
            <div>
              <label className="soft-label">
                Primary Contact No. <span className="text-red-500">*</span>
              </label>
              <input
                className="soft-input"
                value={form.contact_no}
                onChange={(e) =>
                  setForm({ ...form, contact_no: e.target.value })
                }
              />
            </div>

            {/* ADDRESS */}
            <div className="col-span-3">
              <label className="soft-label">Address</label>
              <input
                className="soft-input"
                value={form.address}
                onChange={(e) =>
                  setForm({ ...form, address: e.target.value })
                }
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              className="soft-btn-outline"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
            <PrimaryButton name="Save" onClick={savePayee} />
          </div>
        </Modal>
      )}
    </>
  );
}
