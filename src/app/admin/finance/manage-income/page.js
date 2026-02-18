"use client";

import { useEffect, useState } from "react";
import { api } from "@/utils/api";
import PrimaryButton from "@/components/ui/PrimaryButton";

export default function IncomePage() {
  /* ================= DATA ================= */
  const [payers, setPayers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [incomes, setIncomes] = useState([]);

  /* ================= FORM ================= */
  const [form, setForm] = useState({
    payer_id: "",
    finance_account_id: "",
    payment_date: "",
    transaction_id: "",
    cheque_no: null,
    remark: "",
    category: "",
    description: "",
    quantity: 1,
    amount: "",
  });

  /* ================= FETCH INITIAL ================= */
  useEffect(() => {
    fetchInitial();
    fetchIncomeList();
  }, []);

  const fetchInitial = async () => {
    const [p, c] = await Promise.all([
      api.get("/finance/payer"),
      api.get("/finance/category?type=Income"),
    ]);

    setPayers(Array.isArray(p.data) ? p.data : []);
    setCategories(Array.isArray(c.data.data) ? c.data.data : []);
  };

  /* ================= FETCH INCOME LIST ================= */
  const fetchIncomeList = async () => {
    const res = await api.get("/finance/incomes");
    setIncomes(Array.isArray(res.data?.data) ? res.data.data : []);
  };

  /* ================= FETCH ACCOUNTS BY PAYER ================= */
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

  /* ================= SUBMIT ================= */
  const submitIncome = async () => {
    if (
      !form.payer_id ||
      !form.finance_account_id ||
      !form.payment_date ||
      !form.category ||
      !form.amount
    ) {
      return alert("Please fill all required fields");
    }

    const payload = {
      payer_id: Number(form.payer_id),
      finance_account_id: Number(form.finance_account_id),
      payment_date: form.payment_date,
      transaction_id: form.transaction_id || null,
      cheque_no: form.cheque_no,
      remark: form.remark,
      items: [
        {
          category: form.category,
          description: form.description,
          quantity: Number(form.quantity),
          amount: Number(form.amount),
        },
      ],
    };

    await api.post("/finance/incomes", payload);

    alert("Income added successfully");

    fetchIncomeList();

    setForm({
      payer_id: "",
      finance_account_id: "",
      payment_date: "",
      transaction_id: "",
      cheque_no: null,
      remark: "",
      category: "",
      description: "",
      quantity: 1,
      amount: "",
    });

    setAccounts([]);
  };

  return (
    <div className="space-y-6 p-6">

      {/* ================= FORM ================= */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="grid grid-cols-4 gap-4">

          {/* PAYER */}
          <div>
            <label className="soft-label">Payer Name *</label>
            <select
              className="soft-select"
              value={form.payer_id}
              onChange={(e) => handlePayerChange(e.target.value)}
            >
              <option value="">Select Payer</option>
              {payers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.display_name || p.name}
                </option>
              ))}
            </select>
          </div>

          {/* ACCOUNT */}
          <div>
            <label className="soft-label">Account Name *</label>
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
                  {a.account_name || a.name} ({a.type})
                </option>
              ))}
            </select>
          </div>

          {/* DATE */}
          <div>
            <label className="soft-label">Payment Date *</label>
            <input
              type="date"
              className="soft-input"
              value={form.payment_date}
              onChange={(e) =>
                setForm({ ...form, payment_date: e.target.value })
              }
            />
          </div>

          {/* CATEGORY */}
          <div>
            <label className="soft-label">Item / Category *</label>
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

          {/* DESCRIPTION */}
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

          {/* TRANSACTION ID */}
          <div>
            <label className="soft-label">Transaction ID</label>
            <input
              className="soft-input"
              value={form.transaction_id}
              onChange={(e) =>
                setForm({ ...form, transaction_id: e.target.value })
              }
            />
          </div>

          {/* QTY */}
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

          {/* AMOUNT */}
          <div>
            <label className="soft-label">Amount (Rs) *</label>
            <input
              className="soft-input"
              value={form.amount}
              onChange={(e) =>
                setForm({ ...form, amount: e.target.value })
              }
            />
          </div>

          {/* REMARK */}
          <div className="col-span-4">
            <label className="soft-label">Remark</label>
            <input
              className="soft-input"
              value={form.remark}
              onChange={(e) =>
                setForm({ ...form, remark: e.target.value })
              }
            />
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <PrimaryButton name="Submit Income" onClick={submitIncome} />
        </div>
      </div>

      {/* ================= INCOME LIST TABLE ================= */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Payer</th>
              <th className="px-4 py-2 text-left">Account</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Qty</th>
              <th className="px-4 py-2 text-left">Amount</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {incomes.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-center text-gray-500">
                  No income records found
                </td>
              </tr>
            ) : (
              incomes.map((i) => {
                const item = i.items?.[0];
                return (
                  <tr key={i.id}>
                    <td className="px-4 py-2">{i.payer?.name}</td>
                    <td className="px-4 py-2">
                      {i.account?.name} ({i.account?.type})
                    </td>
                    <td className="px-4 py-2">{item?.category}</td>
                    <td className="px-4 py-2">{i.payment_date}</td>
                    <td className="px-4 py-2">{item?.quantity}</td>
                    <td className="px-4 py-2 font-medium">
                      ₹{item?.total || i.total_amount}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
