"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/utils/api";
import PaymentModal from "@/components/admin/inventory/PaymentModal";

export default function PurchaseViewPage() {
  const { id } = useParams();

  const [purchase, setPurchase] = useState(null);
  const [payments, setPayments] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [editPayment, setEditPayment] = useState(null);
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);

  /* ================= FETCH PURCHASE ================= */
  useEffect(() => {
    api.get(`/inventory/purchase/${id}`).then((res) => {
      setPurchase(res.data?.data);
    });
  }, [id]);

  /* ================= FETCH PAYMENTS ================= */
  const fetchPayments = async () => {
    const res = await api.get(`/inventory/purchase/${id}/payments`);
    setPayments(res.data?.data || []);
  };

  /* ================= DELETE PAYMENT ================= */
  const deletePayment = async (paymentId) => {
    if (!confirm("Delete this payment?")) return;
    await api.delete(`/inventory/purchase/payment/${paymentId}`);
    fetchPayments();
  };

  if (!purchase) {
    return (
      <div className="py-20 text-center text-gray-500">
        Loading purchase details...
      </div>
    );
  }

  const totalAmount = Number(purchase.total_amount || 0);
  const totalPaid = payments.reduce(
    (sum, p) => sum + Number(p.amount),
    0
  );
  const balance = totalAmount - totalPaid;

  return (
    <div className="space-y-6 p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Purchase View</h2>
        <Link
          href="/admin/inventory/purchase"
          className="text-sm text-blue-600"
        >
          Back
        </Link>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-3 gap-6 items-stretch">
        {/* LEFT COLUMN */}
        <div className="h-full flex flex-col gap-6">
          {/* FROM */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 flex-1">
            <div className="bg-blue-50 rounded px-4 py-2 font-medium mb-4">
              From:
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Company</span>
                <span>{purchase.supplier?.company}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Mobile No</span>
                <span>{purchase.supplier?.mobile || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Email</span>
                <span>{purchase.supplier?.email || "-"}</span>
              </div>
            </div>
          </div>

          {/* TO */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 flex-1">
            <div className="bg-blue-50 rounded px-4 py-2 font-medium mb-4">
              To:
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Name</span>
                <span>Institute</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Reference No</span>
                <span>{purchase.reference_no}</span>
              </div>
            </div>
          </div>

          {/* META */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 flex-1">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Created Date</span>
                <span>{purchase.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payment Status</span>
                <span className="text-yellow-600">
                  {balance <= 0 ? "Paid" : "Pending"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="col-span-2 h-full flex flex-col gap-6">
          {/* ITEMS TABLE */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden flex-1">
            <table className="w-full text-sm">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-4 py-3 text-left">Item</th>
                  <th className="px-4 py-3 text-left">Unit Price (Rs)</th>
                  <th className="px-4 py-3 text-left">Units</th>
                  <th className="px-4 py-3 text-right">Subtotal (Rs)</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {purchase.items.map((i) => (
                  <tr key={i.id}>
                    <td className="px-4 py-3">{i.item?.item_name}</td>
                    <td className="px-4 py-3">
                      Rs {Number(i.unit_price).toFixed(2)}
                    </td>
                    <td className="px-4 py-3">{i.units}</td>
                    <td className="px-4 py-3 text-right">
                      Rs {(Number(i.unit_price) * i.units).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* TOTALS */}
          <div className="space-y-3">
            <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 flex justify-between">
              <span>Total Amount</span>
              <strong>Rs {totalAmount.toFixed(2)}</strong>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 flex justify-between">
              <span>Paid</span>
              <strong>Rs {totalPaid.toFixed(2)}</strong>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 flex justify-between">
              <span>Balance</span>
              <strong>Rs {balance.toFixed(2)}</strong>
            </div>
          </div>

          {/* PAYMENT ACTIONS */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => {
                if (!showPaymentHistory) fetchPayments();
                setShowPaymentHistory(!showPaymentHistory);
              }}
              className="text-sm text-blue-600"
            >
              {showPaymentHistory
                ? "Hide Payment History"
                : "Show Payment History"}
            </button>

            <button
              onClick={() => {
                setEditPayment(null);
                setShowPaymentModal(true);
              }}
              className="text-sm text-blue-600"
            >
              + Add Payment
            </button>
          </div>

          {/* PAYMENT HISTORY */}
          {showPaymentHistory && (
            <div className="bg-white border border-gray-200 rounded-xl">
              <table className="w-full text-sm">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Method</th>
                    <th className="px-4 py-2 text-left">Reference</th>
                    <th className="px-4 py-2 text-right">Amount</th>
                    <th className="px-4 py-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {payments.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="py-6 text-center text-gray-500"
                      >
                        No payments added
                      </td>
                    </tr>
                  ) : (
                    payments.map((p) => (
                      <tr key={p.id}>
                        <td className="px-4 py-2">{p.payment_date}</td>
                        <td className="px-4 py-2 capitalize">
                          {p.payment_mode}
                        </td>
                        <td className="px-4 py-2">
                          {p.reference_no || "-"}
                        </td>
                        <td className="px-4 py-2 text-right">
                          Rs {Number(p.amount).toFixed(2)}
                        </td>
                        <td className="px-4 py-2 text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditPayment(p);
                              setShowPaymentModal(true);
                            }}
                            className="text-blue-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deletePayment(p.id)}
                            className="text-red-500"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* PAYMENT MODAL */}
      {showPaymentModal && (
        <PaymentModal
          purchaseId={purchase.id}
          editPayment={editPayment}
          onClose={() => setShowPaymentModal(false)}
          onSaved={() => {
            setShowPaymentModal(false);
            fetchPayments();
          }}
        />
      )}
    </div>
  );
}
