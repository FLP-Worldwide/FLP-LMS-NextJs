"use client";

import { useEffect, useState } from "react";
import { api } from "@/utils/api";
import Card from "@/components/admin/students/common/Card";
import SecondaryButton from "@/components/ui/SecodaryButton";

export default function FeesTab({ studentId }) {
  const [data, setData] = useState(null);
  const [year, setYear] = useState("2025-26");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFees();
  }, [year]);

  const fetchFees = async () => {
    setLoading(true);
    const res = await api.get(`/students/${studentId}/fees`, {
      params: { academic_year: year },
    });
    setData(res.data.data);
    setLoading(false);
  };

  if (loading || !data) {
    return <div className="p-6 text-sm text-gray-400">Loading fees...</div>;
  }

  const { summary, payment_history } = data;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

      {/* ================= LEFT ================= */}
      <div className="lg:col-span-3 space-y-4">

        {/* FILTER */}
        <div className="flex items-center gap-3">
          <select
            className="border rounded px-3 py-1 text-sm"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            <option value="2025-26">2025-26</option>
            <option value="2024-25">2024-25</option>
          </select>

          <SecondaryButton name="GO" />
        </div>

        {/* PAYMENT HISTORY */}
        <Card title="Payment History">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-blue-50 text-gray-600">
                <tr>
                  <th className="px-3 py-2 text-left">Paid On</th>
                  <th>Install. No.</th>
                  <th>Fee Type</th>
                  <th>Batch</th>
                  <th>Amount Paid</th>
                  <th>Payment Mode</th>
                  <th>Remark</th>
                </tr>
              </thead>

              <tbody>
                {payment_history.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-10 text-gray-400">
                      Apply filter to get Payment History.
                    </td>
                  </tr>
                ) : (
                  payment_history.map((row, i) => (
                    <tr key={i} className="border-t">
                      <td className="px-3 py-2">{row.paid_on}</td>
                      <td className="text-center">{row.installment_no}</td>
                      <td className="text-center">{row.fee_type}</td>
                      <td className="text-center">{row.batch}</td>
                      <td className="text-center">₹ {row.amount_paid}</td>
                      <td className="text-center">{row.payment_mode}</td>
                      <td className="text-center">{row.remark}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* ================= RIGHT SUMMARY ================= */}
      <div className="space-y-4 p-6">

        <SummaryCard
          title="Fees"
          rows={[
            ["Fees (F)", summary.fees],
            ["Concession (C)", summary.concession],
            ["Tax (T)", summary.tax],
            ["Total Payable (F-C+T)", summary.total_payable, "text-blue-600"],
          ]}
        />

        <SummaryCard
          title="Payments"
          rows={[
            ["Bad Debt", summary.bad_debt],
            ["Amount Paid", summary.amount_paid, "text-green-600"],
          ]}
        />

        <SummaryCard
          title="Dues"
          rows={[
            ["Overdue Fees (OF)", summary.overdue_fees],
            ["Upcoming Dues (UD)", summary.upcoming_dues],
            ["Total Dues (OF+UD)", summary.total_dues, "text-red-600"],
          ]}
        />

        <SummaryCard
          title="Fine"
          rows={[
            ["Total Fine", summary.total_fine],
            ["Paid Fine", summary.paid_fine],
            ["Balance Fine", summary.balance_fine, "text-red-600"],
          ]}
        />
      </div>
    </div>
  );
}

/* ================= SUMMARY CARD ================= */

function SummaryCard({ title, rows }) {
  return (
    <Card title={title}>
      <div className="space-y-1 text-sm">
        {rows.map(([label, value, color], i) => (
          <div key={i} className="flex justify-between">
            <span>{label} :</span>
            <span className={`font-medium ${color || ""}`}>
              ₹ {value}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
