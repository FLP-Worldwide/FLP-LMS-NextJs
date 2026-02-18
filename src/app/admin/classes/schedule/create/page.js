"use client";

import { useEffect, useState } from "react";
import { api } from "@/utils/api";
import PrimaryButton from "@/components/ui/PrimaryButton";
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
import { useRouter } from "next/navigation";

import { useToast } from "@/components/ui/ToastProvider";

export default function SchedulePage() {
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [classes, setClasses] = useState([]);
  const router = useRouter();
  const  toast  = useToast();
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");

  const [rows, setRows] = useState([]);

  /* ================= FETCH ONLY REQUIRED ================= */
  useEffect(() => {
    fetchInitial();
  }, []);

  const fetchInitial = async () => {
    const [c, t, s] = await Promise.all([
      api.get("/courses"),
      api.get("/teachers"),
      api.get("/subjects"),
    ]);

    setCourses(c.data?.data || []);
    setTeachers(t.data?.data || []);
    setSubjects(s.data?.data || []);
  };





  const fetchBatches = async (courseId) => {
    const res = await api.get(`/batches?course_id=${courseId}`);
    setBatches(res.data?.data || []);
  };

  const fetchClasses = async (batchId) => {
    if (!batchId) return;

    const res = await api.get(`/classes?batch_id=${batchId}`);
    setClasses(res.data?.data || []);
  };
  /* ================= ADD ROW ================= */
  const addRow = () => {
    setRows([
      ...rows,
      {
        class_id: "",
        subject_id: "",
        topic: "",
        start_time: "",
        end_time: "",
        teacher_id: "",
        description: "",
        room_no: "",
        class_type: "Regular",
        repeat: "Does Not Repeat",

        // NEW
        repeat_days: [],
        repeat_dates: [],
      },
    ]);
  };
const toggleDay = (rowIndex, day) => {
  const updated = [...rows];
  const currentDays = updated[rowIndex].repeat_days;

  updated[rowIndex].repeat_days = currentDays.includes(day)
    ? currentDays.filter((d) => d !== day)
    : [...currentDays, day];

  setRows(updated);
};


  const updateRow = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  const removeRow = (index) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  /* ================= SAVE ================= */
  const saveSchedule = async () => {
    if (!rows.length) {
      alert("Please add at least one class");
      return;
    }

    const formattedClasses = rows.map((row) => {
      return {
         class_id: row.class_id,
        subject_id: row.subject_id,
        topic: row.topic,
        start_time: row.start_time,
        end_time: row.end_time,
        teacher_id: row.teacher_id,
        description: row.description,
        room_no: row.room_no,
        class_type: row.class_type,

        repeat_type: row.repeat,

        weekly_days:
          row.repeat === "Weekly" ? row.repeat_days : [],

        specific_dates:
          row.repeat === "Select Dates" ? row.repeat_dates : [],
      };
    });

    const payload = {
      course_id: selectedCourse,
      batch_id: selectedBatch,
      base_date: scheduleDate,
      classes: formattedClasses,
    };

   try {
      await api.post("/class-routines", payload);
      toast.success("Schedule saved successfully");
      // alert("Schedule saved successfully");

      // OPTION 1 → Go Back To Routine List Page
      router.push("/admin/classes/schedule");

      // OPTION 2 (if you want refresh instead)
      // router.refresh();

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to save schedule");
    }
    // router.refresh();
  };



  return (
    <div className="space-y-6">

      {/* ===== HEADER ===== */}
      <div>
        <h2 className="text-lg font-semibold">Class Schedule Details</h2>
      </div>

      {/* ===== TOP FILTER SECTION ===== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white border border-gray-200 rounded-xl p-4">

        {/* COURSE */}
        <div>
          <label className="text-xs text-gray-600">Select Category/Course *</label>
          <select
            className="soft-input"
            value={selectedCourse}
            onChange={(e) => {
              setSelectedCourse(e.target.value);
              fetchBatches(e.target.value);
            }}
          >
            <option value="">Select</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* BATCH */}
        <div>
          <label className="text-xs text-gray-600">Select Batch *</label>
         <select
            className="soft-input"
            value={selectedBatch}
            onChange={(e) => {
              setSelectedBatch(e.target.value);
              fetchClasses(e.target.value);   // ✅ FETCH CLASS HERE
            }}
          >

            <option value="">Select</option>
            {batches.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>

        {/* DATE */}
        <div>
          <label className="text-xs text-gray-600">Class Schedule Date</label>
          <input
            type="date"
            className="soft-input"
            value={scheduleDate}
            onChange={(e) => setScheduleDate(e.target.value)}
          />
        </div>

        {/* GO BUTTON */}
        <div className="flex items-end">
          <PrimaryButton
            name="Go"
            onClick={() => {
              if (!selectedCourse || !selectedBatch || !scheduleDate) {
                alert("Please select course, batch and date");
                return;
              }
              setShowTable(true);
            }}
          />

        </div>
      </div>

      {/* ===== SCHEDULE TABLE ===== */}
      {showTable && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          
          {/* ===== TABLE HEADER ===== */}
          <div className="flex justify-between items-center p-3 border-b">
            <h3 className="text-sm font-medium">Schedule Class</h3>

            <button
              onClick={addRow}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
            >
              Add
            </button>
          </div>

        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left">Class *</th>
              <th className="px-3 py-2 text-left">Subject *</th>
              <th className="px-3 py-2 text-left">Topic</th>
              <th className="px-3 py-2 text-left">Start Time *</th>
              <th className="px-3 py-2 text-left">End Time *</th>
              <th className="px-3 py-2 text-left">Select Teacher *</th>
              <th className="px-3 py-2 text-left">Description</th>
              <th className="px-3 py-2 text-left">Room No.</th>
              <th className="px-3 py-2 text-left">Class Type</th>
              <th className="px-3 py-2 text-left">Repeat</th>
              <th></th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {rows.map((row, index) => (

              <tr key={index}>
                <td className="px-3 py-2">
                  <select
                    className="soft-input"
                    value={row.class_id}
                    onChange={(e) => updateRow(index, "class_id", e.target.value)}
                  >
                    <option value="">Select</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </td>



                <td className="px-3 py-2">
                  <select
                    className="soft-input"
                    value={row.subject_id}
                    onChange={(e) => updateRow(index, "subject_id", e.target.value)}
                  >
                    <option value="">Select</option>
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </td>

                <td className="px-3 py-2">
                  <input
                    className="soft-input"
                    value={row.topic}
                    onChange={(e) => updateRow(index, "topic", e.target.value)}
                  />
                </td>

                <td className="px-3 py-2">
                  <input
                    type="time"
                    className="soft-input"
                    value={row.start_time}
                    onChange={(e) => updateRow(index, "start_time", e.target.value)}
                  />
                </td>

                <td className="px-3 py-2">
                  <input
                    type="time"
                    className="soft-input"
                    value={row.end_time}
                    onChange={(e) => updateRow(index, "end_time", e.target.value)}
                  />
                </td>

                <td className="px-3 py-2">
                  <select
                    className="soft-input"
                    value={row.teacher_id}
                    onChange={(e) => updateRow(index, "teacher_id", e.target.value)}
                  >
                    <option value="">Select</option>
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </td>

                <td className="px-3 py-2">
                  <input
                    className="soft-input"
                    value={row.description}
                    onChange={(e) => updateRow(index, "description", e.target.value)}
                  />
                </td>

                <td className="px-3 py-2">
                  <input
                    className="soft-input"
                    value={row.room_no}
                    onChange={(e) => updateRow(index, "room_no", e.target.value)}
                  />
                </td>

                <td className="px-3 py-2">
                  <select
                    className="soft-input"
                    value={row.class_type}
                    onChange={(e) => updateRow(index, "class_type", e.target.value)}
                  >
                    <option>Regular</option>
                    <option>Extra</option>
                    <option>Doubt</option>
                  </select>
                </td>

                <td className="px-3 py-2">
                  <select
                    className="soft-input"
                    value={row.repeat}
                    onChange={(e) => updateRow(index, "repeat", e.target.value)}
                  >
                    <option>Does Not Repeat</option>
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option>Select Dates</option>
                  </select>

                  {/* ===== WEEKLY → SHOW DAYS ===== */}
                  {row.repeat === "Weekly" && (
                    <div className="mt-2 border rounded p-2 bg-gray-50 text-xs">
                      <div className="flex flex-wrap gap-2">
                        {DAYS.map((d) => (
                          <label key={d} className="flex items-center gap-1">
                            <input
                              type="checkbox"
                              checked={row.repeat_days.includes(d)}
                              onChange={() => toggleDay(index, d)}
                            />
                            {d.slice(0, 3)}
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ===== SELECT DATES → MULTIPLE DATE PICKER ===== */}
                  {row.repeat === "Select Dates" && (
                    <div className="mt-2">
                      <input
                        type="date"
                        className="soft-input"
                        onChange={(e) => {
                          const updated = [...rows];
                          if (!updated[index].repeat_dates.includes(e.target.value)) {
                            updated[index].repeat_dates.push(e.target.value);
                            setRows(updated);
                          }
                        }}
                      />

                      {row.repeat_dates.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {row.repeat_dates.map((d, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs"
                            >
                              {d}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </td>


                <td className="px-3 py-2 text-right">
                  <button
                    onClick={() => removeRow(index)}
                    className="text-red-500"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        </div>
      )}



      {/* FOOTER ACTIONS */}
      <div className="flex justify-end gap-3">
        <button className="soft-btn-outline">Cancel</button>
        <PrimaryButton name="Save" onClick={saveSchedule} />
      </div>


    </div>
  );
}
