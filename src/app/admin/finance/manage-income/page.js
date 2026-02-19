"use client";

import { useEffect, useState } from "react";
import { api } from "@/utils/api";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { useRouter } from "next/navigation";
import { Eye, FileSpreadsheet } from "lucide-react";

export default function IncomePage() {
  const router = useRouter();

  const [incomes, setIncomes] = useState([]);
  const [dateFilter, setDateFilter] = useState("current_month");
  const [viewIncome, setViewIncome] = useState(null);

  /* ================= FETCH INCOME LIST ================= */
  useEffect(() => {
    fetchIncomeList(dateFilter);
  }, [dateFilter]);

  const fetchIncomeList = async (filter) => {
    try {
      const res = await api.get("/finance/incomes", {
        params: { filter },
      });

      setIncomes(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= DOWNLOAD EXCEL ================= */
  const handleDownloadExcel = async () => {
    try {
      const response = await api.get(
        "/reports/finance/income/export",
        {
          responseType: "blob",
          params: { filter: dateFilter },
        }
      );

      const url = window.URL.createObjectURL(
        new Blob([response.data])
      );

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "income.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed", error);
    }
  };

  const openView = (income) => {
    setViewIncome(income);
  };

  return (
    <div className="space-y-6 p-6">

      {/* ================= HEADER ================= */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 flex items-center justify-between">

        {/* FILTER */}
        <div>
          <select
            className="soft-select w-48"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="current_month">Current Month</option>
            <option value="till_date">Till Date</option>
          </select>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-3">

          {/* Excel */}
          <button
            onClick={handleDownloadExcel}
            className="group relative bg-green-50 border border-green-200 rounded-lg p-2 hover:bg-green-100 transition"
          >
            <FileSpreadsheet className="text-green-600 w-5 h-5" />
            <span className="absolute hidden group-hover:block -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded">
              Download Excel
            </span>
          </button>

          <PrimaryButton
            name="+ Add Income"
            onClick={() => router.push("manage-income/add")}
          />
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Reference</th>
              <th className="px-4 py-2 text-left">Payer</th>
              <th className="px-4 py-2 text-left">Account</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Amount</th>
              <th className="px-4 py-2 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {incomes.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-10 text-center text-gray-500">
                  No income records found
                </td>
              </tr>
            ) : (
              incomes.map((i) => (
                <tr key={i.id}>
                  <td className="px-4 py-2">
                    {new Date(i.payment_date).toLocaleDateString()}
                  </td>

                  <td className="px-4 py-2 font-medium">
                    {i.id}
                  </td>

                  <td className="px-4 py-2">
                    {i.payer?.name}
                  </td>

                  <td className="px-4 py-2">
                    {i.account?.type}/{i.account?.name}
                  </td>

                  <td className="px-4 py-2">
                    {i.items?.map(it => it.category).join(", ")}
                  </td>

                  <td className="px-4 py-2 font-semibold">
                    ₹{i.total_amount}
                  </td>

                  <td className="px-4 py-2 text-right">
                    <button
                      onClick={() => openView(i)}
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
      </div>

      {/* ================= VIEW MODAL ================= */}
      {viewIncome && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[900px] rounded-xl shadow-lg p-6 relative">

            <button
              onClick={() => setViewIncome(null)}
              className="absolute right-4 top-4 text-gray-500"
            >
              ✕
            </button>

            {/* HEADER */}
            <div className="bg-green-100 rounded-lg p-6 mb-6 flex justify-between">
              <div>
                <h2 className="text-xl font-bold">
                  Income Voucher
                </h2>
                <p className="text-sm text-gray-600">
                  Generated Date: {viewIncome.payment_date}
                </p>
              </div>
            </div>

            {/* PAYER INFO */}
            <div className="mb-6 text-sm space-y-1">
              <div><strong>Payer:</strong> {viewIncome.payer?.name}</div>
              <div><strong>Payment Mode:</strong> {viewIncome.payment_mode}</div>
              <div><strong>Account:</strong> {viewIncome.account?.name}</div>
            </div>

            {/* ITEMS */}
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
                  {viewIncome.items?.map((item, index) => (
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

            <div className="flex justify-end mt-6 text-lg font-semibold">
              Total Amount: ₹{viewIncome.total_amount}
            </div>

            <div className="flex justify-between mt-12 text-sm text-gray-600">
              <div>Payer Signature</div>
              <div>Receiver Signature</div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
