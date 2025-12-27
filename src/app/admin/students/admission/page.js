// src/app/admin/students/page.jsx
"use client";

import React, { useState } from "react";

const initialData = [
  {
    key: 1,
    admissionNo: "ADM-2025-001",
    name: "Aarav Sharma",
    photo: "https://ui-avatars.com/api/?name=Aarav+Sharma",
    role: "Student",
    mobile: "9876543210",
    class: "10",
    section: "A",
    fatherName: "Rakesh Sharma",
    admissionDate: "2025-04-10",
    status: "active", // active | inactive
  },
];

function StatusPill({ status }) {
  const map = {
    active: "bg-blue-50 text-blue-700",
    inactive: "bg-gray-100 text-gray-600",
  };
  return (
    <span
      className={`text-xs font-medium px-2 py-1 rounded ${
        map[status] || "bg-gray-50 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}

export default function StudentsAddmissionPage() {
  const [students] = useState(initialData);
  const [viewStudent, setViewStudent] = useState(null);

  return (
    <div className="space-y-4">
      {/* HEADER */}
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">New Admissions</h2>
          <p className="text-sm text-gray-500">
            Students not yet assigned to any class or course
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/admin/students/admission/new"
            className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700 transition"
          >
            + New Admission
          </a>
        </div>
      </div>


      {/* CARD */}
      <div className="bg-white rounded-xl p-4 shadow-xs border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold">All Students</h3>
          <div className="text-sm text-gray-500">
            {students.length} total
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
                  Admission No
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
                  Admission Date
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
                        <div className="text-xs text-gray-500">{s.role}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-2 px-3 text-sm">
                    {s.admissionNo}
                  </td>

                  <td className="py-2 px-3 text-sm">
                    Class {s.class} – {s.section}
                  </td>

                  <td className="py-2 px-3 text-sm">
                    {s.fatherName}
                  </td>

                  <td className="py-2 px-3 text-sm">
                    {s.mobile}
                  </td>

                  <td className="py-2 px-3 text-sm">
                    {s.admissionDate}
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
                        className="px-3 py-1 rounded-md border border-gray-200 text-sm hover:bg-gray-50"
                      >
                        Fees Structure
                      </button>

                      <button
                        className="px-3 py-1 rounded-md border border-gray-200 text-sm hover:bg-gray-50"
                      >
                        Report Card
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
              <h3 className="text-lg font-semibold">
                {viewStudent.name}
              </h3>
              <button
                onClick={() => setViewStudent(null)}
                className="px-3 py-1 rounded-md border"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-500">Admission No</div>
                <div>{viewStudent.admissionNo}</div>
              </div>
              <div>
                <div className="text-gray-500">Class</div>
                <div>
                  {viewStudent.class} – {viewStudent.section}
                </div>
              </div>
              <div>
                <div className="text-gray-500">Father Name</div>
                <div>{viewStudent.fatherName}</div>
              </div>
              <div>
                <div className="text-gray-500">Mobile</div>
                <div>{viewStudent.mobile}</div>
              </div>
              <div>
                <div className="text-gray-500">Admission Date</div>
                <div>{viewStudent.admissionDate}</div>
              </div>
              <div>
                <div className="text-gray-500">Status</div>
                <StatusPill status={viewStudent.status} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
