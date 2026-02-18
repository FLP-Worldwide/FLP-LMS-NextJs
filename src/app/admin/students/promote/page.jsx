"use client";

import React, { useState } from "react";

const initialData = [
  {
    key: 1,
    name: "Aarav Sharma",
    photo: "https://ui-avatars.com/api/?name=Aarav+Sharma",
    fromClass: "5-A",
    toClass: "6-A",
    type: "promotion", // promotion | transfer
    reason: "Annual Promotion",
    status: "pending",
  },
  {
    key: 2,
    name: "Riya Verma",
    photo: "https://ui-avatars.com/api/?name=Riya+Verma",
    fromClass: "8-B",
    toClass: "9-A",
    type: "promotion",
    reason: "Passed Final Exams",
    status: "pending",
  },
  {
    key: 3,
    name: "Mohit Singh",
    photo: "https://ui-avatars.com/api/?name=Mohit+Singh",
    fromClass: "10-A",
    toClass: "Transferred",
    type: "transfer",
    reason: "Family Relocation",
    status: "pending",
  },
  {
    key: 4,
    name: "Ananya Gupta",
    photo: "https://ui-avatars.com/api/?name=Ananya+Gupta",
    fromClass: "7-C",
    toClass: "8-B",
    type: "promotion",
    reason: "Academic Promotion",
    status: "pending",
  },
  {
    key: 5,
    name: "Rahul Meena",
    photo: "https://ui-avatars.com/api/?name=Rahul+Meena",
    fromClass: "9-A",
    toClass: "Transferred",
    type: "transfer",
    reason: "School Change (TC)",
    status: "pending",
  },
];

function StatusPill({ status }) {
  return (
    <span className="text-xs font-medium px-2 py-1 rounded bg-yellow-50 text-yellow-700">
      {status}
    </span>
  );
}

function TypePill({ type }) {
  return (
    <span
      className={`text-xs font-medium px-2 py-1 rounded ${
        type === "promotion"
          ? "bg-blue-50 text-blue-700"
          : "bg-rose-50 text-rose-700"
      }`}
    >
      {type}
    </span>
  );
}

export default function StudentPromotePage() {
  const [students, setStudents] = useState(initialData);
  const [viewStudent, setViewStudent] = useState(null);

  function approve(key) {
    alert("Approved (demo)");
    setStudents((prev) => prev.filter((s) => s.key !== key));
  }

  function reject(key) {
    alert("Rejected (demo)");
    setStudents((prev) => prev.filter((s) => s.key !== key));
  }

  return (
    <div className="space-y-4 p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Student Promotion / Transfer</h2>
          <p className="text-sm text-gray-500">
            Pending promotion & transfer requests (TC generation included)
          </p>
        </div>

        <div>
          <button
            className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700 transition"
            onClick={() => alert("Open promote / transfer form (next step)")}
          >
            + Promote / Transfer Student
          </button>
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded-xl p-4 shadow-xs border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold">Pending Requests</h3>
          <div className="text-sm text-gray-500">
            {students.length} pending
          </div>
        </div>

        <div className="overflow-x-auto rounded-md">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-2 px-3 text-xs font-medium text-gray-600">
                  Student
                </th>
                <th className="py-2 px-3 text-xs font-medium text-gray-600">
                  From Class
                </th>
                <th className="py-2 px-3 text-xs font-medium text-gray-600">
                  To Class
                </th>
                <th className="py-2 px-3 text-xs font-medium text-gray-600">
                  Type
                </th>
                <th className="py-2 px-3 text-xs font-medium text-gray-600">
                  Status
                </th>
                <th className="py-2 px-3 text-xs font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="border-t border-gray-300 divide-y divide-gray-200">
              {students.map((s) => (
                <tr key={s.key}>
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={s.photo}
                        alt={s.name}
                        className="w-9 h-9 rounded-full"
                      />
                      <div>
                        <div className="text-sm font-medium">{s.name}</div>
                        <div className="text-xs text-gray-500">
                          {s.reason}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-2 px-3 text-sm">{s.fromClass}</td>
                  <td className="py-2 px-3 text-sm">{s.toClass}</td>

                  <td className="py-2 px-3">
                    <TypePill type={s.type} />
                  </td>

                  <td className="py-2 px-3">
                    <StatusPill status={s.status} />
                  </td>

                  <td className="py-2 px-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setViewStudent(s)}
                        className="px-3 py-1 rounded-md border border-gray-200 text-sm hover:bg-gray-50"
                      >
                        View Details
                      </button>

                      <button
                        onClick={() => approve(s.key)}
                        className="px-3 py-1 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => reject(s.key)}
                        className="px-3 py-1 rounded-md border border-gray-200 text-sm hover:bg-gray-50"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW MODAL */}
      {viewStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setViewStudent(null)}
          />

          <div className="relative w-full max-w-xl bg-white rounded-xl shadow-xl p-6">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-semibold">{viewStudent.name}</h3>
              <button
                onClick={() => setViewStudent(null)}
                className="px-3 py-1 rounded-md border"
              >
                Close
              </button>
            </div>

            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-500">From:</span>{" "}
                {viewStudent.fromClass}
              </div>
              <div>
                <span className="text-gray-500">To:</span>{" "}
                {viewStudent.toClass}
              </div>
              <div>
                <span className="text-gray-500">Type:</span>{" "}
                {viewStudent.type}
              </div>
              <div>
                <span className="text-gray-500">Reason:</span>{" "}
                {viewStudent.reason}
              </div>

              {viewStudent.type === "transfer" && (
                <div className="mt-2 text-sm text-rose-600">
                  Transfer Case: TC will be generated after approval
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
