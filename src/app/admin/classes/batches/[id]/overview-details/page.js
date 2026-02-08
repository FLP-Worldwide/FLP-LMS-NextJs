"use client";

import React, { useState } from "react";
import {
  Pencil,
  Cake,
  ClipboardList,
} from "lucide-react";
import { api } from "@/utils/api";
import { useEffect } from "react";
import { useParams } from "next/navigation";


/* =====================================================
   CLASSES → OVERVIEW PAGE
===================================================== */

export default function Page() {
  const { id } = useParams();

  const [activeTab, setActiveTab] = useState("OVERVIEW");
  const [overview, setOverview] = useState(null);
  const [scheduleFilter, setScheduleFilter] = useState("MONTH"); // MONTH | WEEK

  useEffect(() => {
    api.get(`/batch/${id}/details`) // ← adjust endpoint if needed
      .then(res => setOverview(res.data?.data))
      .catch(console.error);
  }, []);

  const isCurrentMonth = (dateStr) => {
    const d = new Date(dateStr);
    const now = new Date();
    return (
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  };

  const isCurrentWeek = (dateStr) => {
    const d = new Date(dateStr);
    const now = new Date();

    const start = new Date(now);
    start.setDate(now.getDate() - now.getDay());

    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    return d >= start && d <= end;
  };

const filteredSchedule = React.useMemo(() => {
  if (!overview?.monthly_schedule) return [];

  if (scheduleFilter === "WEEK") {
    return overview.monthly_schedule.filter(item =>
      isCurrentWeek(item.date)
    );
  }

  // default: MONTH
  return overview.monthly_schedule.filter(item =>
    isCurrentMonth(item.date)
  );
}, [overview, scheduleFilter]);

  return (
    <>
    <div className="space-y-6 g">

      {/* ================= TABS ================= */}
      <div className="flex gap-6 border-b border-gray-200 text-sm">
        {["Overview", "Students", "Announcement", "Assignment"].map(
          (tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toUpperCase())}
              className={`pb-3 ${
                activeTab === tab.toUpperCase()
                  ? "border-b-2 border-blue-600 text-blue-600 font-medium"
                  : "text-gray-500"
              }`}
            >
              {tab}
            </button>
          )
        )}
      </div>

      {/* ================= OVERVIEW ================= */}
      {activeTab === "OVERVIEW" && (
        <>
          {/* ================= TOP ROW ================= */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* BATCH INFO */}
            <Card>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">
                    {overview?.batch?.name}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    {overview?.batch?.course?.name}
                  </p>

                </div>
                <button className="text-blue-600">
                  <Pencil size={16} />
                </button>
              </div>

              <div className="mt-4 space-y-2 text-sm text-gray-700">
                <InfoRow
                    label="No. of Students"
                    value={overview?.students?.total || 0}
                  />

                  <InfoRow
                    label="ID"
                    value={overview?.batch?.id}
                  />

                  <InfoRow
                    label="Batch Expiry Date"
                    value={overview?.batch?.end_date}
                  />

              </div>
            </Card>

            {/* TOTAL STUDENTS */}
            <Card>
              <h3 className="font-semibold mb-2">
                Total Students
              </h3>

             <p className="text-sm text-gray-500 mb-4">
                Total No. of Students:
                <span className="font-medium text-gray-900 ml-1">
                  {overview?.students?.total || 0}
                </span>
              </p>


              <div className="grid grid-cols-4 gap-4">
              <GenderStat label="Male" value={overview?.students?.gender?.male || 0} color="blue" />
              <GenderStat label="Female" value={overview?.students?.gender?.female || 0} color="pink" />
              <GenderStat label="Not Specified" value={overview?.students?.gender?.na || 0} color="amber" />
              <GenderStat label="Others" value={overview?.students?.gender?.other || 0} color="gray" />

              </div>
            </Card>

            {/* ANNOUNCEMENT */}
            <Card>
              <h3 className="font-semibold mb-2">
                Recent Announcement
              </h3>
              <div className="border border-gray-200 rounded-lg p-4 text-sm text-gray-500">
                There are currently no announcement available.
              </div>
            </Card>
          </div>

          {/* ================= BOTTOM ROW ================= */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* BIRTHDAYS */}
            <Card>
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold">
                  Student Birthday’s
                </h3>
                <span className="text-sm text-gray-500">
                  05/02/2026
                </span>
              </div>

              <EmptyState
                icon={<Cake size={40} />}
                text="There are no birthday"
              />
            </Card>

            {/* EXAM SCHEDULE */}
            <Card>
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold">Schedule Exam</h3>
              </div>

              {!overview?.exams || overview.exams.length === 0 ? (
                <EmptyState
                  icon={<ClipboardList size={40} />}
                  text="No Exam Schedule Found!"
                />
              ) : (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="grid grid-cols-2 bg-gray-50 px-4 py-2 text-sm font-medium">
                    <div>Date</div>
                    <div>Subject</div>
                  </div>

                  {overview.exams.map((exam) => (
                    <div
                      key={exam.id}
                      className="grid grid-cols-2 px-4 py-3 border-t text-sm"
                    >
                      <div>
                        <div className="font-medium">
                          {new Date(exam.date).toLocaleDateString("en-GB")}
                        </div>
                        <div className="text-xs text-gray-500">
                          {exam.start_time} - {exam.end_time}
                        </div>
                      </div>

                      <div className="font-medium">
                        {exam.subjects?.[0]?.subject || "—"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

          </div>
        </>
      )}

      
    </div>
    {/* ================= MONTHLY / WEEKLY SCHEDULE ================= */}
    <div className="mt-5">
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Class Schedule</h3>

        <div className="flex gap-2 text-xs">
          <button
            className={scheduleFilter === "MONTH" ? "soft-btn-primary" : "soft-btn-outline"}
            onClick={() => setScheduleFilter("MONTH")}
          >
            Current Month
          </button>

          <button
            className={scheduleFilter === "WEEK" ? "soft-btn-primary" : "soft-btn-outline"}
            onClick={() => setScheduleFilter("WEEK")}
          >
            Current Week
          </button>
        </div>
      </div>

      {filteredSchedule.length === 0 ? (
        <EmptyState
          icon={<ClipboardList size={40} />}
          text={
            scheduleFilter === "WEEK"
              ? "No schedule for current week"
              : "No schedule for current month"
          }
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-2">Date</th>
                <th className="text-left px-4 py-2">Day</th>
                <th className="text-left px-4 py-2">Subject</th>
                <th className="text-left px-4 py-2">Time</th>
                <th className="text-left px-4 py-2">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {filteredSchedule.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 font-medium">
                    {new Date(item.date).toLocaleDateString("en-GB")}
                  </td>
                  <td className="px-4 py-2">{item.day}</td>
                  <td className="px-4 py-2">{item.subject}</td>
                  <td className="px-4 py-2 text-xs text-gray-500">
                    {item.start_time} - {item.end_time}
                  </td>
                  <td className="px-4 py-2">
                    {item.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
</div>
</>
  );
}

/* =====================================================
   REUSABLE UI
===================================================== */

function Card({ children }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      {children}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function EmptyState({ icon, text }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-gray-400">
      <div className="mb-2">{icon}</div>
      <p className="text-sm">{text}</p>
    </div>
  );
}

/* =====================================================
   GENDER STAT (CENTERED)
===================================================== */

function GenderStat({ label, value, color }) {
  const map = {
    blue: "bg-blue-100 text-blue-600",
    pink: "bg-pink-100 text-pink-600",
    amber: "bg-amber-100 text-amber-600",
    gray: "bg-gray-100 text-gray-600",
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center ${map[color]}`}
      >
        👤
      </div>
      <span className="text-xs text-gray-500">
        {label}
      </span>
      <span className="text-sm font-semibold">
        {value}
      </span>
    </div>
  );
}
