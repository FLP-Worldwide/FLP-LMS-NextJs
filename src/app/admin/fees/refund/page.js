"use client";

import React, { useState,useEffect } from "react";
import { api } from "@/utils/api";
import { formatRupees } from "@/lib/formatHelper";
import PrimaryButton from "@/components/ui/PrimaryButton";
import Modal from "@/components/ui/Modal";

export default function RefundPage() {
  const [query, setQuery] = useState("");
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [payments, setPayments] = useState([]);
  const [refundRow, setRefundRow] = useState(null);

  /* ================= SEARCH STUDENT ================= */
  const searchStudent = async () => {
    if (!query) return;

    const res = await api.get(`/students?q=${query}`);
    setStudents(res.data.data || []);
  };

  /* ================= SELECT STUDENT ================= */
  const selectStudent = async (student) => {
    setSelectedStudent(student);
    setStudents([]);

    const res = await api.get(
      `/fees/student/${student.id}/payments`
    );

    setPayments(res.data.data || []);
  };

  return (
    <div className="space-y-6">

      {/* ================= SEARCH BAR ================= */}
      <div className="relative">
        <div className="flex gap-2">
          
            <div>
              <input
              className="soft-input w-full"
              placeholder="Search by Student Name / Phone / Stud Id"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <PrimaryButton name="Go" onClick={searchStudent} />
        </div>

        {/* SEARCH RESULTS */}
        {students.length > 0 && (
          <div className="absolute z-10 bg-white border border-gray-200 rounded w-full mt-1 shadow">
            {students.map((s) => (
              <div
                key={s.id}
                onClick={() => selectStudent(s)}
                className="p-3 hover:bg-gray-50 cursor-pointer"
              >
                <div className="font-medium">
                  {s.first_name} {s.last_name}
                </div>
                <div className="text-xs text-gray-500">
                  {s.admission_no} · {s.phone}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= STUDENT HEADER ================= */}
      {selectedStudent && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 grid grid-cols-4 gap-4 text-sm">
          <div className="font-semibold">
            {selectedStudent.first_name} {selectedStudent.last_name}
            <div className="text-xs text-gray-500">
              {selectedStudent.admission_no}
            </div>
          </div>
          <div>Class: {selectedStudent.class}-{selectedStudent.section}</div>
          <div>Phone: {selectedStudent.phone}</div>
          <div>Status: {selectedStudent.status}</div>
        </div>
      )}

      {/* ================= PAYMENT HISTORY ================= */}
      {payments.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="font-semibold mb-3">Payment History</h3>

          <table className="w-full text-sm">
            <thead className="bg-blue-50">
              <tr>
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Fee Type</th>
                <th className="p-3 text-left">Amount Paid</th>
                <th className="p-3 text-left">Paid Date</th>
                <th className="p-3 text-left">Payment Mode</th>
                <th className="p-3 text-left">Receipt No.</th>
                <th className="p-3 text-left">Refunded Amount</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {payments.map((p, idx) => (
                <tr key={p.id} className="border-t border-gray-200">
                  <td className="p-3">{idx + 1}</td>
                  <td className="p-3">{p.fee_type}</td>
                  <td className="p-3">
                    {formatRupees(p.amount)}
                  </td>
                  <td className="p-3">{p.payment_date}</td>
                  <td className="p-3">{p.payment_mode}</td>
                  <td className="p-3">{p.reference_number}</td>
                  <td className="p-3">{p.refunded_amount}</td>
                  <td className="p-3">{p.status}</td>
                  <td className="p-3 text-right">
                    <button
                      className="text-blue-600 text-xs"
                      onClick={() => setRefundRow(p)}
                    >
                      Refund
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= REFUND MODAL ================= */}
      {refundRow && (
        <RefundModal
          payment={refundRow}
          onClose={() => setRefundRow(null)}
          onSuccess={() => selectStudent(selectedStudent)}
        />
      )}
    </div>
  );
}



function RefundModal({ payment, onClose, onSuccess }) {
  if (!payment) return null;

  const [refundAmount, setRefundAmount] = useState(0);
  const [refundDate, setRefundDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [paymentMode, setPaymentMode] = useState("");
  const [reason, setReason] = useState("");
  const [referenceNo, setReferenceNo] = useState("");

  const [downloadReceipt, setDownloadReceipt] = useState(false);
  const [emailParents, setEmailParents] = useState(false);
  const [emailStudents, setEmailStudents] = useState(false);
  const [smsParents, setSmsParents] = useState(false);
  const [smsStudents, setSmsStudents] = useState(false);
const [reasons, setReasons] = useState([]);
const [reasonId, setReasonId] = useState("");


 const maxRefund = Number(
    payment.net_amount ?? payment.amount ?? 0
  );

  useEffect(() => {
    fetchReasons();
  }, []);

  const fetchReasons = async () => {
    try {
      const res = await api.get("/fees/refund-reasons");
      setReasons(res.data.data || []);
    } catch (e) {
      console.error("Failed to load refund reasons");
    }
  };


  const submitRefund = async () => {
    if (!refundAmount || refundAmount <= 0)
      return alert("Enter refund amount");

    if (refundAmount > maxRefund)
      return alert("Refund amount exceeds paid amount");

    if (!paymentMode || !reasonId)
      return alert("Please fill required fields");

    try {
      await api.post(`/fees/payments/${payment.id}/refund`, {
        payment_id: payment.id,           // ✅ THIS
        refund_amount: refundAmount,
        refund_date: refundDate,
        payment_mode: paymentMode,
        refund_reason_id: Number(reasonId),
        reference_no: referenceNo,
        student_fee_id: payment.id,
        download_receipt: downloadReceipt,
        notify: {
          email: {
            parents: emailParents,
            students: emailStudents,
          },
          sms: {
            parents: smsParents,
            students: smsStudents,
          },
        },
      });

      alert("Refund processed successfully");
      onClose();
      onSuccess();
    } catch (e) {
      alert(
        e?.response?.data?.message || "Refund failed"
      );
    }
  };

  return (
    <Modal title="Refund Fees" onClose={onClose}>
      {/* ================= INSTALLMENT TABLE ================= */}
      <table className="w-full text-sm mb-6">
      <thead className="bg-blue-50">
        <tr>
          <th className="p-3 text-left">Install. No.</th>
          <th className="p-3 text-left">Fee Type</th>
          <th className="p-3 text-left">Amount Paid (Rs)</th>
          <th className="p-3 text-left">Amount to be Refund (Rs)</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-t">
          <td className="p-3">—</td>
          <td className="p-3">Tuition Fees</td>
          <td className="p-3">
            {formatRupees(maxRefund)}
          </td>
          <td className="p-3">
            <input
              type="number"
              className="soft-input w-40"
              value={refundAmount}
              onChange={(e) =>
                setRefundAmount(Number(e.target.value))
              }
            />
          </td>
        </tr>
      </tbody>
    </table>


      {/* ================= FORM ================= */}
      <div className="grid grid-cols-4 gap-4 text-sm mb-4">
        <div>
          <label className="required">Refund Date</label>
          <input
            type="date"
            className="soft-input"
            value={refundDate}
            onChange={(e) => setRefundDate(e.target.value)}
          />
        </div>

        <div>
          <label className="required">Payment Mode</label>
          <select
            className="soft-input"
            value={paymentMode}
            onChange={(e) => setPaymentMode(e.target.value)}
          >
            <option value="">Select</option>
            <option value="CASH">Cash</option>
            <option value="UPI">UPI</option>
            <option value="BANK_TRANSFER">Bank Transfer</option>
            <option value="CHEQUE">Cheque</option>
          </select>
        </div>

        <div>
          <label className="required">Reason</label>
          <select
            className="soft-input"
            value={reasonId}
            onChange={(e) => setReasonId(e.target.value)}
          >
            <option value="">Select</option>

            {reasons.map((r) => (
              <option key={r.id} value={r.id}>
                {r.reason}
              </option>
            ))}
          </select>
        </div>


        <div>
          <label>Reference No.</label>
          <input
            className="soft-input"
            placeholder="Enter"
            value={referenceNo}
            onChange={(e) => setReferenceNo(e.target.value)}
          />
        </div>
      </div>

      {/* ================= OPTIONS ================= */}
      <div className="space-y-3 text-sm mb-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={downloadReceipt}
            onChange={() =>
              setDownloadReceipt(!downloadReceipt)
            }
          />
          Download Fee Refund Receipt
        </label>

        <div className="flex items-center gap-3">
          <span className="w-32">Send Email To</span>
          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={emailParents}
              onChange={() =>
                setEmailParents(!emailParents)
              }
            />
            Parents
          </label>
          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={emailStudents}
              onChange={() =>
                setEmailStudents(!emailStudents)
              }
            />
            Students
          </label>
        </div>

        <div className="flex items-center gap-3">
          <span className="w-32">Send SMS To</span>
          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={smsParents}
              onChange={() =>
                setSmsParents(!smsParents)
              }
            />
            Parents
          </label>
          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={smsStudents}
              onChange={() =>
                setSmsStudents(!smsStudents)
              }
            />
            Students
          </label>
        </div>
      </div>

      {/* ================= NOTE ================= */}
      <div className="bg-orange-50 border border-orange-200 text-orange-700 text-sm p-3 rounded mb-6">
        <strong>Note:</strong> During the fee refund process,
        the fee dues will be re-established for the student
        and any applicable fines will also be recreated as of
        the due date of installment and following the
        configuration set by the organization.
      </div>

      {/* ================= ACTIONS ================= */}
      <div className="flex justify-end gap-3">
        <button
          className="soft-btn-outline"
          onClick={onClose}
        >
          Cancel
        </button>
        <PrimaryButton name="Refund" onClick={submitRefund} />
      </div>
    </Modal>
  );
}

