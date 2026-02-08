"use client";

import React, { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { api } from "@/utils/api";
import { formatRupees } from "@/lib/formatHelper";
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
  const [loadingStudents, setLoadingStudents] = useState(false);


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
const [feeTypes, setFeeTypes] = useState([]);
  const [extraInstallments, setExtraInstallments] = useState([
  {
    fee_type_id: "",
    assign_type: "TRIGGER",
    offset: "",
    amount: "",
  },
]);

const addExtraRow = () => {
  setExtraInstallments((p) => [
    ...p,
    { fee_type_id: "", assign_type: "TRIGGER", offset: "", amount: "" },
  ]);
};
const fetchFeeTypes = async () => {
  const res = await api.get("/fees/types");
  setFeeTypes(res.data?.data || []);
};

useEffect(() => {
  fetchFeeTypes();
}, []);
const removeExtraRow = (index) => {
  setExtraInstallments((p) => p.filter((_, i) => i !== index));
};

const updateExtraRow = (index, key, value) => {
  setExtraInstallments((p) => {
    const copy = [...p];
    copy[index][key] = value;
    return copy;
  });
};


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
    setLoadingStudents(true);

    try {
      const res = await api.get("/students/filter", {
        params: filters,
      });

      setStudents(res.data?.data || []);
    } catch (error) {
      console.error("Failed to filter students", error);
      setStudents([]);
    } finally {
      setLoadingStudents(false);
    }
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

   if (!structure) {
      setInstallments([]);
      setTotalAmount(0);
      return;
    }


    setInstallments(structure.installments || []);

    setTotalAmount(
      structure.installments.reduce(
        (sum, i) => sum + Number(i.amount),
        0
      )
    );

    
  };

  useEffect(() => {
    const baseTotal = installments.reduce(
      (s, i) => s + Number(i.amount || 0),
      0
    );

    const extraTotal = extraInstallments.reduce(
      (s, i) => s + Number(i.amount || 0),
      0
    );

    setTotalAmount(baseTotal + extraTotal);
  }, [installments, extraInstallments]);

  /* ================= ASSIGN ================= */
