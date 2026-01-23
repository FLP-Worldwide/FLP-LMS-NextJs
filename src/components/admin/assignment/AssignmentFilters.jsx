"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/utils/api";

export default function AssignmentFilters({ onApply }) {
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [filters, setFilters] = useState({
    course_id: "",
    batch_id: "",
    subject_id: "",
  });

  /* ================= LOAD COURSES ================= */
  useEffect(() => {
    api.get("/courses").then((res) => {
      setCourses(res.data?.data || []);
    });
  }, []);

  /* ================= LOAD BATCHES ================= */
  useEffect(() => {
    if (!filters.course_id) {
      setBatches([]);
      setSubjects([]);
      return;
    }

    api
      .get("/batches", {
        params: { course_id: filters.course_id },
      })
      .then((res) => {
        setBatches(res.data?.data || []);
      });
  }, [filters.course_id]);

  /* ================= LOAD SUBJECTS ================= */
  useEffect(() => {
    if (!filters.batch_id) {
      setSubjects([]);
      return;
    }

    api
      .get("/subjects", {
        params: { batch_id: filters.batch_id },
      })
      .then((res) => {
        setSubjects(res.data?.data || []);
      });
  }, [filters.batch_id]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex gap-3 items-center">

      {/* COURSE */}
      <select
        className="soft-select w-56"
        value={filters.course_id}
        onChange={(e) =>
          setFilters({
            course_id: e.target.value,
            batch_id: "",
            subject_id: "",
          })
        }
      >
        <option value="">Select Category / Course</option>
        {courses.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      {/* BATCH */}
      <select
        className="soft-select w-44"
        value={filters.batch_id}
        disabled={!filters.course_id}
        onChange={(e) =>
          setFilters({
            ...filters,
            batch_id: e.target.value,
            subject_id: "",
          })
        }
      >
        <option value="">Select Batch</option>
        {batches.map((b) => (
          <option key={b.id} value={b.id}>
            {b.name}
          </option>
        ))}
      </select>

      {/* SUBJECT */}
      <select
        className="soft-select w-44"
        value={filters.subject_id}
        disabled={!filters.batch_id}
        onChange={(e) =>
          setFilters({
            ...filters,
            subject_id: e.target.value,
          })
        }
      >
        <option value="">Select Subject</option>
        {subjects.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      {/* APPLY */}
      <button
        className="soft-btn-primary"
        onClick={() => onApply(filters)}
      >
        Apply
      </button>
    </div>
  );
}
