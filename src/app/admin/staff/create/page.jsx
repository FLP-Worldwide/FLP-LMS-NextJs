"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/utils/api";
import MultiSelectDropdown from "@/components/ui/MultiSelectDropdown";

export default function CreateStaffPage() {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
const [roles, setRoles] = useState([]);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    role_id: "",
    altPhone: "",
    email: "",
    joiningDate: "",
    dob: "",
    department: "",
    designation: "",
   standards: [],   // ✅ MUST exist
  subjects: [], 
    address: "",
    documentTitle: "",
  });

  /* ================= FETCH DROPDOWNS ================= */
  useEffect(() => {
    async function loadMeta() {
      const [c, s] = await Promise.all([
        api.get("/classes"),
        api.get("/subjects"),
      ]);
      setClasses(c.data?.data || []);
      setSubjects(s.data?.data || []);
    }
    loadMeta();
  }, []);

  useEffect(() => {
    api.get("/settings/roles").then(res => {
      if (res.data?.status === "success") {
        setRoles(res.data.data.filter(r => r.is_active));
      }
    });
  }, []);


  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= SAVE ================= */
  const saveStaff = async () => {
    if (!form.name || !form.phone) {
      alert("Teacher name and phone are required");
      return;
    }

    const [first_name, ...last] = form.name.trim().split(" ");
    const last_name = last.join(" ");

    const payload = {
      first_name,
      last_name: last_name || null,
      role_id: Number(form.role_id),
      phone: form.phone,
      email: form.email || null,
      department: form.department || null,
      designation: form.designation || null,
      joining_date: form.joiningDate || null,
      dob: form.dob || null,
      address: form.address || null,

      // mapping
      class_room_ids: form.standards,
      subject_ids: form.subjects,

    };

    try {
     await api.post("/staff/create", payload);

      alert("Teacher saved successfully");

      // reset form
      setForm({
        name: "",
        phone: "",
        role_id: "",
        altPhone: "",
        email: "",
        joiningDate: "",
        dob: "",
        department: "",
        designation: "",
        standard: [],
        subject: [],
        address: "",
        documentTitle: "",
      });
    } catch (e) {
      console.error(e);
      alert("Failed to save teacher");
    }
  };
const toggleMulti = (field, value) => {
  setForm(prev => ({
    ...prev,
    [field]: prev[field].includes(value)
      ? prev[field].filter(v => v !== value)
      : [...prev[field], value],
  }));
};
const handleMultiSelect = (e) => {
  const { name, options } = e.target;

  const values = Array.from(options)
    .filter(o => o.selected)
    .map(o => Number(o.value));

  setForm(prev => ({
    ...prev,
    [name]: values,
  }));
};

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h2 className="text-xl font-semibold">Staff Details</h2>
        <p className="text-sm text-gray-500">
          Add Staff personal and professional information
        </p>
      </div>

      {/* TEACHER DETAILS */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Teacher Name */}

            <div>
              <label className="text-sm text-gray-600">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                name="role_id"
                value={form.role_id}
                onChange={handleChange}
                className="soft-select"
              >
                <option value="">Select Role</option>
                {roles.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>



          <div>
            <label className="text-sm text-gray-600">
              Staff Name <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter Staff Name"
              className="soft-input"
            />
          </div>

          {/* Contact Number */}
          <div>
            <label className="text-sm text-gray-600">
              Contact Number <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
                <select className=" border border-gray-200  w-24 h-[35px]">
                    <option>IN +91</option>
                </select>

                <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Enter Contact Number"
                    className="soft-input flex-1"
                />
                </div>

          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-gray-600">Email ID</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter Email ID"
              className="soft-input"
            />
          </div>

          {/* Date of Joining */}
          <div>
            <label className="text-sm text-gray-600">Date of Joining</label>
            <input
              type="date"
              name="joiningDate"
              value={form.joiningDate}
              onChange={handleChange}
              className="soft-input"
            />
          </div>

          {/* Department */}
          <div>
            <label className="text-sm text-gray-600">Department</label>
            <input
              name="department"
              value={form.department}
              onChange={handleChange}
              className="soft-input"
            />
          </div>

          {/* Designation */}
          <div>
            <label className="text-sm text-gray-600">Designation</label>
            <input
              name="designation"
              value={form.designation}
              onChange={handleChange}
              className="soft-input"
            />
          </div>

          {/* DOB */}
          <div>
            <label className="text-sm text-gray-600">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={form.dob}
              onChange={handleChange}
              className="soft-input"
            />
          </div>

          {/* Alternate Contact */}
          <div>
            <label className="text-sm text-gray-600">
              Alternate Contact Number
            </label>
            <div className="flex gap-2">
              <select className=" w-24 border border-gray-200 h-[35px]">
                <option>IN +91</option>
              </select>
              <input
                name="altPhone"
                value={form.altPhone}
                onChange={handleChange}
                placeholder="Enter Phone Number"
                className="soft-input flex-1"
              />
            </div>
          </div>

          {/* Standard */}
            <div>
                <label className="text-sm text-gray-600 mb-1 block">
                    Select Standard
                </label>
                <MultiSelectDropdown
                    options={classes}
                    value={form.standards}
                    onChange={vals =>
                        setForm(prev => ({ ...prev, standards: vals }))
                    }
                    placeholder="Select Standard"
                />
            </div>



          {/* Subject */}
           <div>
            <label className="text-sm text-gray-600 mb-1 block">
                Select Subject
            </label>

            <MultiSelectDropdown
                options={subjects}
                value={form.subjects}
                onChange={vals =>
                setForm(prev => ({ ...prev, subjects: vals }))
                }
                placeholder="Select Subject"
                height="42px"
            />
            </div>





          {/* Address */}
          <div className="md:col-span-2">
            <label className="text-sm text-gray-600">Current Address</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Enter Current Address"
              className="soft-input min-h-[90px]"
            />
          </div>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end gap-3">
        <button className="px-4 py-2 rounded-md border border-gray-200">
          Cancel
        </button>
        <button
          onClick={saveStaff}
          className="px-4 py-2 rounded-md bg-blue-600 text-white"
        >
          Save Staff
        </button>
      </div>
    </div>
  );
}
