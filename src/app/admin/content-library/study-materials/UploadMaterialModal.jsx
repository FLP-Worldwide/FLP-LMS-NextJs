"use client";

import React, { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { api } from "@/utils/api";

const MATERIAL_TYPES = [
  "Vimeo",
  "YouTube",
  "EBook",
  "Notes",
  "Images",
  "Slides",
  "Audio Notes",
  "Assignments",
  "Previous Year Questions",
  "Existing Video",
];

export default function UploadMaterialModal({ onClose, defaultClass }) {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);

  const [form, setForm] = useState({
    class_id: defaultClass?.id || "",
    subject_id: "",
    topic_id: "",
    type: "",
    title: "",
    video_url: "",
    file: null,
  });

  /* ================= LOAD CLASSES ================= */
  useEffect(() => {
    api.get("/classes").then((res) =>
      setClasses(res.data?.data || [])
    );
  }, []);

  /* ================= CLASS → SUBJECT ================= */
  useEffect(() => {
    if (!form.class_id) return;

    api
      .get("/subjects", { params: { class_id: form.class_id } })
      .then((res) => setSubjects(res.data?.data || []));

    setForm((p) => ({ ...p, subject_id: "", topic_id: "" }));
    setTopics([]);
  }, [form.class_id]);

  /* ================= SUBJECT → TOPIC ================= */
  useEffect(() => {
    if (!form.subject_id) return;

    api
      .get("/topics", { params: { subject_id: form.subject_id } })
      .then((res) => setTopics(res.data?.data || []));

    setForm((p) => ({ ...p, topic_id: "" }));
  }, [form.subject_id]);

  /* ================= SUBMIT ================= */
  const submit = async () => {
    if (!form.class_id || !form.subject_id || !form.topic_id || !form.type) {
        alert("Please fill all required fields");
        return;
    }

    try {
        let payload;
        let config = {};

        // ✅ Vimeo / YouTube → JSON
        if (form.type === "Vimeo" || form.type === "YouTube") {
        payload = {
            class_id: form.class_id,
            subject_id: form.subject_id,
            topic_id: form.topic_id,
            type: form.type,
            title: form.title,
            video_url: form.video_url,
        };
        } 
        // ✅ Other types → multipart/form-data
        else {
        payload = new FormData();
        payload.append("class_id", form.class_id);
        payload.append("subject_id", form.subject_id);
        payload.append("topic_id", form.topic_id);
        payload.append("type", form.type);
        payload.append("file", form.file);

        config.headers = {
            "Content-Type": "multipart/form-data",
        };
        }

        await api.post("/admin/study-materials", payload, config);

        alert("Material uploaded successfully");
        onClose();
    } catch (err) {
        console.error("Upload failed", err);
        alert("Failed to upload material");
    }
    };


  return (
    <Modal title="Upload Files" onClose={onClose} className="max-w-6xl">
      <div className="space-y-6 p-2">

        <div className="grid grid-cols-4 gap-4">
          <Select
            label="Standard *"
            value={form.class_id}
            options={classes}
            onChange={(v) => setForm({ ...form, class_id: v })}
          />

          <Select
            label="Subject *"
            value={form.subject_id}
            options={subjects}
            onChange={(v) => setForm({ ...form, subject_id: v })}
          />

          <Select
            label="Topic *"
            value={form.topic_id}
            options={topics}
            onChange={(v) => setForm({ ...form, topic_id: v })}
          />
        </div>

        <div className="flex gap-3 flex-wrap">
          {MATERIAL_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setForm({ ...form, type: t })}
              className={`px-4 py-2 border border-gray-200 rounded-lg text-sm ${
                form.type === t
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-50"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {(form.type === "Vimeo" || form.type === "YouTube") && (
          <>
            <Input
              label="Video Title *"
              value={form.title}
              onChange={(v) => setForm({ ...form, title: v })}
            />
            <Input
              label="Video URL *"
              value={form.video_url}
              onChange={(v) =>
                setForm({ ...form, video_url: v })
              }
            />
          </>
        )}

        {form.type &&
          !["Vimeo", "YouTube"].includes(form.type) && (
            <input
              type="file"
              onChange={(e) =>
                setForm({ ...form, file: e.target.files[0] })
              }
            />
          )}

        <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
          <button className="soft-btn-outline" onClick={onClose}>
            Cancel
          </button>
          <PrimaryButton name="Upload" onClick={submit} />
        </div>
      </div>
    </Modal>
  );
}

/* ================= UI ================= */

function Select({ label, value, onChange, options }) {
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
