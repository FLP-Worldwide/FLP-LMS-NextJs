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
  const [showConcession, setShowConcession] = useState(false);

  const [refunds, setRefunds] = useState([]);
  const [totalRefunded, setTotalRefunded] = useState(0);
  const [loadingRefunds, setLoadingRefunds] = useState(false);

  const [concessions, setConcessions] = useState([]);
  const [totalConcessionHistory, setTotalConcessionHistory] = useState(0);
  const [loadingConcessions, setLoadingConcessions] = useState(false);


  useEffect(() => {
    if (!showHistory) return;

    if (activeTab === "REFUND") {
      fetchRefunds();
    }

    if (activeTab === "CONCESSION") {
      fetchConcessions();
    }
  }, [showHistory, activeTab]);

  const fetchConcessions = async () => {
    try {
      setLoadingConcessions(true);

      const res = await api.get(
        `/fees/student/${student_id}/concession-summary`
      );

      setConcessions(res.data.data.concessions || []);
      setTotalConcessionHistory(
        Number(res.data.data.total_concession_amount || 0)
      );
    } catch (e) {
      console.error("Failed to fetch concessions");
    } finally {
      setLoadingConcessions(false);
    }
  };


  const fetchRefunds = async () => {
    try {
      setLoadingRefunds(true);

      const res = await api.get(
        `/fees/student/${student_id}/refund-summary`
      );

      setRefunds(res.data.data.refunds || []);
      setTotalRefunded(
        Number(res.data.data.total_refunded_amount || 0)
      );
    } catch (e) {
      console.error("Failed to fetch refunds");
    } finally {
      setLoadingRefunds(false);
    }
  };

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
  const totalFees = Number(summary.total_assigned || 0);
  const totalConcession = Number(summary.total_concession || 0);
  const tax = Number(summary.tax || 0);

  const totalPaidCash = Number(
    summary.total_paid_excluding_concession || 0
  );

  const totalPayable = Math.max(
    0,
    totalFees - totalConcession + tax
  );

  const totalPending = Number(summary.total_pending || 0);
  const overdue = Number(summary.overdue_fees || 0);


  return (
    <div className="space-y-6 p-6">

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
          <div className="flex justify-between text-orange-600">
            <span>Concession (C)</span>
            <span>- {formatRupees(totalConcession)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax (T)</span>
            <span>{formatRupees(0)}</span>
          </div>
        </div>

        {/* TOTALS */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-blue-600">
            <span>Total Payable (F - C + T)</span>
            <span>{formatRupees(totalPayable)}</span>
          </div>

          <div className="flex justify-between text-green-600">
            <span>Amount Paid</span>
            <span>{formatRupees(totalPaidCash)}</span>
          </div>

          <div className="flex justify-between text-red-600">
            <span>Total Dues</span>
            <span>{formatRupees(totalPending)}</span>
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

        <div className="flex gap-2">
          <PrimaryButton
            name="Add Concession"
            onClick={() => setShowConcession(true)}
          />
          <PrimaryButton
            name="History"
            onClick={() => setShowHistory(true)}
          />
        </div>
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
              <th className="p-3">Concession</th>

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
                 {formatRupees(i.paid_amount_excluding_concession)}

                </td>
                <td className="p-3">
                  {formatRupees(i.pending_amount)}
                </td>
                <td className="p-3 text-orange-600">
                  {formatRupees(i.concession_amount || 0)}
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

          {/* ================= REFUND TAB ================= */}
          {activeTab === "REFUND" && (
            <>
              {/* TOTAL REFUNDED */}
              <div className="mb-3 text-sm text-right text-red-600 font-medium">
                Total Refunded: {formatRupees(totalRefunded)}
              </div>

              <table className="w-full text-sm border border-gray-200">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="p-2">#</th>
                    <th className="p-2 text-left">Refund Amount</th>
                    <th className="p-2 text-left">Refund Date</th>
                    <th className="p-2 text-left">Payment Mode</th>
                    <th className="p-2 text-left">Reason</th>
                    <th className="p-2 text-left">Reference No.</th>
                  </tr>
                </thead>

                <tbody>
                  {loadingRefunds && (
                    <tr>
                      <td colSpan="6" className="p-4 text-center text-gray-400">
                        Loading refunds...
                      </td>
                    </tr>
                  )}

                  {!loadingRefunds && refunds.length === 0 && (
                    <tr>
                      <td colSpan="6" className="p-4 text-center text-gray-400">
                        No refunds found
                      </td>
                    </tr>
                  )}

                  {refunds.map((r, i) => (
                    <tr key={r.refund_id} className="border-t">
                      <td className="p-2">{i + 1}</td>
                      <td className="p-2 text-red-600">
                        {formatRupees(r.refund_amount)}
                      </td>
                      <td className="p-2">{r.refund_date}</td>
                      <td className="p-2">{r.payment_mode}</td>
                      <td className="p-2"><span className="bg-red-50 text-red-900 text-xs px-2 py-1 rounded">{r.reason}</span></td>
                      <td className="p-2">{r.reference_no || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {/* ================= CONCESSION TAB ================= */}
          {activeTab === "CONCESSION" && (
            <>
              {/* TOTAL CONCESSION */}
              <div className="mb-3 text-sm text-right text-orange-600 font-medium">
                Total Concession: {formatRupees(totalConcessionHistory)}
              </div>

              <table className="w-full text-sm border border-gray-200">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="p-2 text-left">#</th>
                    <th className="p-2 text-left">Installment</th>
                    <th className="p-2 text-left">Installment Amount</th>
                    <th className="p-2 text-left">Concession Amount</th>
                    <th className="p-2 text-left">Remarks</th>
                    <th className="p-2 text-left">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {loadingConcessions && (
                    <tr>
                      <td colSpan="6" className="p-4 text-center text-gray-400">
                        Loading concessions...
                      </td>
                    </tr>
                  )}

                  {!loadingConcessions && concessions.length === 0 && (
                    <tr>
                      <td colSpan="6" className="p-4 text-center text-gray-400">
                        No concessions found
                      </td>
                    </tr>
                  )}

                  {concessions.map((c, i) => (
                    <tr key={c.concession_id} className="border-t">
                      <td className="p-2">{i + 1}</td>
                      <td className="p-2">{c.installment_name}</td>
                      <td className="p-2">
                        {formatRupees(c.installment_amount)}
                      </td>
                      <td className="p-2 text-orange-600">
                        {formatRupees(c.concession_amount)}
                      </td>
                      <td className="p-2">
                        {c.remarks || "—"}
                      </td>
                      <td className="p-2">
                        {new Date(c.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}


        </Modal>
      )}

      {showConcession && (
        <ConcessionModal
          studentId={student_id}
          installments={installments}
          onClose={() => setShowConcession(false)}
          onSuccess={fetchData}
        />
      )}

    </div>
  );
}


function ConcessionModal({ studentId, installments, onClose, onSuccess }) {
  const [selected, setSelected] = useState({});
  const [amounts, setAmounts] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [remarks, setRemarks] = useState("");

  const pendingInstallments = installments.filter(
    (i) => i.status === "PENDING" && i.pending_amount > 0
  );

  const toggle = (inst) => {
    const id = inst.installment_id;

    if (selected[id]) {
      const next = { ...amounts };
      delete next[id];
      setAmounts(next);
      setSelected({ ...selected, [id]: false });
      return;
    }

    setSelected({ ...selected, [id]: true });
    setAmounts({ ...amounts, [id]: "" });
  };

  const updateAmount = (inst, value) => {
    const id = inst.installment_id;
    let amt = Number(value || 0);

    if (amt > inst.pending_amount) {
      amt = inst.pending_amount;
    }

    setAmounts({ ...amounts, [id]: amt });
  };

  const submit = async () => {
    const payload = Object.entries(amounts)
      .filter(([_, amt]) => Number(amt) > 0)
      .map(([id, amount]) => ({
        student_fee_installment_id: Number(id),
        amount: Number(amount),
      }));

    if (!payload.length) {
      alert("Please enter concession amount");
      return;
    }

    try {
      setSubmitting(true);

      await api.post(
        `/fees/student/${studentId}/add-concession`,
        {
          concessions: payload,
          remarks, // ✅ added
        }
      );

      alert("Concession added successfully");
      onClose();
      onSuccess(); // refresh parent data
    } catch (error) {
      alert(
        error?.response?.data?.message ||
          "Failed to add concession"
      );
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <Modal title="AD-HOC Concession" onClose={onClose}>
      <div className="mb-3 bg-orange-50 border border-orange-200 text-orange-700 text-sm p-3 rounded">
        Concession once added and approved cannot be updated again.
      </div>

      <table className="w-full text-sm border border-gray-200">
        <thead className="bg-blue-50">
          <tr>
            <th className="p-2"></th>
            <th className="p-2">Fee Type</th>
            <th className="p-2">Due Amount</th>
            <th className="p-2">Concession</th>
          </tr>
        </thead>

        <tbody>
          {pendingInstallments.map((i) => (
            <tr key={i.installment_id} className="border-t">
              <td className="p-2">
                <input
                  type="checkbox"
                  checked={!!selected[i.installment_id]}
                  onChange={() => toggle(i)}
                />
              </td>

              <td className="p-2">{i.fee_type}</td>

              <td className="p-2">
                {formatRupees(i.pending_amount)}
              </td>

              <td className="p-2">
                {selected[i.installment_id] && (
                  <input
                    type="number"
                    className="soft-input w-32"
                    value={amounts[i.installment_id] || ""}
                    onChange={(e) =>
                      updateAmount(i, e.target.value)
                    }
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
        <div className="mt-4">
          <label className="text-sm text-gray-600">Remarks</label>
          <input
            className="soft-input w-full mt-1"
            placeholder="e.g. Sibling discount"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </div>

      <div className="flex justify-end gap-3 mt-5">
        <button className="soft-btn-outline" onClick={onClose}>
          Cancel
        </button>
        <PrimaryButton
          name={submitting ? "Saving..." : "Add"}
          onClick={submit}
          disabled={submitting}
        />
      </div>
    </Modal>
  );
}
