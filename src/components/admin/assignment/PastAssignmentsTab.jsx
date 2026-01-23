import React from "react";
import NoRecords from "./NoRecords";

export default function PastAssignmentsTab({ assignments = [] }) {
  if (assignments.length === 0) {
    return <NoRecords label="No draft assignments found" />;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left">Topic</th>
            <th className="px-4 py-2 text-left">Course</th>
            <th className="px-4 py-2 text-left">Batch</th>
            <th className="px-4 py-2 text-left">Subject</th>
            <th className="px-4 py-2 text-left">Publish</th>
            <th className="px-4 py-2 text-left">Due</th>
            <th className="px-4 py-2 text-left">Evaluation</th>
            <th className="px-4 py-2 text-left">Late Submit</th>
            <th className="px-4 py-2 text-left">Created</th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {assignments.map((a) => (
            <tr key={a.id} className="hover:bg-gray-50">
              {/* TOPIC */}
              <td className="px-4 py-2 font-medium">
                {a.topic}
              </td>

              {/* COURSE */}
              <td className="px-4 py-2">
                {a.course?.name || "—"}
              </td>

              {/* BATCH */}
              <td className="px-4 py-2">
                {a.batch?.name || "—"}
              </td>

              {/* SUBJECT */}
              <td className="px-4 py-2">
                {a.subject?.name || "—"}
              </td>

              {/* PUBLISH DATE */}
              <td className="px-4 py-2 text-gray-500">
                {a.publish_at
                  ? formatDate(a.publish_at)
                  : "Draft"}
              </td>

              {/* DUE DATE */}
              <td className="px-4 py-2 text-gray-500">
                {a.due_at ? formatDate(a.due_at) : "—"}
              </td>

              {/* EVALUATION */}
              <td className="px-4 py-2">
                <StatusBadge
                  active={a.evaluation_required}
                  on="Yes"
                  off="No"
                />
              </td>

              {/* LATE SUBMISSION */}
              <td className="px-4 py-2">
                <StatusBadge
                  active={a.allow_late_submission}
                  on="Allowed"
                  off="No"
                />
              </td>

              {/* CREATED */}
              <td className="px-4 py-2 text-gray-500">
                {formatDate(a.created_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ================= HELPERS ================= */

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
      className={`text-xs px-2 py-1 rounded ${
        active
          ? "bg-blue-50 text-blue-700"
          : "bg-gray-100 text-gray-500"
      }`}
    >
      {active ? on : off}
    </span>
  );
}