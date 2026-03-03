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
import PrimaryButton from "@/components/ui/PrimaryButton";
import Modal from "@/components/ui/Modal";
import CreateAssignmentModal from "@/components/admin/assignment/CreateAssignmentModal";
import DraftAssignmentsTab from "@/components/admin/assignment/DraftAssignmentsTab";
import PublishedAssignmentsTab from "@/components/admin/assignment/PublishedAssignmentsTab";
import PastAssignmentsTab from "@/components/admin/assignment/PastAssignmentsTab";

/* =====================================================
   CLASSES → OVERVIEW PAGE
===================================================== */

export default function Page() {
  const { id } = useParams();

  const [activeTab, setActiveTab] = useState("OVERVIEW");
  const [overview, setOverview] = useState(null);
  const [scheduleFilter, setScheduleFilter] = useState("MONTH"); // MONTH | WEEK
  const [students, setStudents] = useState([]);
  const [studentLoading, setStudentLoading] = useState(false);

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [allStudents, setAllStudents] = useState([]);
  const [assignLoading, setAssignLoading] = useState(false);

  const [announcements, setAnnouncements] = useState([]);
  const [announcementLoading, setAnnouncementLoading] = useState(false);

  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);

  const [announcementForm, setAnnouncementForm] = useState({
    title: "",
    category: "",
    description: "",
    schedule_for_later: false,
    scheduled_date: "",
    scheduled_hour: "",
    scheduled_minute: "",
    attachment: null,
    status: "PUBLISHED",
  });


  const [assignmentLoading, setAssignmentLoading] = useState(false);
  const [assignmentGrouped, setAssignmentGrouped] = useState({
    draft: [],
    active: [],
    past: [],
  });

  const [assignmentType, setAssignmentType] = useState("draft");
  const [modalAssignment, setModalAssignment] = useState(null);

  const fetchBatchAssignments = async () => {
    try {
      setAssignmentLoading(true);

      const res = await api.get("/assignments/grouped", {
        params: { batch_id: id },
      });

      setAssignmentGrouped(res.data?.data || {});
    } finally {
      setAssignmentLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "ASSIGNMENT") {
      fetchBatchAssignments();
    }
  }, [activeTab]);

  const fetchAnnouncements = async () => {
    if (!id) return;

    setAnnouncementLoading(true);

    try {
      const res = await api.get(`/batches/${id}/announcements`);
      setAnnouncements(res.data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setAnnouncementLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "ANNOUNCEMENT") {
      fetchAnnouncements();
    }
  }, [activeTab]);

  const openCreateAnnouncement = () => {
    setEditingAnnouncement(null);
    setAnnouncementForm({
      title: "",
      category: "",
      description: "",
      schedule_for_later: false,
      scheduled_at: "",
      attachment: null,
      status: "PUBLISHED",
    });
    setShowAnnouncementModal(true);
  };

  const saveAnnouncement = async () => {
      if (!announcementForm.title || !announcementForm.description) {
        alert("Title and Description required");
        return;
      }

      const formData = new FormData();

      formData.append("title", announcementForm.title);
      formData.append("category", announcementForm.category || "");
      formData.append("description", announcementForm.description);
      formData.append("status", announcementForm.status || "PUBLISHED");

      // Boolean properly
      formData.append(
        "schedule_for_later",
        announcementForm.schedule_for_later ? 1 : 0
      );

      // If scheduling enabled
      if (announcementForm.schedule_for_later) {
        if (
          !announcementForm.scheduled_date ||
          announcementForm.scheduled_hour === "" ||
          announcementForm.scheduled_minute === ""
        ) {
          alert("Please select schedule date & time");
          return;
        }

        const scheduled_at = `${announcementForm.scheduled_date} ${announcementForm.scheduled_hour}:${announcementForm.scheduled_minute}:00`;

        formData.append("scheduled_at", scheduled_at);
      }

      // Attachment
      if (announcementForm.attachment instanceof File) {
        formData.append("attachment", announcementForm.attachment);
      }

      try {
        if (editingAnnouncement) {
          await api.post(
            `/batches/${id}/announcements/${editingAnnouncement.id}?_method=PUT`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );
        } else {
          await api.post(
            `/batches/${id}/announcements`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );
        }

        setShowAnnouncementModal(false);
        fetchAnnouncements();
      } catch (err) {
        console.error(err.response?.data);
        alert("Failed to save announcement");
      }
    };



  const deleteAnnouncement = async (announcementId) => {
    if (!confirm("Delete this announcement?")) return;

    try {
      await api.delete(
        `/batches/${id}/announcements/${announcementId}`
      );
      fetchAnnouncements();
    } catch (err) {
      console.error(err);
    }
  };


  const fetchAllStudents = async () => {
  try {
    const res = await api.get("/students"); // adjust if needed
    setAllStudents(res.data?.data || []);
  } catch (err) {
    console.error(err);
  }
};
const openAssignModal = async () => {
  await fetchAllStudents();
  setShowAssignModal(true);
};

