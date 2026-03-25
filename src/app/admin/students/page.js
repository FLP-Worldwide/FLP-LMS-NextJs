// src/app/admin/students/page.jsx
"use client";

import StudentsHeaderActions from "@/components/admin/StudentsHeaderActions";
import React, { useEffect, useState } from "react";
import { api } from "@/utils/api";
import { useRouter } from "next/navigation";
import { Settings } from "lucide-react";
import { Eye, Pencil, Trash2 } from "lucide-react";

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

  const [standards, setStandards] = useState([]);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);

  const [advanceFilter, setAdvanceFilter] = useState({
    status: "",
    class_id: "",
    course_id: "",
    batch_id: "",
    gender: "",
    religion: "",
    category: "",
    mother_tongue: "",
    blood_group: "",
    parent_profession: "",
    country: "",
    state: "",
    city: "",
    admission_from: "",
    admission_to: "",
  });



  const [quickFilter, setQuickFilter] = useState({
    class_id: "",
    course_id: "",
    batch_id: "",
    status: "",
  });

  const [filters, setFilters] = useState({
    status: "",
    class: "",
    gender: "",
  });

  const [viewStudent, setViewStudent] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAdvanceFilterData();
  }, []);

  const fetchAdvanceFilterData = async () => {
    try {
      const [classRes, courseRes, batchRes] = await Promise.all([
        api.get("/classes"),
        api.get("/courses"),
        api.get("/batches"),
      ]);

      setStandards(classRes.data?.data || []);
      setCourses(courseRes.data?.data || []);
      setBatches(batchRes.data?.data || []);
    } catch (e) {
      console.error("Advance filter load failed", e);
    }
  };

  useEffect(() => {
    fetchFilterData();
  }, []);

  const fetchFilterData = async () => {
    try {
      const [classRes, courseRes, batchRes] = await Promise.all([
        api.get("/classes"),
        api.get("/courses"),
        api.get("/batches"),
      ]);

      setStandards(classRes.data?.data || []);
      setCourses(courseRes.data?.data || []);
      setBatches(batchRes.data?.data || []);
    } catch (e) {
      console.error("Filter data load failed", e);
    }
  };

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

