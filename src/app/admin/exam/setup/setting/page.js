"use client";

import React, { useEffect, useState } from "react";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { api } from "@/utils/api";

export default function ExamSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [form, setForm] = useState({
    exam_course_wise_grading: false,

    exam_schedule_notification: {
      student: false,
      parent: false,
      guardian: false,
      faculty: false,
      admin: false,
    },

    exam_marks_notification: {
      student: false,
      parent: false,
      guardian: false,
      admin: false,
    },

    attendance_not_marked_2hr: {
      faculty: false,
      admin: false,
      others: false,
    },

    marks_not_updated_5days: {
      faculty: false,
      admin: false,
      others: false,
    },

    attendance_daily_reminder: {
      faculty: false,
      admin: false,
      others: false,
    },

    student_rank_sms: false,
  });

/* ================= FETCH ================= */
useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await api.get("settings/content/exam_settings");

      if (res.data?.data) {
        setForm((prev) => ({
          ...prev,
          ...res.data.data, // ✅ correct path for your current API
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  fetchData();
}, []);

  const updateToggle = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateNested = (section, key, value) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  /* ================= SAVE ================= */
/* ================= SAVE ================= */
const save = async () => {
  try {
    setLoading(true);

    await api.post("settings/content", {
      key: "exam_settings",
      value: form,
    });

    alert("Settings saved successfully");
  } catch (err) {
    console.error(err);
    alert("Failed to save");
  } finally {
    setLoading(false);
  }
};

  if (fetching) return <div className="p-6 text-sm">Loading...</div>;

  return (
    <div className="p-8 bg-white border border-gray-200 rounded-xl space-y-10">

      {/* ================= EXAM GRADE ================= */}
      <Section title="Exam Grade">
        <SettingRow
          title="Exam Grading system for specific Course Wise"
          desc="If enabled, you can decide for particular courses whether to use grading or numerical marks."
          value={form.exam_course_wise_grading}
          onChange={(v) => updateToggle("exam_course_wise_grading", v)}
        />
      </Section>

      <Divider />

      {/* ================= SMS NOTIFICATION ================= */}
      <Section title="SMS Notification Setting">

        <SubSection
          title="Exam Schedule Notification"
          desc="Enable this option to share notification of exam schedule to users."
        >
          <CheckGroup>
            {Object.keys(form.exam_schedule_notification).map((key) => (
              <Check
                key={key}
                label={capitalize(key)}
                checked={form.exam_schedule_notification[key]}
                onChange={(v) =>
                  updateNested("exam_schedule_notification", key, v)
                }
              />
            ))}
          </CheckGroup>
        </SubSection>

        <Divider />

        <SubSection
          title="Exam Marks Notification"
          desc="Notification will be sent regarding the exam marks obtained."
        >
          <CheckGroup>
            {Object.keys(form.exam_marks_notification).map((key) => (
              <Check
                key={key}
                label={capitalize(key)}
                checked={form.exam_marks_notification[key]}
                onChange={(v) =>
                  updateNested("exam_marks_notification", key, v)
                }
              />
            ))}
          </CheckGroup>
        </SubSection>

        <Divider />

        <SubSection
          title="Exam Attendance Not Marked (Post 2 hours)"
          desc="User gets notified after 2 hours if attendance not marked."
        >
          <CheckGroup>
            {Object.keys(form.attendance_not_marked_2hr).map((key) => (
              <Check
                key={key}
                label={capitalize(key)}
                checked={form.attendance_not_marked_2hr[key]}
                onChange={(v) =>
                  updateNested("attendance_not_marked_2hr", key, v)
                }
              />
            ))}
          </CheckGroup>
        </SubSection>

        <Divider />

        <SubSection
          title="Exam Marks Not Updated (Within 5 days)"
          desc="Faculty gets notified if marks not updated within 5 days."
        >
          <CheckGroup>
            {Object.keys(form.marks_not_updated_5days).map((key) => (
              <Check
                key={key}
                label={capitalize(key)}
                checked={form.marks_not_updated_5days[key]}
                onChange={(v) =>
                  updateNested("marks_not_updated_5days", key, v)
                }
              />
            ))}
          </CheckGroup>
        </SubSection>

        <Divider />

        <SubSection
          title="Exam Attendance Not Marked (Daily Reminder)"
          desc="Notification sent every 24 hours till attendance marked."
        >
          <CheckGroup>
            {Object.keys(form.attendance_daily_reminder).map((key) => (
              <Check
                key={key}
                label={capitalize(key)}
                checked={form.attendance_daily_reminder[key]}
                onChange={(v) =>
                  updateNested("attendance_daily_reminder", key, v)
                }
              />
            ))}
          </CheckGroup>
        </SubSection>

        <Divider />

        <SettingRow
          title="Student Rank in Exam SMS"
          desc="Student rank will be shared along with marks via SMS."
          value={form.student_rank_sms}
          onChange={(v) => updateToggle("student_rank_sms", v)}
        />
      </Section>

      {/* ================= SAVE BUTTON ================= */}
      <div className="flex justify-end pt-6 border-t border-gray-200">
        <PrimaryButton
          name={loading ? "Saving..." : "Save"}
          onClick={save}
          disabled={loading}
        />
      </div>
    </div>
  );
}

/* ================= UI COMPONENTS ================= */

function Section({ title, children }) {
  return (
    <div className="space-y-6">
      <h2 className="text-sm font-semibold text-gray-800">{title}</h2>
      {children}
    </div>
  );
}

function SubSection({ title, desc, children }) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium">{title}</h4>
      <p className="text-xs text-gray-500">{desc}</p>
      {children}
    </div>
  );
}

function Divider() {
  return <div className="border-t border-gray-200" />;
}

function CheckGroup({ children }) {
  return <div className="flex flex-wrap gap-6 mt-2">{children}</div>;
}

function Check({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label}
    </label>
  );
}

function SettingRow({ title, desc, value, onChange }) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h4 className="text-sm font-medium">{title}</h4>
        <p className="text-xs text-gray-500 mt-1">{desc}</p>
      </div>

      <Toggle value={value} onChange={onChange} />
    </div>
  );
}

function Toggle({ value, onChange }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className={!value ? "text-gray-600" : "text-gray-400"}>
        OFF
      </span>

      <div
        onClick={() => onChange(!value)}
        className={`relative w-10 h-5 rounded-full cursor-pointer transition ${
          value ? "bg-green-500" : "bg-gray-300"
        }`}
      >
        <div
          className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition ${
            value ? "left-5" : "left-0.5"
          }`}
        />
      </div>

      <span className={value ? "text-green-600" : "text-gray-400"}>
        ON
      </span>
    </div>
  );
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}