"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/utils/api";
import Modal from "@/components/ui/Modal";
import PrimaryButton from "@/components/ui/PrimaryButton";

export default function TopicsTab() {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);

  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    class_id: "",
    subject_id: "",
  });

  const [expanded, setExpanded] = useState({});
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    duration: 0,
    priority: 0,
  });

  /* ================= FETCH CLASSES ================= */
  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const res = await api.get("/classes");
      setClasses(res.data?.data || []);
    } finally {
      setLoading(false);
    }
  };

  /* ================= FETCH SUBJECTS (CLASS BASED) ================= */
  const fetchSubjects = async (classId) => {
    if (!classId) return;
    setLoading(true);
    try {
      const res = await api.get("/subjects", {
        params: { class_id: classId },
      });
      setSubjects(res.data?.data || []);
    } finally {
      setLoading(false);
    }
  };

  /* ================= FETCH TOPICS ================= */
  const fetchTopics = async () => {
    if (!filters.class_id || !filters.subject_id) return;
    setLoading(true);
    try {
      const res = await api.get("/topics", {
        params: filters,
      });
      setTopics(res.data?.data || []);
    } finally {
      setLoading(false);
    }
  };

  /* ================= CREATE TOPIC ================= */
  const createTopic = async () => {
    if (!filters.class_id || !filters.subject_id || !form.name) {
      alert("Class, Subject and Topic Name are required");
      return;
    }

    await api.post("/topics", {
      class_id: filters.class_id,
      subject_id: filters.subject_id,
      name: form.name,
      description: form.description,
      duration: Number(form.duration),
      priority: Number(form.priority),
    });

    setShowCreateModal(false);
    setForm({ name: "", description: "", duration: 0, priority: 0 });
    fetchTopics();
  };

  /* ================= UI ================= */
  return (
    <div className="space-y-6 p-6">

      {/* ================= FILTER ROW ================= */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex gap-4 items-end">
        <div>
          <label className="text-xs text-gray-500">Standard *</label>
          <select
            className="soft-select mt-1"
            value={filters.class_id}
            onChange={(e) => {
              setFilters({ class_id: e.target.value, subject_id: "" });
              setSubjects([]);
              setTopics([]);
              fetchSubjects(e.target.value);
            }}
          >
            <option value="">Select Class</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs text-gray-500">Subject *</label>
          <select
            className="soft-select mt-1"
            value={filters.subject_id}
            onChange={(e) =>
              setFilters({ ...filters, subject_id: e.target.value })
            }
          >
            <option value="">Select Subject</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <PrimaryButton name="View" onClick={fetchTopics} />

        <div className="ml-auto">
          <PrimaryButton
            name="Add Topic"
            onClick={() => setShowCreateModal(true)}
          />
        </div>
      </div>

      {/* ================= TOPICS ACCORDION ================= */}
      <div className="space-y-3 p-6">
        {!loading && topics.length === 0 && (
          <div className="text-sm text-gray-400 text-center">
            No topics found
          </div>
        )}

        {topics.map((t) => (
          <div
            key={t.id}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden"
          >
            {/* ACCORDION HEADER */}
            <div
              className="flex items-center justify-between py-2 px-4 cursor-pointer relative"
              onClick={() =>
                setExpanded({ ...expanded, [t.id]: !expanded[t.id] })
              }
            >
              {/* LEFT COLORED BORDER */}
              <div className="absolute left-0 top-0 h-full w-1 bg-blue-500" />

              <div className="flex items-center gap-3">
                <span className="text-gray-600">
                  {expanded[t.id] ? "▾" : "▸"}
                </span>

                <div>
                  <div className="font-semibold text-gray-800">
                    {t.name}
                  </div>

                  <div className="text-xs text-gray-500 mt-0.5">
                    Class: {t.class_room?.name || "—"} | Subject:{" "}
                    {t.subject?.name || "—"}
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-600">
                Est. Time : {t.duration || 0}
              </div>
            </div>

            {/* ACCORDION BODY */}
            {expanded[t.id] && (
              <div className="border-t border-gray-200 px-3 py-2 text-sm text-gray-600 space-y-1">
                <div>
                  <b>Description:</b>{" "}
                  {t.description || "No description"}
                </div>
                <div>
                  <b>Priority:</b> {t.priority}
                </div>
              </div>
            )}
          </div>
        ))}

      </div>

      {/* ================= CREATE MODAL ================= */}
      {showCreateModal && (
        <Modal
          title="Create New Topic"
          onClose={() => setShowCreateModal(false)}
          rightSlot={
            <PrimaryButton name="Save" onClick={createTopic} />
          }
        >
          <div className="grid grid-cols-2 gap-4">

            {/* STANDARD */}
            <div>
              <label className="text-xs font-medium text-gray-600">
                Standard Name <span className="text-red-500">*</span>
              </label>
              <select
                className="soft-select mt-1"
                value={filters.class_id}
                onChange={(e) => {
                  setFilters({ class_id: e.target.value, subject_id: "" });
                  fetchSubjects(e.target.value);
                }}
              >
                <option value="">Select Standard</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* SUBJECT */}
            <div>
              <label className="text-xs font-medium text-gray-600">
                Subject Name <span className="text-red-500">*</span>
              </label>
              <select
                className="soft-select mt-1"
                value={filters.subject_id}
                onChange={(e) =>
                  setFilters({ ...filters, subject_id: e.target.value })
                }
              >
                <option value="">Select Subject</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* TOPIC NAME (FULL WIDTH) */}
            <div className="col-span-2">
              <label className="text-xs font-medium text-gray-600">
                Topic Name <span className="text-red-500">*</span>
              </label>
              <input
                className="soft-input mt-1"
                placeholder="Enter Topic Name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />
            </div>

            {/* DURATION */}
            <div>
              <label className="text-xs font-medium text-gray-600">
                Duration (minutes)
              </label>
              <input
                type="number"
                className="soft-input mt-1"
                value={form.duration}
                onChange={(e) =>
                  setForm({ ...form, duration: e.target.value })
                }
              />
            </div>

            {/* PRIORITY */}
            <div>
              <label className="text-xs font-medium text-gray-600">
                Priority
              </label>
              <input
                type="number"
                className="soft-input mt-1"
                value={form.priority}
                onChange={(e) =>
                  setForm({ ...form, priority: e.target.value })
                }
              />
            </div>

          </div>
        </Modal>

      )}
    </div>
  );
}
