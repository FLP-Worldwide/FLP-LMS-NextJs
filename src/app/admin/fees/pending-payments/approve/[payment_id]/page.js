"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { api } from "@/utils/api";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { formatRupees } from "@/lib/formatHelper";

export default function ApprovePaymentPage() {
  const { payment_id } = useParams();
  const router = useRouter();

  const [payment, setPayment] = useState(null);
  const [installments, setInstallments] = useState([]);

  const [selected, setSelected] = useState({});
  const [allocations, setAllocations] = useState({});

  const [remarks, setRemarks] = useState("");
  const [generateReceipt, setGenerateReceipt] = useState(true);
  const [sendEmail, setSendEmail] = useState(false);

  /* ================= FETCH PAYMENT ================= */
  useEffect(() => {
    if (payment_id) fetchPayment();
  }, [payment_id]);

  const fetchPayment = async () => {
    const res = await api.get(`/fees/payments-list/${payment_id}`);
    setPayment(res.data.data.payment);
    setInstallments(res.data.data.installments || []);
  };

  /* ================= CHECKBOX HANDLER ================= */
  const toggleInstallment = (installmentId) => {
    setSelected((prev) => ({
      ...prev,
      [installmentId]: !prev[installmentId],
    }));

    if (selected[installmentId]) {
      const copy = { ...allocations };
      delete copy[installmentId];
      setAllocations(copy);
    }
  };

  /* ================= AMOUNT HANDLER ================= */
  const updateAllocation = (installmentId, value) => {
    setAllocations({
      ...allocations,
      [installmentId]: Number(value),
    });
  };

  /* ================= APPROVE ================= */
 const approvePayment = async () => {
  const allocationPayload = Object.entries(allocations)
    .filter(([_, amt]) => Number(amt) > 0)
    .map(([installmentId, amount]) => ({
      student_fee_installment_id: Number(installmentId),
      amount: Number(amount),
    }));

  if (!allocationPayload.length) {
    alert("Please select at least one installment and enter amount.");
    return;
  }

  // 🔹 CALCULATE TOTAL ALLOCATED
  const totalAllocated = allocationPayload.reduce(
    (sum, a) => sum + a.amount,
    0
  );

  const paymentAmount = Number(payment.amount);

  // 🔴 FRONTEND VALIDATION (IMPORTANT)
  if (totalAllocated !== paymentAmount) {
    alert(
      `Allocated amount (${formatRupees(
        totalAllocated
      )}) must be equal to payment amount (${formatRupees(
        paymentAmount
      )}).`
    );
    return;
  }

  try {
    await api.post(`/fees/payment/${payment_id}/approve`, {
      allocations: allocationPayload,
      remarks,
      generate_receipt: generateReceipt,
      send_email: sendEmail,
    });

    alert("Payment approved successfully");
    router.back();
  } catch (error) {
    console.error("Approve payment failed", error);

    // 🔥 BACKEND ERROR MESSAGE HANDLING
    const message =
      error?.response?.data?.message ||
      "Failed to approve payment. Please try again.";

    alert(message);
  }
};


  if (!payment) return null;

  return (
    <div className="space-y-6">

      {/* ================= STUDENT HEADER ================= */}
      <div className="font-semibold text-blue-600">
        {payment.student.first_name} {payment.student.last_name} (
        Class {payment.student.class}-{payment.student.section})
      </div>

      {/* ================= INSTALLMENTS TABLE ================= */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left"></th>
              <th className="p-3 text-left">Installment</th>
              <th className="p-3 text-left">Fee Type</th>
              <th className="p-3 text-left">Assign Type</th>
              <th className="p-3 text-left">Assigned</th>
              <th className="p-3 text-left">Paid</th>
              <th className="p-3 text-left">Pending</th>
              <th className="p-3 text-left">Paying Now</th>
              <th className="p-3 text-left">Payable</th>
              <th className="p-3 text-left">Type</th>
            </tr>
          </thead>

          <tbody>
            {installments.map((i) => (
              <tr
                key={i.student_fee_installment_id}
                className="border-t border-gray-200"
              >
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={!!selected[i.student_fee_installment_id]}
                    onChange={() =>
                      toggleInstallment(i.student_fee_installment_id)
                    }
                  />
                </td>

                <td className="p-3">{i.installment_name}</td>
                <td className="p-3">{i.fee_type}</td>
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

                <td className="p-3 text-rose-600">
                  {formatRupees(i.pending_amount)}
                </td>

                <td className="p-3">
                  {selected[i.student_fee_installment_id] && (
                    <input
                      type="number"
                      className="soft-input w-28"
                      max={i.pending_amount}
                      value={
                        allocations[i.student_fee_installment_id] || ""
                      }
                      onChange={(e) =>
                        updateAllocation(
                          i.student_fee_installment_id,
                          e.target.value
                        )
                      }
                    />
                  )}
                </td>

                <td className="p-3">
                  {formatRupees(
                    allocations[i.student_fee_installment_id] || 0
                  )}
                </td>

                <td className="p-3">
                  {i.is_extra ? "Extra" : "Regular"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= PAYMENT DETAILS ================= */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 grid grid-cols-3 gap-4 text-sm">
        <div>
          <label>Payment Date</label>
          <input
            className="soft-input"
            value={payment.payment_date}
            disabled
          />
        </div>

        <div>
          <label>Payment Mode</label>
          <input
            className="soft-input"
            value={payment.payment_mode}
            disabled
          />
        </div>

        <div>
          <label>Remarks</label>
          <input
            className="soft-input"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </div>

        <div>
          <label>Amount</label>
          <input
            className="soft-input"
            value={formatRupees(payment.amount)}
            disabled
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={generateReceipt}
            onChange={() => setGenerateReceipt(!generateReceipt)}
          />
          Generate Fee Receipt
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={sendEmail}
            onChange={() => setSendEmail(!sendEmail)}
          />
          Send Email (Student/Parent)
        </div>
      </div>

      {/* ================= ACTIONS ================= */}
      <div className="flex justify-end gap-3">
        <button
          className="soft-btn-outline"
          onClick={() => router.back()}
        >
          Cancel
        </button>

        <PrimaryButton name="Approve" onClick={approvePayment} />
      </div>
    </div>
  );
}
