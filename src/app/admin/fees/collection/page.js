"use client";

import React, { useEffect, useState } from "react";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { api } from "@/utils/api";
import { formatRupees } from "@/lib/formatHelper";
import Modal from "@/components/ui/Modal";



/* ---------------- PAGE ---------------- */
export default function CollectionPage() {
  /* FILTER STATE (same as AssignFees) */
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    course_id: "",
    batch_id: "",
    academic_year: "2025-26",
  });

  const [showPaymentHistory, setShowPaymentHistory] = useState(false);
  const [showAddPayment, setShowAddPayment] = useState(false);

    const [selectedStudent, setSelectedStudent] = useState(null);
    const [payments, setPayments] = useState([]);

    const [paymentForm, setPaymentForm] = useState({
      payment_mode: "CHEQUE",
      amount: "",
      payment_date: "",
      bank_name: "",
      account_number: "",
      transaction_reference: "",
      country: "India",
      remarks: "",
    });


const totalCollected = students.reduce(
  (s, i) => s + Number(i.paid_amount || 0),
  0
);

const totalPending = students.reduce(
  (s, i) => s + Number(i.pending_amount || 0),
  0
);

const pendingStudents = students.filter(
  (s) => Number(s.pending_amount) > 0
).length;


  /* FETCH COURSES */
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const res = await api.get("/courses");
    setCourses(res.data?.data || []);
  };
