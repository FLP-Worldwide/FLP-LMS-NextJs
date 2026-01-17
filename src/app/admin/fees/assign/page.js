"use client";

import React, { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { api } from "@/utils/api";

/* ================= CONSTANTS ================= */

const ASSIGN_DATE_OPTIONS = [
  { label: "Trigger Date", value: "TRIGGER" },
  { label: "Batch Assign Date (BAD)", value: "BAD" },
  { label: "Days after BAD", value: "DAYS_AFTER_BAD" },
  { label: "Months after BAD", value: "MONTH_AFTER_BAD" },
];

/* ================= PAGE ================= */

export default function AssignFeesPage() {
  /* ================= FILTER STATE ================= */

  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);

  const [filters, setFilters] = useState({
    course_id: "",
    batch_id: "",
    academic_year: "2025-26",
    status: "ALL",
  });

  /* ================= ASSIGN MODAL ================= */

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [feeStructures, setFeeStructures] = useState([]);
  const [selectedStructureId, setSelectedStructureId] = useState("");
  const [installments, setInstallments] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  /* ================= FETCH ================= */

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const res = await api.get("/courses");
    setCourses(res.data?.data || []);
  };

  const fetchBatches = async (courseId) => {
    if (!courseId) return;
    const res = await api.get(`/batches?course_id=${courseId}`);
    setBatches(res.data?.data || []);
  };

  const searchStudents = async () => {
    const res = await api.get("/students/filter", { params: filters });
    setStudents(res.data?.data || []);
  };

  const fetchFeeStructures = async () => {
    const res = await api.get("/fees/structure/installments", {
      params: {
        course_id: filters.course_id,
        batch_id: filters.batch_id,
      },
    });

    setFeeStructures(res.data?.data || []);
  };

  const onSelectStructure = (structureId) => {
    setSelectedStructureId(structureId);

    const structure = feeStructures.find(
      (s) => s.id === Number(structureId)
    );

    if (!structure) return;

    setInstallments(structure.installments || []);
    setTotalAmount(
      structure.installments.reduce(
        (sum, i) => sum + Number(i.amount),
        0
      )
    );
  };

  /* ================= ASSIGN ================= */

  const assignFees = async () => {
    await api.post("/fees/assign", {
      student_id: selectedStudent.id,
      fees_structure_id: selectedStructureId,
    });

    setShowAssignModal(false);
  };

  /* ================= UI ================= */

  return (
    <div className="space-y-4">
      {/* ================= FILTER ROW ================= */}
      <div className="grid grid-cols-4 gap-4 bg-white p-4 rounded-xl border border-gray-200">
        <select
          className="soft-select"
          value={filters.course_id}
          onChange={(e) => {
            setFilters({ ...filters, course_id: e.target.value });
            fetchBatches(e.target.value);
          }}
        >
          <option value="">Category / Course*</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          className="soft-select"
          value={filters.batch_id}
          onChange={(e) =>
            setFilters({ ...filters, batch_id: e.target.value })
          }
        >
          <option value="">Batch*</option>
          {batches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>

        <select
          className="soft-select"
          value={filters.academic_year}
          onChange={(e) =>
            setFilters({ ...filters, academic_year: e.target.value })
          }
        >
          <option>2025-26</option>
          <option>2024-25</option>
        </select>

        <PrimaryButton name="Search" onClick={searchStudents} />
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Student Id</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Total Fee (Rs)</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {students.length === 0 && (
              <tr>
                <td colSpan="4" className="p-6 text-center text-gray-400">
                  No Student found !
                </td>
              </tr>
            )}

            {students.map((s) => (
              <tr key={s.id} className="border-t border-gray-100">
                <td className="p-3">{s.student_uid}</td>
                <td className="p-3">{s.name}</td>
                <td className="p-3">₹{s.total_fee}</td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => {
                      setSelectedStudent(s);
                      fetchFeeStructures();
                      setShowAssignModal(true);
                    }}
                    className="text-blue-600"
                  >
                    Assign
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= ASSIGN MODAL ================= */}
      {showAssignModal && (
        <Modal
          title="Assign Fee"
          onClose={() => setShowAssignModal(false)}
          rightSlot={
            <div className="bg-green-500 text-white px-4 py-2 rounded-md">
              Total Amount: ₹{totalAmount}
            </div>
          }
        >
          <div className="space-y-4">
            <select
              className="soft-select w-80"
              value={selectedStructureId}
              onChange={(e) => onSelectStructure(e.target.value)}
            >
              <option value="">Select Fee Structure</option>
              {feeStructures.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.fee_structure_name}
                </option>
              ))}
            </select>

            <table className="w-full text-xs border border-gray-200">
              <thead className="bg-blue-50">
                <tr>
                  <th className="p-2">#</th>
                  <th className="p-2">Fee Type</th>
                  <th className="p-2">Trigger</th>
                  <th className="p-2">Day/Month</th>
                  <th className="p-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {installments.map((i, idx) => (
                  <tr key={idx} className="border-t border-gray-100">
                    <td className="p-2">{idx + 1}</td>
                    <td className="p-2">{i.fee_type?.name}</td>
                    <td className="p-2">{i.assign_type}</td>
                    <td className="p-2">{i.offset}</td>
                    <td className="p-2">₹{i.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end gap-3 pt-4">
              <button
                className="soft-btn-outline"
                onClick={() => setShowAssignModal(false)}
              >
                Cancel
              </button>
              <PrimaryButton name="Assign Fee" onClick={assignFees} />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
