"use client";

import { useEffect, useState } from "react";
import { api } from "@/utils/api";
import PrimaryButton from "@/components/ui/PrimaryButton";

export default function IncomePage() {

  /* ================= DATA ================= */
  const [payers, setPayers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [items, setItems] = useState([]);

  /* ================= FORM ================= */
  const [form, setForm] = useState({
    payment_mode: "Cash",
    payer_id: "",
    finance_account_id: "",
    payment_date: "",
    transaction_id: "",
    cheque_no: "",
    remark: "",
    category: "",
    description: "",
    quantity: 1,
    amount: "",
  });

  /* ================= FETCH INITIAL ================= */
  useEffect(() => {
    fetchInitial();
  }, []);

  const fetchInitial = async () => {
    const [p, c] = await Promise.all([
      api.get("/finance/payer"),
      api.get("/finance/category?type=Income"),
    ]);

    setPayers(Array.isArray(p.data) ? p.data : []);
    setCategories(Array.isArray(c.data.data) ? c.data.data : []);
  };

  /* ================= FETCH ACCOUNTS ================= */
  const handlePayerChange = async (payerId) => {
    setForm({
      ...form,
      payer_id: payerId,
      finance_account_id: "",
    });

    if (!payerId) {
      setAccounts([]);
      return;
    }

    const res = await api.get(`/finance/accounts/payer/${payerId}`);
    setAccounts(Array.isArray(res.data?.data) ? res.data.data : []);
  };

  /* ================= ADD ITEM ================= */
  const addItem = () => {
    if (!form.category || !form.amount) {
      return alert("Category and Amount required");
    }

    const newItem = {
      category: form.category,
      description: form.description,
      quantity: Number(form.quantity),
      amount: Number(form.amount),
    };

    setItems([...items, newItem]);

    setForm({
      ...form,
      category: "",
      description: "",
      quantity: 1,
      amount: "",
    });
  };

  /* ================= SAVE INCOME ================= */
  const saveIncome = async () => {
    if (!form.payer_id || !form.finance_account_id || !form.payment_date) {
      return alert("Fill required details");
    }

    if (items.length === 0) {
      return alert("Add at least one item");
    }

    const payload = {
      payer_id: Number(form.payer_id),
      finance_account_id: Number(form.finance_account_id),
      payment_date: form.payment_date,
      payment_mode: form.payment_mode,
      transaction_id: form.transaction_id || null,
      cheque_no: form.cheque_no || null,
      remark: form.remark,
      items: items.map((i) => ({
        category: i.category,
        description: i.description,
        quantity: i.quantity,
        amount: i.amount,
      })),
    };

    await api.post("/finance/incomes", payload);

    alert("Income saved successfully");

    setItems([]);
    setForm({
      payment_mode: "Cash",
      payer_id: "",
      finance_account_id: "",
      payment_date: "",
      transaction_id: "",
      cheque_no: "",
      remark: "",
      category: "",
      description: "",
      quantity: 1,
      amount: "",
    });
  };

  /* ================= TOTAL ================= */
  const totalAmount = items.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  return (
    <div className="space-y-6 p-6">

      <div className="bg-white border border-gray-200 rounded-xl p-6">

        {/* PAYMENT MODE */}
        <div className="mb-6">
          <label className="soft-label">Payment Mode *</label>
          <div className="flex gap-6 mt-2">
            {["Cash", "Bank", "Cheque", "Card"].map((mode) => (
              <label key={mode} className="flex items-center gap-2">
                <input
                  type="radio"
                  value={mode}
                  checked={form.payment_mode === mode}
                  onChange={(e) =>
                    setForm({ ...form, payment_mode: e.target.value })
                  }
                />
                {mode}
              </label>
            ))}
          </div>
        </div>

        {/* BASIC DETAILS */}
        <div className="grid grid-cols-4 gap-4">

          <div>
            <label className="soft-label">Payer *</label>
            <select
              className="soft-select"
              value={form.payer_id}
              onChange={(e) => handlePayerChange(e.target.value)}
              disabled={items.length > 0}
            >
              <option value="">Select Payer</option>
              {payers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.display_name || p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="soft-label">Account *</label>
            <select
              className="soft-select"
              value={form.finance_account_id}
              onChange={(e) =>
                setForm({ ...form, finance_account_id: e.target.value })
              }
              disabled={!form.payer_id}
            >
              <option value="">Select Account</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.account_type} ({a.account_name})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="soft-label">Date *</label>
            <input
              type="date"
              className="soft-input"
              value={form.payment_date}
              onChange={(e) =>
                setForm({ ...form, payment_date: e.target.value })
              }
            />
          </div>

          {/* Conditional fields */}
          {form.payment_mode === "Bank" || form.payment_mode === "Card" ? (
            <div>
              <label className="soft-label">Transaction ID *</label>
              <input
                className="soft-input"
                value={form.transaction_id}
                onChange={(e) =>
                  setForm({ ...form, transaction_id: e.target.value })
                }
              />
            </div>
          ) : null}

          {form.payment_mode === "Cheque" ? (
            <div>
              <label className="soft-label">Cheque No *</label>
              <input
                className="soft-input"
                value={form.cheque_no}
                onChange={(e) =>
                  setForm({ ...form, cheque_no: e.target.value })
                }
              />
            </div>
          ) : null}
        </div>

        {/* ITEM SECTION */}
        <div className="grid grid-cols-4 gap-4 mt-6">

          <div>
            <label className="soft-label">Category *</label>
            <select
              className="soft-select"
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="soft-label">Description</label>
            <input
              className="soft-input"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          <div>
            <label className="soft-label">Quantity</label>
            <input
              type="number"
              className="soft-input"
              value={form.quantity}
              onChange={(e) =>
                setForm({ ...form, quantity: e.target.value })
              }
            />
          </div>

          <div>
            <label className="soft-label">Amount *</label>
            <input
              className="soft-input"
              type="number"
              value={form.amount}
              onChange={(e) =>
                setForm({ ...form, amount: e.target.value })
              }
            />
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <PrimaryButton name="Add" onClick={addItem} />
        </div>
      </div>

      {/* ITEMS TABLE */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Description</th>
              <th className="px-4 py-2 text-left">Qty</th>
              <th className="px-4 py-2 text-left">Amount</th>
              <th className="px-4 py-2 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {items.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No items added
                </td>
              </tr>
            ) : (
              items.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-2">{item.category}</td>
                  <td className="px-4 py-2">{item.description}</td>
                  <td className="px-4 py-2">{item.quantity}</td>
                  <td className="px-4 py-2 font-medium">
                    ₹{item.amount}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <button
                      onClick={() =>
                        setItems(items.filter((_, i) => i !== index))
                      }
                      className="text-red-600"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="flex justify-between p-6">
          <div className="text-lg font-semibold">
            Total: ₹{totalAmount}
          </div>

          <PrimaryButton name="Save Income" onClick={saveIncome} />
        </div>
      </div>
    </div>
  );
}
