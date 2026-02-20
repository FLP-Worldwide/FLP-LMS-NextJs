"use client";

import { useState } from "react";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { api } from "@/utils/api";
import { useEffect } from "react";
export default function SettingsPage() {
const [loading, setLoading] = useState(false);

const [form, setForm] = useState({
  // CLASS SETTINGS
  expiry_students: false,
  expiry_admin: false,
  expiry_days: 0,
  expiry_contact_number: "",

  // HOMEWORK
  enable_homework: false,
  daily_report_enabled: false,
  daily_report_emails: "",
  course_expiry_enabled: false,

  // ATTENDANCE
  absenteeism_days: 0,
  restrict_current_month: false,

  // SMS
  sms_absent_students: false,
  sms_absent_parents: false,
  sms_absent_guardian: false,

  sms_regular_students: false,
  sms_regular_parents: false,
  sms_regular_guardian: false,
  sms_regular_faculty: false,
  sms_regular_admin: false,

  // PUSH
  push_absent_students: false,
  push_absent_parents: false,
});

const [fetching, setFetching] = useState(true);

useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await api.get("settings/content/class_settings");

      if (res.data?.data) {
        setForm((prev) => ({
          ...prev,
          ...res.data.data,
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

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

/* ================= SAVE ================= */
const save = async () => {
  try {
    setLoading(true);

    await api.post("settings/content", {
      key: "class_settings",
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

  const Toggle = ({ checked, onChange }) => (
    <div
      onClick={onChange}
      className={`w-12 h-6 flex items-center rounded-full cursor-pointer transition ${
        checked ? "bg-green-500" : "bg-gray-300"
      }`}
    >
      <div
        className={`w-5 h-5 bg-white rounded-full shadow-md transform transition ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </div>
  );

  const Section = ({ id, title, children }) => (
    <section id={id} className="scroll-mt-4  border-b border-gray-200 pb-2">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-2 h-2 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-semibold">
          {title.charAt(0)}
        </div>
        <h2 className="text-blue-600 text-md font-semibold">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );


  return (
    <div className="flex bg-gray-50 min-h-screen">

      {/* ================= SIDEBAR ================= */}
      <div className="w-64 bg-white border-r border-gray-200 p-6 sticky top-0 h-screen">
        <div className="text-lg font-semibold mb-6">Settings</div>

        <div className="space-y-3 text-sm">
          <div onClick={() => scrollTo("class")} className="cursor-pointer hover:text-blue-600">Class Setting</div>
          <div onClick={() => scrollTo("homework")} className="cursor-pointer hover:text-blue-600">Homework Setting</div>
          <div onClick={() => scrollTo("attendance")} className="cursor-pointer hover:text-blue-600">Attendance</div>
          <div onClick={() => scrollTo("sms")} className="cursor-pointer hover:text-blue-600">SMS Notifications</div>
          <div onClick={() => scrollTo("push")} className="cursor-pointer hover:text-blue-600">Push Notifications</div>
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 p-4 space-y-3">

        {/* CLASS SETTINGS */}
        <Section id="class" title="Class Settings">
          <div className="space-y-2 text-sm">

            <div>
              <div className="font-medium mb-2">
                Student Batch Expiry Notification
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-2">
                 <input
                    type="checkbox"
                    checked={form.expiry_students}
                    onChange={(e) =>
                        setForm({ ...form, expiry_students: e.target.checked })
                    }
                    />
                  Students
                </label>
                <label className="flex items-center gap-2">
                 <input
                    type="checkbox"
                    checked={form.expiry_admin}
                    onChange={(e) =>
                        setForm({ ...form, expiry_admin: e.target.checked })
                    }
                    />
                  Admin
                </label>
              </div>
            </div>

            <div>
              <div className="font-medium">
                Days before which Notification to be Sent
              </div>
            <input
                type="number"
                value={form.expiry_days}
                onChange={(e) =>
                    setForm({ ...form, expiry_days: Number(e.target.value) })
                }
                className="mt-1 w-64 border border-gray-200 px-2 py-1 rounded-md"
                />
            </div>

            <div>
              <div className="font-medium">
                Please specify phone number for notifications
              </div>
              <input type="text" placeholder="Contact Number" className="mt-1 w-64 border border-gray-200 px-2 py-1 rounded-md" /><input
                type="text"
                value={form.expiry_contact_number || ""}
                onChange={(e) =>
                    setForm({ ...form, expiry_contact_number: e.target.value })
                }
                placeholder="Contact Number"
                className="mt-1 w-64 border border-gray-200 px-2 py-1 rounded-md"
                />
            </div>
          </div>
        </Section>

        {/* HOMEWORK SETTING */}
        <Section id="homework" title="Homework Setting">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-medium">Enable Homework Feature</div>
              <p className="text-gray-500 text-sm">
                Share homework with students while scheduling class
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm">
              OFF
              <Toggle
                checked={form.enable_homework}
                onChange={() =>
                    setForm({
                    ...form,
                    enable_homework: !form.enable_homework,
                    })
                }
                />
              ON
            </div>
          </div>

          {/* Daily Report */}
          <div className="mt-2 flex justify-between items-start">
            <div>
              <div className="font-medium">
                Absentees and Homework Daily Report
              </div>
             <input
                value={form.daily_report_emails || ""}
                onChange={(e) =>
                    setForm({ ...form, daily_report_emails: e.target.value })
                }
                placeholder="Email IDs (comma separated)"
                className="mt-1 w-64 border border-gray-200 px-2 py-1 rounded-md"
                />
            </div>

            <div className="flex items-center gap-2 text-sm">
              OFF
              <Toggle
                checked={form.daily_report_enabled}
                onChange={() =>
                    setForm({
                    ...form,
                    daily_report_enabled: !form.daily_report_enabled,
                    })
                }
                />
              ON
            </div>
          </div>

          {/* Course Expiry */}
          <div className="mt-2 flex justify-between items-center">
            <div className="font-medium">
              Course Expiry Notification to Admin
            </div>

            <div className="flex items-center gap-2 text-sm">
              OFF
              <Toggle
                checked={form.course_expiry_enabled}
                onChange={() =>
                    setForm({
                    ...form,
                    course_expiry_enabled: !form.course_expiry_enabled,
                    })
                }
                />
              ON
            </div>
          </div>
        </Section>

        {/* ATTENDANCE */}
        <Section id="attendance" title="Attendance">
          <div className="space-y-6 text-sm">
            <div>
              <div className="font-medium">
                Min. number of days allowed for absenteeism
              </div>
             <input
                type="number"
                value={form.absenteeism_days}
                onChange={(e) =>
                    setForm({ ...form, absenteeism_days: Number(e.target.value) })
                }
                className="mt-1 w-64 border border-gray-200 px-2 py-1 rounded-md"
                />
            </div>

            <label className="flex items-center gap-2">
             <input
                type="checkbox"
                checked={form.restrict_current_month}
                onChange={(e) =>
                    setForm({ ...form, restrict_current_month: e.target.checked })
                }
                />
              Allow teachers to mark attendance only in current system month
            </label>
          </div>
        </Section>

        {/* SMS NOTIFICATIONS */}
        <Section id="sms" title="SMS Notifications">
          <div className="space-y-8 text-sm">

            <div>
              <div className="font-medium mb-2">Absent Students</div>
              <div className="flex gap-6">
                <label><input
                    type="checkbox"
                    checked={form.sms_absent_students}
                    onChange={(e) =>
                        setForm({ ...form, sms_absent_students: e.target.checked })
                    }
                    /> Students</label>
                <label><input
                    type="checkbox"
                    checked={form.sms_absent_parents}
                    onChange={(e) =>
                        setForm({ ...form, sms_absent_parents: e.target.checked })
                    }
                    /> Parents</label>
                <label><input
                    type="checkbox"
                    checked={form.sms_absent_guardian}
                    onChange={(e) =>
                        setForm({ ...form, sms_absent_guardian: e.target.checked })
                    }
                    /> Guardian</label>
              </div>
            </div>

            <div>
              <div className="font-medium mb-2">Regular Class Notification</div>
              <div className="flex gap-6 flex-wrap">
                <label><input
                    type="checkbox"
                    checked={form.sms_regular_students}
                    onChange={(e) =>
                        setForm({ ...form, sms_regular_students: e.target.checked })
                    }
                    /> Students</label>
                <label><input
                    type="checkbox"
                    checked={form.sms_regular_parents}
                    onChange={(e) =>
                        setForm({ ...form, sms_regular_parents: e.target.checked })
                    }
                    /> Parents</label>
                <label><input
                    type="checkbox"
                    checked={form.sms_regular_guardian}
                    onChange={(e) =>
                        setForm({ ...form, sms_regular_guardian: e.target.checked })
                    }
                    /> Guardian</label>
                <label><input
                    type="checkbox"
                    checked={form.sms_regular_faculty}
                    onChange={(e) =>
                        setForm({ ...form, sms_regular_faculty: e.target.checked })
                    }
                    /> Faculty</label>
                <label><input
                    type="checkbox"
                    checked={form.sms_regular_admin}
                    onChange={(e) =>
                        setForm({ ...form, sms_regular_admin: e.target.checked })
                    }
                    /> Admin</label>
              </div>
            </div>

          </div>
        </Section>

        {/* PUSH NOTIFICATIONS */}
        <Section id="push" title="Push Notifications">
          <div className="space-y-4 text-sm">
            <div className="font-medium">Absent Student</div>
            <div className="flex gap-6">
              <label><input
                    type="checkbox"
                    checked={form.push_absent_students}
                    onChange={(e) =>
                        setForm({ ...form, push_absent_students: e.target.checked })
                    }
                    /> Students</label>
              <label><input
                    type="checkbox"
                    checked={form.push_absent_parents}
                    onChange={(e) =>
                        setForm({ ...form, push_absent_parents: e.target.checked })
                    }
                    /> Parents</label>
            </div>
          </div>
        </Section>

        {/* FOOTER */}
        <div className="flex justify-end gap-4 pt-8">
          <button className="px-5 py-2 border rounded-md text-gray-600">
            Cancel
          </button>
         <PrimaryButton name="Save" onClick={save} />
        </div>

      </div>
    </div>
  );
}