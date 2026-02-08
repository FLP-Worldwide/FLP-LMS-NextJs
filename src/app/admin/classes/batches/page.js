"use client";

import React, { useEffect, useState } from "react";
import PrimaryButton from "@/components/ui/PrimaryButton";
import Modal from "@/components/ui/Modal";
import { EditOutlined } from "@ant-design/icons";
import { api } from "@/utils/api";
import { GraduationCap } from "lucide-react";

/* ================= PAGE ================= */

export default function BatchPage() {
  const [classes, setClasses] = useState([]);
  const [activeClassId, setActiveClassId] = useState(null);

  const [courses, setCourses] = useState([]);
  const [standards, setStandards] = useState([]);
  const [editingCourseId, setEditingCourseId] = useState(null);

  const [showCourseModal, setShowCourseModal] = useState(false);

  const emptyCourseForm = {
    name: "",
    standard_id: "",
    short_description: "",
    show_on_registration: true,
  };

  const [courseForm, setCourseForm] = useState(emptyCourseForm);


  const [showBatchModal, setShowBatchModal] = useState(false);
  const [activeCourse, setActiveCourse] = useState(null);

  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const emptyBatchForm = {
  name: "",
  academic_year: "",
  start_date: "",
  end_date: "",
  subjects: [] // [{ subject_id, teacher_id, extra_teacher_id }]
  };

  const [batchForm, setBatchForm] = useState(emptyBatchForm);

  const fetchSubjects = async (classId) => {
    const res = await api.get(`/subjects?class_id=${classId}`);
    setSubjects(res.data?.data || []);
  };

  const fetchTeachers = async () => {
    const res = await api.get("/teachers");
    setTeachers(res.data?.data || []);
  };

  const openAddBatch = async (course) => {
    setActiveCourse(course);
    setBatchForm(emptyBatchForm);
    setShowBatchModal(true);

    await fetchSubjects(activeClassId);
    await fetchTeachers();
  };

  const getEligibleTeachers = (subjectId) => {
    return teachers.filter(t =>
      t.classes?.some(c => c.id === activeClassId) &&
      t.subjects?.some(s => s.id === subjectId)
    );
  };

  const saveBatch = async () => {
    // Only submit checked + valid subjects
    const payload = {
      course_id: activeCourse.id,
      name: batchForm.name,
      academic_year: batchForm.academic_year,
      start_date: batchForm.start_date,
      end_date: batchForm.end_date,
      subjects: batchForm.subjects
        .filter(s => s.teacher_id) // teacher required
        .map(s => ({
          subject_id: s.subject_id,
          teacher_id: s.teacher_id,
          extra_teacher_id: s.extra_teacher_id || null
        }))
    };

    try {
      await api.post("/batches", payload);
      setShowBatchModal(false);
      fetchCourses(activeClassId);
    } catch (err) {
      alert("Failed to save batch");
    }
  };



  /* ================= FETCH ================= */

  const fetchClasses = async () => {
    try {
      const res = await api.get("/classes");
      const list = res.data?.data || [];
      setClasses(list);
      setStandards(list);

      if (list.length && !activeClassId) {
        setActiveClassId(list[0].id);
      }
    } catch {
      console.error("Failed to load classes");
    }
  };


  const fetchCourses = async (classId) => {
    if (!classId) return;

    try {
      const res = await api.get(`/courses?standard_id=${classId}`);
      const list = res.data?.data || [];

      // 🔥 Fetch batches per course
      const coursesWithBatches = await Promise.all(
        list.map(async (course) => {
          try {
            const batchRes = await api.get(
              `/batches?course_id=${course.id}`
            );

            return {
              ...course,
              batches: batchRes.data?.data || [],
            };
          } catch {
            return {
              ...course,
              batches: [],
            };
          }
        })
      );

      setCourses(coursesWithBatches);
    } catch {
      console.error("Failed to load courses");
      setCourses([]);
    }
  };


  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    fetchCourses(activeClassId);
  }, [activeClassId]);

  /* ================= SAVE COURSE ================= */

  const saveCourse = async () => {
    try {
      const payload = {
        ...courseForm,
        class_id: activeClassId,
      };

      if (editingCourseId) {
        // 🔁 UPDATE
        await api.put(`/courses/${editingCourseId}`, payload);
      } else {
        // ➕ CREATE
        await api.post("/courses", payload);
      }

      setShowCourseModal(false);
      setCourseForm(emptyCourseForm);
      setEditingCourseId(null);
      fetchCourses(activeClassId);
    } catch {
      alert("Failed to save course");
    }
  };

  /* ================= UI ================= */

  return (
    <div className="space-y-6">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="w-60">
          <label className="soft-label">
            Academic Year <span className="text-red-500">*</span>
          </label>
          <select className="soft-select">
            <option>2025-26</option>
          </select>
        </div>

        <PrimaryButton
          name="+ Add Category/Course"
          onClick={() => setShowCourseModal(true)}
        />
      </div>

      {/* ================= GRID ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ================= LEFT : CLASS LIST ================= */}
        <div className="lg:col-span-3 bg-white border border-gray-200 rounded-xl p-4 space-y-3">
          <h3 className="font-semibold">Manage Class</h3>

          {classes.length === 0 ? (
            <div className="text-sm text-gray-500">No classes found</div>
          ) : (
            <div className="space-y-1">
              {classes.map((cls) => (
                <div
                  key={cls.id}
                  onClick={() => setActiveClassId(cls.id)}
                  className={`p-2 rounded-lg border cursor-pointer ${
                    activeClassId === cls.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="font-medium text-sm">{cls.name}</div>
                  <div className="text-xs text-gray-500">
                    Code: {cls.class_code}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ================= RIGHT : COURSES & BATCHES ================= */}
        <div className="lg:col-span-9 space-y-6">

          {courses.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-sm text-gray-500">
              No courses created for this class
            </div>
          ) : (
            courses.map((course) => (
              <div
                key={course.id}
                className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-4"
              >
                {/* COURSE HEADER */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                   <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    <GraduationCap size={20} />
                  </div>


                    <div>
                      <h2 className="text-md font-semibold">
                        {course.name}
                      </h2>
                      <p className="text-xs text-gray-500">
                        {course.class_room?.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      className="soft-btn-outline"
                      onClick={() => {
                        setEditingCourseId(course.id);
                        setCourseForm({
                          name: course.name || "",
                          standard_id: course.standard_id || activeClassId,
                          short_description: course.short_description || "",
                          show_on_registration: course.show_on_registration ?? true,
                        });
                        setShowCourseModal(true);
                      }}
                    >
                      <EditOutlined />
                    </button>

                    <PrimaryButton
                      name="+ Add Batch"
                      onClick={() => openAddBatch(course)}
                    />

                  </div>
                </div>

                {/* BATCH CARDS */}
                {course.batches.length === 0 ? (
                  <div className="bg-white border border-gray-200 rounded-xl p-4 text-sm text-gray-500">
                    No batches created
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {course.batches.map((batch) => (
                      <a href={`batches/${batch.id}/overview-details`}>
                      <div
                        key={batch.id}
                        className="bg-white border border-gray-200 rounded-lg overflow-visible cursor-pointer"
                      >
                        {/* HEADER */}
                        <div className="bg-blue-50 px-4 py-2 text-sm font-medium flex justify-between">
                          {batch.name}
                          <span>›</span>
                        </div>

                        {/* BODY */}
                        <div className="p-2 space-y-2 text-sm">

                          <Row label="Batch id" value={batch.batch_uid} />
                          <Row label="Academic Year" value={batch.academic_year} />
                          <Row label="End Date" value={batch.end_date} />

                          {/* SUBJECT TOOLTIP */}
                          <div className="pt-2 flex gap-2 items-center align-center">
                            <div className="text-xs font-semibold text-gray-600 mb-1">
                              Subjects
                            </div>

                            {batch.subjects?.length === 0 ? (
                              <p className="text-xs text-gray-400">No subjects assigned</p>
                            ) : (
                              <div className="relative group inline-block z-10 flex">

                                {/* compact chip */}
                                <span className="text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-300 cursor-pointer">
                                  View Subjects ({batch.subjects.length})
                                </span>
                                
                                {/* Tooltip on hover */}
                                <div className="absolute top-full left-0 w-52 bg-white shadow-xl border border-gray-200 rounded-lg p-2 hidden group-hover:block z-50">
                                  <div className="text-xs font-semibold mb-1 text-gray-700">Subjects</div>

                                  <div className="flex flex-col gap-1 max-h-40 overflow-y-auto">
                                    {batch.subjects.map((s)=>(
                                      <div 
                                        key={s.id}
                                        className="text-xs bg-blue-50 border border-blue-200 px-2 py-1 rounded flex flex-col"
                                      >
                                        <span className="font-medium text-blue-800">{s.subject?.name}</span>
                                        <span className="text-[10px] text-gray-500">
                                          Teacher: {s.teacher?.first_name || "-"}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                        </div>
                      </div>
                      </a>
                    ))}
                </div>

                )}

              </div>
            ))
          )}
        </div>
      </div>

      {/* ================= ADD COURSE MODAL ================= */}
      {showCourseModal && (
        <Modal
           title={editingCourseId ? "Edit Category/Course" : "Add Category/Course"}
            onClose={() => {
              setShowCourseModal(false);
              setEditingCourseId(null);
              setCourseForm(emptyCourseForm);
            }}
        >
          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className="soft-label">Category/Course Name *</label>
              <input
                className="soft-input"
                value={courseForm.name}
                onChange={(e) =>
                  setCourseForm({ ...courseForm, name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="soft-label">Select Standard *</label>
              <select
                className="soft-select"
                value={courseForm.standard_id}
                onChange={(e) =>
                  setCourseForm({
                    ...courseForm,
                    standard_id: e.target.value,
                  })
                }
              >
                <option value="">Select Standard</option>
                {standards.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-2">
              <label className="soft-label">Short Description</label>
              <input
                className="soft-input"
                value={courseForm.short_description}
                onChange={(e) =>
                  setCourseForm({
                    ...courseForm,
                    short_description: e.target.value,
                  })
                }
              />
            </div>

            <div className="col-span-2 flex items-center gap-2">
              <input
                type="checkbox"
                checked={courseForm.show_on_registration}
                onChange={(e) =>
                  setCourseForm({
                    ...courseForm,
                    show_on_registration: e.target.checked,
                  })
                }
              />
              <span className="text-sm">
                Show Category/Course at student registration (Guest)
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-6">
            <button
              className="soft-btn-outline"
              onClick={() => setShowCourseModal(false)}
            >
              Cancel
            </button>

           <PrimaryButton
            name={editingCourseId ? "Update Course" : "Save Course"}
            onClick={saveCourse}
          />

          </div>
        </Modal>
      )}

      {showBatchModal && (
        <Modal
          title={`Add batch for Category/Course: ${activeCourse?.name}`}
          onClose={() => setShowBatchModal(false)}
          className="h-[80vh] max-h-[80vh] w-3/4 overflow-y-scroll" 
        >
          <div className="grid grid-cols-4 gap-4">

            <div className="col-span-1">
              <label className="soft-label">Batch Name *</label>
              <input
                className="soft-input"
                value={batchForm.name}
                onChange={e =>
                  setBatchForm({ ...batchForm, name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="soft-label">Academic Year *</label>
              <select
                className="soft-select"
                value={batchForm.academic_year}
                onChange={e =>
                  setBatchForm({ ...batchForm, academic_year: e.target.value })
                }
              >
                <option value="">Select Year</option>
                <option>2025-26</option>
              </select>
            </div>

            <div>
              <label className="soft-label">Start Date *</label>
              <input
                type="date"
                className="soft-input"
                value={batchForm.start_date}
                onChange={e =>
                  setBatchForm({ ...batchForm, start_date: e.target.value })
                }
              />
            </div>

            <div>
              <label className="soft-label">End Date *</label>
              <input
                type="date"
                className="soft-input"
                value={batchForm.end_date}
                onChange={e =>
                  setBatchForm({ ...batchForm, end_date: e.target.value })
                }
              />
            </div>

          </div>

          {/* SUBJECT TABLE */}
          <div className="mt-6 border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-blue-50">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">Subject Name</th>
                  <th className="p-3">Assign Teacher *</th>
                  <th className="p-3">Extra Teacher</th>
                </tr>
              </thead>

<tbody className="divide-y">
  {subjects.map((sub) => {
    const selected = batchForm.subjects.find(
      s => s.subject_id === sub.id
    );

    return (
      <tr key={sub.id}>
        <td className="p-3">
          <input
            type="checkbox"
            checked={!!selected}
            onChange={(e) => {
              if (e.target.checked) {
                setBatchForm(prev => ({
                  ...prev,
                  subjects: [
                    ...prev.subjects,
                    {
                      subject_id: sub.id,
                      teacher_id: "",
                      extra_teacher_id: ""
                    }
                  ]
                }));
              } else {
                setBatchForm(prev => ({
                  ...prev,
                  subjects: prev.subjects.filter(
                    s => s.subject_id !== sub.id
                  )
                }));
              }
            }}
          />
        </td>

        <td className="p-3">{sub.name}</td>

        {/* ASSIGN TEACHER */}
        <td className="p-3">
          <select
            className="soft-select"
            disabled={!selected}
            value={selected?.teacher_id || ""}
            onChange={(e) => {
              setBatchForm(prev => ({
                ...prev,
                subjects: prev.subjects.map(s =>
                  s.subject_id === sub.id
                    ? { ...s, teacher_id: Number(e.target.value) }
                    : s
                )
              }));
            }}
          >
            <option value="">Select Teacher</option>
            {getEligibleTeachers(sub.id).map(t => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </td>

        {/* EXTRA TEACHER */}
        <td className="p-3">
          <select
            className="soft-select"
            disabled={!selected}
            value={selected?.extra_teacher_id || ""}
            onChange={(e) => {
              setBatchForm(prev => ({
                ...prev,
                subjects: prev.subjects.map(s =>
                  s.subject_id === sub.id
                    ? { ...s, extra_teacher_id: Number(e.target.value) }
                    : s
                )
              }));
            }}
          >
            <option value="">Select Teacher</option>
            {getEligibleTeachers(sub.id).map(t => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </td>
      </tr>
    );
  })}
</tbody>

            </table>
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <button
              className="soft-btn-outline"
              onClick={() => setShowBatchModal(false)}
            >
              Cancel
            </button>
            <PrimaryButton name="Save" onClick={saveBatch} />
          </div>
        </Modal>
      )}

    </div>
  );
}

/* ================= SMALL UI ================= */

function Row({ label, value }) {
  return (
    <div className="flex gap-2">
      <span className="w-28 text-gray-500 text-xs">{label}</span>
      <span className="font-medium text-xs">: {value}</span>
    </div>
  );
}
