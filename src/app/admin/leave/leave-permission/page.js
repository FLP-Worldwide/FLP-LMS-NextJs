"use client";

import React from "react";

export default function LeavePermissionPage() {
  // 🔹 Dummy data (keep empty [] to show No Data Found)
  const permissions = [
    {
      id: 1,
      applicant: "Neha Verma",
      role: "Teacher",
      category: "Casual Leave",
      applied_date: "05/01/2026",
      days: 2,
      from: "06/01/2026",
      to: "07/01/2026",
      reason: "Personal work",
      status: "Pending",
    },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        {/* ================= TABLE HEAD ================= */}
        <thead className="bg-blue-50">
          <tr>
            <th className="px-4 py-2 text-left">#</th>
            <th className="px-4 py-2 text-left">Applicant</th>
            <th className="px-4 py-2 text-left">Role</th>
            <th className="px-4 py-2 text-left">Category</th>
            <th className="px-4 py-2 text-left">Applied Date</th>
            <th className="px-4 py-2 text-left">Days</th>
            <th className="px-4 py-2 text-left">From</th>
            <th className="px-4 py-2 text-left">To</th>
            <th className="px-4 py-2 text-left">Reason</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Action</th>
          </tr>
        </thead>

        {/* ================= TABLE BODY ================= */}
        <tbody className="divide-y">
          {permissions.length === 0 ? (
            <tr>
              <td
                colSpan="11"
                className="px-4 py-12 text-center text-gray-400 text-base"
              >
                No Data Found !
              </td>
            </tr>
          ) : (
            permissions.map((p, index) => (
              <tr key={p.id}>
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{p.applicant}</td>
                <td className="px-4 py-2">{p.role}</td>
                <td className="px-4 py-2">{p.category}</td>
                <td className="px-4 py-2">{p.applied_date}</td>
                <td className="px-4 py-2">{p.days}</td>
                <td className="px-4 py-2">{p.from}</td>
                <td className="px-4 py-2">{p.to}</td>
                <td className="px-4 py-2">{p.reason}</td>
                <td className="px-4 py-2">
                  <span className="px-2 py-1 text-xs rounded bg-amber-50 text-amber-700">
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-2 text-gray-400">—</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
