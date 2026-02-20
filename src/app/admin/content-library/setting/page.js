"use client";

import React, { useEffect, useState } from "react";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { api } from "@/utils/api";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [form, setForm] = useState({
    /* Vimeo - File Manager */
    vimeo_download_student: false,
    vimeo_download_faculty: false,
    vimeo_download_admin: false,
    vimeo_download_guest: false,

    /* Vimeo - Study Material */
    vimeo_study_student: false,
    vimeo_study_admin: false,
    vimeo_study_guest: false,

    storage_threshold: 75,

    /* General */
    video_download_app: false,
    priority_sorting: false,
    teacher_all_access: false,
    study_material_upload_notification: false,
    file_manager_teacher: false,

    file_sorting: "latest",
  });

 /* ================= FETCH ================= */
/* ================= FETCH ================= */
/* ================= FETCH ================= */
useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await api.get("settings/content/content_settings");

      if (res.data?.data) {
        setForm((prev) => ({
          ...prev,
          ...res.data.data, // ✅ correct path for your API
          storage_threshold: Number(res.data.data.storage_threshold) || 75,
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

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };


const save = async () => {
  try {
    setLoading(true);

    await api.post("settings/content", {
      key: "content_settings",
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
    <div className="space-y-6 p-8">
    <div className="p-8 bg-white border border-gray-200 rounded-xl space-y-12">

      {/* ================= VIMEO SETTING ================= */}
      <Section title="Vimeo Setting">

        {/* File Manager Download */}
        <SubTitle title="Video download visibility (File Manager)" />
        <CheckGroup>
          <Check label="Student"
            checked={form.vimeo_download_student}
            onChange={(v)=>updateField("vimeo_download_student",v)}
          />
          <Check label="Faculty"
            checked={form.vimeo_download_faculty}
            onChange={(v)=>updateField("vimeo_download_faculty",v)}
          />
          <Check label="Admin"
            checked={form.vimeo_download_admin}
            onChange={(v)=>updateField("vimeo_download_admin",v)}
          />
          <Check label="Open App / Guest User's"
            checked={form.vimeo_download_guest}
            onChange={(v)=>updateField("vimeo_download_guest",v)}
          />
        </CheckGroup>

        <Divider />

        {/* Study Material Download */}
        <SubTitle title="Video download visibility (Study Material)" />
        <CheckGroup>
          <Check label="Student"
            checked={form.vimeo_study_student}
            onChange={(v)=>updateField("vimeo_study_student",v)}
          />
          <Check label="Admin"
            checked={form.vimeo_study_admin}
            onChange={(v)=>updateField("vimeo_study_admin",v)}
          />
          <Check label="Open App / Guest User's"
            checked={form.vimeo_study_guest}
            onChange={(v)=>updateField("vimeo_study_guest",v)}
          />
        </CheckGroup>

        <Divider />

        {/* Storage Slider */}
        <div>
          <SubTitle title="Storage capacity threshold alert" />
          <p className="text-xs text-gray-500 mb-3">
            Set threshold limit for storage capacity
          </p>

          <input
            type="range"
            min="1"
            max="100"
            value={form.storage_threshold}
            onChange={(e)=>updateField("storage_threshold",e.target.value)}
            className="w-full"
          />

          <div className="text-xs text-gray-500 mt-2">
            {form.storage_threshold} %
          </div>
        </div>

      </Section>

      {/* ================= GENERAL SETTING ================= */}
      <Section title="General Setting">

        <SettingRow
          title="Video Download (In App Only)"
          desc="Allow students to download videos within App"
          value={form.video_download_app}
          onChange={(v)=>updateField("video_download_app",v)}
        />

        <Divider />

        <SettingRow
          title="Enable Priority wise topic sorting"
          desc="View study material priority wise sorted"
          value={form.priority_sorting}
          onChange={(v)=>updateField("priority_sorting",v)}
        />

        <Divider />

        <SettingRow
          title="Study Material All Access (Teacher)"
          desc="Teacher will be able to view all study material data"
          value={form.teacher_all_access}
          onChange={(v)=>updateField("teacher_all_access",v)}
        />

        <Divider />

        <div>
          <SubTitle title="Sorting of Files for Study Material" />
          <select
            className="soft-input h-10 text-sm w-64"
            value={form.file_sorting}
            onChange={(e)=>updateField("file_sorting",e.target.value)}
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="priority">Priority</option>
          </select>
        </div>

        <Divider />

        <SettingRow
          title="Study Material Upload Notification"
          desc="Students get notified when new study material is uploaded"
          value={form.study_material_upload_notification}
          onChange={(v)=>updateField("study_material_upload_notification",v)}
        />

        <Divider />

        <SettingRow
          title="File manager (Teacher)"
          desc="Teacher can view files in file manager"
          value={form.file_manager_teacher}
          onChange={(v)=>updateField("file_manager_teacher",v)}
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
    </div>
  );
}

/* ================= COMPONENTS ================= */

function Section({ title, children }) {
  return (
    <div className="space-y-6">
      <h2 className="text-sm font-semibold text-gray-800">
        {title}
      </h2>
      {children}
    </div>
  );
}

function SubTitle({ title }) {
  return <h4 className="text-sm font-medium">{title}</h4>;
}

function Divider() {
  return <div className="border-t border-gray-200" />;
}

function CheckGroup({ children }) {
  return <div className="flex flex-wrap gap-6 mt-3">{children}</div>;
}

function Check({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e)=>onChange(e.target.checked)}
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
        onClick={()=>onChange(!value)}
        className={`relative w-10 h-5 rounded-full cursor-pointer transition
        ${value ? "bg-green-500" : "bg-gray-300"}`}
      >
        <div
          className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition
          ${value ? "left-5" : "left-0.5"}`}
        />
      </div>

      <span className={value ? "text-green-600" : "text-gray-400"}>
        ON
      </span>
    </div>
  );
}