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

  const [file, setFile] = useState(null);
  const [links, setLinks] = useState([
    { name: "", url: "" },
  ]);
  
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
  try {
    const fd = new FormData();

    /* ================= BASIC FIELDS ================= */
    fd.append("topic", form.topic);
    fd.append("description", form.description || "");
    fd.append("status", status);

    fd.append(
      "publish_at",
      status === "published"
        ? `${form.publish_date} ${form.publish_time}`
        : ""
    );

    fd.append(
      "due_at",
      `${form.due_date} ${form.due_time}`
    );

    fd.append("allow_late_submission", form.allow_late_submission ? 1 : 0);
    fd.append("evaluation_required", form.evaluation_required ? 1 : 0);

    fd.append("course_id", form.course_id);
    fd.append("batch_id", form.batch_id);
    fd.append("subject_id", form.subject_id || "");
    fd.append("teacher_id", form.teacher_id);

    /* ================= FILE ================= */
    if (file) {
      fd.append("file", file);
    }

    /* ================= LINKS ================= */
    links.forEach((link, index) => {
      if (link.name || link.url) {
        fd.append(`links[${index}][name]`, link.name);
        fd.append(`links[${index}][url]`, link.url);
      }
    });

    /* ================= API CALL ================= */
    if (isEdit) {
      fd.append("_method", "PUT"); // if backend requires
      await api.post(`/assignments/update/${assignment.id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } else {
      await api.post("/assignments", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }

    onSaved?.();
    onClose();

  } catch (error) {
    console.error(error);
    alert("Failed to save assignment");
  }
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
      <div className="space-y-6 p-2">

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

        {/* ================= FILES & LINKS ================= */}
        <div className="border-t pt-6 mt-6 space-y-6">

          <h3 className="text-md font-semibold flex items-center gap-2">
            Files & Links
          </h3>

          {/* ================= FILE UPLOAD ================= */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">

            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">File</p>
                <p className="text-xs text-gray-500">
                  Maximum total size allowed (150 MB)
                </p>
              </div>

              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="text-sm"
              />
            </div>

            {file && (
              <div className="text-sm text-green-600 mt-2">
                Selected: {file.name}
              </div>
            )}
          </div>

          {/* ================= LINKS ================= */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">

            <div>
              <p className="font-medium">Link</p>
              <p className="text-xs text-gray-500">
                You can add up to 5 links
              </p>
            </div>

            {links.map((link, index) => (
              <div key={index} className="grid grid-cols-2 gap-3">

                <input
                  type="text"
                  placeholder="Link Name"
                  className="soft-input"
                  value={link.name}
                  onChange={(e) => {
                    const updated = [...links];
                    updated[index].name = e.target.value;
                    setLinks(updated);
                  }}
                />

                <input
                  type="text"
                  placeholder="Add your link here"
                  className="soft-input"
                  value={link.url}
                  onChange={(e) => {
                    const updated = [...links];
                    updated[index].url = e.target.value;
                    setLinks(updated);
                  }}
                />

              </div>
            ))}

            {/* ADD LINK BUTTON */}
            {links.length < 5 && (
              <button
                type="button"
                onClick={() =>
                  setLinks([...links, { name: "", url: "" }])
                }
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
              >
                Add Link
              </button>
            )}
          </div>

        </div>


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
    <div className="space-y-4 p-2">
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
