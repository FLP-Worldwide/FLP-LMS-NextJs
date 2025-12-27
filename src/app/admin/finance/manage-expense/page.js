"use client";

import { useEffect, useState } from "react";
import { api } from "@/utils/api";
import PrimaryButton from "@/components/ui/PrimaryButton";

export default function ExpensePage() {
  /* ================= DATA ================= */
  const [payees, setPayees] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]); // ✅ NEW

  /* ================= FORM ================= */
  const [form, setForm] = useState({
    payment_mode: "Cash",
    payee_id: "",
    finance_account_id: "",
    payment_date: "",
    transaction_id: null,
    cheque_no: null,
    remark: "",
    category: "",
    description: "",
    quantity: 1,
    amount: "",
  });

  /* ================= FETCH MASTER DATA ================= */
  useEffect(() => {
    fetchInitial();
    fetchExpenses(); // ✅ NEW
  }, []);

  const fetchInitial = async () => {
    const [p, c] = await Promise.all([
      api.get("/finance/payee"),
      api.get("/finance/category?type=Expense"),
    ]);

    setPayees(Array.isArray(p.data) ? p.data : []);
    setCategories(Array.isArray(c.data.data) ? c.data.data : []);
  };

  /* ================= FETCH EXPENSE LIST ================= */
  const fetchExpenses = async () => {
    const res = await api.get("/finance/expenses");
    setExpenses(Array.isArray(res.data.data) ? res.data.data : []);
  };

  /* ================= FETCH ACCOUNTS BY PAYEE ================= */
  const handlePayeeChange = async (payeeId) => {
    setForm({
      ...form,
      payee_id: payeeId,
      finance_account_id: "",
    });

    if (!payeeId) {
      setAccounts([]);
      return;
    }

    const res = await api.get(`/finance/accounts/payee/${payeeId}`);
    setAccounts(Array.isArray(res.data?.data) ? res.data.data : []);
  };

  /* ================= SUBMIT ================= */
  const submitExpense = async () => {
    if (
      !form.payee_id ||
      !form.finance_account_id ||
      !form.payment_date ||
      !form.category ||
      !form.amount
    ) {
      return alert("Please fill all required fields");
    }

    const payload = {
      payee_id: Number(form.payee_id),
      finance_account_id: Number(form.finance_account_id),
      payment_date: form.payment_date,
      transaction_id: form.transaction_id,
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

    await api.post("/finance/expenses", payload);

    alert("Expense added successfully");

    fetchExpenses(); // ✅ REFRESH LIST

    setForm({
      payment_mode: "Cash",
      payee_id: "",
      finance_account_id: "",
      payment_date: "",
      transaction_id: null,
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
    <div className="space-y-6">

      {/* ================= FORM (UNCHANGED) ================= */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="grid grid-cols-4 gap-4">
          {/* Payee */}
          <div>
            <label className="soft-label">Payee Name *</label>
            <select
              className="soft-select"
              value={form.payee_id}
              onChange={(e) => handlePayeeChange(e.target.value)}
            >
              <option value="">Select Payee</option>
              {payees.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.display_name}
                </option>
              ))}
            </select>
          </div>

          {/* Account */}
          <div>
            <label className="soft-label">Account Name *</label>
            <select
              className="soft-select"
              value={form.finance_account_id}
              onChange={(e) =>
                setForm({ ...form, finance_account_id: e.target.value })
              }
              disabled={!form.payee_id}
            >
              <option value="">Select Account</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.account_name} ({a.account_type})
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
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

          {/* Category */}
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
            <label className="soft-label">Remark</label>
            <input
              className="soft-input"
              value={form.remark}
              onChange={(e) =>
                setForm({ ...form, remark: e.target.value })
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
            <label className="soft-label">Amount (Rs) *</label>
            <input
              className="soft-input"
              value={form.amount}
              onChange={(e) =>
                setForm({ ...form, amount: e.target.value })
              }
            />
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <PrimaryButton name="Submit Expense" onClick={submitExpense} />
        </div>
      </div>

      {/* ================= EXPENSE LIST TABLE ================= */}

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Payee</th>
                <th className="px-4 py-2 text-left">Account</th>
                <th className="px-4 py-2 text-left">Category</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Qty</th>
                <th className="px-4 py-2 text-left">Amount</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-6 text-center text-gray-500">
                    No expense records found
                  </td>
                </tr>
              ) : (
                expenses.map((e) => {
                  const item = e.items?.[0]; // 👈 first item

                  return (
                    <tr key={e.id}>
                      <td className="px-4 py-2">
                        {e.payee?.name || "—"}
                      </td>

                      <td className="px-4 py-2">
                        {e.account?.name}
                        {e.account?.type && (
                          <span className="text-xs text-gray-500">
                            {" "}({e.account.type})
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-2">
                        {item?.category || "—"}
                      </td>

                      <td className="px-4 py-2">
                        {e.payment_date}
                      </td>

                      <td className="px-4 py-2">
                        {item?.quantity ?? "—"}
                      </td>

                      <td className="px-4 py-2 font-medium">
                        ₹{item?.total ?? e.total_amount}
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
