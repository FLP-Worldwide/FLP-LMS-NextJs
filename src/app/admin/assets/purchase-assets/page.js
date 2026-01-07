"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { api } from "@/utils/api";

/* ---------------- FORM ---------------- */
const emptyForm = {
  supplier_id: "",
  category_id: "",
  asset_id: "",
  purchase_date: "",
  service_date: "",
  expiry_date: "",
  purchase_price: "",
  quantity: "",
  unit: "",
  purchased_by: "",
  file: null,
};


export default function PurchaseAssetsPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [suppliers, setSuppliers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [assets, setAssets] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  /* =====================================================
     FETCH LIST
  ===================================================== */

  const fetchPurchases = async () => {
    setLoading(true);
    try {
      const res = await api.get("/purchase-assets");
      setList(res.data?.data || []);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    const res = await api.get("/supplier-master");
    setSuppliers(res.data?.data || []);
  };

  const fetchSupplierCategories = async (supplierId) => {
    if (!supplierId) return setCategories([]);
    const res = await api.get(`/supplier-master/${supplierId}/categories`);
    setCategories(res.data?.data || []);
  };

  const fetchAssets = async (supplierId, categoryId) => {
    if (!supplierId || !categoryId) return setAssets([]);

    const params = new URLSearchParams();
    params.append("supplier_id", supplierId);
    params.append("category_ids[]", categoryId);

    const res = await api.get(`/assets?${params.toString()}`);
    setAssets(res.data?.data || []);
  };

  useEffect(() => {
    fetchPurchases();
    fetchSuppliers();
  }, []);

  /* =====================================================
     SAVE
  ===================================================== */

    const savePurchase = async () => {
    try {
        const fd = new FormData();

        // 🔹 MASTER FIELDS
        fd.append("supplier_id", form.supplier_id);
        fd.append("purchase_date", form.purchase_date);

        if (form.invoice_no) fd.append("invoice_no", form.invoice_no);
        if (form.remarks) fd.append("remarks", form.remarks);

        // 🔹 OPTIONAL FIELDS
        if (form.service_date) fd.append("service_date", form.service_date);
        if (form.expiry_date) fd.append("expiry_date", form.expiry_date);
        if (form.unit) fd.append("unit", form.unit);
        if (form.purchased_by) fd.append("purchased_by", form.purchased_by);
        if (form.file) fd.append("file", form.file);

        // 🔥 ITEMS ARRAY (BACKEND EXPECTS THIS)
        fd.append("items[0][asset_category_id]", form.category_id);
        fd.append("items[0][asset_id]", form.asset_id);
        fd.append("items[0][quantity]", form.quantity);
        fd.append("items[0][price]", form.purchase_price);

        if (editingId) {
        await api.post(`/purchase-assets/${editingId}?_method=PUT`, fd);
        } else {
        await api.post("/purchase-assets", fd);
        }

        setShowModal(false);
        setForm(emptyForm);
        setEditingId(null);
        fetchPurchases();
    } catch (err) {
        console.error(err);
        alert("Failed to save purchase");
    }
    };


  /* =====================================================
     DELETE
  ===================================================== */

  const deletePurchase = async (id) => {
    if (!confirm("Delete purchase?")) return;
    await api.delete(`/purchase-assets/${id}`);
    fetchPurchases();
  };

  /* =====================================================
     EDIT
  ===================================================== */

const openEdit = async (row) => {
  const item = row.items?.[0];

  setForm({
    supplier_id: row.supplier_id,
    category_id: item?.asset_category_id || "",
    asset_id: item?.asset_id || "",

    purchase_date: row.purchase_date || "",
    service_date: row.service_date || "",
    expiry_date: row.expiry_date || "",

    purchase_price: item?.price || "",
    quantity: item?.quantity || "",
    unit: row.unit || "",
    purchased_by: row.purchased_by || "",

    file: null,
  });

  await fetchSupplierCategories(row.supplier_id);
  await fetchAssets(row.supplier_id, item?.asset_category_id);

  setEditingId(row.id);
  setShowModal(true);
};


  /* =====================================================
     UI
  ===================================================== */

  return (
    <>
      {/* ACTION */}
      <div className="flex justify-end mb-4">
        <PrimaryButton
          name="+ Purchase Asset"
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
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center text-gray-500">
          No purchase records
        </div>
      ) : (
        <table className="w-full text-sm bg-white border border-gray-200 rounded-xl">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-4 py-2 text-left">Asset</th>
              <th className="px-4 py-2 text-left">Supplier</th>
              <th className="px-4 py-2 text-left">Qty</th>
              <th className="px-4 py-2 text-left">Unit</th>
              <th className="px-4 py-2 text-left">Price</th>
              <th className="px-4 py-2 text-left">Purchase Date</th>
              <th className="px-4 py-2 text-left">Service Date</th>
              <th className="px-4 py-2 text-left">Expiry Date</th>
              <th className="px-4 py-2 text-left">Purchased By</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {list.map((row) => {
                const item = row.items?.[0]; // single item purchase

                return (
                <tr key={row.id}>
                    {/* ASSET */}
                    <td className="px-4 py-2">
                    {item?.asset?.name || "-"}
                    </td>

                    {/* SUPPLIER */}
                    <td className="px-4 py-2">
                    {row.supplier?.company_name || "-"}
                    </td>

                    {/* QTY */}
                    <td className="px-4 py-2">
                    {item?.quantity ?? "-"}
                    </td>

                    {/* UNIT */}
                    <td className="px-4 py-2">
                    {row.unit || "-"}
                    </td>

                    {/* PRICE */}
                    <td className="px-4 py-2">
                    {item?.price || "-"}
                    </td>

                    {/* PURCHASE DATE */}
                    <td className="px-4 py-2">
                    {row.purchase_date || "-"}
                    </td>

                    {/* SERVICE DATE */}
                    <td className="px-4 py-2">
                    {row.service_date || "-"}
                    </td>

                    {/* EXPIRY DATE */}
                    <td className="px-4 py-2">
                    {row.expiry_date || "-"}
                    </td>

                    {/* PURCHASED BY */}
                    <td className="px-4 py-2">
                    {row.purchased_by || "-"}
                    </td>

                    {/* ACTION */}
                    <td className="px-4 py-2">
                    <EditOutlined
                        className="mr-3 text-blue-600 cursor-pointer"
                        onClick={() => openEdit(row)}
                    />
                    <DeleteOutlined
                        className="text-rose-600 cursor-pointer"
                        onClick={() => deletePurchase(row.id)}
                    />
                    </td>
                </tr>
                );
            })}
            </tbody>
        </table>
      )}

      {/* =====================================================
         MODAL
      ===================================================== */}
      {showModal && (
        <Modal
          title={editingId ? "Edit Purchase Asset" : "Add Purchase Asset"}
          onClose={() => setShowModal(false)}
        >
          <div className="grid grid-cols-3 gap-4">

            {/* SUPPLIER */}
            <div>
              <label className="soft-label">Supplier *</label>
              <select
                className="soft-select"
                value={form.supplier_id}
                onChange={(e) => {
                  const id = e.target.value;
                  setForm({
                    ...form,
                    supplier_id: id,
                    category_id: "",
                    asset_id: "",
                  });
                  fetchSupplierCategories(id);
                }}
              >
                <option value="">Select Supplier</option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.company_name}
                  </option>
                ))}
              </select>
            </div>

            {/* CATEGORY */}
            <div>
              <label className="soft-label">Category *</label>
              <select
                className="soft-select"
                value={form.category_id}
                onChange={(e) => {
                  const id = e.target.value;
                  setForm({ ...form, category_id: id, asset_id: "" });
                  fetchAssets(form.supplier_id, id);
                }}
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* ASSET */}
            <div>
              <label className="soft-label">Asset *</label>
              <select
                className="soft-select"
                value={form.asset_id}
                onChange={(e) =>
                  setForm({ ...form, asset_id: e.target.value })
                }
              >
                <option value="">Select Asset</option>
                {assets.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>

            {/* DATES */}
            <div>
                <label className="soft-label">Purchase Date *</label>
                <input type="date" className="soft-input" value={form.purchase_date}
                onChange={(e)=>setForm({...form,purchase_date:e.target.value})} />
            </div>
            <div>
                <label className="soft-label">Expiry Date *</label>
                <input type="date" className="soft-input" value={form.expiry_date}
                onChange={(e)=>setForm({...form,expiry_date:e.target.value})} />
            </div>
            <div>
                <label className="soft-label">Service Date *</label>
                <input type="date" className="soft-input" value={form.service_date}
                onChange={(e)=>setForm({...form,service_date:e.target.value})} />
            </div>
            {/* PRICE / QTY / UNIT */}
            <div>
                <label className="soft-label">Purchase Price *</label>
                <input className="soft-input" placeholder="Purchase Price"
                value={form.purchase_price}
                onChange={(e)=>setForm({...form,purchase_price:e.target.value})} />
            </div>
            <div>
                <label className="soft-label">Quantity *</label>
                <input className="soft-input" placeholder="Quantity"
                value={form.quantity}
                onChange={(e)=>setForm({...form,quantity:e.target.value})} />
            </div>

            <div>
                <label className="soft-label">Select Unit *</label>
                <select className="soft-select"
                value={form.unit}
                onChange={(e)=>setForm({...form,unit:e.target.value})}>
                <option value="">Select Unit</option>
                <option>Kg</option>
                <option>Piece</option>
                <option>Other</option>
                </select>
            </div>

            <div>
                <label className="soft-label">Upload File</label>

                {/* FILE */}
                <input type="file"
                onChange={(e)=>setForm({...form,file:e.target.files[0]})} />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-6">
            <button className="soft-btn-outline" onClick={()=>setShowModal(false)}>
              Cancel
            </button>
            <PrimaryButton
              name={editingId ? "Update Purchase" : "Purchase Asset"}
              onClick={savePurchase}
            />
          </div>
        </Modal>
      )}
    </>
  );
}
