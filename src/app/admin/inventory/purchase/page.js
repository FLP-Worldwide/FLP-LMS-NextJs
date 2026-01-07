"use client";

import React, {useState, useEffect} from "react";
import Link from "next/link";
import { EyeOutlined } from "@ant-design/icons";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { api } from "@/utils/api";

export default function PurchasePage() {
  // Dummy data for now
const [purchases, setPurchases] = useState([]);
const [loading, setLoading] = useState(false);

useEffect(() => {
  fetchPurchases();
}, []);

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
    <div className="space-y-4">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Purchase</h2>
          <p className="text-sm text-gray-500">
            Manage all inventory purchase records
          </p>
        </div>

        {/* ADD PURCHASE BUTTON (NEW PAGE) */}
        <Link href="/admin/inventory/purchase/create">
          <PrimaryButton name="+ Add Purchase" />
        </Link>
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
