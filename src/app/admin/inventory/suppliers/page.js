"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { api } from "@/utils/api";

export default function SupplierPage() {
  /* ================= STATE ================= */
  const [suppliers, setSuppliers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    company: "",
    supplier: "",
    email: "",
    mobile: "",
    address: "",
  });

  /* ================= FETCH ================= */
  const fetchSuppliers = async () => {
    const res = await api.get("/inventory/suppliers");
    setSuppliers(Array.isArray(res.data?.data) ? res.data.data : []);
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const openCreate = () => {
    setForm({
      company: "",
      supplier: "",
      email: "",
      mobile: "",
      address: "",
    });
    setEditingId(null);
    setShowModal(true);
  };

  const saveSupplier = async () => {
    if (!form.company || !form.supplier || !form.email || !form.mobile) {
      return alert("Please fill all required fields");
    }

    if (editingId) {
      await api.put(`/inventory/suppliers/${editingId}`, form);
    } else {
      await api.post("/inventory/suppliers", form);
    }

    setShowModal(false);
    fetchSuppliers();
  };

  const deleteSupplier = async (id) => {
    if (!confirm("Delete supplier?")) return;
    await api.delete(`/inventory/suppliers/${id}`);
    fetchSuppliers();
  };

  /* ================= UI ================= */
  return (
    <div className="space-y-3">
      {/* HEADER ACTION */}
      <div className="flex justify-end">
        <PrimaryButton name="+ Add Supplier" onClick={openCreate} />
      </div>

      {/* TABLE */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Company Name</th>
              <th className="px-4 py-2 text-left">Supplier Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Mobile</th>
              <th className="px-4 py-2 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {suppliers.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="px-4 py-10 text-center text-gray-400"
                >
                  No Data Found !
                </td>
              </tr>
            ) : (
              suppliers.map((s) => (
                <tr key={s.id}>
                  <td className="px-4 py-2">{s.company}</td>
                  <td className="px-4 py-2">{s.supplier}</td>
                  <td className="px-4 py-2">{s.email}</td>
                  <td className="px-4 py-2">{s.mobile}</td>
                  <td className="px-4 py-2 text-right">
                    <EditOutlined
                      className="mr-3 text-blue-600 cursor-pointer"
                      onClick={() => {
                        setForm({
                          company: s.company,
                          supplier: s.supplier,
                          email: s.email,
                          mobile: s.mobile,
                          address: s.address || "",
                        });
                        setEditingId(s.id);
                        setShowModal(true);
                      }}
                    />
                    <DeleteOutlined
                      className="text-rose-600 cursor-pointer"
                      onClick={() => deleteSupplier(s.id)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <Modal title="Add Supplier" onClose={() => setShowModal(false)}>
          <div className="grid grid-cols-2 gap-4">
            {/* COMPANY */}
            <div>
              <label className="soft-label">
                Company <span className="text-red-500">*</span>
              </label>
              <input
                name="company"
                value={form.company}
                onChange={handleChange}
                className="soft-input"
                placeholder="Enter Company Name"
              />
            </div>

            {/* SUPPLIER */}
            <div>
              <label className="soft-label">
                Supplier <span className="text-red-500">*</span>
              </label>
              <input
                name="supplier"
                value={form.supplier}
                onChange={handleChange}
                className="soft-input"
                placeholder="Enter Supplier Name"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="soft-label">
                Email ID <span className="text-red-500">*</span>
              </label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                className="soft-input"
                placeholder="For Ex. abc@gmail.com"
              />
            </div>

            {/* MOBILE */}
            <div>
              <label className="soft-label">
                Mobile <span className="text-red-500">*</span>
              </label>
              <input
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                className="soft-input"
                placeholder="Enter Mobile Number"
              />
            </div>

            {/* ADDRESS */}
            <div className="col-span-2">
              <label className="soft-label">Address</label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                className="soft-input"
                placeholder="Enter company address"
              />
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-2 pt-6">
            <button
              className="soft-btn-outline"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
            <PrimaryButton
              name={editingId ? "Update Supplier" : "Add Supplier"}
              onClick={saveSupplier}
            />
          </div>
        </Modal>
      )}
    </div>
  );
}
