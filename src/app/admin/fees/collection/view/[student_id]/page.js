"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Modal from "@/components/ui/Modal";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { api } from "@/utils/api";
import { formatRupees } from "@/lib/formatHelper";

export default function ViewStudentFeesPage() {
  const { student_id } = useParams();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [activeTab, setActiveTab] = useState("PAYMENT");

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    if (student_id) fetchData();
  }, [student_id]);

  const fetchData = async () => {
    try {
      const res = await api.get(
        `/fees/student/${student_id}/financial-summary`
      );
      setData(res.data.data);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null;
  if (!data) return null;

  const { student, installments, payments, summary } = data;

  /* ================= DERIVED SUMMARY ================= */
  const totalFees = installments.reduce(
    (s, i) => s + Number(i.assigned_amount || 0),
    0
  );

  const overdue = installments
    .filter((i) => i.status === "PENDING" && i.pending_amount > 0)
    .reduce((s, i) => s + Number(i.pending_amount), 0);

  return (
    <div className="space-y-6">

      {/* ================= STUDENT + SUMMARY CARD ================= */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 grid grid-cols-3 gap-6">

        {/* STUDENT INFO */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="font-semibold text-lg">{student.name}</div>
          <div className="text-sm text-gray-500">--</div>
          <div className="mt-3 text-sm">🆔 {student.admission_no}</div>
          <div className="text-sm">📞 {student.details?.phone}</div>
        </div>

        {/* FEES */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Fees (F)</span>
            <span>{formatRupees(totalFees)}</span>
          </div>
          <div className="flex justify-between">
            <span>Concession (C)</span>
            <span>{formatRupees(0)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax (T)</span>
            <span>{formatRupees(0)}</span>
          </div>
        </div>

        {/* TOTALS */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-blue-600">
            <span>Total Payable (F-C+T)</span>
            <span>{formatRupees(totalFees)}</span>
          </div>
          <div className="flex justify-between text-green-600">
            <span>Amount Paid</span>
            <span>{formatRupees(summary.total_paid)}</span>
          </div>
          <div className="flex justify-between text-red-600">
            <span>Total Dues</span>
            <span>{formatRupees(summary.total_pending)}</span>
          </div>
          <div className="flex justify-between">
            <span>Overdue Fees</span>
            <span>{formatRupees(overdue)}</span>
          </div>
          <div className="flex justify-between">
            <span>Bad Debt</span>
            <span>{formatRupees(0)}</span>
          </div>
        </div>
      </div>

      {/* ================= INSTALLMENTS ================= */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Installments</h3>
          <PrimaryButton name="History" onClick={() => setShowHistory(true)} />
        </div>

        <table className="w-full text-sm">
          <thead className="bg-blue-50">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Fee Type</th>
              <th className="p-3">Structure</th>
              <th className="p-3">Assign Type</th>
              <th className="p-3">Assigned</th>
              <th className="p-3">Paid</th>
              <th className="p-3">Balance</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {installments.map((i, idx) => (
              <tr key={i.installment_id} className="border-t border-gray-200">
                <td className="p-3">{idx + 1}</td>
                <td className="p-3">{i.fee_type}</td>
                <td className="p-3">{i.fee_structure || "—"}</td>
                <td className="p-3">
                  {i.assign_type}
                  {i.offset ? ` (+${i.offset})` : ""}
                </td>
                <td className="p-3">
                  {formatRupees(i.assigned_amount)}
                </td>
                <td className="p-3">
                  {formatRupees(i.paid_amount)}
                </td>
                <td className="p-3">
                  {formatRupees(i.pending_amount)}
                </td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded text-xs ${
                      i.status === "PAID"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {i.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= HISTORY MODAL ================= */}
      {showHistory && (
        <Modal title="History" onClose={() => setShowHistory(false)}>
          {/* TABS */}
          <div className="flex gap-6 border-b border-gray-200 mb-4 text-sm">
            {["PAYMENT", "REFUND", "CONCESSION", "BAD_DEBT"].map((t) => (
              <button
                key={t}
                className={`pb-2 ${
                  activeTab === t
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab(t)}
              >
                {t.replace("_", " ")}
              </button>
            ))}
          </div>

          {/* PAYMENT TAB */}
          {activeTab === "PAYMENT" && (
            <table className="w-full text-sm border border-gray-200">
              <thead className="bg-blue-50">
                <tr>
                  <th className="p-2">#</th>
                  <th className="p-2">Mode</th>
                  <th className="p-2">Amount</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p, i) => (
                  <tr key={p.id} className="border-t">
                    <td className="p-2">{i + 1}</td>
                    <td className="p-2">{p.payment_mode}</td>
                    <td className="p-2">{formatRupees(p.amount)}</td>
                    <td className="p-2">{p.payment_date}</td>
                    <td className="p-2">
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab !== "PAYMENT" && (
            <div className="p-6 text-center text-gray-400">
              No data available
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
