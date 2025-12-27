"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CLASSES, SECTIONS } from "@/constants/academic";

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

  const [form, setForm] = useState({
    studentName: "",
    gender: "",
    dob: "",
    mobile: "",
    email: "",
    class: "",
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

  const update = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  function next() {
    if (step < STEPS.length - 1) setStep(step + 1);
  }

  function back() {
    if (step > 0) setStep(step - 1);
  }

  function submit(e) {
    e.preventDefault();
    console.log("FINAL ADMISSION DATA", form);
    alert("Admission created (demo)");
    router.push("/admin/students/admission");
  }

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
          className={`px-4 py-1.5 rounded-full border transition
            ${
              i === step
                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
            }`}
        >
          {i + 1}. {s}
        </div>
      ))}
    </div>

      {/* FORM */}
      <form
        onSubmit={submit}
        className="bg-white border border-gray-200 rounded-2xl p-8 space-y-8 shadow-sm"
      >

        {/* STEP 1 — STUDENT DETAILS */}
        {step === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Student Name" name="studentName" onChange={update} />
            <Input label="Mobile No" name="mobile" onChange={update} />
            <Input label="Email" name="email" onChange={update} />

            <Select label="Class" name="class" options={CLASSES} onChange={update} />
            <Select label="Section" name="section" options={SECTIONS} onChange={update} />

            <Input type="date" label="Date of Birth" name="dob" onChange={update} />
            <Select label="Gender" name="gender" options={["Male", "Female"]} onChange={update} />
          </div>
        )}

        {/* STEP 2 — PARENT DETAILS */}
        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Father Name" name="fatherName" onChange={update} />
            <Input label="Mother Name" name="motherName" onChange={update} />
            <Input label="Parent Mobile" name="parentMobile" onChange={update} />
            <Input label="Parent Email" name="parentEmail" onChange={update} />
            <Input label="Profession" name="profession" onChange={update} />
          </div>
        )}

        {/* STEP 3 — ADDRESS */}
        {step === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Address" name="address" onChange={update} />
            <Input label="City" name="city" onChange={update} />
            <Input label="State" name="state" onChange={update} />
            <Input label="Pincode" name="pincode" onChange={update} />
          </div>
        )}

        {/* STEP 4 — DOCUMENTS */}
        {step === 3 && (
          <div>
            <p className="text-sm text-gray-500 mb-2">
              Upload student documents (Aadhaar, Birth Certificate etc.)
            </p>
            <input type="file" multiple />
          </div>
        )}

        {/* STEP 5 — ADMIN DETAILS */}
        {step === 4 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input type="date" label="Admission Date" name="admissionDate" onChange={update} />
          </div>
        )}

        {/* STEP 6 — OTHER */}
        {step === 5 && (
          <div>
            <label className="text-xs text-gray-500">Remarks</label>
            <textarea
              name="remarks"
              onChange={update}
              className="w-full mt-1 p-2 border rounded"
              rows={3}
            />
          </div>
        )}

        {/* ACTIONS */}
        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={back}
            disabled={step === 0}
            className="px-4 py-2 border rounded"
          >
            Back
          </button>

          {step === STEPS.length - 1 ? (
            <button className="px-4 py-2 bg-blue-600 text-white rounded">
              Submit Admission
            </button>
          ) : (
            <button
              type="button"
              onClick={next}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Next
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

/* ------------------ REUSABLE INPUTS ------------------ */

function Input({ label, ...props }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-gray-600">
        {label}
      </label>
      <input
        {...props}
        className="w-full h-11 px-3 rounded-lg border border-gray-200 bg-white
                   focus:outline-none focus:ring-2 focus:ring-blue-100
                   focus:border-blue-500 transition"
      />
    </div>
  );
}

function Select({ label, options, ...props }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-gray-600">
        {label}
      </label>
      <select
        {...props}
        className="w-full h-11 px-3 rounded-lg border border-gray-200 bg-white
                   focus:outline-none focus:ring-2 focus:ring-blue-100
                   focus:border-blue-500 transition"
      >
        <option value="">Select</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

