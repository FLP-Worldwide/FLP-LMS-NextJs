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
    Eye,
  Ban,
  Trash2,
  ClipboardCheck,
  Users2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/utils/api";


/* ======================================================
   ADMIN DASHBOARD PAGE
====================================================== */

export default function AdminPage() {
  const { dashboard } = useAdmin();
  const d = dashboard?.dashboard;
    const router = useRouter();
    const [activeTab, setActiveTab] = React.useState("batch"); 
    const [attendanceModal, setAttendanceModal] = React.useState({
        open: false,
        classes: [],
    });

    const [viewModal, setViewModal] = React.useState({
        open: false,
        batch: null,
    });
    const [cancelModal, setCancelModal] = React.useState({
        open: false,
        classes: [],
    });

  if (!d) return null;

  const {
    students,
    today_fee_stats,
    lead_stats,
    birthdays_today,
    running_batches,
  } = d;


  const cancelSingleDate = async (routineId) => {
  if (!confirm("Are you sure you want to cancel this class?")) return;

  try {
    const payload = {
      routine_id: routineId,
      date: new Date().toISOString().split("T")[0], // today date
    };

    await api.post("/class-routines/cancel-single", payload);

    alert("Class cancelled successfully");

    setCancelModal({ open: false, classes: [] });

    // Ideally refetch dashboard here
    // refreshDashboard();

  } catch (err) {
    console.error(err.response?.data);
    alert("Failed to cancel class");
  }
};



  return (
    <div className="space-y-8 p-6">

        <Card title="Running Batches">

            <div className="flex gap-4 mb-6 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab("batch")}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
                    activeTab === "batch"
                        ? "bg-blue-600 text-white"
                        : "text-gray-600"
                    }`}
                >
                    Batch
                </button>

                <button
                    onClick={() => setActiveTab("class")}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
                    activeTab === "class"
                        ? "bg-blue-600 text-white"
                        : "text-gray-600"
                    }`}
                >
                    Subject
                </button>
                </div>


       {activeTab === "batch" && (
        running_batches.length === 0 ? (
            <div className="text-sm text-gray-400 text-center py-6">
            No running batches
            </div>
        ) : (
            <table className="w-full text-sm">
                <thead className="bg-indigo-50">
                <tr>
                    <th className="p-3 text-left">Batch Name</th>
                    <th className="p-3 text-left">Start Date</th>
                    <th className="p-3 text-left">End Date</th>
                    <th className="p-3 text-left">Students</th>
                    <th className="p-3 text-left">Actions</th>
                </tr>
                </thead>
               <tbody>
                    {running_batches.map((b) => (
                        <React.Fragment key={b.batch_id}>
                        
                        {/* MAIN BATCH ROW */}
                        <tr className="border-b border-gray-200">
                            <td className="p-3">
                            <div className="font-semibold">{b.batch_name}</div>
                            <div className="text-xs text-gray-500">
                                {b.course_name}
                            </div>
                            </td>

                            <td className="p-3 text-gray-500">
                            {b.start_date}
                            </td>

                            <td className="p-3 text-gray-500">
                            {b.end_date}
                            </td>

                            <td className="p-3 text-indigo-700 font-medium">
                            {b.students_count}
                            </td>

                            <td className="p-3">
                                <div className="flex items-center gap-3 text-gray-500">

                                <Eye
                                    size={18}
                                    onClick={() =>
                                        setViewModal({
                                        open: true,
                                        batch: b,
                                        })
                                    }
                                    className="cursor-pointer hover:text-blue-600"
                                />


                                <Users2
                                    size={18}
                                    onClick={() =>
                                        setAttendanceModal({
                                        open: true,
                                        classes: b.today_classes || [],
                                        })
                                    }
                                    className="cursor-pointer hover:text-green-600"
                                    />


                                <Ban
                                    size={18}
                                    onClick={() =>
                                        setCancelModal({
                                        open: true,
                                        classes: b.today_classes || [],
                                        })
                                    }
                                    className="cursor-pointer hover:text-amber-600"
                                    />


                                {/* <Trash2
                                    size={18}
                                    className="cursor-pointer hover:text-red-600"
                                /> */}
                                </div>
                            </td>
                        </tr>

                        {/* TODAY CLASSES ROW */}
                        {b.today_classes?.length > 0 && (
                            <tr className="bg-gray-50 border-b border-gray-200">
                            <td colSpan="4" className="p-3">
                                <div className="flex flex-wrap gap-2">
                                {b.today_classes.map((cls) => (
                                    <div
                                    key={cls.routine_id}
                                    className="bg-indigo-100 text-indigo-700 text-xs px-3 py-1 rounded-full flex items-center gap-2"
                                    >
                                    <span className="font-medium">
                                        {cls.subject}
                                    </span>

                                    <span className="text-gray-600">
                                        {cls.teacher}
                                    </span>

                                    <span>
                                        {cls.start_time} - {cls.end_time}
                                    </span>

                                    <span className="text-[10px] bg-white px-2 py-0.5 rounded">
                                        {cls.class_type}
                                    </span>
                                    </div>
                                ))}
                                </div>
                            </td>
                            </tr>
                        )}

                        </React.Fragment>
                    ))}
                    </tbody>

            </table>
            )
            )}


            {activeTab === "class" && (
                <table className="w-full text-sm">
                    <thead className="bg-indigo-50">
                    <tr>
                        <th className="p-3 text-left">Class Time</th>
                        <th className="p-3 text-left">Subject</th>
                        <th className="p-3 text-left">Teacher</th>
                        <th className="p-3 text-left">Course</th>
                        <th className="p-3 text-left">Batch</th>
                        <th className="p-3 text-left">Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {running_batches.flatMap((b) =>
                        (b.today_classes || []).map((cls) => (
                        <tr key={cls.routine_id} className="border-b border-gray-200">
                            <td className="p-3">
                            {cls.start_time} - {cls.end_time}
                            </td>

                            <td className="p-3 font-medium">
                            {cls.subject}
                            </td>

                            <td className="p-3 text-gray-500">
                            {cls.teacher}
                            </td>

                            <td className="p-3 text-gray-500">
                            {b.course_name}
                            </td>

                            <td className="p-3 text-gray-500">
                            {b.batch_name}
                            </td>

                            <td className="p-3">
                            {cls.status}
                            </td>
                        </tr>
                        ))
                    )}
                    </tbody>
                </table>
                )}
      </Card>

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
      
        {attendanceModal.open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl w-96 p-6 shadow-xl">

            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">
                Select Class
                </h3>
                <button
                onClick={() =>
                    setAttendanceModal({ open: false, classes: [] })
                }
                className="text-gray-400 hover:text-gray-600"
                >
                ✕
                </button>
            </div>

            {attendanceModal.classes.length === 0 ? (
                <div className="text-sm text-gray-400 text-center py-6">
                No classes today
                </div>
            ) : (
                <div className="space-y-3 p-6">
                {attendanceModal.classes.map((cls) => (
                    <div
                    key={cls.routine_id}
                    onClick={() => {
                        router.push(
                        `/admin/classes/attendance/${cls.routine_id}`
                        );
                    }}
                    className="border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50"
                    >
                    <div className="font-medium">
                        {cls.subject}
                    </div>
                    <div className="text-xs text-gray-500">
                        {cls.teacher}
                    </div>
                    <div className="text-xs text-gray-400">
                        {cls.start_time} - {cls.end_time}
                    </div>
                    </div>
                ))}
                </div>
            )}
            </div>
        </div>
        )}
        {viewModal.open && viewModal.batch && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl w-[600px] max-h-[80vh] overflow-y-auto p-6 shadow-xl">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
               <h4 className="font-semibold mb-3">Today's Classes</h4>
                <button
                onClick={() =>
                    setViewModal({ open: false, batch: null })
                }
                className="text-gray-400 hover:text-gray-600"
                >
                ✕
                </button>
            </div>

            {/* BASIC INFO TABLE */}
            

            {/* TODAY CLASSES */}
           

            {viewModal.batch.today_classes?.length === 0 ? (
                <div className="text-sm text-gray-400 text-center py-4">
                No classes today
                </div>
            ) : (
                <table className="w-full text-sm border border-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                    <th className="p-3 text-left">Subject</th>
                    <th className="p-3 text-left">Teacher</th>
                    <th className="p-3 text-left">Time</th>
                    <th className="p-3 text-left">Type</th>
                    <th className="p-3 text-left">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {viewModal.batch.today_classes.map((cls) => (
                    <tr key={cls.routine_id} className="border-b">
                        <td className="p-3">{cls.subject}</td>
                        <td className="p-3">{cls.teacher}</td>
                        <td className="p-3">
                        {cls.start_time} - {cls.end_time}
                        </td>
                        <td className="p-3">{cls.class_type}</td>
                        <td className="p-3">{cls.status}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
            )}

            </div>
        </div>
        )}
{cancelModal.open && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl w-96 max-h-[80vh] overflow-y-auto p-6 shadow-xl">

      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">
          Cancel Scheduled Class
        </h3>
        <button
          onClick={() =>
            setCancelModal({ open: false, classes: [] })
          }
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      {cancelModal.classes.length === 0 ? (
        <div className="text-sm text-gray-400 text-center py-6">
          No classes available
        </div>
      ) : (
        <div className="space-y-3 p-6">
          {cancelModal.classes.map((cls) => (
            <div
              key={cls.routine_id}
              className="border border-gray-200 rounded-lg p-3 flex justify-between items-center"
            >
              <div>
                <div className="font-medium">
                  {cls.subject}
                </div>
                <div className="text-xs text-gray-500">
                  {cls.teacher}
                </div>
                <div className="text-xs text-gray-400">
                  {cls.start_time} - {cls.end_time}
                </div>
              </div>

              <button
                onClick={() =>
                  cancelSingleDate(cls.routine_id)
                }
                className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200"
              >
                Cancel
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  </div>
)}

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
