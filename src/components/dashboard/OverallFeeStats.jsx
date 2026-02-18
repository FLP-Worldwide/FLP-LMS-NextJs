"use client";

import React from "react";
import { formatRupees } from "@/lib/formatHelper";

/* ================= COLORS ================= */
const MODE_COLORS = {
  CASH: "bg-pink-400",
  UPI: "bg-orange-400",
  BANK_TRANSFER: "bg-emerald-400",
  CHEQUE: "bg-blue-400",
  OTHERS: "bg-gray-400",
};

/* ======================================================
   OVERALL FEE STATISTICS COMPONENT
====================================================== */

export default function OverallFeeStats({ data }) {
  const fee = data?.overall_fee_stats || {};
  const modes = data?.payment_modes || {};

  const total =
    Number(fee.collected || 0) +
    Number(fee.past_dues || 0) +
    Number(fee.future_dues || 0) +
    Number(fee.bad_debt || 0);

  const percent = (v) =>
    total ? ((Number(v) / total) * 100).toFixed(2) : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* ================= LEFT CARD ================= */}
      <div className="rounded-2xl p-5 border border-gray-200 bg-orange-50">
        <h3 className="font-semibold mb-2">
          Overall Fee Statistics
        </h3>

        <StatRow label="Fees" value={fee.fees} />
        <StatRow label="Concession" value={fee.concession} />
        <StatRow label="Total Fees" value={fee.total_fees} />

        <div className="text-xs text-gray-500 mt-4">
          * All amounts are inclusive of GST
        </div>
      </div>

      {/* ================= MIDDLE CARD ================= */}
      <div className="rounded-2xl p-5 border border-gray-200 bg-white">
          <h3 className="font-semibold">Fee Breakdown</h3>
        <div className="mb-1 flex justify-between items-center">
          <span className="text-xs text-gray-500">
            Academic Year : 2025-26
          </span>
        </div>

        {/* PROGRESS BAR */}
        <div className="flex h-2 rounded-full overflow-hidden mb-2">
          <Bar color="bg-emerald-400" value={percent(fee.collected)} />
          <Bar color="bg-red-400" value={percent(fee.past_dues)} />
          <Bar color="bg-orange-400" value={percent(fee.future_dues)} />
          <Bar color="bg-gray-400" value={percent(fee.bad_debt)} />
        </div>

        <Legend
          color="bg-emerald-400"
          label="Collected Fees"
          percent={percent(fee.collected)}
          amount={fee.collected}
        />
        <Legend
          color="bg-red-400"
          label="Past Dues"
          percent={percent(fee.past_dues)}
          amount={fee.past_dues}
        />
        <Legend
          color="bg-orange-400"
          label="Future Dues"
          percent={percent(fee.future_dues)}
          amount={fee.future_dues}
        />
        <Legend
          color="bg-gray-400"
          label="Bad Debt"
          percent={percent(fee.bad_debt)}
          amount={fee.bad_debt}
        />

        <div className="text-xs text-gray-400 mt-3">
          * Today’s dues included in future dues
        </div>
      </div>

      {/* ================= RIGHT CARD ================= */}
      <div className="rounded-2xl p-5 border border-gray-200 bg-indigo-50">
        <h3 className="font-semibold mb-2">
          Mode of Transactions
        </h3>

        <ModeBars data={modes} />
      </div>
    </div>
  );
}

/* ======================================================
   MODE OF TRANSACTIONS (SIMPLE + STABLE)
====================================================== */

function ModeBars({ data }) {
  const entries = Object.entries(data || {}).map(
    ([key, value]) => ({
      label: key.replace("_", " "),
      value: Number(value),
      color: MODE_COLORS[key] || MODE_COLORS.OTHERS,
    })
  );

  const max = Math.max(...entries.map((e) => e.value), 1);

  return (
    <div className="space-y-2 p-6">
      {entries.map((m) => (
        <div key={m.label}>
          <div className="flex justify-between text-sm mb-1">
            <span className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${m.color}`}
              />
              <span className="text-gray-700">
                {m.label}
              </span>
            </span>

            <span className="font-medium">
              {formatRupees(m.value)}
            </span>
          </div>

          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`${m.color} h-full rounded-full transition-all`}
              style={{
                width: `${(m.value / max) * 100}%`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ======================================================
   SMALL HELPERS
====================================================== */

function StatRow({ label, value }) {
  return (
    <div className="flex justify-between text-sm mb-1">
      <span className="text-gray-700">{label}</span>
      <span className="font-medium">
        {formatRupees(value)}
      </span>
    </div>
  );
}

function Bar({ color, value }) {
  return (
    <div
      className={`${color}`}
      style={{ width: `${value}%` }}
    />
  );
}

function Legend({ color, label, percent, amount }) {
  return (
    <div className="flex justify-between text-sm mb-1">
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${color}`} />
        <span>{label}</span>
      </div>

      <div className="text-right flex gap-1">
        <div className="text-xs text-gray-400">
          {percent}%
        </div>
        <div className="font-medium">
          {formatRupees(amount)}
        </div>
      </div>
    </div>
  );
}
