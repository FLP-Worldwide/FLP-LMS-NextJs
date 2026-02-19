"use client";

import { useEffect, useState } from "react";
import { api } from "@/utils/api";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { useRouter } from "next/navigation";
import { Eye, Pencil, FileSpreadsheet } from "lucide-react";


export default function ExpenseEditPage() {

  const router = useRouter();
  /* ================= DATA ================= */
  const [payees, setPayees] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]); // ✅ NEW
const [dateFilter, setDateFilter] = useState("current_month");
const [viewExpense, setViewExpense] = useState(null);

const openView = (expense) => {
  setViewExpense(expense);
};

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
    fetchExpenses(dateFilter);
  }, [dateFilter]);

const handleDownloadExcel = async () => {
  try {
    const response = await api.get("/reports/finance/expenses/export", {
      responseType: "blob",
      params: { filter: dateFilter },
    });

    const url = window.URL.createObjectURL(
      new Blob([response.data])
    );

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "expenses.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Export failed", error);
  }
};

  const fetchInitial = async () => {
    const [p, c] = await Promise.all([
      api.get("/finance/payee"),
      api.get("/finance/category?type=Expense"),
    ]);

    console.log(c);

    setPayees(Array.isArray(p.data) ? p.data : []);
    setCategories(Array.isArray(c.data.data) ? c.data.data : []);
  };

  /* ================= FETCH EXPENSE LIST ================= */
 const fetchExpenses = async (filter = dateFilter) => {
  try {
    const res = await api.get("/finance/expenses", {
      params: { filter }, // backend should handle this
    });

    setExpenses(Array.isArray(res.data.data) ? res.data.data : []);
  } catch (err) {
    console.error(err);
  }
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


  return (
    <div className="space-y-6 p-6">

      {/* ================= FORM (UNCHANGED) ================= */}
     <div className="bg-white border border-gray-200 rounded-xl p-6 flex items-center justify-between">

      {/* LEFT SIDE - FILTER */}
      <div className="flex items-center gap-3">
        <select
          className="soft-select w-48"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        >
          <option value="current_month">Current Month</option>
          <option value="till_date">Till Date</option>
        </select>
      </div>

      {/* RIGHT SIDE - ACTIONS */}
      <div className="flex items-center gap-3">

        {/* Excel Download */}
        <button
          onClick={handleDownloadExcel}
          className="group relative bg-green-50 border border-green-200 rounded-lg p-2 hover:bg-green-100 transition"
        >
          <FileSpreadsheet className="text-green-600 w-5 h-5" />

          {/* Tooltip */}
          <span className="absolute hidden group-hover:block -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded">
            Download Excel
          </span>
        </button>

        <PrimaryButton
          name="+ Add Expense"
          onClick={() => router.push("manage-expense/add")}
        />
      </div>
    </div>


      {/* ================= EXPENSE LIST TABLE ================= */}

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Reference</th>
                <th className="px-4 py-2 text-left">Payee</th>
                <th className="px-4 py-2 text-left">Account</th>
                <th className="px-4 py-2 text-left">Category</th>

                <th className="px-4 py-2 text-left">Amount</th>
                <th className="px-4 py-2 text-right">Action</th>

              </tr>
            </thead>

            <tbody className="divide-y">
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-10 text-center text-gray-500">
                    No expense records found
                  </td>
                </tr>
              ) : (
                expenses.map((e) => (
                  <tr key={e.id}>
                    <td className="px-4 py-2">
                      {new Date(e.payment_date).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-2 font-medium">
                      {e.id}
                    </td>

                    <td className="px-4 py-2">
                      {e.payee?.name}
                    </td>
                    <td className="px-4 py-2">
                      {e.account?.type}/{e.account?.name}
                    </td>
                   

                    <td className="px-4 py-2">
                      {e.items?.map(i => i.category).join(", ")}
                    </td>

                    <td className="px-4 py-2 font-semibold">
                      ₹{e.total_amount}
                    </td>

                    <td className="px-4 py-2 text-right space-x-3">
                      <button
                        onClick={() => openView(e)}
                        className="text-blue-600"
                        title="View"
                      >
                        <Eye />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>


          {viewExpense && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-[900px] rounded-xl shadow-lg p-6 relative">

              {/* CLOSE */}
              <button
                onClick={() => setViewExpense(null)}
                className="absolute right-4 top-4 text-gray-500"
              >
                ✕
              </button>

              {/* HEADER */}
              <div className="bg-blue-100 rounded-lg p-6 mb-6 flex justify-between">
                <div>
                  <h2 className="text-xl font-bold">
                    Expense Voucher
                  </h2>
                  <p className="text-sm text-gray-600">
                    Generated Date: {viewExpense.payment_date}
                  </p>
                </div>
              </div>

              {/* PAYEE INFO */}
              <div className="mb-6 text-sm space-y-1">
                <div><strong>Payee:</strong> {viewExpense.payee?.name}</div>
                <div><strong>Email:</strong> {viewExpense.payee?.email}</div>
                <div><strong>Address:</strong> {viewExpense.payee?.address}</div>
                <div><strong>Payment Mode:</strong> {viewExpense.payment_mode}</div>
                <div><strong>Account:</strong> {viewExpense.payee?.type}</div>
              </div>

              {/* ITEMS TABLE */}
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-[#2f78ce] text-white">
                    <tr>
                      <th className="px-3 py-2 text-left">Sr</th>
                      <th className="px-3 py-2 text-left">Category</th>
                      <th className="px-3 py-2 text-left">Description</th>
                      <th className="px-3 py-2 text-left">Qty</th>
                      <th className="px-3 py-2 text-left">Amount</th>
                    </tr>
                  </thead>

                  <tbody>
                    {viewExpense.items?.map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-3 py-2">{index + 1}</td>
                        <td className="px-3 py-2">{item.category}</td>
                        <td className="px-3 py-2">{item.description}</td>
                        <td className="px-3 py-2">{item.quantity}</td>
                        <td className="px-3 py-2">₹{item.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* TOTAL */}
              <div className="flex justify-end mt-6 text-lg font-semibold">
                Total Amount: ₹{viewExpense.total_amount}
              </div>
              <div className="flex-1 mt-6 text-sm ">
                <div>
                  Payment Mode: {viewExpense.payment_mode}
                </div>
                <div>
                  Payment Date: {viewExpense.payment_date}
                </div>
              </div>

              {/* SIGNATURE */}
              <div className="flex justify-between mt-12 text-sm text-gray-600">
                <div>Payee Signature</div>
                <div>Payer Signature</div>
              </div>
            </div>
          </div>
        )}


        </div>

    </div>
  );
}
