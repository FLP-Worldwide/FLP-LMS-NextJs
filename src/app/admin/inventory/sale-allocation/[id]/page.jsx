"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/utils/api";

export default function Page() {
  const { id } = useParams();
  const [sale, setSale] = useState(null);

  useEffect(() => {
    api.get(`/inventory/sale/${id}`).then((res) => {
      setSale(res.data?.data);
    });
  }, [id]);

  if (!sale) {
    return (
      <div className="py-20 text-center text-gray-500">
        Loading sale details...
      </div>
    );
  }

  const totalAmount = Number(sale.total_amount || 0);
  const paidAmount =
    sale.payment_status === "paid" ? totalAmount : 0;
  const balanceAmount = totalAmount - paidAmount;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Sale View</h2>
        <Link
          href="/admin/inventory/sale-allocation"
          className="text-sm text-blue-600"
        >
          Back
        </Link>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-3 gap-6 items-stretch">
        {/* LEFT COLUMN */}
        <div className="h-full flex flex-col gap-6">
          {/* FROM */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 flex-1">
            <div className="bg-blue-50 rounded px-4 py-2 font-medium mb-4">
              From:
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Designation</span>
                <span>{sale.staff?.designation}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Staff Name</span>
                <span>{sale.staff?.name}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Mobile No</span>
                <span>{sale.staff?.phone || "-"}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Email</span>
                <span>{sale.staff?.email || "-"}</span>
              </div>
            </div>
          </div>

          {/* TO */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 flex-1">
            <div className="bg-blue-50 rounded px-4 py-2 font-medium mb-4">
              To:
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Institute</span>
                <span>Institute</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Reference No</span>
                <span>{sale.reference_no}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Date</span>
                <span>{sale.date}</span>
              </div>
            </div>
          </div>

          {/* META */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 flex-1">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Payment Status</span>
                <span
                  className={
                    sale.payment_status === "paid"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }
                >
                  {sale.payment_status}
                </span>
              </div>

              {sale.bill_copy && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Bill Copy</span>
                  <a
                    href={sale.bill_copy}
                    target="_blank"
                    className="text-blue-600 text-sm"
                  >
                    View
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="col-span-2 h-full flex flex-col gap-6">
          {/* ITEMS TABLE */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden flex-1">
            <table className="w-full text-sm">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-4 py-3 text-left">Item</th>
                  <th className="px-4 py-3 text-left">Sale Type</th>
                  <th className="px-4 py-3 text-left">Price (Rs)</th>
                  <th className="px-4 py-3 text-left">Units</th>
                  <th className="px-4 py-3 text-right">
                    Subtotal (Rs)
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {sale.items.map((i) => (
                  <tr key={i.id}>
                    <td className="px-4 py-3">
                      {i.item_name}
                    </td>
                    <td className="px-4 py-3 capitalize">
                      {i.sale_type}
                    </td>
                    <td className="px-4 py-3">
                      Rs {Number(i.sale_price).toFixed(2)}
                    </td>
                    <td className="px-4 py-3">{i.units}</td>
                    <td className="px-4 py-3 text-right">
                      Rs {Number(i.sub_total).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* TOTALS */}
          <div className="space-y-3">
            <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 flex justify-between">
              <span>Total Amount</span>
              <strong>Rs {totalAmount.toFixed(2)}</strong>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 flex justify-between">
              <span>Paid</span>
              <strong>Rs {paidAmount.toFixed(2)}</strong>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 flex justify-between">
              <span>Balance</span>
              <strong>Rs {balanceAmount.toFixed(2)}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
