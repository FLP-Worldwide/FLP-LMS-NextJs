"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { api } from "@/utils/api";
import MultiSelectDropdown from "@/components/ui/MultiSelectDropdown";

/* ---------------- FORMS ---------------- */
const emptyForm = {
  company_name: "",
  email: "",
  mobile: "",
  contact_person: "",
  address: "",
  category_ids: [],
  asset_item_ids: [],
};

export default function SupplierMasterPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const [categories, setCategories] = useState([]);
  const [assets, setAssets] = useState([]);

  /* =====================================================
     FETCH
  ===================================================== */

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/supplier-master");
      setList(res.data?.data || []);
    } finally {
      setLoading(false);
    }
  };

    const categoryOptions = categories.map(c => ({
    id: c.id,
    name: c.name,
    }));

    const assetOptions = assets.map(a => ({
    id: a.id,
    name: a.name,
    }));



  const fetchCategories = async () => {
    const res = await api.get("/asset-categories");
    setCategories(res.data?.data || []);
  };

    const fetchAssets = async (categoryIds = [], search = "") => {
    if (!categoryIds.length) {
        setAssets([]);
        return;
    }

    const params = new URLSearchParams();

    if (categoryIds.length === 1) {
        params.append("category_id", categoryIds[0]);
    } else {
        categoryIds.forEach((id) =>
        params.append("category_ids[]", id)
        );
    }

    if (search) {
        params.append("search", search);
    }

    const res = await api.get(`/assets?${params.toString()}`);
    setAssets(res.data?.data || []);
    };


  useEffect(() => {
    fetchSuppliers();
    fetchCategories();

  }, []);

  /* =====================================================
     SAVE
  ===================================================== */

  const saveSupplier = async () => {
    try {
      if (editingId) {
        await api.patch(`/supplier-master/${editingId}`, form);
      } else {
        await api.post("/supplier-master", form);
      }

      setShowModal(false);
      setForm(emptyForm);
      setEditingId(null);
      fetchSuppliers();
    } catch {
      alert("Failed to save supplier");
    }
  };

  /* =====================================================
     DELETE
  ===================================================== */

  const deleteSupplier = async (id) => {
    if (!confirm("Delete supplier?")) return;
    await api.delete(`/supplier-master/${id}`);
    fetchSuppliers();
  };

  /* =====================================================
     EDIT
  ===================================================== */

    const openEdit = (s) => {
    const categoryIds = s.categories?.map(c => c.id) || [];

    setForm({
        company_name: s.company_name || "",
        email: s.email || "",
        mobile: s.mobile || "",
        contact_person: s.contact_person || "",
        address: s.address || "",
        category_ids: categoryIds,
        asset_item_ids: s.asset_items?.map(a => a.id) || [],
    });

    // 🔥 fetch assets for existing categories
    fetchAssets(categoryIds);

    setEditingId(s.id);
    setShowModal(true);
    };

  /* =====================================================
     MULTI SELECT HELPERS
  ===================================================== */

  const toggleMulti = (key, id) => {
    setForm((prev) => ({
      ...prev,
      [key]: prev[key].includes(id)
        ? prev[key].filter((x) => x !== id)
        : [...prev[key], id],
    }));
  };

  /* =====================================================
     UI
  ===================================================== */

  return (
    <>
      {/* ACTION */}
      <div className="flex justify-end mb-4">
        <PrimaryButton
          name="+ Add Supplier"
          onClick={() => {
            setForm(emptyForm);
            setEditingId(null);
            setShowModal(true);
          }}
        />
      </div>

      {/* TABLE */}
      {loading ? (
        <div className="text-sm text-gray-500">Loading...</div>
      ) : list.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-sm text-gray-500 text-center">
          No supplier available
        </div>
      ) : (
        <table className="w-full text-sm bg-white border border-gray-200 rounded-xl">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Company</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Mobile</th>
              <th className="px-4 py-2 text-left">Contact Person</th>
              <th className="px-4 py-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {list.map((s) => (
              <tr key={s.id}>
                <td className="px-4 py-2">{s.company_name}</td>
                <td className="px-4 py-2">{s.email}</td>
                <td className="px-4 py-2">{s.mobile}</td>
                <td className="px-4 py-2">{s.contact_person}</td>
                <td className="px-4 py-2 text-right">
                  <EditOutlined
                    className="mr-3 text-blue-600 cursor-pointer"
                    onClick={() => openEdit(s)}
                  />
                  <DeleteOutlined
                    className="text-rose-600 cursor-pointer"
                    onClick={() => deleteSupplier(s.id)}
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
          title={editingId ? "Edit Supplier" : "Add Supplier"}
          onClose={() => setShowModal(false)}
        >
          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className="soft-label">Company Name *</label>
              <input
                className="soft-input"
                value={form.company_name}
                onChange={(e) =>
                  setForm({ ...form, company_name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="soft-label">Email *</label>
              <input
                className="soft-input"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />
            </div>

            <div>
              <label className="soft-label">Mobile *</label>
              <input
                className="soft-input"
                value={form.mobile}
                onChange={(e) =>
                  setForm({ ...form, mobile: e.target.value })
                }
              />
            </div>

            <div>
              <label className="soft-label">Contact Person *</label>
              <input
                className="soft-input"
                value={form.contact_person}
                onChange={(e) =>
                  setForm({ ...form, contact_person: e.target.value })
                }
              />
            </div>

            {/* CATEGORY MULTI */}
           <div>
            <label className="soft-label">Category Name *</label>
            <MultiSelectDropdown
            options={categoryOptions}
            value={form.category_ids}
            onChange={(vals) => {
                // 1️⃣ Update category selection
                setForm((prev) => ({
                ...prev,
                category_ids: vals,
                asset_item_ids: [], // 🔥 reset asset selection
                }));

                // 2️⃣ Fetch assets based on selected categories
                fetchAssets(vals);
            }}
            placeholder="Select Category"
            />


            </div>


            {/* ASSET MULTI */}
            <div>
            <label className="soft-label">Asset Provided</label>
           <MultiSelectDropdown
                options={assetOptions}
                value={form.asset_item_ids}
                onChange={(vals) =>
                    setForm((prev) => ({ ...prev, asset_item_ids: vals }))
                }
                placeholder={
                    form.category_ids.length === 0
                    ? "Select category first"
                    : "Select Assets"
                }
                />


            </div>


            <div className="col-span-2">
              <label className="soft-label">Address *</label>
              <input
                className="soft-input"
                value={form.address}
                onChange={(e) =>
                  setForm({ ...form, address: e.target.value })
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
              name={editingId ? "Update Supplier" : "Add Supplier"}
              onClick={saveSupplier}
            />
          </div>
        </Modal>
      )}
    </>
  );
}
