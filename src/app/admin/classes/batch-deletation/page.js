"use client";

import React, { useEffect, useState } from "react";
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
  const [view, setView] = useState(null); // null | delete | report
  const [batches, setBatches] = useState([]);
  const [deletedBatches, setDeletedBatches] = useState([]);
  const [selected, setSelected] = useState([]);

  /* ================= FETCH ACTIVE ================= */

  const fetchBatches = async () => {
    const res = await api.get("/batches");
    setBatches(res.data?.data || []);
  };

  /* ================= FETCH DELETED ================= */

  const fetchDeleted = async () => {
    const res = await api.get("/batches/deleted");
    setDeletedBatches(res.data?.data || []);
  };

  /* ================= DELETE ================= */

  const handleDelete = async () => {
    for (let id of selected) {
      await api.delete(`/batches/${id}`);
    }

    setSelected([]);
    setView("report");
    fetchDeleted();
  };

  /* ================= SWITCH VIEW ================= */

  const openDelete = () => {
    setView("delete");
    fetchBatches();
  };

  const openReport = () => {
    setView("report");
    fetchDeleted();
  };

  return (
    <div className="space-y-6 p-6">

      {/* ================= CARDS ================= */}
      {!view && (
        <div className="grid grid-cols-2 gap-6">
          <div
            onClick={openDelete}
            className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm cursor-pointer"
          >
            <h2 className="text-lg font-semibold">
              Delete Batches
            </h2>
            <p className="text-gray-500 mt-2">
              Select and delete the old Batches
            </p>
          </div>

          <div
            onClick={openReport}
            className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm cursor-pointer"
          >
            <h2 className="text-lg font-semibold">
              Batch Deletion Report
            </h2>
            <p className="text-gray-500 mt-2">
              Report of old deleted Batches
            </p>
          </div>
        </div>
      )}

      {/* ===================================================== */}
      {/* ================= DELETE TABLE ====================== */}
      {/* ===================================================== */}

      {view === "delete" && (
        <div className="bg-white border border-gray-200 rounded-xl">

          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-semibold">
              Delete Batches
            </h2>
            <PrimaryButton name="Delete" onClick={handleDelete} />
          </div>

          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Batch</th>
                <th className="p-3 text-left">Category/Course</th>
                <th className="p-3 text-left">Subjects</th>
                <th className="p-3 text-left">Teachers</th>
                <th className="p-3 text-left">Start Date</th>
                <th className="p-3 text-left">End Date</th>
              </tr>
            </thead>

            <tbody>
              {batches.map((b) => (
                <tr key={b.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(b.id)}
                      onChange={() =>
                        setSelected((prev) =>
                          prev.includes(b.id)
                            ? prev.filter((i) => i !== b.id)
                            : [...prev, b.id]
                        )
                      }
                    />
                  </td>

                  <td className="p-3">{b.name}</td>

                  <td className="p-3">
                    {b.course?.name || "-"}
                  </td>

                  {/* SUBJECTS */}
                  <td className="p-3">
                    {b.subjects?.length
                      ? b.subjects
                          .map((s) => s.subject?.name)
                          .join(", ")
                      : "-"}
                  </td>

                  {/* TEACHERS */}
                  <td className="p-3">
                    {b.subjects?.length
                      ? b.subjects
                          .map(
                            (s) =>
                              `${s.teacher?.first_name} ${s.teacher?.last_name}`
                          )
                          .join(", ")
                      : "-"}
                  </td>

                  <td className="p-3">{b.start_date}</td>
                  <td className="p-3">{b.end_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ===================================================== */}
      {/* ================= REPORT TABLE ====================== */}
      {/* ===================================================== */}

      {view === "report" && (
        <div className="bg-white border border-gray-200 rounded-xl">

          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">
              Batch Deletion Report
            </h2>
          </div>

          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Batch</th>
                <th className="p-3 text-left">Category/Course</th>
                <th className="p-3 text-left">Start Date</th>
                <th className="p-3 text-left">End Date</th>
                <th className="p-3 text-left">Deleted At</th>
              </tr>
            </thead>

            <tbody>
              {deletedBatches.map((b) => (
                <tr key={b.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{b.name}</td>
                  <td className="p-3">
                    {b.course?.name || "-"}
                  </td>
                  <td className="p-3">{b.start_date}</td>
                  <td className="p-3">{b.end_date}</td>
                  <td className="p-3">{formatTime(b.deleted_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}