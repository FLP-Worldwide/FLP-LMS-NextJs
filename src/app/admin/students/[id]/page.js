"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/utils/api";

const TABS = [
  "Overview",
  "Profile",
  "Documents",
  "Fees",
  "Exam",
  "Attendance",
  "Inventory",
  "PTM",
  "Time Table",
];

export default function StudentViewPage() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [activeTab, setActiveTab] = useState("Overview");

  useEffect(() => {
    fetchStudent();
  }, [id]);

  const fetchStudent = async () => {
    const res = await api.get(`/students/${id}`);
    setStudent(res.data.data);
  };

  if (!student) return <div className="text-sm p-4">Loading...</div>;

  return (
    <div className="space-y-4">
      {/* ================= HEADER ================= */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 flex justify-between items-start">
        <div className="flex gap-4">
          <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-lg">
            {student.first_name[0]}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">
                {student.first_name} {student.last_name}
              </h2>
              <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">
                {student.status}
              </span>
            </div>

            <div className="text-xs text-gray-500 space-y-0.5 mt-1">
              <div>Admission No : <b>{student.admission_no}</b></div>
              <div>Roll No : <b>{student.roll_no}</b></div>
              <div>Class : <b>{student.class} - {student.section}</b></div>
            </div>
          </div>
        </div>

        <button className="border px-3 py-1 text-sm rounded border-gray-300">Action</button>
      </div>

      {/* ================= TABS ================= */}
      <div className="flex gap-6 border-b border-gray-200 text-sm">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 ${
              activeTab === tab
                ? "border-b border-gray-200-2 border-b border-gray-200lue-600 text-blue-600 font-medium"
                : "text-gray-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ================= TAB CONTENT ================= */}
      {activeTab === "Overview" && <OverviewTab student={student} />}
      {activeTab === "Profile" && <ProfileTab student={student} />}
      {activeTab === "Attendance" && <AttendanceTab />}
      {activeTab === "Documents" && <EmptyTab title="Documents" />}
      {activeTab === "Fees" && <EmptyTab title="Fees" />}
      {activeTab === "Exam" && <EmptyTab title="Exam" />}
      {activeTab === "Inventory" && <EmptyTab title="Inventory" />}
      {activeTab === "PTM" && <EmptyTab title="PTM" />}
      {activeTab === "Time Table" && <EmptyTab title="Time Table" />}
    </div>
  );
}

/* ================= OVERVIEW TAB ================= */

function OverviewTab({ student }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 space-y-4">
        <Card title="Attendance">
          <div className="h-40 bg-gray-50 rounded flex items-center justify-center text-xs text-gray-400">
            Attendance graph (dummy)
          </div>
        </Card>

        <Card title="Calendar">
          <div className="h-32 bg-gray-50 rounded flex items-center justify-center text-xs text-gray-400">
            Calendar (dummy – will show day attendance)
          </div>
        </Card>

        <Card title="Upcoming Exam">
          <div className="text-xs text-gray-400">
            No upcoming exams scheduled
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <Card title="Yearly Attendance (Till Date)">
          <div className="h-32 bg-gray-50 rounded flex items-center justify-center text-xs text-gray-400">
            Donut chart (dummy)
          </div>
        </Card>

        <Card title="Birthday">
          <div className="text-xs text-center text-gray-500 py-4">
            {student.details?.dob || "Birthday Date is Not Mentioned!"}
          </div>
        </Card>

        <Card title="Announcements">
          <div className="text-xs text-gray-400">
            No announcements
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ================= PROFILE TAB ================= */

function ProfileTab({ student }) {
  const d = student.details || {};

  const Row = ({ label, value }) => (
    <div className="flex gap-2 text-sm">
      <div className="w-44 text-gray-500">{label} :</div>
      <div className="font-medium">{value || "--"}</div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Card title="Student Details">
        <Row label="Gender" value={d.gender} />
        <Row label="Date of Birth" value={d.dob} />
        <Row label="Blood Group" value={d.blood_group} />
        <Row label="Nationality" value={d.country} />
      </Card>

      <Card title="Address Details">
        <Row label="Address" value={d.address} />
        <Row label="City" value={d.city} />
        <Row label="State" value={d.state} />
        <Row label="Country" value={d.country} />
      </Card>

      <Card title="Parent Details">
        <Row label="Father Name" value={d.father_name} />
        <Row label="Mother Name" value={d.mother_name} />
        <Row label="Parent Phone" value={d.parent_phone} />
      </Card>

      <Card title="Report Details">
        <div className="text-sm text-blue-600 cursor-pointer">
          📄 Report Card
        </div>
      </Card>
    </div>
  );
}

/* ================= ATTENDANCE TAB ================= */

function AttendanceTab() {
  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <button className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-sm">
          Regular Attendance
        </button>
        <button className="px-4 py-1.5 border border-gray-300 rounded-full text-sm">
          Live Class Attendance
        </button>
      </div>

      <div className="flex gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input type="radio" checked readOnly />
          All
        </label>
        <label className="flex items-center gap-2">
          <input type="radio" readOnly />
          Date Range
        </label>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-4 py-2 text-left">Batch</th>
              <th>Classes</th>
              <th>Present</th>
              <th>Absent</th>
              <th>Leave</th>
              <th>Attendance</th>
              <th>Assign Date</th>
              <th>Leaving Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-gray-200">
              <td className="px-4 py-2">
                German Language Course – Batch A1
              </td>
              <td className="text-center">259</td>
              <td className="text-center">01</td>
              <td className="text-center">00</td>
              <td className="text-center">00</td>
              <td className="text-center">100%</td>
              <td className="text-center">06-01-2026</td>
              <td className="text-center">--</td>
              <td className="text-center">👁</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ================= COMMON ================= */

function EmptyTab({ title }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 text-sm text-gray-400 text-center">
      {title} data not available
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-2">
      <h3 className="text-sm font-semibold border-b border-gray-200 pb-1">{title}</h3>
      {children}
    </div>
  );
}
