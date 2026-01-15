"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SECTIONS } from "@/constants/sections";
import { BLOOD_GROUPS } from "@/constants/studentMeta";
import { api } from "@/utils/api";

const STEPS = [
  "Student Details",
  "Parent / Guardian Details",
  "Address Details",
  "Documents",
  "Administration Details",
  "Other Details",
];

export default function NewAdmissionPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [classes, setClasses] = useState([]);

  const [form, setForm] = useState({
    studentName: "",
    gender: "",
    dob: "",
    blood_group: "",
    mobile: "",
    email: "",
    class_id: "",
    section: "",

    fatherName: "",
    motherName: "",
    parentMobile: "",
    parentEmail: "",
    profession: "",

    address: "",
    city: "",
    state: "",
    pincode: "",

    admissionDate: "",
    remarks: "",
  });

  /* ---------------- FETCH CLASSES ---------------- */
  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await api.get("/classes");
      setClasses(res.data?.data || []);
    } catch (e) {
      console.error("Failed to load classes", e);
    }
  };

  const update = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const next = () => step < STEPS.length - 1 && setStep(step + 1);
  const back = () => step > 0 && setStep(step - 1);

  /* ---------------- SUBMIT ---------------- */
  const submitAdmission = async () => {
    const payload = {
      first_name: form.studentName.split(" ")[0],
      last_name: form.studentName.split(" ").slice(1).join(" ") || null,
      admission_date: form.admissionDate,
      class: form.class_id,
      section: form.section || null,
      status: "active",

      details: {
        dob: form.dob,
        gender: form.gender.toLowerCase(),
        blood_group: form.blood_group,
        phone: form.mobile,
        email: form.email,
        father_name: form.fatherName,
        mother_name: form.motherName,
        parent_phone: form.parentMobile,
        address: form.address,
        city: form.city,
        state: form.state,
        medical_info: form.remarks || null,
      },
    };

    try {
      setLoading(true);
      await api.post("/students", payload);
      alert("Admission created successfully");
      router.push("/admin/students/admission");
    } catch (err) {
      console.error(err);
      alert("Failed to create admission");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* TITLE */}
      <div>
        <h2 className="text-xl font-semibold">New Student Admission</h2>
        <p className="text-sm text-gray-500">
          Complete all steps to create student admission
        </p>
      </div>

      {/* STEPPER */}
      <div className="flex flex-wrap gap-3 text-sm">
        {STEPS.map((s, i) => (
          <div
            key={s}
            className={`px-4 py-1.5 rounded-full border transition ${
              i === step
                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
            }`}
          >
            {i + 1}. {s}
          </div>
        ))}
      </div>

      {/* FORM BODY */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8 space-y-8 shadow-sm">
        {/* STEP 1 */}
        {step === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Student Name" name="studentName" onChange={update} placeholder="Enter student name" />
            <Input label="Mobile No" name="mobile" onChange={update} placeholder="Enter mobile number" />
            <Input label="Email" name="email" onChange={update} placeholder="Enter email address" />

            <Select
              label="Class"
              name="class_id"
              value={form.class_id}
              onChange={update}
              options={classes.map((c) => ({
                value: c.id,
                label: c.name,
              }))}
            />

            <Select
              label="Section"
              name="section"
              options={SECTIONS.map((s) => ({ value: s, label: s }))}
              onChange={update}
            />

            <Input type="date" label="Date of Birth" name="dob" onChange={update} placeholder="Enter date of birth" />

            <Select
              label="Gender"
              name="gender"
              options={[
                { value: "Male", label: "Male" },
                { value: "Female", label: "Female" },
              ]}
              onChange={update}
            />

            <Select
              label="Blood Group"
              name="blood_group"
              options={BLOOD_GROUPS.map((b) => ({ value: b, label: b }))}
              onChange={update}
            />
          </div>
        )}

        {/* STEP 2 */}
        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Father Name" name="fatherName" onChange={update} placeholder="Enter father name" />
            <Input label="Mother Name" name="motherName" onChange={update} placeholder="Enter mother name" />
            <Input label="Parent Mobile" name="parentMobile" onChange={update} placeholder="Enter parent mobile number" />
            <Input label="Parent Email" name="parentEmail" onChange={update} placeholder="Enter parent email address" />
            <Input label="Profession" name="profession" onChange={update} placeholder="Enter profession" />
          </div>
        )}

        {/* STEP 3 */}
        {step === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Address" name="address" onChange={update} placeholder="Enter address" />
            <Input label="City" name="city" onChange={update} placeholder="Enter city" />
            <Input label="State" name="state" onChange={update} placeholder="Enter state" />
            <Input label="Pincode" name="pincode" onChange={update} placeholder="Enter pincode" />
          </div>
        )}

        {/* STEP 4 */}
        {step === 3 && <input type="file" multiple />}

        {/* STEP 5 */}
        {step === 4 && (
          <Input type="date" label="Admission Date" name="admissionDate" onChange={update} placeholder="Enter admission date" />
        )}

        {/* STEP 6 */}
        {step === 5 && (
          <textarea
            name="remarks"
            onChange={update}
            className="w-full px-2 py-2 text-sm border rounded"
            rows={3}
            placeholder="Enter any remarks or medical information"
          />
        )}

        {/* ACTIONS */}
        <div className="flex justify-between pt-4">
          <button type="button" onClick={back} disabled={step === 0} className="px-4 py-2 border rounded">
            Back
          </button>

          {step === STEPS.length - 1 ? (
            <button
              type="button"
              disabled={loading}
              onClick={submitAdmission}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {loading ? "Saving..." : "Submit Admission"}
            </button>
          ) : (
            <button type="button" onClick={next} className="px-4 py-2 bg-blue-600 text-white rounded">
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- INPUTS ---------- */

function Input({ label, ...props }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-gray-600">{label}</label>
      <input
        {...props}
       
        className="w-full px-2 py-2 text-sm rounded-lg border border-gray-200 bg-white
                   focus:outline-none focus:ring-2 focus:ring-blue-100
                   focus:border-blue-500 transition"
      />
    </div>
  );
}

function Select({ label, options = [], ...props }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-gray-600">{label}</label>
      <select
        {...props}
        className="w-full px-2 py-2 text-sm rounded-lg border border-gray-200 bg-white
                   focus:outline-none focus:ring-2 focus:ring-blue-100
                   focus:border-blue-500 transition"
      >
        <option value="">Select</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
