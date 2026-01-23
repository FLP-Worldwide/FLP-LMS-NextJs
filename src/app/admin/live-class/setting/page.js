"use client";

import PrimaryButton from "@/components/ui/PrimaryButton";
import React, { useRef, useState, useEffect } from "react";
import { api } from "@/utils/api";


export default function LiveClassSettingsPage() {
  /* ================= SECTION REFS ================= */
  const liveClassRef = useRef(null);
  const attendanceRef = useRef(null);
  const vdoRef = useRef(null);

  /* ================= STATE ================= */
  const [settings, setSettings] = useState({
    recording_enabled: true,

    recorded_view_visibility: {
      students: true,
      teachers: true,
      admin: true,
    },

    recorded_download_visibility: {
      students: false,
      teachers: false,
      admin: false,
    },

    absent_notification: {
      students: false,
      parents: false,
      guardian: false,
    },

    partial_present_notification: {
      students: false,
      parents: false,
      guardian: false,
    },

    attendance_status_notification: {
      students: false,
      parents: false,
    },

    attendance_threshold: 0,
    attendance_notification_mode: "",
    zoom_account_selection: true,
    vdocipher_watch_multiplier: 3,
  });

  useEffect(() => {
  fetchSettings();
}, []);

const fetchSettings = async () => {
  try {
    const res = await api.get("/live-class/settings");

    if (res.data?.status !== "success") return;

    const data = res.data.data || {};

    setSettings((prev) => ({
      ...prev,

      // recording
      recording_enabled:
        data.recording_enabled ?? prev.recording_enabled,

      // recorded view
      recorded_view_visibility: {
        ...prev.recorded_view_visibility,
        ...(data.recorded_view_visibility || {}),
      },

      // recorded download (FIXED)
      recorded_download_visibility: {
        ...prev.recorded_download_visibility,
        ...(data.recorded_download_visibility || {}),
      },

      // attendance
      attendance_threshold:
        data.attendance?.attendance_threshold ??
        prev.attendance_threshold,

      attendance_notification_mode:
        data.attendance?.attendance_notification_mode ??
        prev.attendance_notification_mode,

      // vdocipher
      vdocipher_watch_multiplier:
        data.vdocipher?.watch_multiplier ??
        prev.vdocipher_watch_multiplier,

      // zoom
      zoom_account_selection:
        data.zoom_account_selection ??
        prev.zoom_account_selection,
    }));
  } catch (err) {
    console.error("Failed to load live class settings", err);
  }
};



  /* ================= HELPERS ================= */
  const toggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleNested = (parent, key) => {
    setSettings((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [key]: !prev[parent][key],
      },
    }));
  };
