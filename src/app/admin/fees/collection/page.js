"use client";

import React, { useState } from "react";

/* ---------------- MOCK DATA ---------------- */
const collectionData = [
  {
    id: 1,
    admissionNo: "ADM-2025-001",
    name: "Aarav Sharma",
    class: "10",
    section: "A",
    fees: [
      { type: "Tuition", amount: 30000, paid: 20000 },
      { type: "Lab", amount: 5000, paid: 0 },
      { type: "Transport", amount: 10000, paid: 10000 },
    ],
    lastPaidDate: "2025-08-10",
  },
  {
    id: 2,
    admissionNo: "ADM-2025-014",
    name: "Ananya Verma",
    class: "10",
    section: "A",
    fees: [{ type: "Tuition", amount: 42000, paid: 42000 }],
    lastPaidDate: "2025-08-05",
  },
];

/* ---------------- HELPERS ---------------- */
const getTotalFees = (fees) =>
  fees.reduce((sum, f) => sum + f.amount, 0);

const getPaidFees = (fees) =>
  fees.reduce((sum, f) => sum + f.paid, 0);

const getPendingFees = (fees) =>
  fees.reduce((sum, f) => sum + (f.amount - f.paid), 0);

/* ---------------- BADGES ---------------- */
function FeeBadge({ type, pending }) {
  const map = {
    Tuition: "bg-blue-50 text-blue-700",
    Lab: "bg-purple-50 text-purple-700",
    Transport: "bg-orange-50 text-orange-700",
    Hostel: "bg-emerald-50 text-emerald-700",
  };

  return (
    <span
      className={`text-xs font-medium px-2 py-0.5 rounded ${
        pending > 0 ? map[type] : "bg-gray-100 text-gray-500"
      }`}
    >
      {type} {pending > 0 ? "Due" : "Paid"}
    </span>
  );
}

/* ---------------- PAGE ---------------- */
export default function CollectionPage() {
  const [month, setMonth] = useState("2025-08");
  const [classFilter, setClassFilter] = useState("");
  const [sectionFilter, setSectionFilter] = useState("");

  /* FILTER DATA */
  const filteredData = collectionData.filter((s) => {
    if (classFilter && s.class !== classFilter) return false;
    if (sectionFilter && s.section !== sectionFilter) return false;
    return true;
  });

  /* SUMMARY */
  const totalCollected = filteredData.reduce(
    (sum, s) => sum + getPaidFees(s.fees),
    0
  );

  const totalPending = filteredData.reduce(
    (sum, s) => sum + getPendingFees(s.fees),
    0
  );

  const pendingStudents = filteredData.filter(
    (s) => getPendingFees(s.fees) > 0
  ).length;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h2 className="text-xl font-semibold">Fees Collection</h2>
        <p className="text-sm text-gray-500">
          Track monthly fee collection and pending payments
        </p>
      </div>

      {/* FILTERS */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap gap-4">
        <div>
          <label className="text-xs text-gray-500">Month</label>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="mt-1 soft-input"
          />
        </div>

        <div>
          <label className="text-xs text-gray-500">Class</label>
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="mt-1 soft-select"
          >
            <option value="">All</option>
            <option value="9">Class 9</option>
            <option value="10">Class 10</option>
          </select>
        </div>

        <div>
          <label className="text-xs text-gray-500">Section</label>
          <select
            value={sectionFilter}
            onChange={(e) => setSectionFilter(e.target.value)}
            className="mt-1 soft-select"
          >
            <option value="">All</option>
            <option value="A">Section A</option>
            <option value="B">Section B</option>
          </select>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <SummaryCard title="Total Collected" value={`₹${totalCollected.toLocaleString()}`} />
        <SummaryCard title="Total Pending" value={`₹${totalPending.toLocaleString()}`} />
        <SummaryCard title="Students" value={filteredData.length} />
        <SummaryCard title="Pending Students" value={pendingStudents} />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-xs">Student</th>
                <th className="px-3 py-2 text-xs">Class</th>
                <th className="px-3 py-2 text-xs">Total</th>
                <th className="px-3 py-2 text-xs">Paid</th>
                <th className="px-3 py-2 text-xs">Pending</th>
                <th className="px-3 py-2 text-xs">Fees</th>
                <th className="px-3 py-2 text-xs">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {filteredData.map((s) => {
                const total = getTotalFees(s.fees);
                const paid = getPaidFees(s.fees);
                const pending = getPendingFees(s.fees);

                return (
                  <tr key={s.id}>
                    <td className="px-3 py-2">
                      <div className="font-medium text-sm">{s.name}</div>
                      <div className="text-xs text-gray-500">
                        {s.admissionNo}
                      </div>
                    </td>

                    <td className="px-3 py-2 text-sm">
                      {s.class}-{s.section}
                    </td>

                    <td className="px-3 py-2 text-sm">
                      ₹{total.toLocaleString()}
                    </td>

                    <td className="px-3 py-2 text-sm text-emerald-700">
                      ₹{paid.toLocaleString()}
                    </td>

                    <td className="px-3 py-2 text-sm text-rose-700">
                      ₹{pending.toLocaleString()}
                    </td>

                    <td className="px-3 py-2">
                      <div className="flex flex-wrap gap-1">
                        {s.fees.map((f, i) => (
                          <FeeBadge
                            key={i}
                            type={f.type}
                            pending={f.amount - f.paid}
                          />
                        ))}
                      </div>
                    </td>

                    <td className="px-3 py-2">
                      <div className="flex gap-2">
                        <button className="soft-btn-outline">
                          View
                        </button>
                        {pending > 0 && (
                          <button className="soft-btn bg-emerald-600 hover:bg-emerald-700">
                            Collect
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}

/* ---------------- SUMMARY CARD ---------------- */
function SummaryCard({ title, value }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="text-xs text-gray-500">{title}</div>
      <div className="text-lg font-semibold mt-1">{value}</div>
    </div>
  );
}
