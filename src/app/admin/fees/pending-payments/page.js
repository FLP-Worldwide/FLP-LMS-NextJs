"use client";

import React, { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { api } from "@/utils/api";
import { formatRupees } from "@/lib/formatHelper";
import { useRouter } from "next/navigation";
import SecondaryButton from "@/components/ui/SecodaryButton";

export default function Page() {
    const router = useRouter();

  const [status, setStatus] = useState("");
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showView, setShowView] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  /* FETCH PAYMENTS */
  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await api.get("/fees/payments", {
        params: status ? { status } : {},
      });
      setPayments(res.data?.data || []);
    } catch (e) {
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [status]);

  return (
    <div className="space-y-4 p-6">

      {/* FILTER BAR */}
<div className="bg-white p-4 rounded-xl border border-gray-200">
  <div className="grid grid-cols-5 gap-3 items-end">

    {/* STATUS */}
    <select
      className="soft-select"
      value={status}
      onChange={(e) => setStatus(e.target.value)}
    >
      <option value="ALL">All</option>
      <option value="PENDING">Pending</option>
      <option value="APPROVED">Approved</option>
      <option value="REJECTED">Rejected</option>
    </select>

    <PrimaryButton name="Go" onClick={fetchPayments} />

  </div>
</div>


      {/* TABLE */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Student Name</th>
              <th className="p-3">Class</th>
              <th className="p-3">Payment Mode</th>
              <th className="p-3">Payment Date</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan="8" className="p-6 text-center text-gray-400">
                  Loading...
                </td>
              </tr>
            )}

            {!loading && payments.length === 0 && (
              <tr>
                <td colSpan="8" className="p-6 text-center text-gray-400">
                  No payments found
                </td>
              </tr>
            )}

            {payments.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-3">{p.id}</td>

                <td className="p-3">
                  {p.student.first_name} {p.student.last_name}
                </td>

                <td className="p-3">
                  Class {p.student.class}-{p.student.section}
                </td>

                <td className="p-3">{p.payment_mode}</td>

                <td className="p-3">{p.payment_date}</td>

                <td className="p-3">{formatRupees(p.amount)}</td>

                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      p.status === "APPROVED"
                        ? "bg-green-100 text-green-700"
                        : p.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {p.status.toLowerCase()}
                  </span>
                </td>

                <td className="p-3 text-right">
                  <div className="flex justify-end gap-2">
                    {/* <button
                      className="underline text-xs bg-gray-200 px-3 py-1"
                      onClick={() => {
                        setSelectedPayment(p);
                        setShowView(true);
                      }}
                    >
                      View
                    </button> */}

                    {p.status === "PENDING" && (
                      <>
                        <SecondaryButton name="Approve" onClick={() => router.push(`/admin/fees/pending-payments/approve/${p.id}`)} />
                        {/* <PrimaryButton name="Reject" /> */}
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* VIEW MODAL */}
      {showView && selectedPayment && (
        <Modal
          title="Payment Details"
          onClose={() => setShowView(false)}
        >
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <b>Student:</b>{" "}
              {selectedPayment.student.first_name}{" "}
              {selectedPayment.student.last_name}
            </div>
            <div>
              <b>Class:</b>{" "}
              {selectedPayment.student.class}-
              {selectedPayment.student.section}
            </div>
            <div>
              <b>Mode:</b> {selectedPayment.payment_mode}
            </div>
            <div>
              <b>Date:</b> {selectedPayment.payment_date}
            </div>
            <div>
              <b>Amount:</b>{" "}
              {formatRupees(selectedPayment.amount)}
            </div>
            <div>
              <b>Status:</b> {selectedPayment.status}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
