"use client";

import React, { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import PrimaryButton from "@/components/ui/PrimaryButton";
import MultiSelectDropdown from "@/components/ui/MultiSelectDropdown";
import { api } from "@/utils/api";

export default function ZoomCreateModal({ onClose, editData }) {

  /* ================= STATE ================= */
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
   

  const [loadingStudents, setLoadingStudents] = useState(false);

  const [form, setForm] = useState({
    topic: "",
    date: "",
    from_hh: "",
    from_mm: "",
    to_hh: "",
    to_mm: "",
    course_ids: [],
    batch_ids: [],
    student_ids: [],
    teacher_ids: [],
    send_notification: true,
    join_before_host: true,
    mute_on_entry: true,
    host_video: false,
    participant_video: false,
    auto_recording: false,
  });
useEffect(() => {
  if (!editData) return;

  setForm({
    topic: editData.topic || "",
    date: editData.date?.slice(0, 10) || "",
    from_hh: editData.from_time?.slice(0, 2) || "",
    from_mm: editData.from_time?.slice(3, 5) || "",
    to_hh: editData.to_time?.slice(0, 2) || "",
    to_mm: editData.to_time?.slice(3, 5) || "",
    teacher_ids: editData.teachers?.map(t => t.id) || [],
    course_ids: editData.courses?.map(c => c.id) || [],
    batch_ids: editData.batches?.map(b => b.id) || [],
    student_ids: editData.students?.map(s => s.id) || [],
    send_notification: editData.settings?.send_notification ?? true,
    join_before_host: editData.settings?.join_before_host ?? true,
    mute_on_entry: editData.settings?.mute_on_entry ?? true,
    host_video: editData.settings?.host_video ?? false,
    participant_video: editData.settings?.participant_video ?? false,
    auto_recording: editData.settings?.auto_recording ?? false,
  });
}, [editData]);


  /* ================= FETCH COURSES ================= */
  const fetchCourses = async () => {
    const res = await api.get("/courses");
    setCourses(res.data?.data || []);
  };

  /* ================= FETCH BATCHES ================= */
    const fetchBatches = async (courseIds) => {
    if (!courseIds.length) {
        setBatches([]);
        return;
    }

    try {
        const responses = await Promise.all(
        courseIds.map((id) =>
            api.get("/batches", {
            params: { course_id: id },
            })
        )
        );

        // merge + dedupe
        const allBatches = responses
        .flatMap((r) => r.data?.data || [])
        .reduce((acc, curr) => {
            if (!acc.find((b) => b.id === curr.id)) acc.push(curr);
            return acc;
        }, []);

        setBatches(allBatches);
    } catch (err) {
        console.error("Failed to load batches", err);
        setBatches([]);
    }
    };


  /* ================= FETCH STUDENTS ================= */
   const fetchStudents = async (batchIds) => {
  if (!batchIds.length) {
    setStudents([]);
    return;
  }

  setLoadingStudents(true);

  try {
    const responses = await Promise.all(
      batchIds.map((id) =>
        api.get("/students/filter", {
          params: { batch_id: id },
        })
      )
    );

    const allStudents = responses.flatMap(
      (r) => r.data?.data || []
    );

    // ✅ IMPORTANT: map to {id, name}
    const normalized = allStudents.reduce((acc, s) => {
      if (!acc.find((x) => x.id === s.id)) {
        acc.push({
          id: s.id,
          name: `${s.first_name} ${s.last_name ?? ""}`.trim(),
        });
      }
      return acc;
    }, []);

    setStudents(normalized);
  } catch (err) {
    console.error("Failed to load students", err);
    setStudents([]);
  } finally {
    setLoadingStudents(false);
  }
};



  /* ================= FETCH TEACHERS ================= */
  const fetchTeachers = async () => {
    const res = await api.get("/teachers");
    setTeachers(res.data?.data || []);
  };

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    fetchCourses();
    fetchTeachers();
  }, []);

  /* ================= EFFECT: COURSE → BATCH ================= */
    useEffect(() => {
    fetchBatches(form.course_ids);

    setForm(prev => ({
        ...prev,
        batch_ids: [],
        student_ids: [],
    }));
    setStudents([]);
    }, [form.course_ids]);


  /* ================= EFFECT: BATCH → STUDENTS ================= */
  useEffect(() => {
    fetchStudents(form.batch_ids);

    setForm(prev => ({
      ...prev,
      student_ids: [],
    }));
  }, [form.batch_ids]);

  /* ================= SUBMIT ================= */
  const submit = async () => {
  if (!form.topic || !form.date || !form.teacher_ids.length) {
    alert("Please fill all required fields");
    return;
  }

  const payload = {
    topic: form.topic,
    date: form.date,
    from_time: `${form.from_hh}:${form.from_mm}`,
    to_time: `${form.to_hh}:${form.to_mm}`,
    teacher_ids: form.teacher_ids,
    course_ids: form.course_ids,
    batch_ids: form.batch_ids,
    student_ids: form.student_ids,
    settings: {
      send_notification: form.send_notification,
      join_before_host: form.join_before_host,
      mute_on_entry: form.mute_on_entry,
      host_video: form.host_video,
      participant_video: form.participant_video,
      auto_recording: form.auto_recording,
    },
  };

  try {
    if (editData) {
        await api.put(`/live-class/zoom-classes/${editData.id}`, payload);
    } else {
        await api.post("/live-class/zoom-classes", payload);
    }

    alert("Zoom class created successfully");
    onClose();
  } catch (err) {
    console.error("Failed to create Zoom class", err);
    alert("Failed to create Zoom class");
  }
};


  return (
    <Modal title="Add Zoom Class" onClose={onClose} className="max-w-6xl">
      <div className="space-y-6">
        {/* TOP */}
        <div>
          <label className="form-label">Topic Name *</label>
          <input
            className="soft-input"
            value={form.topic}
            onChange={e => setForm({ ...form, topic: e.target.value })}
            placeholder="Enter Topic Name"
          />
        </div>

        {/* DATE + TIME */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="form-label">Date *</label>
            <input
              type="date"
              className="soft-input"
              value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })}
            />
          </div>

          <TimeSelect
            label="From *"
            hh={form.from_hh}
            mm={form.from_mm}
            onChange={(hh, mm) =>
              setForm({ ...form, from_hh: hh, from_mm: mm })
            }
          />

          <TimeSelect
            label="To *"
            hh={form.to_hh}
            mm={form.to_mm}
            onChange={(hh, mm) =>
              setForm({ ...form, to_hh: hh, to_mm: mm })
            }
          />
        </div>

        {/* MULTI SELECT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Teacher Name(s) *">
            <MultiSelectDropdown
              options={teachers}
              value={form.teacher_ids}
              onChange={v => setForm({ ...form, teacher_ids: v })}
              placeholder="Select Teacher"
            />
          </Field>

          <Field label="Category / Course *">
            <MultiSelectDropdown
              options={courses}
              value={form.course_ids}
              onChange={v => setForm({ ...form, course_ids: v })}
              placeholder="Select Course"
            />
          </Field>

          <Field label="Batch(s) *">
            <MultiSelectDropdown
              options={batches}
              value={form.batch_ids}
              onChange={v => setForm({ ...form, batch_ids: v })}
              placeholder="Select Batch"
            />
          </Field>

          <Field label="Student Name(s) *">
           <MultiSelectDropdown
                options={students}
                value={form.student_ids}
                onChange={v => setForm({ ...form, student_ids: v })}
                placeholder={loadingStudents ? "Loading..." : "Select Students"}
            />

          </Field>
        </div>

        {/* ADVANCE SETTINGS */}
        <div>
          <h4 className="font-medium mb-3">Advance settings</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <Checkbox label="Send Notification" checked={form.send_notification} onChange={() => setForm({ ...form, send_notification: !form.send_notification })} />
            <Checkbox label="Join Before Host" checked={form.join_before_host} onChange={() => setForm({ ...form, join_before_host: !form.join_before_host })} />
            <Checkbox label="Mute Upon Entry" checked={form.mute_on_entry} onChange={() => setForm({ ...form, mute_on_entry: !form.mute_on_entry })} />
            <Checkbox label="Host Video" checked={form.host_video} onChange={() => setForm({ ...form, host_video: !form.host_video })} />
            <Checkbox label="Participant Video" checked={form.participant_video} onChange={() => setForm({ ...form, participant_video: !form.participant_video })} />
            <Checkbox label="Auto Recording" checked={form.auto_recording} onChange={() => setForm({ ...form, auto_recording: !form.auto_recording })} />
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <button onClick={onClose} className="soft-btn-outline">
            Cancel
          </button>
          <PrimaryButton name="Submit" onClick={submit} />
        </div>
      </div>
    </Modal>
  );
}

/* ================= SMALL UI ================= */

function Field({ label, children }) {
  return (
    <div>
      <label className="form-label">{label}</label>
      {children}
    </div>
  );
}

function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2">
      <input type="checkbox" checked={checked} onChange={onChange} />
      {label}
    </label>
  );
}

function TimeSelect({ label, hh, mm, onChange }) {
  return (
    <div>
      <label className="form-label">{label}</label>
      <div className="grid grid-cols-2 gap-2">
        <select
          className="soft-select"
          value={hh}
          onChange={e => onChange(e.target.value, mm)}
        >
          <option value="">HH</option>
          {[...Array(24)].map((_, i) => (
            <option key={i} value={String(i).padStart(2, "0")}>
              {String(i).padStart(2, "0")}
            </option>
          ))}
        </select>

        <select
          className="soft-select"
          value={mm}
          onChange={e => onChange(hh, e.target.value)}
        >
          <option value="">MM</option>
          {[0, 15, 30, 45].map(m => (
            <option key={m} value={String(m).padStart(2, "0")}>
              {String(m).padStart(2, "0")}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
