"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState, useMemo } from "react";
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

  /* ================= FETCH ================= */
  useEffect(() => {
    if (payment_id) fetchPayment();
  }, [payment_id]);

  const fetchPayment = async () => {
    const res = await api.get(`/fees/payments-list/${payment_id}`);
    setPayment(res.data.data.payment);
    setInstallments(res.data.data.installments || []);
  };

  /* ================= TOTALS ================= */
  const paymentAmount = Number(payment?.amount || 0);

  const totalAllocated = useMemo(
    () =>
      Object.values(allocations).reduce(
        (sum, amt) => sum + Number(amt || 0),
        0
      ),
    [allocations]
  );

  const remainingAmount = paymentAmount - totalAllocated;

  /* ================= TOGGLE INSTALLMENT ================= */
  const toggleInstallment = (inst) => {
    const id = inst.student_fee_installment_id;

    // UNCHECK
    if (selected[id]) {
      const newAlloc = { ...allocations };
      delete newAlloc[id];

      setAllocations(newAlloc);
      setSelected({ ...selected, [id]: false });
      return;
    }

    // CHECK → AUTO ALLOCATE
    const allocatable = Math.min(
      inst.pending_amount,
      remainingAmount
    );

    if (allocatable <= 0) return;

    setSelected({ ...selected, [id]: true });
    setAllocations({
      ...allocations,
      [id]: allocatable,
    });
  };

  /* ================= MANUAL CHANGE ================= */
  const updateAllocation = (inst, value) => {
    const id = inst.student_fee_installment_id;
    let amount = Number(value || 0);

    if (amount > inst.pending_amount) {
      amount = inst.pending_amount;
    }

    const otherAllocated =
      totalAllocated - (allocations[id] || 0);

    if (otherAllocated + amount > paymentAmount) {
      amount = paymentAmount - otherAllocated;
    }

    setAllocations({
      ...allocations,
      [id]: amount,
    });
  };

  /* ================= APPROVE ================= */
  const approvePayment = async () => {
    if (remainingAmount !== 0) {
      alert(
        `Please allocate full amount. Remaining: ${formatRupees(
          remainingAmount
        )}`
      );
      return;
    }

    const allocationPayload = Object.entries(allocations)
      .filter(([_, amt]) => amt > 0)
      .map(([id, amount]) => ({
        student_fee_installment_id: Number(id),
        amount,
      }));

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
      alert(
        error?.response?.data?.message ||
          "Failed to approve payment"
      );
    }
  };

  if (!payment) return null;

  return (
    <div className="space-y-6">

      {/* ================= HEADER ================= */}
      <div className="font-semibold text-blue-600">
        {payment.student.first_name} {payment.student.last_name} (
        Class {payment.student.class}-{payment.student.section})
      </div>

      {/* ================= INSTALLMENTS ================= */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2"></th>
              <th className="p-2">Installment</th>
              <th className="p-2">Fee Type</th>
              <th className="p-2">Assigned</th>
              <th className="p-2">Paid</th>
              <th className="p-2">Pending</th>
              <th className="p-2">Paying Now</th>
              <th className="p-2">Type</th>
            </tr>
          </thead>

          <tbody>
            {installments.map((i) => (
              <tr key={i.student_fee_installment_id} className="border-t">
                <td className="p-2">
                  <input
                    type="checkbox"
                    checked={!!selected[i.student_fee_installment_id]}
                    onChange={() => toggleInstallment(i)}
                  />
                </td>

                <td className="p-2">{i.installment_name}</td>
                <td className="p-2">{i.fee_type}</td>
                <td className="p-2">{formatRupees(i.assigned_amount)}</td>
                <td className="p-2">{formatRupees(i.paid_amount)}</td>
                <td className="p-2 text-rose-600">
                  {formatRupees(i.pending_amount)}
                </td>

                <td className="p-2">
                  {selected[i.student_fee_installment_id] && (
                    <input
                      type="number"
                      className="soft-input w-28"
                      value={
                        allocations[i.student_fee_installment_id] || ""
                      }
                      onChange={(e) =>
                        updateAllocation(i, e.target.value)
                      }
                    />
                  )}
                </td>

                <td className="p-2">
                  {i.is_extra ? "Extra" : "Regular"}
                </td>
              </tr>
            ))}
          </tbody>

          {/* ================= FOOTER ================= */}
          <tfoot className="bg-gray-50">
            <tr>
              <td colSpan="5" className="p-3 text-right font-semibold">
                Remaining Amount:
              </td>
              <td colSpan="3" className="p-3 font-semibold text-rose-600">
                {formatRupees(remainingAmount)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* ================= PAYMENT DETAILS ================= */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 grid grid-cols-3 gap-4 text-sm">
        <div>
          <label>Payment Mode</label>
          <input className="soft-input" value={payment.payment_mode} disabled />
        </div>

        <div>
          <label>Payment Date</label>
          <input className="soft-input" value={payment.payment_date} disabled />
        </div>

        <div>
          <label>Amount</label>
          <input
            className="soft-input"
            value={formatRupees(payment.amount)}
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

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={generateReceipt}
            onChange={() => setGenerateReceipt(!generateReceipt)}
          />
          Generate Receipt
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={sendEmail}
            onChange={() => setSendEmail(!sendEmail)}
          />
          Send Email
        </div>
      </div>

      {/* ================= ACTIONS ================= */}
      <div className="flex justify-end gap-3">
        <button className="soft-btn-outline" onClick={() => router.back()}>
          Cancel
        </button>

        <PrimaryButton name="Approve" onClick={approvePayment} />
      </div>
    </div>
  );
}
