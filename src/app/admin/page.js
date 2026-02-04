"use client";

import React from "react";
import { useAdmin } from "@/context/AdminContext";
import OverallFeeStats from "@/components/dashboard/OverallFeeStats";
import { formatRupees } from "@/lib/formatHelper";
import {
  User,
  UserCircle,
  Users,
  HelpCircle,
} from "lucide-react";
/* ======================================================
   ADMIN DASHBOARD PAGE
====================================================== */

export default function AdminPage() {
  const { dashboard } = useAdmin();
  const d = dashboard?.dashboard;

  if (!d) return null;

  const {
    students,
    today_fee_stats,
    lead_stats,
    birthdays_today,
    running_batches,
  } = d;

  return (
    <div className="space-y-8">

      {/* ================= STUDENT STRENGTH ================= */}
      <Card
        title="Student Strength"
        subtitle="This is the total head count of the active students with gender-wise bifurcation."
      >
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

          {/* TOTAL STUDENTS */}
          <div className="bg-sky-50 rounded-xl p-3 text-center">
            <div className="text-3xl font-bold text-sky-700">
              {students.total}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Total Students
            </div>
            <div className="text-xs text-gray-400 mt-2">
              Added Today {students.added_today}
            </div>
          </div>

          <GenderStat label="Male" value={students.gender.male} color="blue" className="bg-gray-50" />
          <GenderStat label="Female" value={students.gender.female} color="pink" className="bg-gray-50" />
          <GenderStat label="Others" value={students.gender.others} color="amber" className="bg-gray-50" />
          <GenderStat label="NA" value={students.gender.na} color="gray" className="bg-gray-50" />

        </div>
      </Card>

      {/* ================= TODAY + OVERALL FEES ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* TODAY FEES */}
        <Card title="Today's Fee Stats" right="03 Feb 2026">
          <div className="grid grid-cols-2 gap-4">
            <SoftMetric
              label="Today's Collection"
              value={formatRupees(today_fee_stats.collection)}
              color="green"
            />
            <SoftMetric
              label="Today's Dues"
              value={formatRupees(today_fee_stats.dues)}
              color="rose"
            />
          </div>
        </Card>

        {/* OVERALL FEES + GRAPH */}
        <div className="lg:col-span-2">
          <OverallFeeStats data={d} />
        </div>
      </div>

      {/* ================= LEADS + BIRTHDAY ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LEAD STATS */}
        <Card title="Lead Stats" right="01 Feb 2026 to 03 Feb 2026">
          <div className="grid grid-cols-2 gap-4">
            <LeadRow label="Open" value={lead_stats.open} />
            <LeadRow label="In Progress" value={lead_stats.in_progress} />
            <LeadRow label="Admitted" value={lead_stats.admitted} />
            <LeadRow label="Closed" value={lead_stats.closed} />
          </div>
        </Card>

        {/* BIRTHDAY */}
        <Card title="Student Birthday" right="03 Feb 2026">
          <table className="w-full text-sm">
            <thead className="bg-blue-50">
              <tr>
                <th className="p-3 text-left">Student ID</th>
                <th className="p-3 text-left">Student Name</th>
                <th className="p-3 text-left">Contact No.</th>
              </tr>
            </thead>
            <tbody>
              {birthdays_today.length === 0 && (
                <tr>
                  <td
                    colSpan="3"
                    className="p-6 text-center text-gray-400"
                  >
                    🎂 There are no birthday
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
      </div>

      {/* ================= RUNNING BATCHES ================= */}
      <Card title="Running Batches">
        {running_batches.length === 0 ? (
          <div className="text-sm text-gray-400 text-center py-6">
            No running batches
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {running_batches.map((b) => (
              <div
                key={b.batch_id}
                className="bg-indigo-50 rounded-xl p-4 flex justify-between"
              >
                <div>
                  <div className="font-semibold">{b.batch_name}</div>
                  <div className="text-xs text-gray-500">
                    {b.start_date} → {b.end_date}
                  </div>
                </div>
                <div className="text-indigo-700 font-medium">
                  {b.students_count} Students
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

    </div>
  );
}

/* ======================================================
   UI HELPERS
====================================================== */

function Card({ title, subtitle, right, children }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-base font-semibold">{title}</h3>
          {subtitle && (
            <p className="text-xs text-gray-400">{subtitle}</p>
          )}
        </div>
        {right && (
          <span className="text-xs text-gray-500">{right}</span>
        )}
      </div>
      {children}
    </div>
  );
}


function GenderStat({ label, value, color, className }) {
  const colorMap = {
    blue: {
      bg: "bg-blue-100",
      text: "text-blue-700",
      icon: <User size={16} />,
    },
    pink: {
      bg: "bg-pink-100",
      text: "text-pink-700",
      icon: <UserCircle size={16} />,
    },
    amber: {
      bg: "bg-amber-100",
      text: "text-amber-700",
      icon: <Users size={16} />,
    },
    gray: {
      bg: "bg-gray-100",
      text: "text-gray-700",
      icon: <HelpCircle size={16} />,
    },
  };

  const theme = colorMap[color] || colorMap.gray;

  return (
    <div
      className={`rounded-xl border border-gray-200 bg-white flex items-center justify-center p-6 ${className}`}
    >
      <div className="flex items-center gap-3">
        {/* ICON */}
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center ${theme.bg} ${theme.text}`}
        >
          {theme.icon}
        </div>

        {/* TEXT */}
        <div className="flex-1 items-center gap-1">
          <div>
            <span className="text-sm  text-gray-900">
              {value}
            </span>
          </div>
          <div>
            <span className="text-xs  text-gray-700">
              {label}
            </span>
          </div>
           
        </div>
      </div>
    </div>
  );
}

function SoftMetric({ label, value, color }) {
  const map = {
    green: "bg-emerald-50 text-emerald-700",
    rose: "bg-rose-50 text-rose-700",
  };

  return (
    <div className={`rounded-xl p-4 ${map[color]}`}>
      <div className="text-sm">{label}</div>
      <div className="text-lg font-semibold mt-1">{value}</div>
    </div>
  );
}

function LeadRow({ label, value }) {
  return (
    <div className="border border-gray-200 rounded-lg p-3 flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
