"use client";

import React from "react";
import { formatRupees } from "@/lib/formatHelper";

export default function Page() {
  // 🔹 Dummy data (replace with API later)
  const refunds = [
    {
      id: 1,
      student_name: "Faith Burns",
      admission_no: "ADM-N9HEF",
      class: "Class 2-B",
      batch: "German - 2025-26",
      refund_amount: 500,
      reason: "Duplicate payment",
      status: "PENDING",
      refund_date: "2026-01-20",
    },

  ];

  return (
    <div className="space-y-6">

      {/* ================= HEADER ================= */}
      <div>
        <h2 className="text-xl font-semibold">Refunds</h2>
        <p className="text-sm text-gray-500">
          View and manage student fee refunds
        </p>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Student</th>
              <th className="p-3">Class</th>
              <th className="p-3">Batch</th>
              <th className="p-3">Refund Amount</th>
              <th className="p-3">Reason</th>
              <th className="p-3">Refund Date</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {refunds.length === 0 && (
              <tr>
                <td
                  colSpan="8"
                  className="p-6 text-center text-gray-400"
                >
                  No refunds found
                </td>
              </tr>
            )}

            {refunds.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-3">
                  <div className="font-medium">{r.student_name}</div>
                  <div className="text-xs text-gray-500">
                    {r.admission_no}
                  </div>
                </td>

                <td className="p-3">{r.class}</td>

                <td className="p-3">{r.batch}</td>

                <td className="p-3 text-emerald-700">
                  {formatRupees(r.refund_amount)}
                </td>

                <td className="p-3">{r.reason}</td>

                <td className="p-3">{r.refund_date}</td>

                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded text-xs ${
                      r.status === "APPROVED"
                        ? "bg-green-100 text-green-700"
                        : r.status === "REJECTED"
                        ? "bg-red-100 text-red-600"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>

                <td className="p-3 text-right">
                  <button className="soft-btn-outline text-xs">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
