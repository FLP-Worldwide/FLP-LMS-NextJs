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
  const [view, setView] = useState("list");
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
    <div className="space-y-4">
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between">
        {/* LEFT */}
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
    

          {/* VIEW TOGGLE */}
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

        {/* RIGHT */}
        <div className="flex items-center gap-2">

          <PrimaryButton
            name="Add Zoom Class"
            onClick={() => setOpenCreate(true)}
          />
        </div>
      </div>

      {/* ================= EMPTY STATE ================= */}
      <div className="bg-white rounded-xl border border-gray-200 min-h-[420px] p-4">
        {loading ? (
            <div className="text-sm text-gray-500">Loading...</div>
            ) : zoomclasses.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-sm text-gray-500 text-center">
                No {tab === "upcoming" ? "Upcoming" : "Previous"} Zoom classes
            </div>
            ) : view === "list" ? (
            /* ================= LIST VIEW (TABLE STYLE) ================= */
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                <thead className="bg-gray-50">
                    <tr>
                    <th className="px-4 py-2 text-left">Topic</th>
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Time</th>
                    <th className="px-4 py-2 text-left">Teachers</th>
                    <th className="px-4 py-2 text-right">Action</th>
                    </tr>
                </thead>

                <tbody className="divide-y">
                    {zoomclasses.map((c) => (
                    <tr key={c.id}>
                        <td className="px-4 py-2 font-medium">{c.topic}</td>

                        <td className="px-4 py-2">
                        {new Date(c.date).toLocaleDateString()}
                        </td>

                        <td className="px-4 py-2">
                        {c.from_time.slice(0, 5)} – {c.to_time.slice(0, 5)}
                        </td>

                        <td className="px-4 py-2">
                        {c.teachers?.map(t => (t.first_name || "") + " " + (t.last_name || "")).join(", ") || "—"}
                        </td>

                        <td className="px-4 py-2 text-right">
                        <button
                            className="text-blue-600 mr-3"
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
            /* ================= GRID VIEW (CARD STYLE) ================= */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {zoomclasses.map((c) => (
                <div
                    key={c.id}
                    className="bg-white rounded-xl border border-gray-200 p-4"
                >
                    <div className="flex justify-between">
                    <div>
                        <h3 className="font-semibold text-sm">{c.topic}</h3>
                        <p className="text-xs text-gray-500">
                        {new Date(c.date).toLocaleDateString()}
                        </p>
                    </div>

                    <button
                        className="text-blue-600"
                        onClick={() => openEdit(c)}
                    >
                        Edit
                    </button>
                    </div>

                    <div className="mt-4 text-sm text-gray-600">
                    ⏰ {c.from_time.slice(0, 5)} – {c.to_time.slice(0, 5)}
                    </div>

                    <div className="mt-2 text-xs text-gray-500">
                    Teachers: {c.teachers?.length || 0} <br />
                    Students: {c.students?.length || 0}
                    </div>
                </div>
                ))}
            </div>
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
