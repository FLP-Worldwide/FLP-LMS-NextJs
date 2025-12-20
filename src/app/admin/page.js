"use client";

import React from "react";

export default function AdminPage() {
  return (
    <div className="space-y-8">

      {/* TOP METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <Metric
          title="Total Students"
          value="1,240"
          color="from-blue-500 to-blue-400"
        />
        <Metric
          title="Teachers"
          value="68"
          color="from-indigo-500 to-indigo-400"
        />
        <Metric
          title="Attendance Today"
          value="92%"
          color="from-emerald-500 to-emerald-400"
        />
        <Metric
          title="Pending Fees"
          value="₹3.4L"
          color="from-rose-500 to-rose-400"
        />
      </div>

      {/* GRAPHS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ATTENDANCE BAR */}
        <Card title="Attendance Overview">
          <Progress label="Present" value={92} color="bg-emerald-500" />
          <Progress label="Absent" value={8} color="bg-rose-400" />
        </Card>

        {/* FEE COLLECTION */}
        <Card title="Fee Collection">
          <Progress label="Collected" value={75} color="bg-blue-500" />
          <Progress label="Pending" value={25} color="bg-orange-400" />
        </Card>

        {/* QUICK STATS */}
        <Card title="Quick Stats">
          <Stat label="Active Batches" value="18" />
          <Stat label="Exams This Month" value="6" />
          <Stat label="Events Planned" value="4" />
        </Card>
      </div>

      {/* RUNNING BATCHES */}
      <Section title="Running Batches">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <BatchCard
            name="Class 10 – Science"
            teacher="Mr. Sharma"
            students={42}
            color="bg-blue-50"
          />
          <BatchCard
            name="Class 8 – Mathematics"
            teacher="Ms. Neha"
            students={35}
            color="bg-indigo-50"
          />
        </div>
      </Section>

      {/* UPCOMING EVENTS */}
      <Section title="Upcoming Exams & Events">
        <ul className="space-y-3 text-sm">
          <Event title="Half-Yearly Exams" date="22 Dec 2025" />
          <Event title="Parent Teacher Meeting" date="26 Dec 2025" />
        </ul>
      </Section>

    </div>
  );
}

/* ---------- UI COMPONENTS ---------- */

function Metric({ title, value, color }) {
  return (
    <div className={`rounded-2xl p-4 text-white shadow-sm bg-gradient-to-br ${color}`}>
      <div className="text-xs opacity-90">{title}</div>
      <div className="text-2xl font-bold mt-2">{value}</div>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <h3 className="text-sm font-semibold mb-4">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Progress({ label, value, color }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1 text-gray-500">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
        <div
          className={`h-full ${color} rounded-full`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <h3 className="text-base font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );
}

function BatchCard({ name, teacher, students, color }) {
  return (
    <div className={`rounded-xl p-4 ${color} flex justify-between items-center`}>
      <div>
        <div className="font-semibold">{name}</div>
        <div className="text-xs text-gray-500 mt-1">
          Teacher: {teacher}
        </div>
      </div>
      <div className="text-sm font-medium text-blue-600">
        {students} Students
      </div>
    </div>
  );
}

function Event({ title, date }) {
  return (
    <li className="flex justify-between">
      <span>{title}</span>
      <span className="text-gray-400">{date}</span>
    </li>
  );
}