const assignStudentToBatch = async (studentId) => {
  setAssignLoading(true);

  try {
    await api.post(`/batches/${id}/assign-student`, {
      student_id: studentId,
    });

    setShowAssignModal(false);
    fetchBatchStudents(); // refresh student list
  } catch (err) {
    console.error(err);
    alert("Failed to assign student");
  } finally {
    setAssignLoading(false);
  }
};


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

const upcomingExams = React.useMemo(() => {
  if (!overview?.exams) return [];

  const today = new Date();
  today.setHours(0, 0, 0, 0); // ignore time

  return overview.exams.filter((exam) => {
    const examDate = new Date(exam.date);
    examDate.setHours(0, 0, 0, 0);
    return examDate >= today;
  });
}, [overview]);


  const fetchBatchStudents = async () => {
    if (!id) return;

    setStudentLoading(true);

    try {
      const res = await api.get(`/batches/${id}/students`);
      setStudents(res.data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setStudentLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "STUDENTS") {
      fetchBatchStudents();
    }
  }, [activeTab]);

  const updateAssignedDate = async (studentId, date) => {
    try {
      await api.put(
        `/batches/${id}/students/${studentId}/update-date`,
        { assigned_date: date }
      );

      fetchBatchStudents(); // refresh
    } catch (err) {
      console.error(err);
      alert("Failed to update date");
    }
  };





  return (
    <>
    <div className="space-y-6 p-4">
    
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

              {!upcomingExams || upcomingExams.length === 0? (
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

                  {upcomingExams.map((exam) => (
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



    {/* ================= STUDENTS TAB ================= */}
      {activeTab === "STUDENTS" && (
        <Card>
          <h3 className="font-semibold mb-4">Students List</h3>

            <div className="flex justify-end mb-4">
              <PrimaryButton
                name="Assign Student"
                onClick={openAssignModal}
              />
            </div>

          {studentLoading ? (
            <div className="text-sm text-gray-500">
              Loading...
            </div>
          ) : students.length === 0 ? (
            <EmptyState
              icon={<ClipboardList size={40} />}
              text="No Students Found!"
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left">#</th>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Gender</th>
                    <th className="px-4 py-2 text-left">
                      Assigned Date
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {students.map((student, index) => (
                    <tr key={student.id}>
                      <td className="px-4 py-2">
                        {index + 1}
                      </td>

                      <td className="px-4 py-2 font-medium">
                        {student.name}
                      </td>

                      <td className="px-4 py-2 text-gray-500">
                        {student.email || "—"}
                      </td>

                      <td className="px-4 py-2">
                        {student.gender || "—"}
                      </td>

                      <td className="px-4 py-2">
                        <input
                          type="date"
                          className="soft-input text-xs"
                          value={
                            student.assigned_date
                              ? student.assigned_date.split("T")[0]
                              : ""
                          }
                          onChange={(e) =>
                            updateAssignedDate(
                              student.id,
                              e.target.value
                            )
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}
      

      {/* ================= ANNOUNCEMENT TAB ================= */}
      {activeTab === "ANNOUNCEMENT" && (
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Announcements</h3>

              <PrimaryButton
                name="+ Add Announcement"
                onClick={openCreateAnnouncement}
              />
            </div>

            {announcementLoading ? (
              <div className="text-sm text-gray-500">
                Loading...
              </div>
            ) : announcements.length === 0 ? (
              <EmptyState
                icon={<ClipboardList size={40} />}
                text="No Data Found!"
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-left">
                        Announcement Date
                      </th>
                      <th className="px-4 py-2 text-left">
                        Title
                      </th>
                      <th className="px-4 py-2 text-left">
                        Category
                      </th>
                      <th className="px-4 py-2 text-left">
                        Status
                      </th>
                      <th className="px-4 py-2 text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y">
                    {announcements.map((a) => (
                      <tr key={a.id}>
                        <td className="px-4 py-2">
                          {new Date(a.scheduled_at).toLocaleDateString("en-GB")}
                        </td>

                        <td className="px-4 py-2 font-medium">
                          {a.title}
                        </td>

                        <td className="px-4 py-2">
                          {a.category}
                        </td>

                       <td className="px-4 py-2">
                        <span
                          className={`px-2 py-1 text-xs rounded-full font-medium ${
                            a.display_status === "SCHEDULED"
                              ? "bg-amber-100 text-amber-600"
                              : "bg-green-100 text-green-600"
                          }`}
                        >
                          {a.display_status}
                        </span>
                      </td>

                        <td className="px-4 py-2 text-right">
                          <div className="flex gap-3 justify-end">
                            <button
                              className="text-blue-600"
                              onClick={() => {
                                setEditingAnnouncement(a);

                                let scheduled_date = "";
                                let scheduled_hour = "";
                                let scheduled_minute = "";

                                if (a.scheduled_at) {
                                  const [datePart, timePart] = a.scheduled_at.split(" ");
                                  const [hour, minute] = timePart.split(":");

                                  scheduled_date = datePart;
                                  scheduled_hour = hour;
                                  scheduled_minute = minute;
                                }

                                setAnnouncementForm({
                                  title: a.title || "",
                                  category: a.category || "",
                                  description: a.description || "",
                                  schedule_for_later: a.schedule_for_later == 1,
                                  scheduled_date,
                                  scheduled_hour,
                                  scheduled_minute,
                                  attachment: null,
                                  status: a.status || "PUBLISHED",
                                });

                                setShowAnnouncementModal(true);
                              }}
                            >
                              Edit
                            </button>

                            <button
                              className="text-rose-600"
                              onClick={() =>
                                deleteAnnouncement(a.id)
                              }
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        )}



      {/* ================= ASSIGNMENT TAB ================= */}
      {activeTab === "ASSIGNMENT" && (
        <div className="space-y-4">

          {/* Header */}
          <div className="flex justify-between items-center">
            <div className="flex gap-4 text-sm">
              {["draft", "published", "past"].map((type) => (
                <button
                  key={type}
                  onClick={() => setAssignmentType(type)}
                  className={`pb-2 ${
                    assignmentType === type
                      ? "border-b-2 border-blue-600 text-blue-600 font-medium"
                      : "text-gray-500"
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>

            <PrimaryButton
              name="+ Add Assignment"
              onClick={() => setModalAssignment({ batch_id: id })}
            />
          </div>

          {assignmentLoading ? (
            <div className="text-sm text-gray-500">Loading...</div>
          ) : (
            <>
              {assignmentType === "draft" && (
                <DraftAssignmentsTab
                  assignments={assignmentGrouped.draft}
                  onEdit={(a) => setModalAssignment(a)}
                />
              )}

              {assignmentType === "published" && (
                <PublishedAssignmentsTab
                  assignments={assignmentGrouped.active}
                />
              )}

              {assignmentType === "past" && (
                <PastAssignmentsTab
                  assignments={assignmentGrouped.past}
                />
              )}
            </>
          )}

        </div>
      )}



    </div>
    {/* ================= MONTHLY / WEEKLY SCHEDULE ================= */}
    <div className="mt-5 hidden ">
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



  {showAssignModal && (
    <Modal
      title="Assign Student"
      onClose={() => setShowAssignModal(false)}
    >
      <div className="max-h-96 overflow-y-auto">

        {allStudents.length === 0 ? (
          <div className="text-sm text-gray-500">
            No Students Found
          </div>
        ) : (
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Standard</th>
                <th className="px-4 py-2 text-right">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {allStudents.map((student) => (
                <tr key={student.id}>
                  <td className="px-4 py-2 font-medium">
                    {student.admission_no}
                  </td>
                  <td className="px-4 py-2 font-medium">
                    {student.first_name} {student.last_name}
                  </td>

                  <td className="px-4 py-2 text-gray-500">
                    {student.classes.name || "—"} {student.section || "—"}
                  </td>

                  <td className="px-4 py-2 text-right">
                    <PrimaryButton
                      name="Assign"
                      onClick={() =>
                        assignStudentToBatch(student.id)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      </div>
    </Modal>
  )}


      {showAnnouncementModal && (
      <Modal
        title={
          editingAnnouncement
            ? "Edit Announcement"
            : "Add Announcement"
        }
        onClose={() => setShowAnnouncementModal(false)}
      >
        <div className="space-y-4 p-6">

          <div>
            <label className="text-xs text-gray-500">
              Title *
            </label>
            <input
              className="soft-input mt-1"
              value={announcementForm.title}
              onChange={(e) =>
                setAnnouncementForm({
                  ...announcementForm,
                  title: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="text-xs text-gray-500">
              Category
            </label>
            <select
              className="soft-select mt-1"
              value={announcementForm.category}
              onChange={(e) =>
                setAnnouncementForm({
                  ...announcementForm,
                  category: e.target.value,
                })
              }
            >
              <option value="">Select</option>
              <option value="General">General</option>
              <option value="Exam">Exam</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-500">
              Description *
            </label>
            <textarea
              className="soft-input mt-1"
              rows={5}
              value={announcementForm.description}
              onChange={(e) =>
                setAnnouncementForm({
                  ...announcementForm,
                  description: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="text-xs text-gray-500">
              Attachment
            </label>
            <input
              type="file"
              className="soft-input mt-1"
              onChange={(e) =>
                setAnnouncementForm({
                  ...announcementForm,
                  attachment: e.target.files[0],
                })
              }
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm font-medium">
              Schedule For Later
            </label>

            <button
              type="button"
              onClick={() =>
                setAnnouncementForm({
                  ...announcementForm,
                  schedule_for_later:
                    !announcementForm.schedule_for_later,
                })
              }
              className={`w-12 h-6 rounded-full transition ${
                announcementForm.schedule_for_later
                  ? "bg-blue-600"
                  : "bg-gray-300"
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transform transition ${
                  announcementForm.schedule_for_later
                    ? "translate-x-6"
                    : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {announcementForm.schedule_for_later && (
            <div className="grid grid-cols-3 gap-4 mt-3">

              {/* Date */}
              <div>
                <label className="text-xs text-gray-500">
                  Schedule Date *
                </label>
                <input
                  type="date"
                  className="soft-input mt-1"
                  value={announcementForm.scheduled_date}
                  onChange={(e) =>
                    setAnnouncementForm({
                      ...announcementForm,
                      scheduled_date: e.target.value,
                    })
                  }
                />
              </div>

              {/* Hour */}
              <div>
                <label className="text-xs text-gray-500">
                  Hour *
                </label>
                <select
                  className="soft-select mt-1"
                  value={announcementForm.scheduled_hour}
                  onChange={(e) =>
                    setAnnouncementForm({
                      ...announcementForm,
                      scheduled_hour: e.target.value,
                    })
                  }
                >
                  <option value="">HH</option>
                  {Array.from({ length: 24 }).map((_, i) => (
                    <option key={i} value={i}>
                      {i.toString().padStart(2, "0")}
                    </option>
                  ))}
                </select>
              </div>

              {/* Minute */}
              <div>
                <label className="text-xs text-gray-500">
                  Minute *
                </label>
                <select
                  className="soft-select mt-1"
                  value={announcementForm.scheduled_minute}
                  onChange={(e) =>
                    setAnnouncementForm({
                      ...announcementForm,
                      scheduled_minute: e.target.value,
                    })
                  }
                >
                  <option value="">MM</option>
                  {["00", "15", "30", "45"].map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

            </div>
          )}

          <div className="flex justify-end gap-2 pt-3">
            <button
              onClick={() =>
                setShowAnnouncementModal(false)
              }
              className="soft-btn-outline"
            >
              Cancel
            </button>

            <PrimaryButton
              name="Save"
              onClick={saveAnnouncement}
            />
          </div>

        </div>
      </Modal>
    )}


    {modalAssignment !== null && (
      <CreateAssignmentModal
        assignment={modalAssignment}
        onClose={() => setModalAssignment(null)}
        onSaved={() => {
          setModalAssignment(null);
          fetchBatchAssignments();
        }}
      />
    )}
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
