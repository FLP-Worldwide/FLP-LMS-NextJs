"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/utils/api";
import PrimaryButton from "@/components/ui/PrimaryButton";


function formatTime(dateString) {
  if (!dateString) return "—";

  return new Date(dateString).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}



export default function Page() {
  const router = useRouter();
  const { id } = useParams();
  const staffId = id;

  const currentMonth = new Date().toISOString().slice(0, 7);
  const today = new Date().toISOString().slice(0, 10);

  const [staff, setStaff] = useState(null);
  const [salary, setSalary] = useState(null);
  const [history, setHistory] = useState([]);

  const [form, setForm] = useState({
    salary_month: currentMonth,
    payment_amount: "",
    payment_method: "",
    payment_date: today,
    comment: "",
  });

  /* ================= LOAD ON PAGE ================= */
  useEffect(() => {
    if (!staffId) return;

    fetchStaff();
    fetchHistory();
    handleMonthChange(currentMonth); // calculate default month
  }, [staffId]);

  /* ================= STAFF DETAILS ================= */
  const fetchStaff = async () => {
    const res = await api.get(`/staff/${staffId}`);
    setStaff(res.data?.data);
  };

  /* ================= SALARY CALC ================= */
  const calculateSalary = async () => {
    const res = await api.post("/payroll/calculate-salary", {
      staff_id: staffId,
      salary_month: currentMonth, // ✅ FIXED
    });

    setSalary(res.data?.data);
  };

  /* ================= HISTORY ================= */
  const fetchHistory = async () => {
    const res = await api.get("/payroll/salary-history", {
      params: { staff_id: staffId },
    });
    setHistory(res.data?.data || []);
  };

  /* ================= SAVE ================= */
  const handleSubmit = async () => {
    await api.post("/payroll/salary-payment", {
      staff_id: staffId,
      salary_month: form.salary_month,
      payment_amount: Number(form.payment_amount),
      payment_method: form.payment_method,
      payment_date: form.payment_date,
      comment: form.comment,
    });

    fetchHistory();

    setForm({
      ...form,
      payment_amount: "",
      comment: "",
    });
  };


  const handleMonthChange = async (month) => {
    setForm({ ...form, salary_month: month });

    if (!month) return;

    const res = await api.post("/payroll/calculate-salary", {
      staff_id: staffId,
      salary_month: month,
    });

    setSalary(res.data?.data);
  };

  return (
    <div className="p-6 space-y-6">

      <div className="grid grid-cols-12 gap-6">

        {/* ================= LEFT CARD ================= */}
        <div className="col-span-4 bg-white border border-gray-200 rounded-xl p-6 space-y-6">

          {staff && (
            <>
              {/* Profile Section */}
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="font-semibold text-lg">
                  {staff.first_name} {staff.last_name}
                </h3>
                <p className="text-sm text-gray-500 capitalize">
                  {staff.role}
                </p>
              </div>

              {/* Basic Details */}
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span>Email</span>
                  <span>{staff.email}</span>
                </div>
                <div className="flex justify-between">
                  <span>Phone</span>
                  <span>{staff.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span>Department</span>
                  <span>{staff.department}</span>
                </div>
              </div>

              {/* Salary Box */}
              {salary && (
                <div className="bg-gray-50 p-4 rounded-lg space-y-3 text-sm mt-4">

                  <div className="flex justify-between">
                    <span>Basic Salary</span>
                    <span>Rs. {salary.basic_or_rate?.basic}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Total Allowance</span>
                    <span>Rs. {salary.total_allowance}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Total Deduction</span>
                    <span>Rs. {salary.total_deduction}</span>
                  </div>

                  <div className="flex justify-between font-semibold">
                    <span>Gross Salary</span>
                    <span>Rs. {salary.gross_salary}</span>
                  </div>

                  <div className="flex justify-between font-bold text-green-600">
                    <span>Net Salary</span>
                    <span>Rs. {salary.net_salary}</span>
                  </div>

                </div>
              )}
            </>
          )}

        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="col-span-8 space-y-6">

          {/* MAKE PAYMENT */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">

            <h3 className="font-semibold">Make Payment</h3>

            <div className="grid grid-cols-3 gap-4">

              <div>
                <label className="form-label">Month*</label>
                <input
                  type="month"
                  className="soft-input"
                  value={form.salary_month}
                  onChange={(e) => handleMonthChange(e.target.value)}
                />
              </div>

              <div>
                <label className="form-label">Paying Now*</label>
                <input
                  type="number"
                  className="soft-input"
                  value={form.payment_amount}
                  onChange={(e) =>
                    setForm({ ...form, payment_amount: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="form-label">Payment Mode*</label>
                <select
                  className="soft-select"
                  value={form.payment_method}
                  onChange={(e) =>
                    setForm({ ...form, payment_method: e.target.value })
                  }
                >
                  <option value="">Select Payment Method</option>
                  <option>Cash</option>
                  <option>Bank Transfer</option>
                  <option>UPI</option>
                  <option>Cheque</option>
                </select>
              </div>

            </div>

            <div>
              <label className="form-label">Comment</label>
              <input
                type="text"
                className="soft-input"
                value={form.comment}
                onChange={(e) =>
                  setForm({ ...form, comment: e.target.value })
                }
              />
            </div>

            <div className="flex justify-end">
              <PrimaryButton
                name="Process Payroll"
                onClick={handleSubmit}
              />
            </div>

          </div>

          {/* HISTORY */}
          {/* ================= PAYMENT HISTORY ================= */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
              <h3 className="font-semibold text-lg">
                Payment History
              </h3>

              {history.length === 0 && (
                <div className="text-center text-gray-500 py-6">
                  No payment history
                </div>
              )}

              {history.map((monthData, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 space-y-4"
                >
                  {/* ===== MONTH HEADER ===== */}
                  <div className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
                    <div>
                      <span className="font-semibold">
                        Month: {monthData.month}
                      </span>
                    </div>

                    <div className="text-sm space-x-6">
                      <span>Gross: Rs. {monthData.gross_salary}</span>
                      <span>Deduction: Rs. {monthData.total_deduction}</span>
                      <span className="font-medium">
                        Net: Rs. {monthData.net_salary}
                      </span>
                    </div>
                  </div>

                  {/* ===== SUMMARY ROW ===== */}
                  <div className="flex justify-between text-sm bg-gray-100 p-3 rounded-md">
                    <span>
                      Total Paid: <b>Rs. {monthData.total_paid}</b>
                    </span>
                    <span className="text-red-600 font-semibold">
                      Remaining: Rs. {monthData.remaining_balance}
                    </span>
                  </div>

                  {/* ===== PAYMENTS TABLE ===== */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left">#</th>
                          <th className="px-4 py-2 text-left">Amount</th>
                          <th className="px-4 py-2 text-left">Method</th>
                          <th className="px-4 py-2 text-left">Date</th>
                          <th className="px-4 py-2 text-left">Comment</th>
                        </tr>
                      </thead>

                      <tbody className="divide-y">
                        {monthData.payments.map((p, i) => (
                          <tr key={p.payment_id}>
                            <td className="px-4 py-2">{i + 1}</td>
                            <td className="px-4 py-2">
                              Rs. {p.payment_amount}
                            </td>
                            <td className="px-4 py-2">
                              {p.payment_method}
                            </td>
                            <td className="px-4 py-2">
                              {formatTime(p.payment_date)}
                            </td>
                            <td className="px-4 py-2">
                              {p.comment || "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                </div>
              ))}
            </div>

        </div>

      </div>

      <div className="flex justify-end">
        <button
          onClick={() => router.back()}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg"
        >
          Back
        </button>
      </div>

    </div>
  );
}