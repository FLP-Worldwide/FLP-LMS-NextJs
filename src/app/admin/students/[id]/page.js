"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/utils/api";

import { SECTIONS } from "@/constants/sections";
import { BLOOD_GROUPS } from "@/constants/studentMeta";


import Modal from "@/components/ui/Modal";
import OverviewTab from "@/components/admin/students/OverviewTab";
import ProfileTab from "@/components/admin/students/ProfileTab";
import AttendanceTab from "@/components/admin/students/AttendanceTab";
import EmptyTab from "@/components/admin/students/EmptyTab";
import FeesTab from "@/components/admin/students/FeesTab";
import PrimaryButton from "@/components/ui/PrimaryButton";

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
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    api.get("/classes").then((res) => {
      setClasses(res.data?.data || []);
    });
  }, []);

  /* ================= STATE ================= */
  const [student, setStudent] = useState(null);
  const [activeTab, setActiveTab] = useState("Overview");
  const [openMenu, setOpenMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    studentName: "",
    admissionDate: "",
    class_id: "",
    section: "",
    dob: "",
    gender: "",
    blood_group: "",
    mobile: "",
    email: "",
    fatherName: "",
    motherName: "",
    parentMobile: "",
    address: "",
    city: "",
    state: "",
    remarks: "",
  });

  /* ================= FETCH STUDENT ================= */
  useEffect(() => {
    if (!id) return;

    const fetchStudent = async () => {
      const res = await api.get(`/students/${id}`);
      setStudent(res.data.data);
    };

    fetchStudent();
  }, [id]);

  /* ================= PREFILL FORM ON EDIT ================= */
  useEffect(() => {
    if (!showModal || !student) return;

    setForm({
      studentName: `${student.first_name} ${student.last_name ?? ""}`,
      admissionDate: student.admission_date,
      class_id: student.class,
      section: student.section ?? "",
      dob: student.details?.dob ?? "",
      gender: student.details?.gender ?? "",
      blood_group: student.details?.blood_group ?? "",
      mobile: student.details?.phone ?? "",
      email: student.details?.email ?? "",
      fatherName: student.details?.father_name ?? "",
      motherName: student.details?.mother_name ?? "",
      parentMobile: student.details?.parent_phone ?? "",
      address: student.details?.address ?? "",
      city: student.details?.city ?? "",
      state: student.details?.state ?? "",
      remarks: student.details?.medical_info ?? "",
    });
  }, [showModal, student]);

  /* ================= UPDATE STUDENT ================= */
  const submitAdmission = async () => {
    const payload = {
      first_name: form.studentName.split(" ")[0],
      last_name: form.studentName.split(" ").slice(1).join(" ") || null,
      admission_date: form.admissionDate,
      class: form.class_id,
      section: form.section || null,
      status: "active",
      details: {
        dob: form.dob,
        gender: form.gender.toLowerCase(),
        blood_group: form.blood_group,
        phone: form.mobile,
        email: form.email,
        father_name: form.fatherName,
        mother_name: form.motherName,
        parent_phone: form.parentMobile,
        address: form.address,
        city: form.city,
        state: form.state,
        medical_info: form.remarks || null,
      },
    };

    await api.put(`/students/${id}`, payload);

    // refresh view data
    const res = await api.get(`/students/${id}`);
    setStudent(res.data.data);

    setShowModal(false);
  };

  /* ================= LOADING ================= */
  if (!student) {
    return <div className="text-sm p-4">Loading...</div>;
  }

  /* ================= SAFE DATA ================= */
  const classRoom = student.class_room || {};
  const courses = classRoom.courses || [];
  const coursesWithBatches = courses.filter(
    (course) => course.batches && course.batches.length > 0
  );

  return (
    <>
      <div className="space-y-4 p-6">
        {/* ================= HEADER ================= */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex gap-4">
            <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-lg font-semibold">
              {student.first_name?.[0] || "?"}
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

              <div className="text-xs text-gray-500 mt-1 space-y-0.5">
                <div>
                  Class : <b>{classRoom.name || "--"} {student.section || "--"}</b>
                </div>

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
                  <div>Course : <b>--</b></div>
                )}
              </div>
            </div>
          </div>

          <div className="relative">
            <button className="underline " onClick={() => setOpenMenu((p) => !p)}>
              Action
            </button>

            {openMenu && (
              <div className="absolute right-0 mt-2 w-40 rounded-md border border-gray-200 bg-white shadow-lg z-50">
                <button
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                  onClick={() => {
                    setShowModal(true);
                    setOpenMenu(false);
                  }}
                >
                  Edit Profile
                </button>

                {/* <button
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                  onClick={() => setOpenMenu(false)}
                >
                  Add Document
                </button> */}
              </div>
            )}
          </div>
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
        {activeTab === "Documents" && (
          <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3 text-sm">
            <h3 className="font-medium text-gray-700">Uploaded Documents</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Aadhaar */}
              <DocumentItem
                label="Aadhaar Card"
                file={student.details?.aadhaar_doc}
              />

              {/* Main Document */}
              <DocumentItem
                label="Document"
                file={student.details?.document}
              />

              {/* Other Document */}
              <DocumentItem
                label="Extra Document"
                file={student.details?.document_other}
              />
            </div>
          </div>
        )}

        {activeTab === "Fees" && <FeesTab studentId={student.id} />}
       {activeTab === "Exam" && (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-4 py-2 text-left">#</th>
                  <th className="px-4 py-2 text-left">Title</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Time</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Attendance</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {student.exams?.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-4 py-10 text-center text-gray-400"
                    >
                      No Exams Found
                    </td>
                  </tr>
                ) : (
                  student.exams.map((exam, index) => (
                    <tr key={exam.exam_id}>
                      <td className="px-4 py-2">{index + 1}</td>

                      <td className="px-4 py-2">
                        {exam.title || "Untitled Exam"}
                      </td>

                      <td className="px-4 py-2">
                        {exam.exam_date}
                      </td>

                      <td className="px-4 py-2">
                        {exam.start_time} - {exam.end_time}
                      </td>

                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-1 text-xs rounded ${
                            exam.status === "scheduled"
                              ? "bg-blue-50 text-blue-600"
                              : "bg-red-50 text-red-600"
                          }`}
                        >
                          {exam.status}
                        </span>
                      </td>

                      <td className="px-4 py-2">
                        {renderAttendanceBadge(exam.attendance_status, exam.attended)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "Inventory" && <EmptyTab title="Inventory" />}
        {activeTab === "PTM" && <EmptyTab title="PTM" />}
        {activeTab === "Time Table" && <EmptyTab title="Time Table" />}
      </div>


      {showModal && (
        <Modal title="Edit Student Profile" onClose={() => setShowModal(false)}>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="soft-label">Student Name</label>
              <input
                className="soft-input"
                value={form.studentName}
                onChange={(e) =>
                  setForm({ ...form, studentName: e.target.value })
                }
              />
            </div>

            <div>
              <label className="soft-label">Admission Date</label>
              <input
                type="date"
                className="soft-input"
                value={form.admissionDate}
                onChange={(e) =>
                  setForm({ ...form, admissionDate: e.target.value })
                }
              />
            </div>

           <div>
            <label className="soft-label">Class</label>
            <select
              className="soft-input"
              value={form.class_id}
              onChange={(e) => setForm({ ...form, class_id: e.target.value })}
            >
              <option value="">Select</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

            <div>
              <label className="soft-label">Section</label>
              <select
                className="soft-input"
                value={form.section}
                onChange={(e) => setForm({ ...form, section: e.target.value })}
              >
                <option value="">Select</option>
                {SECTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="soft-label">DOB</label>
              <input
                type="date"
                className="soft-input"
                value={form.dob}
                onChange={(e) =>
                  setForm({ ...form, dob: e.target.value })
                }
              />
            </div>

            <div>
              <label className="soft-label">Gender</label>
              <select
                className="soft-input"
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
           <div>
              <label className="soft-label">Blood Group</label>
              <select
                className="soft-input"
                value={form.blood_group}
                onChange={(e) =>
                  setForm({ ...form, blood_group: e.target.value })
                }
              >
                <option value="">Select</option>
                {BLOOD_GROUPS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="soft-label">Mobile</label>
              <input
                className="soft-input"
                value={form.mobile}
                onChange={(e) =>
                  setForm({ ...form, mobile: e.target.value })
                }
              />
            </div>

            <div>
              <label className="soft-label">Email</label>
              <input
                className="soft-input"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />
            </div>

            <div>
              <label className="soft-label">Father Name</label>
              <input
                className="soft-input"
                value={form.fatherName}
                onChange={(e) =>
                  setForm({ ...form, fatherName: e.target.value })
                }
              />
            </div>

            <div>
              <label className="soft-label">Mother Name</label>
              <input
                className="soft-input"
                value={form.motherName}
                onChange={(e) =>
                  setForm({ ...form, motherName: e.target.value })
                }
              />
            </div>

            <div>
              <label className="soft-label">Parent Mobile</label>
              <input
                className="soft-input"
                value={form.parentMobile}
                onChange={(e) =>
                  setForm({ ...form, parentMobile: e.target.value })
                }
              />
            </div>

            <div className="col-span-3">
              <label className="soft-label">Address</label>
              <input
                className="soft-input"
                value={form.address}
                onChange={(e) =>
                  setForm({ ...form, address: e.target.value })
                }
              />
            </div>

            <div>
              <label className="soft-label">City</label>
              <input
                className="soft-input"
                value={form.city}
                onChange={(e) =>
                  setForm({ ...form, city: e.target.value })
                }
              />
            </div>

            <div>
              <label className="soft-label">State</label>
              <input
                className="soft-input"
                value={form.state}
                onChange={(e) =>
                  setForm({ ...form, state: e.target.value })
                }
              />
            </div>

            <div className="col-span-3">
              <label className="soft-label">Remarks</label>
              <input
                className="soft-input"
                value={form.remarks}
                onChange={(e) =>
                  setForm({ ...form, remarks: e.target.value })
                }
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              className="soft-btn-outline"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
            <PrimaryButton name="Save" onClick={submitAdmission} />
          </div>
        </Modal>
      )}


  </>
  );
}



function DocumentItem({ label, file }) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api", "") || "";

  return (
    <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
      <div className="text-xs font-medium text-gray-600 mb-2">
        {label}
      </div>

      {file ? (
        <a
          href={`${baseUrl}/storage/${file}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 text-sm underline break-all"
        >
          View Document
        </a>
      ) : (
        <div className="text-gray-400 text-xs">
          No Document Uploaded
        </div>
      )}
    </div>
  );
}


function renderAttendanceBadge(status, attended) {
  if (!attended)
    return (
      <span className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-500">
        Not Attempted
      </span>
    );

  switch (status) {
    case 1:
      return (
        <span className="px-2 py-1 text-xs rounded bg-green-50 text-green-600">
          Present
        </span>
      );
    case 2:
      return (
        <span className="px-2 py-1 text-xs rounded bg-red-50 text-red-600">
          Absent
        </span>
      );
    case 3:
      return (
        <span className="px-2 py-1 text-xs rounded bg-amber-50 text-amber-600">
          Leave
        </span>
      );
    default:
      return (
        <span className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-500">
          Not Marked
        </span>
      );
  }
}