const applyAdvancedFilters = async () => {
  try {
    setLoading(true);

    const res = await api.get("/students", {
      params: {
        ...advanceFilter,
      },
    });

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
    console.error("Advanced filter failed", e);
  } finally {
    setLoading(false);
  }
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

    // 🔹 Basic filters
    setFilters({
      status: "",
      class: "",
      gender: "",
    });

    // 🔹 Quick filter reset
    setQuickFilter({
      class_id: "",
      course_id: "",
      batch_id: "",
      status: "",
    });

    // 🔹 Advanced filter reset
    setAdvanceFilter({
      status: "",
      class_id: "",
      course_id: "",
      batch_id: "",
      gender: "",
      religion: "",
      category: "",
      mother_tongue: "",
      blood_group: "",
      parent_profession: "",
      country: "",
      state: "",
      city: "",
      admission_from: "",
      admission_to: "",
    });

    // 🔹 Search reset
    setSearch("");

    // 🔹 Reset data (IMPORTANT → reload from API)
    fetchStudents();

    // 🔹 UI reset
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

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this student?")) return;

    try {
      await api.delete(`/students/${id}`);
      fetchStudents(); // refresh list
    } catch (e) {
      console.error("Delete failed", e);
    }
  };

  const applyQuickFilter = async () => {
    try {
      setLoading(true);

      const res = await api.get("/students", {
        params: {
          class_id: quickFilter.class_id,
          course_id: quickFilter.course_id,
          batch_id: quickFilter.batch_id,
          status: quickFilter.status,
        },
      });

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
      console.error("Quick filter failed", e);
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
          
          <select
            className="border border-gray-200 rounded px-3 py-2 text-sm"
            value={quickFilter.class_id}
            onChange={(e) =>
              setQuickFilter({ ...quickFilter, class_id: e.target.value })
            }
          >
            <option value="">Select Standard</option>
            {standards.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            className="border border-gray-200 rounded px-3 py-2 text-sm"
            value={quickFilter.course_id}
            onChange={(e) =>
              setQuickFilter({ ...quickFilter, course_id: e.target.value })
            }
          >
            <option value="">Select Category/Courses</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            className="border border-gray-200 rounded px-3 py-2 text-sm"
            value={quickFilter.batch_id}
            onChange={(e) =>
              setQuickFilter({ ...quickFilter, batch_id: e.target.value })
            }
          >
            <option value="">Select Batch</option>
            {batches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>

         <select
            className="border border-gray-200 rounded px-3 py-2 text-sm"
            value={quickFilter.status}
            onChange={(e) =>
              setQuickFilter({ ...quickFilter, status: e.target.value })
            }
          >
            <option value="">Both</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={applyQuickFilter}
          >
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

                      {/* VIEW */}
                      <button
                        onClick={() => router.push(`/admin/students/${s.key}`)}
                        className="p-2 rounded-md border hover:bg-gray-50"
                        title="View"
                      >
                        <Eye size={16} />
                      </button>

                      {/* EDIT */}
                      <button
                        onClick={() => router.push(`/admin/students/${s.key}/edit`)}
                        className="p-2 rounded-md border hover:bg-blue-50 text-blue-600"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>

                      {/* DELETE */}
                      <button
                        onClick={() => handleDelete(s.key)}
                        className="p-2 rounded-md border hover:bg-red-50 text-red-600"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>

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

              {/* STATUS */}
              <select
                className="soft-select w-full"
                value={advanceFilter.status}
                onChange={(e) =>
                  setAdvanceFilter({ ...advanceFilter, status: e.target.value })
                }
              >
                <option value="">Both</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="passed">Passed</option>
                <option value="left">Left</option>
              </select>

              <div className="grid grid-cols-2 gap-4">

                {/* STANDARD */}
                <select
                  className="soft-select"
                  value={advanceFilter.class_id}
                  onChange={(e) =>
                    setAdvanceFilter({ ...advanceFilter, class_id: e.target.value })
                  }
                >
                  <option value="">Select Standard</option>
                  {standards.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>

                {/* COURSE */}
                <select
                  className="soft-select"
                  value={advanceFilter.course_id}
                  onChange={(e) =>
                    setAdvanceFilter({ ...advanceFilter, course_id: e.target.value })
                  }
                >
                  <option value="">Select Course</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>

                {/* BATCH */}
                <select
                  className="soft-select"
                  value={advanceFilter.batch_id}
                  onChange={(e) =>
                    setAdvanceFilter({ ...advanceFilter, batch_id: e.target.value })
                  }
                >
                  <option value="">Select Batch</option>
                  {batches.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>

                {/* GENDER */}
                <select
                  className="soft-select"
                  value={advanceFilter.gender}
                  onChange={(e) =>
                    setAdvanceFilter({ ...advanceFilter, gender: e.target.value })
                  }
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>

                {/* RELIGION */}
                <input
                  className="soft-input"
                  placeholder="Religion"
                  value={advanceFilter.religion}
                  onChange={(e) =>
                    setAdvanceFilter({ ...advanceFilter, religion: e.target.value })
                  }
                />

                {/* CATEGORY */}
                <input
                  className="soft-input"
                  placeholder="Category"
                  value={advanceFilter.category}
                  onChange={(e) =>
                    setAdvanceFilter({ ...advanceFilter, category: e.target.value })
                  }
                />

                {/* MOTHER TONGUE */}
                <input
                  className="soft-input"
                  placeholder="Mother Tongue"
                  value={advanceFilter.mother_tongue}
                  onChange={(e) =>
                    setAdvanceFilter({ ...advanceFilter, mother_tongue: e.target.value })
                  }
                />

                {/* BLOOD GROUP */}
                <select
                  className="soft-select"
                  value={advanceFilter.blood_group}
                  onChange={(e) =>
                    setAdvanceFilter({ ...advanceFilter, blood_group: e.target.value })
                  }
                >
                  <option value="">Blood Group</option>
                  <option>A+</option>
                  <option>B+</option>
                  <option>O+</option>
                  <option>AB+</option>
                </select>
              </div>

              {/* PARENT */}
              <h4 className="font-semibold text-gray-700">Parent Details</h4>

              <input
                className="soft-input w-full"
                placeholder="Parent Profession"
                value={advanceFilter.parent_profession}
                onChange={(e) =>
                  setAdvanceFilter({ ...advanceFilter, parent_profession: e.target.value })
                }
              />

              {/* ADDRESS */}
              <h4 className="font-semibold text-gray-700">Address</h4>

              <div className="grid grid-cols-2 gap-4">
                <input
                  className="soft-input"
                  placeholder="Country"
                  value={advanceFilter.country}
                  onChange={(e) =>
                    setAdvanceFilter({ ...advanceFilter, country: e.target.value })
                  }
                />

                <input
                  className="soft-input"
                  placeholder="State"
                  value={advanceFilter.state}
                  onChange={(e) =>
                    setAdvanceFilter({ ...advanceFilter, state: e.target.value })
                  }
                />

                <input
                  className="soft-input col-span-2"
                  placeholder="City"
                  value={advanceFilter.city}
                  onChange={(e) =>
                    setAdvanceFilter({ ...advanceFilter, city: e.target.value })
                  }
                />
              </div>

              {/* DATE */}
              <h4 className="font-semibold text-gray-700">Admission Date</h4>

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  className="soft-input"
                  value={advanceFilter.admission_from}
                  onChange={(e) =>
                    setAdvanceFilter({ ...advanceFilter, admission_from: e.target.value })
                  }
                />

                <input
                  type="date"
                  className="soft-input"
                  value={advanceFilter.admission_to}
                  onChange={(e) =>
                    setAdvanceFilter({ ...advanceFilter, admission_to: e.target.value })
                  }
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
                  applyAdvancedFilters();
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
