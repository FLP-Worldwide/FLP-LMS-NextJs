"use client";

import React, {useState, useEffect} from "react";
import Link from "next/link";
import { EyeOutlined } from "@ant-design/icons";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { api } from "@/utils/api";
import { FileExcelOutlined } from "@ant-design/icons";

export default function PurchasePage() {
  // Dummy data for now
const [purchases, setPurchases] = useState([]);
const [loading, setLoading] = useState(false);

useEffect(() => {
  fetchPurchases();
}, []);
const handleDownloadExcel = async () => {
  try {
    const response = await api.get("/reports/inventory/purchase/export", {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(
      new Blob([response.data])
    );

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "purchase-records.xlsx");

    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Purchase export failed", error);
    alert("Failed to download Excel");
  }
};

const fetchPurchases = async () => {
  try {
    setLoading(true);
    const res = await api.get("/inventory/purchase");
    setPurchases(res.data?.data || []);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="space-y-4 p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Purchase</h2>
          <p className="text-sm text-gray-500">
            Manage all inventory purchase records
          </p>
        </div>

        <div className="flex items-center gap-3">

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

          <Link href="/admin/inventory/purchase/create">
            <PrimaryButton name="+ Add Purchase" />
          </Link>

        </div>
      </div>


      {/* TABLE */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-4 py-2 text-left">Purchase ID</th>
              <th className="px-4 py-2 text-left">Supplier</th>
              <th className="px-4 py-2 text-left">Invoice No.</th>
              <th className="px-4 py-2 text-left">Purchase Date</th>
              <th className="px-4 py-2 text-right">Total Amount (Rs)</th>
              <th className="px-4 py-2 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {loading ? (
                <tr>
                <td colSpan="6" className="py-10 text-center text-gray-500">
                    Loading...
                </td>
                </tr>
            ) : purchases.length === 0 ? (
                <tr>
                <td colSpan="6" className="py-10 text-center text-gray-500">
                    No purchase records found
                </td>
                </tr>
            ) : (
                purchases.map((p) => (
                <tr key={p.id}>
                    <td className="px-4 py-2">{p.id}</td>

                    <td className="px-4 py-2">
                    {p.supplier?.company || "-"}
                    </td>

                    <td className="px-4 py-2">
                    {p.reference_no}
                    </td>

                    <td className="px-4 py-2">
                    {p.date}
                    </td>

                    <td className="px-4 py-2 text-right">
                    Rs {Number(p.total_amount || 0).toFixed(2)}
                    </td>

                    <td className="px-4 py-2 text-right">
                    <Link href={`/admin/inventory/purchase/${p.id}`}>
                        <EyeOutlined className="text-blue-600 cursor-pointer" />
                    </Link>
                    </td>
                </tr>
                ))
            )}
            </tbody>
        </table>
      </div>
    </div>
  );
}
