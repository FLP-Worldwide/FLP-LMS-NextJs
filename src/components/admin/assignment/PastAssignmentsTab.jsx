import React from "react";
import NoRecords from "./NoRecords";

export default function PastAssignmentsTab({ assignments = [] }) {
  if (assignments.length === 0) {
    return <NoRecords label="No past assignments found" />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {assignments.map((a) => (
        <div
          key={a.id}
          className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition"
        >
          {/* Header */}
          <div className="mb-3">
            <h3 className="font-semibold text-gray-800 text-sm truncate">
              {a.topic}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Created: {formatDate(a.created_at)}
            </p>
          </div>

          {/* Info Section */}
          <div className="space-y-2 text-xs text-gray-600">
            <InfoRow label="Course" value={a.course?.name || "—"} />
            <InfoRow label="Batch" value={a.batch?.name || "—"} />
            <InfoRow label="Subject" value={a.subject?.name || "—"} />
            <InfoRow
              label="Published"
              value={a.publish_at ? formatDate(a.publish_at) : "—"}
            />
            <InfoRow
              label="Due"
              value={a.due_at ? formatDate(a.due_at) : "—"}
            />
          </div>

          {/* Status Section */}
          <div className="flex flex-wrap gap-2 mt-3">
            <StatusBadge
              active={a.evaluation_required}
              on="Evaluation: Yes"
              off="Evaluation: No"
            />
            <StatusBadge
              active={a.allow_late_submission}
              on="Late: Allowed"
              off="Late: No"
            />
          </div>

          {/* Optional: Past Label */}
          <div className="mt-4">
            <span className="text-[10px] px-2 py-1 rounded-full bg-gray-100 text-gray-600">
              Past Assignment
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* Reusable Row */
function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-700">{value}</span>
    </div>
  );
}

/* Helpers */

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function StatusBadge({ active, on, off }) {
  return (
    <span
      className={`text-[10px] px-2 py-1 rounded-full ${
        active
          ? "bg-blue-50 text-blue-700"
          : "bg-gray-100 text-gray-500"
      }`}
    >
      {active ? on : off}
    </span>
  );
}