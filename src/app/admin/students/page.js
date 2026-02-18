// src/app/admin/students/page.jsx
"use client";

import StudentsHeaderActions from "@/components/admin/StudentsHeaderActions";
import React, { useEffect, useState } from "react";
import { api } from "@/utils/api";
import { useRouter } from "next/navigation";
function StatusPill({ status }) {
  const map = {
    active: "bg-blue-50 text-blue-700",
    inactive: "bg-gray-100 text-gray-600",
    passed: "bg-green-50 text-green-700",
    left: "bg-red-50 text-red-700",
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

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [viewStudent, setViewStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);

      const res = await api.get("/students");

      const mapped = (res.data?.data || []).map((s) => ({
        key: s.id,
        admissionNo: s.admission_no,
        name: `${s.first_name} ${s.last_name ?? ""}`.trim(),
        role: "Student",
        photo:
          s.details?.photo ||
          `https://ui-avatars.com/api/?name=${s.first_name}+${s.last_name ?? ""}`,
        mobile: s.phone || "-",
        class: s.classes?.name || "-",
        section: s.section || "-",
        fatherName: s.father_name || "-",
        admissionDate: s.admission_date || "-",
        status: s.status,
      }));

      setStudents(mapped);
    } catch (e) {
      console.error("Failed to load students", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-6">
      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold">Students</h2>
          <p className="text-sm text-gray-500">
            Manage students and their academic details
          </p>
        </div>

        <StudentsHeaderActions />
      </div>

      {/* CARD */}
      <div className="bg-white rounded-xl p-4 shadow-xs border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold">All Students</h3>
          <div className="text-sm text-gray-500">
            {loading ? "Loading..." : `${students.length} total`}
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

                  <td className="py-2 px-3 text-sm">{s.admissionNo}</td>

                  <td className="py-2 px-3 text-sm">
                  {s.class} – {s.section}
                  </td>

                  <td className="py-2 px-3 text-sm">{s.fatherName}</td>

                  <td className="py-2 px-3 text-sm">{s.mobile}</td>

                  <td className="py-2 px-3 text-sm">{s.admissionDate}</td>

                  <td className="py-2 px-3">
                    <StatusPill status={s.status} />
                  </td>

                  <td className="py-2 px-3">
                    <div className="flex items-center gap-2">
                      {/* <a href={`/admin/students/${s.key}`}> */}
                      <button onClick={() => router.push(`/admin/students/${s.key}`)}
                        className="px-3 py-1 rounded-md border border-gray-200 text-sm hover:bg-gray-50"
                      >
                        View Details
                      </button>
                      {/* </a> */}
                    </div>
                  </td>
                </tr>
              ))}

              {!loading && students.length === 0 && (
                <tr>
                  <td
                    colSpan="8"
                    className="py-6 text-center text-sm text-gray-500"
                  >
                    No students found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW MODAL (UNCHANGED) */}
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