const buildPayload = () => ({
  recording_enabled: settings.recording_enabled,

  recorded_view_visibility: settings.recorded_view_visibility,

  recorded_download_visibility: settings.recorded_download_visibility,

  attendance: {
    absent_notification: settings.absent_notification,
    partial_present_notification: settings.partial_present_notification,
    attendance_status_notification: settings.attendance_status_notification,
    attendance_threshold: Number(settings.attendance_threshold),
    attendance_notification_mode:
      settings.attendance_notification_mode || null,
  },

  vdocipher: {
    watch_multiplier: Number(settings.vdocipher_watch_multiplier),
  },

  zoom_account_selection: settings.zoom_account_selection,
});


  const handleSave = async () => {
  try {
    const payload = buildPayload();

    await api.post("/live-class/settings", payload);

    alert("Settings saved successfully");
  } catch (error) {
    console.error(error);
    alert("Failed to save settings");
  }
};


  return (
    /* PAGE CONTENT (inside ERP layout) */
    <div className="flex  h-[calc(100vh-64px)]">
      {/* ================= PAGE SIDEBAR ================= */}
      <aside className="w-64 bg-gray-50 p-4 sticky  self-start">
        <h3 className="font-semibold mb-4 text-gray-800">Settings</h3>

        <ul className="space-y-3 text-sm">
          <li
            className="cursor-pointer text-blue-600"
            onClick={() =>
              liveClassRef.current.scrollIntoView({ behavior: "smooth" })
            }
          >
            Live Class
          </li>

          <li
            className="cursor-pointer text-gray-600 hover:text-blue-600"
            onClick={() =>
              attendanceRef.current.scrollIntoView({ behavior: "smooth" })
            }
          >
            Live Class Attendance
          </li>

          <li
            className="cursor-pointer text-gray-600 hover:text-blue-600"
            onClick={() =>
              vdoRef.current.scrollIntoView({ behavior: "smooth" })
            }
          >
            VDOCipher Watch Multiplier
          </li>
        </ul>
      </aside>

      {/* ================= CONTENT WRAPPER ================= */}
      <div className="flex-1 flex flex-col bg-white border border-gray-200  overflow-hidden">
        {/* ================= SCROLLABLE CONTENT ================= */}
        <div className="flex-1 overflow-y-auto p-6 space-y-12">
          {/* ================================================= */}
          {/* LIVE CLASS */}
          {/* ================================================= */}
          <section ref={liveClassRef}>
            <h2 className="text-lg font-semibold">Live Class Settings</h2>
            <p className="text-sm text-gray-500 mb-6">
              Manage live class recording, access, and download permissions.
            </p>

            <div className="flex justify-between items-center border-b border-gray-200 pb-4">
              <div>
                <p className="font-medium">Enable Live Class Recording</p>
                <p className="text-xs text-gray-500">
                  If enabled, live classes will be recorded automatically.
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.recording_enabled}
                onChange={() => toggle("recording_enabled")}
              />
            </div>

            {/* View Permission */}
            <div className="mt-6">
              <h4 className="font-medium">
                Recorded Session View Visibility
              </h4>
              <p className="text-xs text-gray-500 mb-3">
                Select user types who can view recorded sessions.
              </p>

              <div className="flex gap-6 capitalize">
                {["students", "teachers", "admin"].map((u) => (
                  <label key={u} className="flex gap-2 items-center">
                    <input
                      type="checkbox"
                      checked={settings.recorded_view_visibility[u]}
                      onChange={() =>
                        toggleNested("recorded_view_visibility", u)
                      }
                    />
                    {u}
                  </label>
                ))}
              </div>
            </div>

            {/* Download Permission */}
            <div className="mt-6 border-t pt-4">
              <h4 className="font-medium">
                Recorded Session Download Visibility
              </h4>
              <p className="text-xs text-gray-500 mb-3">
                Control who can download recorded sessions.
              </p>

              <div className="flex gap-6 capitalize">
                {["students", "teachers", "admin"].map((u) => (
                  <label key={u} className="flex gap-2 items-center">
                    <input
                      type="checkbox"
                      checked={settings.recorded_download_visibility?.[u]}
                      onChange={() =>
                        toggleNested("recorded_download_visibility", u)
                      }
                    />
                    {u}
                  </label>
                ))}
              </div>
            </div>
          </section>

          {/* ================================================= */}
          {/* ATTENDANCE */}
          {/* ================================================= */}
          <section ref={attendanceRef}>
            <h2 className="text-lg font-semibold">Live Class Attendance</h2>
            <p className="text-sm text-gray-500 mb-6">
              Configure attendance rules and notifications.
            </p>

            <div className="mb-6">
              <h4 className="font-medium">Absent Notifications</h4>
              <p className="text-xs text-gray-500 mb-3">
                Select users to notify when a student is absent.
              </p>

              <div className="flex gap-6 capitalize">
                {["students", "parents", "guardian"].map((u) => (
                  <label key={u} className="flex gap-2 items-center">
                    <input
                      type="checkbox"
                      checked={settings.absent_notification[u]}
                      onChange={() =>
                        toggleNested("absent_notification", u)
                      }
                    />
                    {u}
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6 border-t border-gray-200 pt-4">
              <h4 className="font-medium">
                Partially Present Notifications
              </h4>

              <div className="flex gap-6 capitalize mt-2">
                {["students", "parents", "guardian"].map((u) => (
                  <label key={u} className="flex gap-2 items-center">
                    <input
                      type="checkbox"
                      checked={settings.partial_present_notification[u]}
                      onChange={() =>
                        toggleNested("partial_present_notification", u)
                      }
                    />
                    {u}
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6 border-t border-gray-200 pt-4">
              <h4 className="font-medium">
                Attendance Status Notification
              </h4>

              <div className="flex gap-6 capitalize mt-2">
                {["students", "parents"].map((u) => (
                  <label key={u} className="flex gap-2 items-center">
                    <input
                      type="checkbox"
                      checked={settings.attendance_status_notification[u]}
                      onChange={() =>
                        toggleNested("attendance_status_notification", u)
                      }
                    />
                    {u}
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6 border-t border-gray-200 pt-4">
              <h4 className="font-medium">Attendance Threshold (%)</h4>
              <input
                type="number"
                className="soft-input w-40 mt-2"
                value={settings.attendance_threshold}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    attendance_threshold: e.target.value,
                  })
                }
              />
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h4 className="font-medium">
                Attendance Notification Mode
              </h4>

              <select
                className="soft-select w-64 mt-2"
                value={settings.attendance_notification_mode}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    attendance_notification_mode: e.target.value,
                  })
                }
              >
                <option value="">Select Mode</option>
                <option value="SMS">SMS</option>
                <option value="EMAIL">Email</option>
                <option value="SMS_EMAIL">SMS & Email</option>
              </select>
            </div>
          </section>

          {/* ================================================= */}
          {/* VDOCIPHER */}
          {/* ================================================= */}
          <section ref={vdoRef}>
            <h2 className="text-lg font-semibold">
              VDOCipher Live Class Multiplier
            </h2>
            <p className="text-sm text-gray-500 mb-3">
              Limit how many times a recorded class can be watched.
            </p>

            <input
              type="number"
              className="soft-input w-40"
              value={settings.vdocipher_watch_multiplier}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  vdocipher_watch_multiplier: e.target.value,
                })
              }
            />
          </section>
        </div>

        {/* ================= SAVE BAR ================= */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-3 flex justify-end gap-3">
            <PrimaryButton
                name="Save"
                onClick={handleSave}
            />
        </div>
      </div>
    </div>
  );
}