const fetchPayments = async (studentId) => {
  const res = await api.get(`/fees/payments/${studentId}`);
  setPayments(res.data?.data || []);
};

  const fetchBatches = async (courseId) => {
    if (!courseId) return;
    const res = await api.get(`/batches?course_id=${courseId}`);
    setBatches(res.data?.data || []);
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await api.get("/students/financial-summary", {
        params: filters,
      });
      setStudents(res.data?.data || []);
    } catch (e) {
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };
  
  const submitPayment = async () => {
    await api.post("/fees/update/payments", {
      student_id: selectedStudent.id,
      payment_mode: paymentForm.payment_mode,
      amount: Number(paymentForm.amount),
      payment_date: paymentForm.payment_date,
      bank_name: paymentForm.bank_name || undefined,
      account_number: paymentForm.account_number || undefined,
      transaction_reference:
        paymentForm.transaction_reference || undefined,
      country: paymentForm.country || undefined,
      remarks: paymentForm.remarks || undefined,
    });

    setShowAddPayment(false);
    fetchPayments(selectedStudent.id);
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h2 className="text-xl font-semibold">Fees Collection</h2>
        <p className="text-sm text-gray-500">
          Track paid, pending & installment-wise fee collection
        </p>
      </div>

      {/* FILTER CARD (same as Assign Fees) */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 grid grid-cols-4 gap-4">
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

        <PrimaryButton name="Search" onClick={fetchStudents} />
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <SummaryCard title="Total Collected" value={formatRupees(totalCollected)} />
        <SummaryCard title="Total Pending" value={formatRupees(totalPending)} />
        <SummaryCard title="Students" value={students.length} />
        <SummaryCard title="Pending Students" value={pendingStudents} />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Student</th>
              <th className="p-3 text-left">Class</th>
              <th className="p-3 text-left">Total Batch Fee</th>
              <th className="p-3 text-left">Total Collective Fees</th>
              <th className="p-3 text-left">Paid</th>
              <th className="p-3 text-left">Pending</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
  {loading && (
    <tr>
      <td colSpan="6" className="p-6 text-center text-gray-400">
        Loading...
      </td>
    </tr>
  )}

  {!loading && students.length === 0 && (
    <tr>
      <td colSpan="6" className="p-6 text-center text-gray-400">
        No students found
      </td>
    </tr>
  )}

  {students.map((s) => (
    <tr key={s.student_id} className="border-t">
      {/* STUDENT */}
      <td className="p-3">
        <div className="font-medium">{s.student_name}</div>
        <div className="text-xs text-gray-500">
          {s.admission_no}
        </div>
      </td>

      {/* CLASS */}
      <td className="p-3">
        {s.class} - {s.section}
      </td>

      {/* TOTAL FEES */}
      <td className="p-3">
        {formatRupees(s.total_fees)}
      </td>
      <td className="p-3">
        {formatRupees(s.assigned_fees)}
      </td>

      {/* PAID */}
      <td className="p-3 text-emerald-700">
        {formatRupees(s.paid_amount)}
      </td>

      {/* PENDING */}
      <td className="p-3 text-rose-700">
        {formatRupees(s.pending_amount)}
      </td>

      {/* ACTION */}
      <td className="p-3 text-right">
        <div className="flex justify-end gap-2">
          <button className="soft-btn-outline">
            View
          </button>

          {!s.is_fully_paid && (
            <button
              className="soft-btn-outline underline text-xs bg-gray-200 px-2 py-1"
              onClick={() => {
                setSelectedStudent(s);
                fetchPayments(s.student_id);
                setShowPaymentHistory(true);
              }}
            >
              Update Payment
            </button>
          )}
        </div>
      </td>
    </tr>
  ))}
</tbody>

        </table>
      </div>

      {showPaymentHistory && (
  <Modal
    title="Payment History"
    onClose={() => setShowPaymentHistory(false)}
    rightSlot={
      <PrimaryButton
        name="Add Payment"
        onClick={() => setShowAddPayment(true)}
      />
    }
  >
    <table className="w-full text-sm border border-gray-200">
      <thead className="bg-blue-50">
        <tr>
          <th className="p-2">Mode</th>
          <th className="p-2">Bank</th>
          <th className="p-2">Reference</th>
          <th className="p-2">Date</th>
          <th className="p-2">Amount</th>
          <th className="p-2">Status</th>
        </tr>
      </thead>
      <tbody>
        {payments.map((p) => (
          <tr key={p.id} className="border-t">
            <td className="p-2">{p.payment_mode}</td>
            <td className="p-2">{p.bank_name || "-"}</td>
            <td className="p-2">{p.transaction_reference || "-"}</td>
            <td className="p-2">{p.payment_date}</td>
            <td className="p-2">₹{p.amount}</td>
            <td className="p-2">
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                {p.status || "Received"}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </Modal>
)}


  
  

{showAddPayment && (
  <Modal
    title={`Add ${paymentForm.payment_mode.replace("_", " ")}`}
    onClose={() => setShowAddPayment(false)}
    rightSlot={
      <PrimaryButton
        name={`Save`}
        onClick={submitPayment}
      >
      </PrimaryButton>
    }
  >
    <div className="grid grid-cols-2 gap-4">
      {/* PAYMENT MODE */}
      <select
        className="soft-select col-span-2"
        value={paymentForm.payment_mode}
        onChange={(e) =>
          setPaymentForm({ ...paymentForm, payment_mode: e.target.value })
        }
      >
        <option value="CHEQUE">Cheque</option>
        <option value="BANK_TRANSFER">Bank Transfer</option>
        <option value="UPI">UPI</option>
        <option value="CASH">Cash</option>
      </select>

      {/* DATE */}
      <input
        type="date"
        className="soft-input"
        value={paymentForm.payment_date}
        onChange={(e) =>
          setPaymentForm({ ...paymentForm, payment_date: e.target.value })
        }
      />

      {/* AMOUNT */}
      <input
        type="number"
        className="soft-input"
        placeholder="Amount in Rs"
        value={paymentForm.amount}
        onChange={(e) =>
          setPaymentForm({ ...paymentForm, amount: e.target.value })
        }
      />

      {/* CHEQUE / BANK */}
      {(paymentForm.payment_mode === "CHEQUE" ||
        paymentForm.payment_mode === "BANK_TRANSFER") && (
        <>
          <input
            className="soft-input"
            placeholder="Bank Name"
            value={paymentForm.bank_name}
            onChange={(e) =>
              setPaymentForm({ ...paymentForm, bank_name: e.target.value })
            }
          />

          {paymentForm.payment_mode === "BANK_TRANSFER" && (
            <input
              className="soft-input"
              placeholder="Account Number"
              value={paymentForm.account_number}
              onChange={(e) =>
                setPaymentForm({
                  ...paymentForm,
                  account_number: e.target.value,
                })
              }
            />
          )}
        </>
      )}

      {/* TRANSACTION REF */}
      {paymentForm.payment_mode !== "CASH" && (
        <input
          className="soft-input col-span-2"
          placeholder="Transaction Reference"
          value={paymentForm.transaction_reference}
          onChange={(e) =>
            setPaymentForm({
              ...paymentForm,
              transaction_reference: e.target.value,
            })
          }
        />
      )}

      {/* REMARKS */}
      <input
        className="soft-input col-span-2"
        placeholder="Remarks"
        value={paymentForm.remarks}
        onChange={(e) =>
          setPaymentForm({ ...paymentForm, remarks: e.target.value })
        }
      />
    </div>
  </Modal>
)}
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
