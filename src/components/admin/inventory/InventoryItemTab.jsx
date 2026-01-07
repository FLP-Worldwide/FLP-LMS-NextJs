"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { api } from "@/utils/api";

export default function InventoryItemTab() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    item_name: "",
    inventory_category_id: "",
    buying_price: "",
    sale_price: "",
    tax_percentage: "",
    low_stock_indicator: "",
    description: "",
  });

  /* ================= FETCH DATA ================= */
  const fetchAll = async () => {
    try {
      const [i, c] = await Promise.all([
        api.get("/inventory/item"),
        api.get("/inventory/category"),
      ]);

      setItems(Array.isArray(i.data?.data) ? i.data?.data : []);
      setCategories(Array.isArray(c.data.data) ? c.data?.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  /* ================= SAVE ================= */
  const saveItem = async () => {
    if (!form.item_name || !form.inventory_category_id)
      return alert("Required fields missing");

    setLoading(true);
    try {
      if (editing) {
        await api.patch(`/inventory/item/${editing}`, form);
      } else {
        await api.post("/inventory/item", form);
      }

      fetchAll();
      setShow(false);
      setEditing(null);
      setForm({
        item_name: "",
        inventory_category_id: "",
        buying_price: "",
        sale_price: "",
        tax_percentage: "",
        low_stock_indicator: "",
        description: "",
      });
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ================= EDIT ================= */
  const edit = (i) => {
    setEditing(i.id);
    setForm({
      item_name: i.item_name || "",
      inventory_category_id: i.inventory_category_id || "",
      buying_price: i.buying_price || "",
      sale_price: i.sale_price || "",
      tax_percentage: i.tax_percentage || "",
      low_stock_indicator: i.low_stock_indicator || "",
      description: i.description || "",
    });
    setShow(true);
  };

  /* ================= DELETE ================= */
  const remove = async (id) => {
    if (!confirm("Delete item?")) return;

    try {
      await api.delete(`/inventory/item/${id}`);
      fetchAll();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <>
      {/* ADD BUTTON */}
      <div className="flex justify-end">
        <PrimaryButton name="+ Add Item" onClick={() => setShow(true)} />
      </div>

      {/* TABLE */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-4 py-2 text-left">Item</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-center">Total Units</th>
              <th className="px-4 py-2 text-center">Available Units</th>
              <th className="px-4 py-2 text-center">
                Buying Price (Rs)
                <div className="text-xs text-gray-500">(Unit Price)</div>
              </th>
              <th className="px-4 py-2 text-center">
                Sale Price (Rs)
                <div className="text-xs text-gray-500">(Unit Price)</div>
              </th>
              <th className="px-4 py-2 text-center">Tax (%)</th>
              <th className="px-4 py-2 text-center">Low Stock</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {items.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-6 text-gray-500">
                  No items found
                </td>
              </tr>
            ) : (
              items.map((i) => (
                <tr key={i.id}>
                  <td className="px-4 py-2">{i.item_name}</td>

                  <td className="px-4 py-2">
                    {categories.find(c => c.id === i.inventory_category_id)?.category_name || "—"}
                  </td>

                  {/* TOTAL UNITS (default 0 for now) */}
                  <td className="px-4 py-2 text-center">
                    {i.total_units ?? 0}
                  </td>

                  {/* AVAILABLE UNITS (red when 0) */}
                  <td className="px-4 py-2 text-center text-red-500 font-medium">
                    {i.available_units ?? 0}
                  </td>

                  <td className="px-4 py-2 text-center">
                    {i.buying_price}
                  </td>

                  <td className="px-4 py-2 text-center">
                    {i.sale_price}
                  </td>

                  <td className="px-4 py-2 text-center">
                    {i.tax_percentage}
                  </td>

                  <td className="px-4 py-2 text-center">
                    {i.low_stock_indicator}
                  </td>

                  <td className="px-4 py-2 text-right">
                    <EditOutlined
                      className="mr-3 text-blue-600 cursor-pointer"
                      onClick={() => edit(i)}
                    />
                    <DeleteOutlined
                      className="text-rose-600 cursor-pointer"
                      onClick={() => remove(i.id)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>


      {/* MODAL */}
      {show && (
        <Modal title="Add Item" onClose={() => setShow(false)}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="soft-label">Item *</label>
              <input
                className="soft-input"
                placeholder="Enter Item Name"
                value={form.item_name}
                onChange={(e) =>
                  setForm({ ...form, item_name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="soft-label">Category *</label>
              <select
                className="soft-select"
                value={form.inventory_category_id}
                onChange={(e) =>
                  setForm({ ...form, inventory_category_id: e.target.value })
                }
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.category_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="soft-label">Buying Price *</label>
              <input
                className="soft-input"
                placeholder="Enter Buying Price"
                value={form.buying_price}
                onChange={(e) =>
                  setForm({ ...form, buying_price: e.target.value })
                }
              />
            </div>

            <div>
              <label className="soft-label">Sale Price *</label>
              <input
                className="soft-input"
                placeholder="Enter Sale Price"
                value={form.sale_price}
                onChange={(e) =>
                  setForm({ ...form, sale_price: e.target.value })
                }
              />
            </div>

            <div>
              <label className="soft-label">Tax (%) *</label>
              <input
                className="soft-input"
                placeholder="Enter tax percentage"
                value={form.tax_percentage}
                onChange={(e) =>
                  setForm({ ...form, tax_percentage: e.target.value })
                }
              />
            </div>

            <div>
              <label className="soft-label">Low Stock *</label>
              <input
                className="soft-input"
                placeholder="Enter low stock indicator"
                value={form.low_stock_indicator}
                onChange={(e) =>
                  setForm({ ...form, low_stock_indicator: e.target.value })
                }
              />
            </div>

            <div className="col-span-2">
              <label className="soft-label">Description</label>
              <textarea
                className="soft-input"
                placeholder="Enter description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <PrimaryButton
              name={editing ? "Update Item" : "Add Item"}
              onClick={saveItem}
              disabled={loading}
            />
          </div>
        </Modal>
      )}
    </>
  );
}
