"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/utils/api";

import OverviewTab from "@/components/admin/students/OverviewTab";
import ProfileTab from "@/components/admin/students/ProfileTab";
import AttendanceTab from "@/components/admin/students/AttendanceTab";
import EmptyTab from "@/components/admin/students/EmptyTab";
import SecondaryButton from "@/components/ui/SecodaryButton";
import FeesTab from "@/components/admin/students/FeesTab";

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
    if (id) fetchStudent();
  }, [id]);

  const fetchStudent = async () => {
    const res = await api.get(`/students/${id}`);
    setStudent(res.data.data);
  };

  /* ================= LOADING ================= */
  if (!student) {
    return <div className="text-sm p-4">Loading...</div>;
  }

  /* ================= SAFE DATA ================= */
  const details = student.details || {};
  const classRoom = student.class_room || {};
  const courses = classRoom.courses || [];

  const coursesWithBatches = courses.filter(
    (course) => course.batches && course.batches.length > 0
  );

  return (
    <div className="space-y-4">

      {/* ================= HEADER ================= */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
        <div className="flex gap-4">

          {/* Avatar */}
          <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-lg font-semibold">
            {student.first_name?.[0] || "?"}
          </div>

          {/* Basic Info */}
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">
                {student.first_name} {student.last_name}
              </h2>

              <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">
                {student.status}
              </span>
            </div>

            <div className="text-xs text-gray-500 mt-1 space-y-0.5">
   
              <div>
                Class : <b>{classRoom.name || "--"} {student.section || "--"}</b>
              </div>
              

              {/* ================= COURSES & BATCHES ================= */}
              {coursesWithBatches.length > 0 ? (
                coursesWithBatches.map((course) => (
                  <div key={course.id} className="ml-2">
                    <div>
                      Course : <b>{course.name}</b>
                    </div>

                    {course.batches.map((batch) => (
                      <div key={batch.id} className="ml-4">
                        Batch : <b>{batch.name}</b> ({batch.academic_year})
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                <div>
                  Course : <b>--</b>
                </div>
              )}
            </div>
          </div>
        </div>

        <SecondaryButton name="Action" />
      </div>

      {/* ================= TABS ================= */}
      <div className="flex gap-6 border-b text-sm">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 ${
              activeTab === tab
                ? "border-b-2 border-blue-600 text-blue-600 font-medium"
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
      {activeTab === "Attendance" && <AttendanceTab student={student} />}
      {activeTab === "Documents" && <EmptyTab title="Documents" />}
      {activeTab === "Fees" && <FeesTab studentId={student.id} />}

      {activeTab === "Exam" && <EmptyTab title="Exam" />}
      {activeTab === "Inventory" && <EmptyTab title="Inventory" />}
      {activeTab === "PTM" && <EmptyTab title="PTM" />}
      {activeTab === "Time Table" && <EmptyTab title="Time Table" />}
    </div>
  );
}
