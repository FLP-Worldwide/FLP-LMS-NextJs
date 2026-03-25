// src/app/admin/students/page.jsx
"use client";

import StudentsHeaderActions from "@/components/admin/StudentsHeaderActions";
import React, { useEffect, useState } from "react";
import { api } from "@/utils/api";
import { useRouter } from "next/navigation";
import { Settings } from "lucide-react";

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
const [showQuickFilter, setShowQuickFilter] = useState(false);
const [showAdvanceFilter, setShowAdvanceFilter] = useState(false);
  const [students, setStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [search, setSearch] = useState("");
const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    class: "",
    gender: "",
  });

  const [viewStudent, setViewStudent] = useState(null);
  const [loading, setLoading] = useState(false);

 const isFilterActive =
  search ||
  filters.status ||
  filters.class ||
  filters.gender ||
  showQuickFilter;
    
  const applySearch = (value) => {
    setSearch(value);

    const term = value.toLowerCase();

    let filtered = [...allStudents];

    if (term) {
      filtered = filtered.filter((s) =>
        s.name.toLowerCase().includes(term) ||
        s.admissionNo?.toLowerCase().includes(term) ||
        s.mobile?.toLowerCase().includes(term)
      );
    }

    if (filters.status) {
      filtered = filtered.filter((s) => s.status === filters.status);
    }

    setStudents(filtered);
  };

const applyFilters = () => {

  let filtered = [...allStudents];

  if (search) {
    const term = search.toLowerCase();

    filtered = filtered.filter((s) =>
      s.name.toLowerCase().includes(term) ||
      s.admissionNo?.toLowerCase().includes(term) ||
      s.mobile?.toLowerCase().includes(term)
    );
  }

  if (filters.status) {
    filtered = filtered.filter((s) => s.status === filters.status);
  }

  if (filters.class) {
    filtered = filtered.filter((s) => s.class === filters.class);
  }

  setStudents(filtered);
};

useEffect(() => {
  const closeMenu = () => setShowFilterMenu(false);
  window.addEventListener("click", closeMenu);

  return () => window.removeEventListener("click", closeMenu);
}, []);

