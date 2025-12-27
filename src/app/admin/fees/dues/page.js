"use client";

import React, { useState } from "react";

/* ---------------- MOCK DATA ---------------- */
const studentsData = [
  {
    id: 1,
    admissionNo: "ADM-2025-001",
    name: "Aarav Sharma",
    class: "10",
    section: "A",
    fatherName: "Rakesh Sharma",
    mobile: "9876543210",
    totalFees: 45000,
    paidFees: 30000,
    dueFees: 15000,
    lastPaidDate: "2025-08-10",
    status: "due",
  },
  {
    id: 2,
    admissionNo: "ADM-2025-014",
    name: "Ananya Verma",
    class: "9",
    section: "B",
    fatherName: "Sandeep Verma",
    mobile: "9988776655",
    totalFees: 42000,
    paidFees: 42000,
    dueFees: 0,
    lastPaidDate: "2025-07-01",
    status: "paid",
  },
];

/* ---------------- STATUS PILL ---------------- */
function StatusPill({ status }) {
  const map = {
    due: "bg-rose-50 text-rose-700",
    paid: "bg-emerald-50 text-emerald-700",
  };

  return (
    <span
      className={`text-xs font-medium px-2 py-1 rounded ${
        map[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}

/* ---------------- PAGE ---------------- */
export default function FeesDuePage() {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");

  const filteredStudents = studentsData.filter((s) => {
    if (selectedClass && s.class !== selectedClass) return false;
    if (selectedSection && s.section !== selectedSection) return false;
    return s.dueFees > 0;
  });

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Fees Due</h2>
          <p className="text-sm text-gray-500">
            View students with pending fees by class & section
          </p>
        </div>
      </div>

      {/* FILTERS */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap gap-4">
        <div>
          <label className="text-xs text-gray-500">Class</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="mt-1 px-3 py-2 rounded-md border border-gray-200 text-sm"
          >
            <option value="">All</option>
            <option value="9">Class 9</option>
            <option value="10">Class 10</option>
          </select>
        </div>

        <div className="">
          <label className="text-xs text-gray-500">Section</label>
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="mt-1 px-3 py-2 rounded-md border border-gray-200 text-sm"
          >
            <option value="">All</option>
            <option value="A">Section A</option>
            <option value="B">Section B</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold">Pending Fees List</h3>
          <span className="text-sm text-gray-500">
            {filteredStudents.length} students
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-2 px-3 text-xs font-medium text-gray-600">
                  Student
                </th>
                <th className="py-2 px-3 text-xs font-medium text-gray-600">
                  Class
                </th>
                <th className="py-2 px-3 text-xs font-medium text-gray-600">
                  Father Name
                </th>
                <th className="py-2 px-3 text-xs font-medium text-gray-600">
                  Mobile
                </th>
                <th className="py-2 px-3 text-xs font-medium text-gray-600">
                  Total Fees
                </th>
                <th className="py-2 px-3 text-xs font-medium text-gray-600">
                  Paid
                </th>
                <th className="py-2 px-3 text-xs font-medium text-gray-600">
                  Due
                </th>
                <th className="py-2 px-3 text-xs font-medium text-gray-600">
                  Status
                </th>
                <th className="py-2 px-3 text-xs font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filteredStudents.map((s) => (
                <tr key={s.id}>
                  <td className="py-2 px-3">
                    <div className="text-sm font-medium">{s.name}</div>
                    <div className="text-xs text-gray-500">
                      {s.admissionNo}
                    </div>
                  </td>
                  <td className="py-2 px-3 text-sm">
                    {s.class} - {s.section}
                  </td>
                  <td className="py-2 px-3 text-sm">{s.fatherName}</td>
                  <td className="py-2 px-3 text-sm">{s.mobile}</td>
                  <td className="py-2 px-3 text-sm">
                    ₹{s.totalFees.toLocaleString()}
                  </td>
                  <td className="py-2 px-3 text-sm">
                    ₹{s.paidFees.toLocaleString()}
                  </td>
                  <td className="py-2 px-3 text-sm font-medium text-rose-700">
                    ₹{s.dueFees.toLocaleString()}
                  </td>
                  <td className="py-2 px-3">
                    <StatusPill status={s.status} />
                  </td>
                  <td className="py-2 px-3">
                    <div className="flex gap-2">
                      <button className="px-3 py-1 text-sm rounded-md border border-gray-200 hover:bg-gray-50">
                        View
                      </button>
                      <button className="px-3 py-1 text-sm rounded-md bg-emerald-600 text-white hover:bg-emerald-700">
                        Collect Fees
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredStudents.length === 0 && (
                <tr>
                  <td
                    colSpan="9"
                    className="py-6 text-center text-sm text-gray-500"
                  >
                    No pending fees found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
