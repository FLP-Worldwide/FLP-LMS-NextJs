"use client";

import React, { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { api } from "@/utils/api";

export default function CreateAssignmentModal({
  assignment = null,
  onClose,
  onSaved,
}) {
  const isEdit = !!assignment?.id;

  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const [form, setForm] = useState({
    topic: assignment?.topic || "",
    description: assignment?.description || "",
    evaluation_required: assignment?.evaluation_required || false,
    allow_late_submission: assignment?.allow_late_submission || false,

    publish_date: assignment?.publish_at?.split(" ")[0] || "",
    publish_time: assignment?.publish_at?.split(" ")[1] || "",
    due_date: assignment?.due_at?.split(" ")[0] || "",
    due_time: assignment?.due_at?.split(" ")[1] || "",

    course_id: assignment?.course_id || "",
    batch_id: assignment?.batch_id || "",
    subject_id: assignment?.subject_id || "",
    teacher_id: assignment?.teacher_id || "",
  });

  /* ================= LOAD MASTER DATA ================= */
  useEffect(() => {
    api.get("/courses").then((r) => setCourses(r.data?.data || []));
    api.get("/teachers").then((r) => setTeachers(r.data?.data || []));
  }, []);

  /* ================= COURSE → BATCH ================= */
  useEffect(() => {
    if (!form.course_id) return;

    api
      .get("/batches", { params: { course_id: form.course_id } })
      .then((r) => setBatches(r.data?.data || []));

    setForm((p) => ({ ...p, batch_id: "", subject_id: "" }));
    setSubjects([]);
  }, [form.course_id]);

  /* ================= BATCH → SUBJECT ================= */
  useEffect(() => {
    if (!form.batch_id) return;

    api
      .get("/subjects", { params: { batch_id: form.batch_id } })
      .then((r) => setSubjects(r.data?.data || []));

    setForm((p) => ({ ...p, subject_id: "" }));
  }, [form.batch_id]);

  /* ================= SAVE ================= */
  const saveAssignment = async (status) => {
    const payload = {
      topic: form.topic,
      description: form.description,
      status,
      publish_at:
        status === "published"
          ? `${form.publish_date} ${form.publish_time}`
          : null,
      due_at: `${form.due_date} ${form.due_time}`,
      allow_late_submission: form.allow_late_submission,
      evaluation_required: form.evaluation_required,
      course_id: form.course_id,
      batch_id: form.batch_id,
      subject_id: form.subject_id,
      teacher_id: form.teacher_id,
    };

    if (isEdit) {
      await api.put(`/assignments/update/${assignment.id}`, payload);
    } else {
      await api.post("/assignments", payload);
    }

    onSaved?.();
    onClose();
  };
useEffect(() => {
  if (!assignment) return;

  setForm({
    topic: assignment.topic || "",
    description: assignment.description || "",
    evaluation_required: !!assignment.evaluation_required,
    allow_late_submission: !!assignment.allow_late_submission,

    publish_date: assignment.publish_at
      ? assignment.publish_at.split(" ")[0]
      : "",
    publish_time: assignment.publish_at
      ? assignment.publish_at.split(" ")[1]?.slice(0, 5)
      : "",

    due_date: assignment.due_at
      ? assignment.due_at.split(" ")[0]
      : "",
    due_time: assignment.due_at
      ? assignment.due_at.split(" ")[1]?.slice(0, 5)
      : "",

    course_id: assignment.course_id || "",
    batch_id: assignment.batch_id || "",
    subject_id: assignment.subject_id || "",
    teacher_id: assignment.teacher_id || "",
  });
}, [assignment]);

  return (
    <Modal
      title={isEdit ? "Edit Assignment" : "Create Assignment"}
      onClose={onClose}
      className="max-w-5xl"
    >
      <div className="space-y-6">

        {/* DETAILS */}
        <Section title="Details">
          <Input
            label="Topic *"
            value={form.topic}
            onChange={(v) => setForm({ ...form, topic: v })}
          />

          <Textarea
            label="Description"
            value={form.description}
            onChange={(v) => setForm({ ...form, description: v })}
          />

          <Checkbox
            label="Evaluation Required"
            checked={form.evaluation_required}
            onChange={() =>
              setForm({
                ...form,
                evaluation_required: !form.evaluation_required,
              })
            }
          />
        </Section>

        {/* SCHEDULE */}
        <Section title="Schedule">
          <div className="grid grid-cols-2 gap-4">
            <DateTime
              label="Publish Date & Time"
              date={form.publish_date}
              time={form.publish_time}
              onChange={(d, t) =>
                setForm({ ...form, publish_date: d, publish_time: t })
              }
            />

            <DateTime
              label="Due Date & Time"
              date={form.due_date}
              time={form.due_time}
              onChange={(d, t) =>
                setForm({ ...form, due_date: d, due_time: t })
              }
            />
          </div>

          <Checkbox
            label="Allow Late Submission"
            checked={form.allow_late_submission}
            onChange={() =>
              setForm({
                ...form,
                allow_late_submission: !form.allow_late_submission,
              })
            }
          />
        </Section>

        {/* BATCH */}
        <Section title="Batch">
          <div className="grid grid-cols-3 gap-4">
            <Select
              label="Course *"
              options={courses}
              value={form.course_id}
              onChange={(v) => setForm({ ...form, course_id: v })}
            />

            <Select
              label="Batch *"
              options={batches}
              value={form.batch_id}
              onChange={(v) => setForm({ ...form, batch_id: v })}
            />

            <Select
              label="Teacher *"
              options={teachers}
              value={form.teacher_id}
              onChange={(v) => setForm({ ...form, teacher_id: v })}
            />

            <Select
              label="Subject"
              options={subjects}
              value={form.subject_id}
              onChange={(v) => setForm({ ...form, subject_id: v })}
            />
          </div>
        </Section>

        {/* FOOTER */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <button className="soft-btn-outline" onClick={onClose}>
            Cancel
          </button>

          <PrimaryButton
            name="Save as Draft"
            onClick={() => saveAssignment("draft")}
          />

          <PrimaryButton
            name={isEdit ? "Save & Publish" : "Submit"}
            onClick={() => saveAssignment("published")}
          />
        </div>
      </div>
    </Modal>
  );
}

/* ================= UI HELPERS (REQUIRED) ================= */

function Section({ title, children }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
        <div className="flex-1 border-t border-gray-200" />
      </div>
      {children}
    </div>
  );
}

function Input({ label, value, onChange }) {
  return (
    <div>
      <label className="form-label">{label}</label>
      <input
        className="soft-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function Textarea({ label, value, onChange }) {
  return (
    <div>
      <label className="form-label">{label}</label>
      <textarea
        rows={3}
        className="soft-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" checked={checked} onChange={onChange} />
      {label}
    </label>
  );
}

function Select({ label, value, options, onChange }) {
  return (
    <div>
      <label className="form-label">{label}</label>
      <select
        className="soft-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select</option>
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.name}
          </option>
        ))}
      </select>
    </div>
  );
}

function DateTime({ label, date, time, onChange }) {
  return (
    <div>
      <label className="form-label">{label}</label>
      <div className="grid grid-cols-2 gap-2">
        <input
          type="date"
          className="soft-input"
          value={date}
          onChange={(e) => onChange(e.target.value, time)}
        />
        <input
          type="time"
          className="soft-input"
          value={time}
          onChange={(e) => onChange(date, e.target.value)}
        />
      </div>
    </div>
  );
}
