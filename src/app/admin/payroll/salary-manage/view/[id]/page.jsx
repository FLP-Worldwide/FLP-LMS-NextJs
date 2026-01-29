"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/utils/api";
import { useParams } from "next/navigation";

export default function ViewSalaryPage() {
  const params = useParams();
  const userId = params?.id;

  const [user, setUser] = useState({});
  const [salaryTemplate, setSalaryTemplate] = useState({});
  const [attendance, setAttendance] = useState({});

  /* ================= API ================= */
  useEffect(() => {
    if (!userId) return;

    const loadSalary = async () => {
      const res = await api.get(
        `/payroll/salary-overview/${userId}`
      );

      const data = res.data?.data || {};

      setUser(data.user || {});
      setSalaryTemplate(data.salary_template || {});
      setAttendance(data.attendance_summary || {});
    };

    loadSalary();
  }, [userId]);

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* LEFT USER CARD */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gray-200 rounded-full" />
          <div>
            <div className="font-medium">
              {user.name || "-"}
            </div>
            <div className="text-xs text-gray-500">
              {user.designation || "-"}
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-500">
          Phone No.
        </div>
        <div className="font-medium mb-4">
          {user.phone || "-"}
        </div>

        {/* ATTENDANCE SUMMARY (ONLY HERE) */}
        <div className="border-t pt-3 space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Working Days</span>
            <span>{attendance.working_days ?? "-"}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Present</span>
            <span>{attendance.present ?? "-"}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Absent</span>
            <span>{attendance.absent ?? "-"}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Half Day</span>
            <span>{attendance.half_day ?? "-"}</span>
          </div>
        </div>
      </div>

      {/* RIGHT SALARY DETAILS */}
      <div className="col-span-2 space-y-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex justify-between text-sm font-medium">
            <span>
              Salary Template: {salaryTemplate.name || "-"}
            </span>
            <span>
              Rate (Per Hour): Rs{" "}
              {salaryTemplate.salary?.rate_per_hour || 0}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* GROSS */}
          {/* GROSS */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="font-medium mb-2">
              Gross Salary
            </div>

            {/* BASIC */}
            <div className="flex justify-between text-sm">
              <span>Basic Salary</span>
              <span>
                Rs {salaryTemplate.salary?.basic || 0}
              </span>
            </div>

            {/* ALLOWANCES */}
            {(salaryTemplate.allowances || []).map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between text-sm mt-1"
              >
                <span className="capitalize">
                  {item.name}
                </span>
                <span>
                  Rs {item.amount}
                </span>
              </div>
            ))}

            {/* TOTAL */}
            <div className="border-t mt-4 pt-2 flex justify-between font-medium">
              <span>Total Gross Amount</span>
              <span>
                Rs {salaryTemplate.summary?.gross_salary || 0}
              </span>
            </div>
          </div>


          {/* DEDUCTION */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="font-medium mb-2">
              Deduction
            </div>

            <div className="border-t mt-4 pt-2 flex justify-between font-medium">
              <span>Total Deduction Amount</span>
              <span>
                Rs {salaryTemplate.summary?.total_deduction || 0}
              </span>
            </div>
          </div>
        </div>

        {/* NET */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex justify-between font-semibold">
          <span>Net Salary</span>
          <span>
            Rs {salaryTemplate.summary?.net_salary || 0}
          </span>
        </div>
      </div>
    </div>
  );
}