const fetchStructuresByClass = async (classId) => {
  try {
    const res = await api.get(`/fees/structures/by-class/${classId}`);
    setFeeStructures(res.data?.data || []);
  } catch (error) {
    console.error("Failed to load fee structures", error);
    setFeeStructures([]);
  }
};

  const assignFees = async () => {
    if (!selectedStructureId) {
      alert("Please select a Fee Structure");
      return;
    }

    try {
      await api.post("/fees/assign-to-student", {
        student_id: selectedStudent.id,
        fees_structure_id: selectedStructureId,
        extra_installments: extraInstallments
          .filter((i) => i.fee_type_id && i.amount)
          .map((i) => ({
            ...i,
            offset: Number(i.offset || 0),
            amount: Number(i.amount),
          })),
      });

      // ✅ CLOSE MODAL
      setShowAssignModal(false);

      // ✅ CLEAR SELECTION (optional but clean)
      setSelectedStudent(null);

      // ✅ REFRESH STUDENT LIST WITH UPDATED FEES
      await searchStudents();

    } catch (error) {
      alert(
        error?.response?.data?.message ||
        "Failed to assign fees"
      );
    }
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
              <th className="p-3 text-left">Class</th>
              <th className="p-3 text-left">Total Fee (Rs)</th>
              <th className="p-3 text-left">Total Assign Fee (Rs)</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {loadingStudents && (
              <tr>
                <td colSpan="4" className="p-6 text-center text-gray-400">
                  Loading...
                </td>
              </tr>
            )}

            {!loadingStudents && students.length === 0 && (
              <tr>
                <td colSpan="4" className="p-6 text-center text-gray-400">
                  No Student found !
                </td>
              </tr>
            )}

            {!loadingStudents &&
              students.map((s) => (
                <tr key={s.id} className="border-t border-gray-100">
                  {/* Student ID */}
                  <td className="p-3 font-mono">
                    {s.admission_no}
                  </td>

                  {/* Name */}
                  <td className="p-3">
                    {s.first_name} {s.last_name}
                  </td>

                  {/* Total Fee (not in API yet) */}
                  <td className="p-3">
                    Class {s.class} - {s.section}
                  </td>
                  <td className="p-3">
                    {formatRupees(s.total_fees) || "N/A"}
                  </td>
                  <td className="p-3">
                    {formatRupees(s.assigned_fees) || "N/A"}
                  </td>

                  {/* Action */}
                  <td className="p-3 text-right">
                    <button
                      onClick={() => {
                        setSelectedStudent(s);

                        // 🔥 fetch fee structures by student class
                        fetchStructuresByClass(s.class);

                        // reset modal state
                        setSelectedStructureId("");
                        setInstallments([]);
                        setTotalAmount(0);

                        setShowAssignModal(true);
                        // ✅ RESET EXTRA FEES
                        setExtraInstallments([
                          {
                            fee_type_id: "",
                            assign_type: "TRIGGER",
                            offset: "",
                            amount: "",
                          },
                        ]);

                      }}
                      className="text-blue-600"
                    >
                      Assign/ Manage Fee
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
                  {s.name || s.fees_type?.name}
                </option>
              ))}
            </select>
              {/* ================= ADD EXTRA INSTALLMENTS ================= */}
              <div className="mt-4 border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-semibold text-gray-700">
                    Add Extra Fee (Optional)
                  </h4>
                </div>

                {extraInstallments.map((row, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-2 items-center mb-2"
                  >
                    {/* Fee Type */}
                    <div className="col-span-3">
                      <select
                        className="soft-select"
                        value={row.fee_type_id}
                        onChange={(e) =>
                          updateExtraRow(index, "fee_type_id", e.target.value)
                        }
                      >
                        <option value="">Fee Type</option>
                          {feeTypes.map((f) => (
                            <option key={f.id} value={f.id}>
                              {f.name}
                            </option>
                          ))}
                      </select>
                    </div>

                    {/* Trigger */}
                    <div className="col-span-3">
                      <select
                        className="soft-select"
                        value={row.assign_type}
                        onChange={(e) =>
                          updateExtraRow(index, "assign_type", e.target.value)
                        }
                      >
                        <option value="TRIGGER">Trigger Date</option>
                        <option value="BAD">Batch Assign Date (BAD)</option>
                        <option value="DAYS_AFTER_BAD">Days after BAD</option>
                        <option value="MONTH_AFTER_BAD">Months after BAD</option>
                      </select>
                    </div>

                    {/* Offset */}
                    <div className="col-span-2">
                      <input
                        type="number"
                        className="soft-input"
                        placeholder="Day/Month"
                        value={row.offset}
                        onChange={(e) =>
                          updateExtraRow(index, "offset", e.target.value)
                        }
                      />
                    </div>

                    {/* Amount */}
                    <div className="col-span-3">
                      <input
                        type="number"
                        className="soft-input"
                        placeholder="Amount"
                        value={row.amount}
                        onChange={(e) =>
                          updateExtraRow(index, "amount", e.target.value)
                        }
                      />
                    </div>

                    {/* Action */}
                    <div className="col-span-1 flex gap-1">
                      {index === extraInstallments.length - 1 && (
                        <button
                          onClick={addExtraRow}
                          className="text-blue-600 text-xl"
                        >
                          +
                        </button>
                      )}
                      {extraInstallments.length > 1 && (
                        <button
                          onClick={() => removeExtraRow(index)}
                          className="text-red-500 text-xl"
                        >
                          −
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>


            <table className="w-full text-xs border border-gray-200">
              <thead className="bg-blue-50">
                <tr>
                  <th className="p-2 text-left">#</th>
                  <th className="p-2 text-left">Fee Type</th>
                  <th className="p-2 text-left">Trigger</th>
                  <th className="p-2 text-left">Day/Month</th>
                  <th className="p-2 text-left">Amount</th>
                </tr>
              </thead>
              <tbody>
                {/* Structure Installments */}
                {installments.map((i, idx) => (
                  <tr key={`base-${idx}`}>
                    <td className="p-2">{idx + 1}</td>
                    <td className="p-2">{i.fees_type?.name}</td>
                    <td className="p-2">{i.assign_type}</td>
                    <td className="p-2">{i.offset}</td>
                    <td className="p-2">₹{i.amount}</td>
                  </tr>
                ))}

                {/* Extra Installments */}
                {extraInstallments
                  .filter((e) => e.fee_type_id && e.amount)
                  .map((e, idx) => (
                    <tr key={`extra-${idx}`} className="bg-yellow-50">
                      <td className="p-2">
                        {installments.length + idx + 1}
                      </td>
                      <td className="p-2">
                        {feeTypes.find((f) => f.id == e.fee_type_id)?.name}
                      </td>
                      <td className="p-2">{e.assign_type}</td>
                      <td className="p-2">{e.offset}</td>
                      <td className="p-2">₹{e.amount}</td>
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
              <PrimaryButton name="Assign Fee" onClick={assignFees}  />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
