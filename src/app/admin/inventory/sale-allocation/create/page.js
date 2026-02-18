"use client";

import { useEffect, useState } from "react";
import { api } from "@/utils/api";
import { DeleteOutlined } from "@ant-design/icons";
import PrimaryButton from "@/components/ui/PrimaryButton";

export default function Page() {
  /* ================= MASTER ================= */
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [staff, setStaff] = useState([]);

  /* ================= BASIC FORM ================= */
  const [form, setForm] = useState({
    designation: "",
    user_id: "",
    reference_no: "",
    date: "",
    payment_status: "",
    description: "",
    bill_copy: "",
    category_id: "",
    item_id: "",
  });

  /* ================= PAYMENT ================= */
  const [payment, setPayment] = useState({
    reference_no: "",
    amount: "",
    method: "",
    date: "",
    receipt: null,
  });

  /* ================= SALE ITEMS ================= */
  const [saleItems, setSaleItems] = useState([]);

  /* ================= FETCH CATEGORY ================= */
  useEffect(() => {
    api.get("/inventory/category").then((res) => {
      setCategories(res.data?.data || []);
    });
  }, []);

  /* ================= FETCH STAFF ================= */
  useEffect(() => {
    api.get("/teachers").then((res) => {
      setStaff(res.data?.data || []);
    });
  }, []);

  /* ================= DESIGNATIONS ================= */
  const designations = [
    ...new Set(staff.map((s) => s.designation)),
  ];

  const filteredStaff = form.designation
    ? staff.filter(
        (s) => s.designation === form.designation
      )
    : [];

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

    if (saleItems.some((i) => i.item_id === item.id)) return;

    setSaleItems([
      ...saleItems,
      {
        id: Date.now(),
        item_id: item.id,
        item_name: item.item_name,
        sale_type: "paid",
        price: Number(item.sale_price || 0),
        units: 1,
        tax: Number(item.tax_percentage || 0),
      },
    ]);

    setForm({ ...form, item_id: "" });
  };

  /* ================= UPDATE ITEM ================= */
  const updateItem = (id, field, value) => {
    setSaleItems(
      saleItems.map((i) => {
        if (i.id !== id) return i;

        if (field === "sale_type" && value === "free") {
          return { ...i, sale_type: value, price: 0 };
        }

        return { ...i, [field]: value };
      })
    );
  };

  /* ================= REMOVE ITEM ================= */
  const removeItem = (id) => {
    setSaleItems(saleItems.filter((i) => i.id !== id));
  };

  /* ================= TOTAL ================= */
  const totalAmount = saleItems.reduce((s, i) => {
    const base =
      i.sale_type === "free" ? 0 : i.price * i.units;
    const tax = (base * i.tax) / 100;
    return s + base + tax;
  }, 0);

  /* ================= SUBMIT ================= */
  const submit = async () => {
    try {
      if (
        !form.designation ||
        !form.user_id ||
        !form.reference_no ||
        !form.date
      ) {
        alert("Please fill all required fields");
        return;
      }

      if (saleItems.length === 0) {
        alert("Please add at least one item");
        return;
      }

      if (
        form.payment_status === "paid" &&
        (!payment.method ||
          !payment.amount ||
          !payment.date)
      ) {
        alert("Please fill payment details");
        return;
      }

      const payload = new FormData();

      payload.append("role", 'staff');
      payload.append("user_id", form.user_id);
      payload.append("reference_no", form.reference_no);
      payload.append("date", form.date);
      payload.append("payment_status", form.payment_status);
      payload.append("description", form.description || "");
      payload.append("bill_copy", form.bill_copy || "");

      saleItems.forEach((i, index) => {
        payload.append(
          `items[${index}][inventory_item_id]`,
          i.item_id
        );
        payload.append(`items[${index}][sale_type]`, i.sale_type);
        payload.append(
          `items[${index}][sale_price]`,
          i.sale_type === "free" ? 0 : i.price
        );
        payload.append(`items[${index}][units]`, i.units);
        payload.append(
          `items[${index}][tax_percentage]`,
          i.tax
        );
      });

      if (form.payment_status === "paid") {
        payload.append(
          "payment[reference_no]",
          payment.reference_no || ""
        );
        payload.append("payment[amount]", payment.amount);
        payload.append(
          "payment[payment_method]",
          payment.method
        );
        payload.append("payment[date]", payment.date);

        if (payment.receipt) {
          payload.append("payment[receipt]", payment.receipt);
        }
      }

      await api.post("/inventory/sale", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Sale saved successfully");
    } catch (err) {
      alert(
        err?.response?.data?.message ||
          "Something went wrong"
      );
    }
  };

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-xl font-semibold">Add Sale</h2>

      <div className="grid grid-cols-3 gap-6">
        {/* LEFT FORM */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <div>
            <label className="soft-label">Designation *</label>
            <select
              className="soft-select"
              value={form.designation}
              onChange={(e) =>
                setForm({
                  ...form,
                  designation: e.target.value,
                  user_id: "",
                })
              }
            >
              <option value="">Select Designation</option>
              {designations.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="soft-label">Staff *</label>
            <select
              className="soft-select"
              value={form.user_id}
              disabled={!form.designation}
              onChange={(e) =>
                setForm({
                  ...form,
                  user_id: e.target.value,
                })
              }
            >
              <option value="">Select Staff</option>
              {filteredStaff.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="soft-label">Reference No *</label>
            <input
              className="soft-input"
              value={form.reference_no}
              onChange={(e) =>
                setForm({
                  ...form,
                  reference_no: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="soft-label">Date *</label>
            <input
              type="date"
              className="soft-input"
              value={form.date}
              onChange={(e) =>
                setForm({ ...form, date: e.target.value })
              }
            />
          </div>

          <div>
            <label className="soft-label">Payment Status *</label>
            <select
              className="soft-select"
              value={form.payment_status}
              onChange={(e) =>
                setForm({
                  ...form,
                  payment_status: e.target.value,
                })
              }
            >
              <option value="">Select Status</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Pending</option>
            </select>
          </div>

          <div>
            <label className="soft-label">Description</label>
            <textarea
              className="soft-input"
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
            />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="col-span-2 space-y-6">
          {/* CATEGORY / ITEM */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <select
                className="soft-select"
                value={form.category_id}
                onChange={(e) => onCategoryChange(e.target.value)}
              >
                <option value="">Select Category *</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.category_name}
                  </option>
                ))}
              </select>

              <select
                className="soft-select"
                value={form.item_id}
                disabled={!form.category_id}
                onChange={(e) =>
                  setForm({ ...form, item_id: e.target.value })
                }
              >
                <option value="">Select Item *</option>
                {items.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.item_name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={addItem}
              className="text-sm text-blue-600"
            >
              + Add Item
            </button>
          </div>

          {/* ITEMS TABLE */}
          {saleItems.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="px-4 py-3">Item</th>
                    <th className="px-4 py-3">Sale Type</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Units</th>
                    <th className="px-4 py-3">Tax</th>
                    <th className="px-4 py-3">Subtotal</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {saleItems.map((i) => {
                    const base =
                      i.sale_type === "free"
                        ? 0
                        : i.price * i.units;
                    const tax = (base * i.tax) / 100;
                    const sub = base + tax;

                    return (
                      <tr key={i.id}>
                        <td className="px-4 py-2">{i.item_name}</td>
                        <td className="px-4 py-2">
                          <select
                            className="soft-select"
                            value={i.sale_type}
                            onChange={(e) =>
                              updateItem(
                                i.id,
                                "sale_type",
                                e.target.value
                              )
                            }
                          >
                            <option value="paid">Paid</option>
                            <option value="free">Free</option>
                          </select>
                        </td>
                        <td className="px-4 py-2">
                          <input
                            className="soft-input"
                            value={i.price}
                            disabled={i.sale_type === "free"}
                            onChange={(e) =>
                              updateItem(
                                i.id,
                                "price",
                                Number(e.target.value)
                              )
                            }
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            className="soft-input"
                            value={i.units}
                            onChange={(e) =>
                              updateItem(
                                i.id,
                                "units",
                                Number(e.target.value)
                              )
                            }
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            className="soft-input"
                            value={i.tax}
                            onChange={(e) =>
                              updateItem(
                                i.id,
                                "tax",
                                Number(e.target.value)
                              )
                            }
                          />
                        </td>
                        <td className="px-4 py-2">
                          Rs {sub.toFixed(2)}
                        </td>
                        <td className="px-4 py-2 text-center">
                          <DeleteOutlined
                            className="text-red-500 cursor-pointer"
                            onClick={() => removeItem(i.id)}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* PAYMENT DETAILS */}
          {form.payment_status === "paid" && (
            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <input
                  className="soft-input"
                  placeholder="Reference No"
                  value={payment.reference_no}
                  onChange={(e) =>
                    setPayment({
                      ...payment,
                      reference_no: e.target.value,
                    })
                  }
                />
                <input
                  className="soft-input"
                  placeholder="Amount"
                  value={payment.amount}
                  onChange={(e) =>
                    setPayment({
                      ...payment,
                      amount: e.target.value,
                    })
                  }
                />
                <select
                  className="soft-select"
                  value={payment.method}
                  onChange={(e) =>
                    setPayment({
                      ...payment,
                      method: e.target.value,
                    })
                  }
                >
                  <option value="">Payment Method</option>
                  <option value="cash">Cash</option>
                  <option value="upi">UPI</option>
                  <option value="bank">Bank</option>
                  <option value="card">Card</option>
                  <option value="cheque">Cheque</option>
                </select>

                <input
                  type="date"
                  className="soft-input"
                  value={payment.date}
                  onChange={(e) =>
                    setPayment({
                      ...payment,
                      date: e.target.value,
                    })
                  }
                />
                <input
                  type="file"
                  className="soft-input"
                  onChange={(e) =>
                    setPayment({
                      ...payment,
                      receipt: e.target.files[0],
                    })
                  }
                />
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <PrimaryButton name="Save Sale" onClick={submit} />
          </div>
        </div>
      </div>
    </div>
  );
}
