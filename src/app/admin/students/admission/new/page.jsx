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

  const [documents, setDocuments] = useState({
    aadhaar: null,
    document: null,
    document_other: null,
  });

const handleFileChange = (e) => {
    const { name, files } = e.target;
    setDocuments((prev) => ({
      ...prev,
      [name]: files[0],
    }));
  };

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
    try {
      setLoading(true);

      const formData = new FormData();

      // Student basic
      formData.append("first_name", form.studentName.split(" ")[0]);
      formData.append(
        "last_name",
        form.studentName.split(" ").slice(1).join(" ") || ""
      );
      formData.append("admission_date", form.admissionDate);
      formData.append("class", form.class_id);
      formData.append("section", form.section || "");
      formData.append("status", "active");

      // Details
      formData.append("dob", form.dob);
      formData.append("gender", form.gender.toLowerCase());
      formData.append("blood_group", form.blood_group);
      formData.append("phone", form.mobile);
      formData.append("email", form.email);
      formData.append("father_name", form.fatherName);
      formData.append("mother_name", form.motherName);
      formData.append("parent_phone", form.parentMobile);
      formData.append("address", form.address);
      formData.append("city", form.city);
      formData.append("state", form.state);
      formData.append("medical_info", form.remarks || "");

      // Documents
      if (documents.aadhaar) {
        formData.append("aadhaar", documents.aadhaar);
      }

      if (documents.document) {
        formData.append("document", documents.document);
      }

      if (documents.document_other) {
        formData.append("document_other", documents.document_other);
      }

    await api.post("/students", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });


      alert("Admission created successfully");
      router.push("/admin/students");
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
            <Input label="Student Name" name="studentName" onChange={update} placeholder="Enter student name" value={form.studentName} />
            <Input label="Mobile No" name="mobile" onChange={update} placeholder="Enter mobile number" value={form.mobile} />
            <Input label="Email" name="email" onChange={update} placeholder="Enter email address" value={form.email} />

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
              value={form.section}
              onChange={update}
            />

            <Input type="date" label="Date of Birth" name="dob" onChange={update} placeholder="Enter date of birth" value={form.dob} />

            <Select
              label="Gender"
              name="gender"
              value={form.gender}
              options={[
                { value: "Male", label: "Male" },
                { value: "Female", label: "Female" },
              ]}
              onChange={update}
            />

            <Select
              label="Blood Group"
              name="blood_group"
              value={form.blood_group}
              options={BLOOD_GROUPS.map((b) => ({ value: b, label: b }))}
              onChange={update}
            />
          </div>
        )}

        {/* STEP 2 */}
        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Father Name" name="fatherName" onChange={update} placeholder="Enter father name" value={form.fatherName} />
            <Input label="Mother Name" name="motherName" onChange={update} placeholder="Enter mother name" value={form.motherName} />
            <Input label="Parent Mobile" name="parentMobile" onChange={update} placeholder="Enter parent mobile number" value={form.parentMobile} />
            <Input label="Parent Email" name="parentEmail" onChange={update} placeholder="Enter parent email address" value={form.parentEmail} />
            <Input label="Profession" name="profession" onChange={update} placeholder="Enter profession" value={form.profession} />
          </div>
        )}

        {/* STEP 3 */}
        {step === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Address" name="address" onChange={update} placeholder="Enter address" value={form.address} />
            <Input label="City" name="city" onChange={update} placeholder="Enter city" value={form.city} />
            <Input label="State" name="state" onChange={update} placeholder="Enter state" value={form.state} />
            <Input label="Pincode" name="pincode" onChange={update} placeholder="Enter pincode" value={form.pincode} />
          </div>
        )}

        {/* STEP 4 */}
       {step === 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FileUpload
            label="Aadhaar Card"
            name="aadhaar"
           
            onChange={handleFileChange}
          />
          <FileUpload
            label="Document"
            name="document"
            
            onChange={handleFileChange}
          />
          <FileUpload
            label="Extra Document"
            name="document_other"
           
            onChange={handleFileChange}
          />
        </div>

        
      )}


        {/* STEP 5 */}
        {step === 4 && (
          <Input type="date" label="Admission Date" name="admissionDate" onChange={update} placeholder="Enter admission date" value={form.admissionDate} />
        )}

        {/* STEP 6 */}
        {step === 5 && (
          <textarea
            name="remarks"
            onChange={update}
            className="w-full px-2 py-2 text-sm border rounded"
            rows={3}
            value={form.remarks}
            placeholder="Enter any remarks or medical information"
          />
        )}

        {/* ACTIONS */}
        <div className="flex justify-between pt-4">
          <button type="button" onClick={back} disabled={step === 0} className="bg-gray-100 px-4 py-1  text-sm rounded-lg border border-gray-300 hover:bg-gray-200">
            Back
          </button>

          {step === STEPS.length - 1 ? (
            <button
              type="button"
              disabled={loading}
              onClick={submitAdmission}
              className="bg-blue-800 px-4 py-1 text-white text-sm rounded-lg border border-blue-900 hover:bg-blue-900"
            >
              {loading ? "Saving..." : "Submit Admission"}
            </button>
          ) : (
            <button type="button" onClick={next} className="bg-blue-800 px-4 py-1 text-white text-sm rounded-lg border border-blue-900 hover:bg-blue-900">
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

function FileUpload({ label, ...props }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-gray-600">
        {label}
      </label>
      <input
        type="file"
        {...props}
        className="w-full px-2 py-2 text-sm rounded-lg border border-gray-300 bg-white
                   focus:outline-none focus:ring-2 focus:ring-blue-100
                   focus:border-blue-500 transition cursor-pointer"
      />
    </div>
  );
}

