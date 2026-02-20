"use client";

import React, { useState, useEffect } from "react";
import PrimaryButton from "@/components/ui/PrimaryButton";
import ZoomCreateModal from "./ZoomCreateModal";
import { Grid, List, SlidersHorizontal } from "lucide-react";
import SecondaryButton from "@/components/ui/SecodaryButton";
import { api } from "@/utils/api";

export default function ZoomClassPage() {
  const [tab, setTab] = useState("upcoming");
  const [openCreate, setOpenCreate] = useState(false);
  const [view, setView] = useState("grid");
    const [zoomclasses, setZoomclasses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingClass, setEditingClass] = useState(null);


  useEffect(() => {
  fetchZoomClasses();
}, [tab]);

const openEdit = (data) => {
  setEditingClass(data);
  setOpenCreate(true);
};

const fetchZoomClasses = async () => {
  try {
    setLoading(true);

    const res = await api.get("/live-class/zoom-classes", {
      params: { type: tab }, // upcoming | previous
    });

    setZoomclasses(res.data?.data || []);
  } catch (err) {
    console.error("Failed to load zoom classes", err);
    setZoomclasses([]);
  } finally {
    setLoading(false);
  }
};

 return (
  <div className="space-y-4 p-6">
    {/* ================= HEADER ================= */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <SecondaryButton
          onClick={() => setTab("upcoming")}
          className={`-sm ${
            tab === "upcoming"
              ? "soft-btn-primary"
              : "soft-btn-outline"
          }`}
          name={`Upcoming`}
        />

        <SecondaryButton
          onClick={() => setTab("previous")}
          className={`soft-btn-sm ${
            tab === "previous"
              ? "soft-btn-primary"
              : "soft-btn-outline"
          }`}
          name={`Previous`}
        />

        <button
          onClick={() => setView("grid")}
          className={`p-2 rounded-md border ${
            view === "grid"
              ? "bg-blue-600 text-white border-blue-600"
              : "border-gray-200"
          }`}
        >
          <Grid size={16} />
        </button>

        <button
          onClick={() => setView("list")}
          className={`p-2 rounded-md border ${
            view === "list"
              ? "bg-blue-600 text-white border-blue-600"
              : "border-gray-200"
          }`}
        >
          <List size={16} />
        </button>
      </div>

      <PrimaryButton
        name="Add Zoom Class"
        onClick={() => setOpenCreate(true)}
      />
    </div>

    {/* ================= BODY ================= */}
    <div className="bg-white rounded-xl border border-gray-200 min-h-[420px] p-4">
      {loading ? (
        <div className="text-sm text-gray-500">Loading...</div>
      ) : zoomclasses.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-sm text-gray-500 text-center">
          No {tab === "upcoming" ? "Upcoming" : "Previous"} Zoom classes
        </div>
      ) : (
        Object.entries(groupByDate(zoomclasses)).map(([date, classes]) => (
          <div key={date} className="mb-8">
            
            {/* ===== DATE HEADER ===== */}
            <div className="mb-4">
              <span className="bg-gray-100 text-xs px-3 py-1 rounded-md">
                {formatDate(date)}
              </span>
            </div>

            {/* ================= LIST VIEW ================= */}
            {view === "list" ? (
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left">Topic</th>
                      <th className="px-4 py-2 text-left">Time</th>
                      <th className="px-4 py-2 text-left">Teachers</th>
                      <th className="px-4 py-2 text-right">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y">
                    {classes.map((c) => (
                      <tr key={c.id}>
                        <td className="px-4 py-2 font-medium">
                          {c.topic}
                        </td>

                        <td className="px-4 py-2">
                          {c.from_time.slice(0, 5)} –{" "}
                          {c.to_time.slice(0, 5)}
                        </td>

                        <td className="px-4 py-2">
                          {c.teachers
                            ?.map(
                              (t) =>
                                `${t.first_name} ${t.last_name}`
                            )
                            .join(", ") || "—"}
                        </td>

                        <td className="px-4 py-2 text-right">
                          <button
                            className="text-blue-600"
                            onClick={() => openEdit(c)}
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              /* ================= GRID VIEW ================= */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {classes.map((c) => (
                  <div
                    key={c.id}
                    className="bg-white rounded-xl border border-gray-200 p-4 relative"
                  >
                    {tab === "upcoming" && (
                      <TimeLeftBadge date={c.date} from={c.from_time} />
                    )}

                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-semibold text-sm text-blue-600">
                          {c.topic}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {c.from_time.slice(0, 5)} – {c.to_time.slice(0, 5)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-2 text-xs text-gray-500">
                      {c.teachers?.map(t => `${t.first_name} ${t.last_name}`).join(", ")}
                    </div>

                    {/* ===== ACTION BAR ===== */}
                    <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between">
                      
                      {/* LEFT ICONS */}
                      <div className="flex items-center gap-3 text-sm">
                        
                        {/* Cancel */}
                        <button
                          className="text-red-500 hover:scale-110 transition"
                          title="Cancel"
                        >
                          ✕
                        </button>

                        {/* Reminder */}
                        <button
                          className="text-green-500 hover:scale-110 transition"
                          title="Send Reminder"
                        >
                          📩
                        </button>

                        {/* View */}
                        <button
                          className="text-blue-500 hover:scale-110 transition"
                          title="View"
                          onClick={() => openEdit(c)}
                        >
                          👁
                        </button>
                      </div>

                      {/* START BUTTON */}
                      {(() => {
                        const status = getClassStatus(c.date, c.from_time);

                        return (
                          <button
                            disabled={!status.canStart}
                            className={`px-4 py-1.5 text-sm rounded-md transition
                              ${
                                status.canStart
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-300 text-white cursor-not-allowed"
                              }`}
                          >
                            Start
                          </button>
                        );
                      })()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>

    {/* ================= CREATE MODAL ================= */}
    {openCreate && (
      <ZoomCreateModal
        onClose={() => {
          setOpenCreate(false);
          setEditingClass(null);
          fetchZoomClasses();
        }}
        editData={editingClass}
      />
    )}
  </div>
);
}

/* ================= HELPERS ================= */

function groupByDate(classes) {
  return classes.reduce((acc, cls) => {
    const dateKey = cls.date.split("T")[0];
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(cls);
    return acc;
  }, {});
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function TimeLeftBadge({ date, from }) {
  const classTime = new Date(`${date.split("T")[0]}T${from}`);
  const now = new Date();
  const diff = classTime - now;

  if (diff <= 0) return null;

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff / (1000 * 60)) % 60);

  return (
    <div className="absolute top-3 right-3 bg-purple-100 text-purple-600 text-xs px-2 py-1 rounded-full">
      {hours > 0 ? `${hours}h ${minutes}m left` : `${minutes}m left`}
    </div>
  );
}


function getClassStatus(date, from) {
  const classTime = new Date(`${date.split("T")[0]}T${from}`);
  const now = new Date();
  const diff = classTime - now;

  const minutesLeft = Math.floor(diff / (1000 * 60));

  return {
    minutesLeft,
    canStart: minutesLeft <= 5 && minutesLeft >= 0,
    isPast: minutesLeft < 0,
  };
}