const clearFilters = () => {

  setFilters({
    status: "",
    class: "",
    gender: "",
  });

  setSearch("");

  setStudents(allStudents);

  // reset UI states
  setShowQuickFilter(false);
  setShowAdvanceFilter(false);
};


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
      setAllStudents(mapped);

    } catch (e) {
      console.error("Failed to load students", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-6">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-3">

        <input
          placeholder="Search By Name/Contact No/Student ID"
          value={search}
          onChange={(e) => applySearch(e.target.value)}
          className="border border-gray-200 rounded px-3 py-2 text-sm w-72"
        />

        <button
          onClick={() => applySearch(search)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Search
        </button>

      </div>


      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold">Students</h2>
          <p className="text-sm text-gray-500">
            Manage students and their academic details
          </p>
        </div>

        <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/admin/students/student-setting")}
              className="p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              <Settings size={18} />
            </button>

{isFilterActive && (
  <button
    onClick={() => {
      clearFilters();
      setShowQuickFilter(false);
    }}
    className="px-3 py-1 rounded-md border border-red-300 text-red-500 text-sm hover:bg-red-50"
  >
    Clear Filter
  </button>
)}

            <div className="relative">
<button
  onClick={(e) => {
    e.stopPropagation();
    setShowFilterMenu(!showFilterMenu);
  }}
  className="px-3 py-1 rounded-md border border-gray-200 text-sm hover:bg-gray-50 flex items-center gap-1"
>
  Filter
</button>

  {showFilterMenu && (
    <div
        className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-md z-50"
        onClick={(e) => e.stopPropagation()}
      >
      
    <button
  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
  onClick={() => {
    setShowFilterMenu(false);
    setShowQuickFilter(true);
  }}
>
  Quick Filter
</button>

<button
  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
  onClick={() => {
    setShowFilterMenu(false);
    setShowAdvanceFilter(true);
  }}
>
  Advance Filter
</button>

    </div>
  )}
</div>


            <StudentsHeaderActions />
        </div>

      </div>

      {showQuickFilter && (
  <div className="flex items-center gap-3 bg-white p-4 rounded-lg border border-gray-200">
    
    <select className="border border-gray-200 rounded px-3 py-2 text-sm">
      <option>Select Standard</option>
    </select>

    <select className="border border-gray-200 rounded px-3 py-2 text-sm">
      <option>Select Category/Courses</option>
    </select>

    <select className="border border-gray-200  rounded px-3 py-2 text-sm">
      <option>Select Batch</option>
    </select>

    <select className="border border-gray-200 rounded px-3 py-2 text-sm">
      <option>Both</option>
      <option>Active</option>
      <option>Inactive</option>
    </select>

    <button className="px-4 py-2 bg-blue-600 text-white rounded">
      Search
    </button>
  </div>
)}
      {/* CARD */}
      <div className="bg-white rounded-xl p-4 shadow-xs border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold">All Students</h3>
          <div className="text-sm text-gray-500">
            {loading ? "Loading..." : `${students.length} total`}
          </div>
        </div>

        <div className="overflow-x-auto rounded-md">
          <table className="w-full text-left border-collapse border-gray-200">
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


     {showAdvanceFilter && (
  <div className="fixed inset-0 z-50 flex justify-end">

    {/* Overlay */}
    <div
      className="absolute inset-0 bg-black/30"
      onClick={() => setShowAdvanceFilter(false)}
    />

    {/* Panel */}
    <div className="relative w-[520px] h-full bg-white shadow-xl overflow-y-auto">

      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <h3 className="text-lg font-semibold">Advance Filter</h3>

        <button
          onClick={() => setShowAdvanceFilter(false)}
          className="text-gray-500 text-xl"
        >
          ×
        </button>
      </div>

      <div className="p-6 space-y-6">

        {/* STUDENT DETAILS */}
        <h4 className="font-semibold text-gray-700">Student Details</h4>

        <div>
          <label className="text-sm">Is Active</label>
          <select className="soft-select w-full">
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <select className="soft-select">
            <option>Select Standard</option>
          </select>

          <select className="soft-select">
            <option>Select Category/Course</option>
          </select>

          <select className="soft-select">
            <option>Select Batch</option>
          </select>

          <select className="soft-select">
            <option>Select Gender</option>
          </select>

          <select className="soft-select">
            <option>Select Religion</option>
          </select>

          <select className="soft-select">
            <option>Select Category</option>
          </select>

          <select className="soft-select">
            <option>Select Mother Tongue</option>
          </select>

          <select className="soft-select">
            <option>Select Blood Group</option>
          </select>
        </div>

        {/* PARENT DETAILS */}
        <h4 className="font-semibold text-gray-700">Parent/Guardian Details</h4>

        <select className="soft-select w-full">
          <option>Select Parent Profession</option>
        </select>

        {/* ADDRESS */}
        <h4 className="font-semibold text-gray-700">Address Details</h4>

        <div className="grid grid-cols-2 gap-4">
          <select className="soft-select">
            <option>Select Country</option>
          </select>

          <select className="soft-select">
            <option>Select State</option>
          </select>

          <select className="soft-select col-span-2">
            <option>Select City</option>
          </select>
        </div>

        {/* ADMIN DETAILS */}
        <h4 className="font-semibold text-gray-700">Administration Details</h4>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="date"
            className="soft-input"
            placeholder="Admission From Date"
          />

          <input
            type="date"
            className="soft-input"
            placeholder="Admission To Date"
          />
        </div>

      </div>

      {/* FOOTER */}
      <div className="flex justify-end gap-3 p-6 border-t">
        <button
          className="soft-btn-outline"
          onClick={clearFilters}
        >
          Clear Filter
        </button>

        <button
          className="soft-btn-primary border bg-blue-500 text-white px-2 py-1 rounded"
          onClick={() => {
            applyFilters();
            setShowAdvanceFilter(false);
          }}
        >
          Apply
        </button>
      </div>

    </div>
  </div>
)}
    </div>
  );
}
