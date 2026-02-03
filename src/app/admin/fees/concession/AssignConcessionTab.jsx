"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/utils/api";
import MultiSelectDropdown from "@/components/ui/MultiSelectDropdown";
import Modal from "@/components/ui/Modal";
import PrimaryButton from "@/components/ui/PrimaryButton";

export default function AssignConcessionTab() {
  /* ================= STATE ================= */
  const [mode, setMode] = useState("STUDENT"); // STUDENT | CONCESSION

  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [concessions, setConcessions] = useState([]);

  const [courseId, setCourseId] = useState("");
  const [batchId, setBatchId] = useState("");
  const [concessionId, setConcessionId] = useState("");

  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [showConcessionModal, setShowConcessionModal] = useState(false);
    const [availableConcessions, setAvailableConcessions] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectedConcessionId, setSelectedConcessionId] = useState("");


  /* ================= FETCH ================= */

  useEffect(() => {
    fetchCourses();
    fetchConcessions();
  }, []);

  const fetchCourses = async () => {
    const res = await api.get("/courses");
    setCourses(res.data?.data || []);
  };

  const fetchBatches = async (cid) => {
    if (!cid) return;
    const res = await api.get(`/batches?course_id=${cid}`);
    setBatches(res.data?.data || []);
  };

  const fetchConcessions = async () => {
    const res = await api.get("/fees/concessions");
    setConcessions(res.data?.data || []);
  };

  const fetchStudents = async () => {
    setLoading(true);

    const params =
      mode === "STUDENT"
        ? { course_id: courseId, batch_id: batchId, search }
        : {
            course_id: courseId,
            batch_id: batchId,
            concession_id: concessionId,
          };

    const res = await api.get("/fees/concessions/students", { params });
    setStudents(res.data?.data || []);
    setLoading(false);
  };

    const assignConcessionToStudent = async (studentId, consId) => {
        await api.post("/fees/concessions/assign", {
            student_id: studentId,
            concession_id: consId,
        });

        setShowConcessionModal(false);
        setSelectedConcessionId("");
        setSelectedStudent(null);

        fetchStudents(); // refresh table
    };

   const handleAssignClick = async (student) => {
    // CASE 1: concession already selected (concession-based search)
    if (concessionId) {
        await assignConcessionToStudent(student.id, concessionId);
        return;
    }

    // CASE 2: student-based search (no concession)
    setSelectedStudent(student);

    const res = await api.get("/fees/concessions/by-batch", {
        params: { batch_id: batchId },
    });

    const list = res.data?.data || [];

    if (list.length === 0) {
        alert("No concessions found for this batch");
        return;
    }

    setAvailableConcessions(list);
    setShowConcessionModal(true);
    };



  /* ================= UI ================= */

  return (
    <div className="space-y-4">
      {/* ================= RADIO ================= */}
      <div className="flex gap-6 text-sm">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            checked={mode === "STUDENT"}
            onChange={() => setMode("STUDENT")}
          />
          Student Based Allocation
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            checked={mode === "CONCESSION"}
            onChange={() => setMode("CONCESSION")}
          />
          Concession Based Allocation
        </label>
      </div>

      {/* ================= FILTER BAR ================= */}
      <div className="bg-gray-50 rounded-xl flex items-center gap-2">
        {/* CONCESSION (only in concession mode) */}
        {mode === "CONCESSION" && (
          <select
            className="soft-select w-56"
            value={concessionId}
            onChange={(e) => setConcessionId(e.target.value)}
          >
            <option value="">Select Concession</option>
            {concessions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        )}

        {/* COURSE */}
        <select
          className="soft-select w-56"
          value={courseId}
          onChange={(e) => {
            setCourseId(e.target.value);
            setBatchId("");
            fetchBatches(e.target.value);
          }}
        >
          <option value="">Select Category/Course</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* BATCH */}
        <select
          className="soft-select w-56"
          value={batchId}
          onChange={(e) => setBatchId(e.target.value)}
        >
          <option value="">Select Batch</option>
          {batches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>

        <PrimaryButton name="Go" onClick={fetchStudents} />

        {/* SEARCH */}
        {mode === "STUDENT" && (
          <input
            className="soft-input ml-auto w-80"
            placeholder="Search by Student Name / Contact No. / Student ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        )}
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-blue-50">
            <tr>
              {mode === "CONCESSION" && (
                <th className="p-3 w-10">
                  <input type="checkbox" />
                </th>
              )}
              <th className="p-3">Student ID</th>
              <th className="p-3">Student Name</th>
              <th className="p-3">Contact No.</th>
              {mode === "STUDENT" && (
                <th className="p-3">Assigned Concession(s)</th>
              )}
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {students.length === 0 && !loading && (
                <tr>
                <td colSpan="4" className="p-8 text-center text-gray-400">
                    No students found
                </td>
                </tr>
            )}

            {students.map((s) => (
                <tr key={s.id} className="border-t">
                {/* checkbox (optional, future bulk use) */}
                <td className="p-3">
                    <input type="checkbox" disabled={s.assigned} />
                </td>

                {/* Student ID */}
                <td className="p-3">{s.admission_no}</td>

                {/* Name */}
                <td className="p-3">{s.name}</td>

                {/* Action */}
                <td className="p-3 text-right">
                    {s.is_assigned ? (
                    <span className="text-blue-600 font-medium cursor-not-allowed">
                        Already Assigned
                    </span>
                    ) : (
                    <button
                        className="text-blue-600 font-medium"
                        onClick={() => handleAssignClick(s)}
                        >
                        Assign
                    </button>
                    )}
                </td>
                </tr>
            ))}
            </tbody>

        </table>
      </div>
      {showConcessionModal && (
  <Modal
    title="Select Concession"
    onClose={() => setShowConcessionModal(false)}
  >
    <div className="space-y-4">
      <div className="text-sm">
        Assign concession to{" "}
        <span className="font-medium">
          {selectedStudent?.name}
        </span>
      </div>

      <div>
        <label className="text-xs font-medium">
          Concession<span className="text-red-500">*</span>
        </label>
        <select
          className="soft-select mt-1"
          value={selectedConcessionId}
          onChange={(e) => setSelectedConcessionId(e.target.value)}
        >
          <option value="">Select Concession</option>
          {availableConcessions.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          className="soft-btn-outline"
          onClick={() => setShowConcessionModal(false)}
        >
          Cancel
        </button>

        <button
          className="soft-btn-primary"
          disabled={!selectedConcessionId}
          onClick={() =>
            assignConcessionToStudent(
              selectedStudent.id,
              selectedConcessionId
            )
          }
        >
          Assign
        </button>
      </div>
    </div>
  </Modal>
)}


    </div>
  );
}
