"use client";

import React from "react";
import { api } from "@/utils/api";

export default function ReportsPage() {
  const generateReport = async (key) => {
    try {
      const res = await api.get(`/reports/${key}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(
        new Blob([res.data])
      );

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${key}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e) {
      console.error(e);
      alert("Failed to generate report");
    }
  };

  return (
    <div className="space-y-6">
      <PageSection title="Summary">
        <ReportItem
          title="Summary Report"
          desc="It generates detailed data on enquiries, admissions, and fees."
          onClick={() => generateReport("summary")}
        />
      </PageSection>

      <PageSection title="Enquiry">
        <ReportItem
          title="Enquiry Report"
          desc="Enquiry reports counsellor wise, source wise and referral wise."
          onClick={() => generateReport("enquiry")}
        />
      </PageSection>

      <PageSection title="Fees">
        <ReportItem
          title="Batch Wise"
          desc="Check student fee report batch wise."
          onClick={() => generateReport("fees-batch")}
        />
        <ReportItem
          title="Due Report"
          desc="Check student Fee Due details, download and send reminders."
          onClick={() => generateReport("fees-due")}
        />
        <ReportItem
          title="GST Report"
          desc="Get detailed Tax-wise bifurcation for each Payment."
          onClick={() => generateReport("fees-gst")}
        />
        <ReportItem
          title="Payment History"
          desc="Date wise payment history of students."
          onClick={() => generateReport("payment-history")}
        />
        <ReportItem
          title="Transaction History"
          desc="Collected date wise transaction history of students."
          onClick={() => generateReport("transaction-history")}
        />
        <ReportItem
          title="Online Fees Report"
          desc="Report of Online collected fees through app."
          onClick={() => generateReport("online-fees")}
        />
      </PageSection>

      <PageSection title="Student Attendance & Exam Report">
        <ReportItem
          title="Student Attendance Report"
          desc="Attendance report for students."
          onClick={() => generateReport("student-attendance")}
        />
        <ReportItem
          title="Exam Report"
          desc="Exam report of student as per their performance."
          onClick={() => generateReport("exam-report")}
        />
      </PageSection>

      <PageSection title="Product">
        <ReportItem
          title="Sales Report"
          desc="Report of products to students."
          onClick={() => generateReport("product-sales")}
        />
        <ReportItem
          title="Offer History"
          desc="Coupon / Voucher usage report."
          onClick={() => generateReport("offer-history")}
        />
      </PageSection>

      <PageSection title="Expense">
        <ReportItem
          title="Income and Expense Report"
          desc="Income and Expense report of the institution."
          onClick={() => generateReport("income-expense")}
        />
      </PageSection>

      <PageSection title="Staff Attendance">
        <ReportItem
          title="Teacher Attendance"
          desc="Consolidated report of teacher attendance."
          onClick={() => generateReport("teacher-attendance")}
        />
        <ReportItem
          title="Custom User Attendance"
          desc="Day wise consolidated custom user attendance."
          onClick={() => generateReport("custom-user-attendance")}
        />
      </PageSection>

      <PageSection title="Additional Reports">
        <p className="text-sm text-gray-500 px-4 pb-4">
          Multiple Reports related to Students, Fees (Upcoming) etc.
        </p>
      </PageSection>
    </div>
  );
}



function PageSection({ title, children }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl">
      <div className="px-4 py-3 font-semibold text-gray-700 border-b border-gray-200">
        {title}
      </div>
      <div>{children}</div>
    </div>
  );
}

function ReportItem({ title, desc, onClick }) {
  return (
    <div
      onClick={onClick}
      className="px-4 py-3 cursor-pointer hover:bg-gray-50 border-b border-gray-200 last:border-b-0"
    >
      <div className="font-medium text-gray-800">
        {title}
      </div>
      <div className="text-sm text-gray-500">
        {desc}
      </div>
    </div>
  );
}
