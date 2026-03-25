"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/utils/api";

import { SECTIONS } from "@/constants/sections";
import { BLOOD_GROUPS } from "@/constants/studentMeta";

export default function EditStudentPage() {
  const { id } = useParams();
  const router = useRouter();

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    studentName: "",
    admissionDate: "",
    class_id: "",
    section: "",
    dob: "",
    gender: "",
    blood_group: "",
    mobile: "",
    email: "",
    fatherName: "",
    motherName: "",
    parentMobile: "",
    address: "",
    city: "",
    status: "active",
    remarks: "",
  });

  // ================= FETCH CLASSES =================
  useEffect(() => {
    api.get("/classes").then((res) => {
      setClasses(res.data?.data || []);
    });
  }, []);

  // ================= FETCH STUDENT =================
  useEffect(() => {
    if (!id) return;

    const fetchStudent = async () => {
      try {
        const res = await api.get(`/students/${id}`);
        const s = res.data.data;

        setForm({
          studentName: `${s.first_name} ${s.last_name ?? ""}`,
          admissionDate: s.admission_date || "",
          class_id: s.class || "",
          section: s.section || "",
          dob: s.details?.dob || "",
          gender: s.details?.gender || "",
          blood_group: s.details?.blood_group || "",
          mobile: s.details?.phone || "",
          email: s.details?.email || "",
          fatherName: s.details?.father_name || "",
          motherName: s.details?.mother_name || "",
          parentMobile: s.details?.parent_phone || "",
          address: s.details?.address || "",
          city: s.details?.city || "",
        status: s.status || "active",   
          remarks: s.details?.medical_info || "",
        });

      } catch (e) {
        console.error("Failed to load student", e);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    try {
      const payload = {
        first_name: form.studentName.split(" ")[0],
        last_name: form.studentName.split(" ").slice(1).join(" ") || null,
        admission_date: form.admissionDate,
        class: form.class_id,
        section: form.section || null,
        status: form.status,
        details: {
          dob: form.dob,
          gender: form.gender?.toLowerCase(),
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

      await api.put(`/students/${id}`, payload);

      alert("Student updated successfully ✅");

      router.push("/admin/students");

    } catch (e) {
      console.error("Update failed", e);
      alert("Something went wrong ❌");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Edit Student</h2>

        <button
          onClick={() => router.back()}
          className="px-3 py-1 border rounded"
        >
          Back
        </button>
      </div>

      {/* FORM */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 grid grid-cols-3 gap-4">

        <div className="col-span-3 flex items-center gap-3 bg-gray-50 p-3 rounded-md">
        <input
            type="checkbox"
            checked={form.status === "inactive"}
            onChange={(e) =>
            setForm({
                ...form,
                status: e.target.checked ? "inactive" : "active",
            })
            }
        />

        <label className="text-sm font-medium">
            Mark as Inactive Student
        </label>
        </div>

        {/* NAME */}
        <div>
          <label className="soft-label">Student Name</label>
          <input
            className="soft-input"
            value={form.studentName}
            onChange={(e) =>
              setForm({ ...form, studentName: e.target.value })
            }
          />
        </div>

        {/* ADMISSION DATE */}
        <div>
          <label className="soft-label">Admission Date</label>
          <input
            type="date"
            className="soft-input"
            value={form.admissionDate}
            onChange={(e) =>
              setForm({ ...form, admissionDate: e.target.value })
            }
          />
        </div>

        {/* CLASS */}
        <div>
          <label className="soft-label">Class</label>
          <select
            className="soft-input"
            value={form.class_id}
            onChange={(e) =>
              setForm({ ...form, class_id: e.target.value })
            }
          >
            <option value="">Select</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* SECTION */}
        <div>
          <label className="soft-label">Section</label>
          <select
            className="soft-input"
            value={form.section}
            onChange={(e) =>
              setForm({ ...form, section: e.target.value })
            }
          >
            <option value="">Select</option>
            {SECTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* DOB */}
        <div>
          <label className="soft-label">DOB</label>
          <input
            type="date"
            className="soft-input"
            value={form.dob}
            onChange={(e) =>
              setForm({ ...form, dob: e.target.value })
            }
          />
        </div>

        {/* GENDER */}
        <div>
          <label className="soft-label">Gender</label>
          <select
            className="soft-input"
            value={form.gender}
            onChange={(e) =>
              setForm({ ...form, gender: e.target.value })
            }
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        {/* BLOOD GROUP */}
        <div>
          <label className="soft-label">Blood Group</label>
          <select
            className="soft-input"
            value={form.blood_group}
            onChange={(e) =>
              setForm({ ...form, blood_group: e.target.value })
            }
          >
            <option value="">Select</option>
            {BLOOD_GROUPS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        {/* MOBILE */}
        <div>
          <label className="soft-label">Mobile</label>
          <input
            className="soft-input"
            value={form.mobile}
            onChange={(e) =>
              setForm({ ...form, mobile: e.target.value })
            }
          />
        </div>

        {/* EMAIL */}
        <div>
          <label className="soft-label">Email</label>
          <input
            className="soft-input"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />
        </div>

        {/* FATHER */}
        <div>
          <label className="soft-label">Father Name</label>
          <input
            className="soft-input"
            value={form.fatherName}
            onChange={(e) =>
              setForm({ ...form, fatherName: e.target.value })
            }
          />
        </div>

        {/* MOTHER */}
        <div>
          <label className="soft-label">Mother Name</label>
          <input
            className="soft-input"
            value={form.motherName}
            onChange={(e) =>
              setForm({ ...form, motherName: e.target.value })
            }
          />
        </div>

        {/* PARENT MOBILE */}
        <div>
          <label className="soft-label">Parent Mobile</label>
          <input
            className="soft-input"
            value={form.parentMobile}
            onChange={(e) =>
              setForm({ ...form, parentMobile: e.target.value })
            }
          />
        </div>

        {/* ADDRESS */}
        <div className="col-span-3">
          <label className="soft-label">Address</label>
          <input
            className="soft-input"
            value={form.address}
            onChange={(e) =>
              setForm({ ...form, address: e.target.value })
            }
          />
        </div>

        {/* CITY */}
        <div>
          <label className="soft-label">City</label>
          <input
            className="soft-input"
            value={form.city}
            onChange={(e) =>
              setForm({ ...form, city: e.target.value })
            }
          />
        </div>

        {/* STATE */}
        <div>
          <label className="soft-label">State</label>
          <input
            className="soft-input"
            value={form.state}
            onChange={(e) =>
              setForm({ ...form, state: e.target.value })
            }
          />
        </div>

        {/* REMARKS */}
        <div className="col-span-3">
          <label className="soft-label">Remarks</label>
          <input
            className="soft-input"
            value={form.remarks}
            onChange={(e) =>
              setForm({ ...form, remarks: e.target.value })
            }
          />
        </div>

      </div>

      {/* ACTIONS */}
      <div className="flex justify-end gap-3">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 border rounded"
        >
          Cancel
        </button>

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          Save Changes
        </button>
      </div>

    </div>
  );
}