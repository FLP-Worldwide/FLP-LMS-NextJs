"use client";

import React, { useState } from "react";
import SalaryTemplateModal from "@/components/staff/SalaryTemplateModal";
import OvertimeModal from "@/components/staff/OvertimeModal";
import IncentiveModal from "@/components/staff/IncentiveModal";

/* ---------------- STAFF ---------------- */
const staffList = [
  { id: 1, name: "Rohit Sharma", role: "Teacher", department: "Science", templateId: 1 },
  { id: 2, name: "Anita Verma", role: "Accountant", department: "Accounts", templateId: 2 },
  { id: 3, name: "Neha Singh", role: "Teacher", department: "Maths", templateId: 1 },
];

/* ---------------- SALARY TEMPLATES ---------------- */
const salaryTemplates = [
  {
    id: 1,
    name: "Teacher Monthly",
    type: "monthly",
    baseSalary: 35000,
    perDayDeduction: 1000,
    overtimeRate: 200,
  },
  {
    id: 2,
    name: "Staff Monthly",
    type: "monthly",
    baseSalary: 30000,
    perDayDeduction: 800,
    overtimeRate: 150,
  },
];

/* ---------------- PAYROLL DATA ---------------- */
const payrollMap = {
  1: {
    presentDays: 24,
    leaveDays: 2,
    overtimeHours: 5,
    incentives: [
      { title: "Extra Classes", amount: 2000 },
      { title: "Exam Duty", amount: 1500 },
    ],
    status: "Paid",
    paidOn: "31/12/2025",
  },
};

/* ---------------- DEFAULT PAYROLL (FIX ERROR) ---------------- */
const defaultPayroll = {
  presentDays: 0,
  leaveDays: 0,
  overtimeHours: 0,
  incentives: [],
  status: "Pending",
  paidOn: "-",
};

export default function PayrollPage() {
  const [selectedStaff, setSelectedStaff] = useState(staffList[0]);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showIncentiveModal, setShowIncentiveModal] = useState(false);
  const [showOvertimeModal, setShowOvertimeModal] = useState(false);

  const payroll = payrollMap[selectedStaff.id] || defaultPayroll;
  const template =
    salaryTemplates.find((t) => t.id === selectedStaff.templateId) ||
    salaryTemplates[0];

  const deduction = payroll.leaveDays * template.perDayDeduction;
  const incentiveTotal = payroll.incentives.reduce(
    (t, i) => t + i.amount,
    0
  );
  const overtimeAmount = payroll.overtimeHours * template.overtimeRate;

  const netPay =
    template.baseSalary -
    deduction +
    incentiveTotal +
    overtimeAmount;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* STAFF LIST */}
      <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="font-semibold mb-3">Staff</h3>

        {staffList.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelectedStaff(s)}
            className={`w-full text-left px-3 py-2 rounded-lg border mb-2 ${
              selectedStaff.id === s.id
                ? "bg-blue-50 border-blue-300"
                : "border-gray-200 hover:bg-gray-50"
            }`}
          >
            <div className="text-sm font-medium">{s.name}</div>
            <div className="text-xs text-gray-500">
              {s.role} • {s.department}
            </div>
          </button>
        ))}
      </div>

      {/* PAYROLL DETAILS */}
      <div className="lg:col-span-9 space-y-4">
        {/* HEADER */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              Payroll – {selectedStaff.name}
            </h2>
            <p className="text-xs text-gray-500">December 2025</p>
          </div>
          <div className="flex bg-white">
          <span
            className={`inline-flex items-center h-7 px-3 rounded-full text-xs font-medium ${
              payroll.status === "Paid"
                ? "bg-blue-100 text-blue-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {payroll.status}
          </span>

          </div>
        </div>

        {/* SALARY TEMPLATE */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold">Salary Template</h3>
            <button
              onClick={() => setShowTemplateModal(true)}
              className="text-sm text-blue-600"
            >
              Change
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-gray-500">Template</div>
              <b>{template.name}</b>
            </div>
            <div>
              <div className="text-gray-500">Base Salary</div>
              <b>₹{template.baseSalary}</b>
            </div>
            <div>
              <div className="text-gray-500">Per Day Deduction</div>
              <b>₹{template.perDayDeduction}</b>
            </div>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card title="Present Days" value={payroll.presentDays} />
          <Card title="Leave Days" value={payroll.leaveDays} />
          <Card title="Deduction" value={`-₹${deduction}`} danger />
          <Card title="Net Pay" value={`₹${netPay}`} />
        </div>

        {/* BREAKDOWN */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h3 className="font-semibold mb-3">Salary Breakdown</h3>

          <Row label="Base Salary" value={`₹${template.baseSalary}`} />
          <Row label="Leave Deduction" value={`-₹${deduction}`} danger />
          <Row label="Overtime" value={`₹${overtimeAmount}`} />
          <Row label="Incentives" value={`₹${incentiveTotal}`} />

          <hr className="my-3" />

          <Row label="Net Payable" value={`₹${netPay}`} bold />
        </div>

        {/* ACTIONS */}
        <div className="flex gap-3">
          <button
            onClick={() => setShowIncentiveModal(true)}
            className="soft-btn"
          >
            + Add Incentive
          </button>
          <button
            onClick={() => setShowOvertimeModal(true)}
            className="soft-btn"
          >
            + Add Overtime
          </button>
        </div>
      </div>

      {/* MODALS */}
      {showTemplateModal && (
        <SalaryTemplateModal onClose={() => setShowTemplateModal(false)} />
      )}
      {showIncentiveModal && (
        <IncentiveModal onClose={() => setShowIncentiveModal(false)} />
      )}
      {showOvertimeModal && (
        <OvertimeModal onClose={() => setShowOvertimeModal(false)} />
      )}
    </div>
  );
}

/* ---------------- SMALL UI ---------------- */

function Card({ title, value, danger }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="text-xs text-gray-500">{title}</div>
      <div className={`text-lg font-semibold ${danger ? "text-red-600" : ""}`}>
        {value}
      </div>
    </div>
  );
}

function Row({ label, value, bold, danger }) {
  return (
    <div className="flex justify-between text-sm py-1">
      <span className={bold ? "font-semibold" : ""}>{label}</span>
      <span className={`${bold ? "font-semibold" : ""} ${danger ? "text-red-600" : ""}`}>
        {value}
      </span>
    </div>
  );
}
