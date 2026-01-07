"use client";

import { useEffect, useState } from "react";
import { api } from "@/utils/api";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { DeleteOutlined } from "@ant-design/icons";
import Link from "next/link";

export default function PurchaseCreatePage() {
  /* ================= MASTER ================= */
  const [suppliers, setSuppliers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);


  /* ================= FORM ================= */
  const [form, setForm] = useState({
    supplier_id: "",
    date: "",
    reference_no: "",
    description: "",
    bill_copy: null,
    category_id: "",
    item_id: "",
  });

  /* ================= PURCHASE ITEMS ================= */
  const [purchaseItems, setPurchaseItems] = useState([]);

  /* ================= FETCH ================= */
  useEffect(() => {
    fetchInitial();
  }, []);

  const fetchInitial = async () => {
    const [s, c] = await Promise.all([
      api.get("/inventory/suppliers"),
      api.get("/inventory/category"),
    ]);

    setSuppliers(s.data?.data || []);
    setCategories(c.data?.data || []);
  };

  /* ================= CATEGORY CHANGE ================= */
  const onCategoryChange = async (categoryId) => {
    setForm({ ...form, category_id: categoryId, item_id: "" });

    if (!categoryId) {
      setItems([]);
      return;
    }

    const res = await api.get("/inventory/item", {
      params: { category_id: categoryId },
    });

    setItems(res.data?.data || []);
  };

  /* ================= ADD ITEM ================= */
  const addItem = () => {
    if (!form.item_id) return;

    const item = items.find((i) => i.id == form.item_id);
    if (!item) return;

    // Prevent duplicate
    if (purchaseItems.some((p) => p.item_id === item.id)) {
      alert("Item already added");
      return;
    }

    setPurchaseItems([
      ...purchaseItems,
      {
        item_id: item.id,
        item_name: item.item_name,
        unit_price: item.buying_price,
        units: 1,
      },
    ]);

    setForm({ ...form, item_id: "" });
  };

  /* ================= UPDATE ITEM ================= */
  const updateItem = (id, field, value) => {
    setPurchaseItems(
      purchaseItems.map((i) =>
        i.item_id === id ? { ...i, [field]: value } : i
      )
    );
  };

  /* ================= REMOVE ITEM ================= */
  const removeItem = (id) => {
    setPurchaseItems(purchaseItems.filter((i) => i.item_id !== id));
  };

  /* ================= TOTAL ================= */
  const totalAmount = purchaseItems.reduce(
    (sum, i) => sum + i.unit_price * i.units,
    0
  );

    const handleSubmit = async () => {
    try {
        // basic frontend validation
        if (!form.supplier_id || !form.date || !form.reference_no || !form.bill_copy) {
        alert("Please fill all required fields");
        return;
        }

        if (purchaseItems.length === 0) {
        alert("Please add at least one item");
        return;
        }

        setLoading(true);

        const payload = new FormData();

        payload.append("supplier_id", form.supplier_id);
        payload.append("date", form.date);
        payload.append("reference_no", form.reference_no);
        payload.append("description", form.description || "");
        payload.append("bill_copy", form.bill_copy);

        purchaseItems.forEach((i, index) => {
        payload.append(`items[${index}][inventory_item_id]`, i.item_id);
        payload.append(`items[${index}][inventory_category_id]`, form.category_id);
        payload.append(`items[${index}][unit_price]`, i.unit_price);
        payload.append(`items[${index}][units]`, i.units);
        });

        await api.post("/inventory/purchase", payload, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        });

        alert("Purchase added successfully");

        // redirect back
        window.location.href = "/admin/inventory/purchase";
    } catch (error) {
        console.error(error);
        alert(
        error?.response?.data?.message ||
            "Something went wrong while saving purchase"
        );
    } finally {
        setLoading(false);
    }
    };


  return (
    <div className="space-y-4">
      {/* BREADCRUMB */}
      <div className="text-sm text-gray-500">
        <Link href="/admin/inventory/purchase">Purchase Item</Link> › Add Purchase
      </div>

      {/* HEADER */}
      <h2 className="text-xl font-semibold">Purchase</h2>

      {/* ================= BASIC DETAILS ================= */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 grid grid-cols-3 gap-4">
        {/* SUPPLIER */}
        <div>
          <label className="soft-label">
            Company Name <span className="text-red-500">*</span>
          </label>
          <select
            className="soft-select"
            value={form.supplier_id}
            onChange={(e) =>
              setForm({ ...form, supplier_id: e.target.value })
            }
          >
            <option value="">Select Company</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.company}
              </option>
            ))}
          </select>
        </div>

        {/* DATE */}
        <div>
          <label className="soft-label">
            Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            className="soft-input"
            value={form.date}
            onChange={(e) =>
              setForm({ ...form, date: e.target.value })
            }
          />
        </div>

        {/* REFERENCE */}
        <div>
          <label className="soft-label">
            Reference No. <span className="text-red-500">*</span>
          </label>
          <input
            className="soft-input"
            placeholder="Enter Reference Number"
            value={form.reference_no}
            onChange={(e) =>
              setForm({ ...form, reference_no: e.target.value })
            }
          />
        </div>

        {/* BILL */}
        <div>
          <label className="soft-label">
            Bill copy <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            className="soft-input"
            onChange={(e) =>
              setForm({ ...form, bill_copy: e.target.files[0] })
            }
          />
        </div>

        {/* DESCRIPTION */}
        <div className="col-span-2">
          <label className="soft-label">
            Description <span className="text-red-500">*</span>
          </label>
          <input
            className="soft-input"
            placeholder="Enter Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />
        </div>
      </div>

      {/* ================= ITEM SELECT ================= */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 grid grid-cols-2 gap-4">
        <div>
          <label className="soft-label">
            Select Item Category <span className="text-red-500">*</span>
          </label>
          <select
            className="soft-select"
            value={form.category_id}
            onChange={(e) => onCategoryChange(e.target.value)}
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
          <label className="soft-label">
            Select Item <span className="text-red-500">*</span>
          </label>
          <select
            className="soft-select"
            value={form.item_id}
            onChange={(e) =>
              setForm({ ...form, item_id: e.target.value })
            }
            disabled={!form.category_id}
          >
            <option value="">Select Item</option>
            {items.map((i) => (
              <option key={i.id} value={i.id}>
                {i.item_name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-span-2 flex justify-end">
          <PrimaryButton name="Add Item" onClick={addItem} />
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-4 py-2 text-left">Item</th>
              <th className="px-4 py-2 text-left">Unit Price (Rs)</th>
              <th className="px-4 py-2 text-left">Units</th>
              <th className="px-4 py-2 text-left">Sub-total (Rs)</th>
              <th className="px-4 py-2 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {purchaseItems.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="py-6 text-center text-gray-500"
                >
                  No items added
                </td>
              </tr>
            ) : (
              purchaseItems.map((i) => (
                <tr key={i.item_id}>
                  <td className="px-4 py-2">{i.item_name}</td>

                  <td className="px-4 py-2">
                    <input
                      className="soft-input w-28"
                      value={i.unit_price}
                      onChange={(e) =>
                        updateItem(
                          i.item_id,
                          "unit_price",
                          Number(e.target.value)
                        )
                      }
                    />
                  </td>

                  <td className="px-4 py-2">
                    <input
                      className="soft-input w-20"
                      value={i.units}
                      onChange={(e) =>
                        updateItem(
                          i.item_id,
                          "units",
                          Number(e.target.value)
                        )
                      }
                    />
                  </td>

                  <td className="px-4 py-2">
                    Rs {(i.unit_price * i.units).toFixed(2)}
                  </td>

                  <td className="px-4 py-2 text-right">
                    <DeleteOutlined
                      className="text-red-500 cursor-pointer"
                      onClick={() => removeItem(i.item_id)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* FOOTER */}
      <div className="flex justify-between items-center">
        <Link href="/admin/inventory/purchase" className="text-sm">
          Back
        </Link>

        <PrimaryButton
        name={loading ? "Saving..." : `Add Purchase (Rs ${totalAmount})`}
        onClick={handleSubmit}
        disabled={loading}
        />

      </div>
    </div>
  );
}
