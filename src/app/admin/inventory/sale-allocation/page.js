"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SearchOutlined, EyeOutlined } from "@ant-design/icons";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { api } from "@/utils/api";
import { FileExcelOutlined } from "@ant-design/icons";

export default function Page() {
  const [sales, setSales] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDownloadExcel = async () => {
  try {
    const response = await api.get("/reports/inventory/sale/export", {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(
      new Blob([response.data])
    );

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "sales-records.xlsx");

    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Sales export failed", error);
    alert("Failed to download Excel");
  }
};


  /* ================= FETCH SALES ================= */
  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    setLoading(true);
    try {
      const res = await api.get("/inventory/sale");
      setSales(res.data?.data || []);
    } finally {
      setLoading(false);
    }
  };

  /* ================= SEARCH FILTER ================= */
  const filteredSales = sales.filter((s) =>
    `${s.reference_no} ${s.staff} ${s.designation}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 p-6">
      {/* TOP BAR */}
      <div className="flex items-center justify-between gap-4">
        {/* SEARCH */}
        <div className="relative w-72">
          <input
            className="soft-input pl-10"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        {/* NOTE */}
        <div className="flex-1">
          <div className="bg-orange-50 border border-orange-200 text-orange-800 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
            <span className="font-semibold">Note :</span>
            Faculty having multiple role, will get displayed only in
            <strong className="ml-1">Faculty list</strong> while in
            <strong className="ml-1">Sales / Allocate</strong>.
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-3">
          {/* <button
            title="Export PDF"
            className="bg-white border border-gray-200 rounded-lg p-2 hover:bg-gray-50"
          >
            📄
          </button> */}

         {/* Excel Hover Expand Button */}
          <button
            onClick={handleDownloadExcel}
            className="group flex items-center gap-2 
                      border border-gray-200 rounded-lg 
                      px-3 py-2 overflow-hidden
                      transition-all duration-300
                      hover:bg-green-50 hover:shadow-sm"
          >
            <FileExcelOutlined className="text-green-600 text-lg" />

            <span
              className="max-w-0 opacity-0 overflow-hidden whitespace-nowrap
                        group-hover:max-w-xs group-hover:opacity-100
                        transition-all duration-300 text-sm text-green-700"
            >
              Download Excel
            </span>
          </button>


          <Link href="/admin/inventory/sale-allocation/create">
            <PrimaryButton name="+ Add Sale" />
          </Link>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-4 py-3 text-left">Reference No.</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-right">Grand Total (Rs)</th>
              <th className="px-4 py-3 text-right">Paid (Rs)</th>
              <th className="px-4 py-3 text-right">Balance (Rs)</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td colSpan="8" className="py-16 text-center text-gray-500">
                  Loading sales...
                </td>
              </tr>
            ) : filteredSales.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-16 text-center text-gray-500">
                  No sales records found
                </td>
              </tr>
            ) : (
              filteredSales.map((s) => {
                const total = Number(s.total_amount || 0);
                const paid =
                  s.payment_status === "paid" ? total : 0;
                const balance = total - paid;

                return (
                  <tr key={s.id}>
                    <td className="px-4 py-2">{s.reference_no}</td>
                    <td className="px-4 py-2 capitalize">
                      {s.designation}
                    </td>
                    <td className="px-4 py-2">{s.staff}</td>
                    <td className="px-4 py-2">{s.date}</td>
                    <td className="px-4 py-2 text-right">
                      Rs {total.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-right">
                      Rs {paid.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-right">
                      Rs {balance.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-right">
                      <Link
                        href={`/admin/inventory/sale-allocation/${s.id}`}
                        title="View"
                      >
                        <EyeOutlined className="text-blue-600 cursor-pointer" />
                      </Link>
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
