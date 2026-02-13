"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/utils/api";
import MultiSelectDropdown from "@/components/ui/MultiSelectDropdown";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecodaryButton";

export default function EditStaffPage() {
  const { id } = useParams(); // user_id
  const router = useRouter();

  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    role_id: "",
    role: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    department: "",
    class_room_ids: [],
    subject_ids: [],
  });

  /* ================= LOAD META ================= */
  useEffect(() => {
    loadMeta();
    loadStaff();
  }, []);

  const loadMeta = async () => {
    const [c, s, r] = await Promise.all([
      api.get("/classes"),
      api.get("/subjects"),
      api.get("/settings/roles"),
    ]);

    setClasses(c.data?.data || []);
    setSubjects(s.data?.data || []);
    setRoles(r.data?.data?.filter(r => r.is_active) || []);
  };

  /* ================= LOAD STAFF ================= */
  const loadStaff = async () => {
    try {
      const res = await api.get(`/staff/${id}`);
      const data = res.data?.data;

      setForm({
        role_id: data.role_id,
        role: data.role,
        first_name: data.first_name,
        last_name: data.last_name || "",
        email: data.email,
        phone: data.phone,
        department: data.department || "",
        class_room_ids: data.class_room_ids || [],
        subject_ids: data.subject_ids || [],
      });
    } finally {
      setLoading(false);
    }
  };

  /* ================= UPDATE ================= */
  const updateStaff = async () => {
    if (!form.email || !form.phone) {
        alert("Email and Phone are required");
        return;
    }

    const basePayload = {
        first_name: form.first_name,
        last_name: form.last_name || null,
        email: form.email,
        phone: form.phone,
        department: form.department || null,
    };

    let payload;

    // 🔹 If Teacher → send full mapping
    if (form.role === "teacher") {
        payload = {
        ...basePayload,
        role_id: Number(form.role_id),
        class_room_ids: form.class_room_ids || [],
        subject_ids: form.subject_ids || [],
        };
    } 
    // 🔹 If Non-Teacher → DO NOT send role_id or mapping
    else {
        payload = basePayload;
    }

    try {
        await api.put(`/staff/${id}`, payload);
        alert("Staff updated successfully");
        router.push("/admin/staff");
    } catch (e) {
        console.error(e);
        alert("Update failed");
    }
    };


  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Edit Staff</h2>

      <div className="bg-white p-6 rounded-xl border border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* ROLE */}
        <div>
          <label className="text-sm text-gray-600">
            Role <span className="text-red-500">*</span>
          </label>
         <select
            className="soft-select"
            value={form.role_id}
            disabled={true}
            onChange={e => {
                const selected = roles.find(
                r => r.id === Number(e.target.value)
                );

                setForm(prev => ({
                ...prev,
                role_id: e.target.value,
                role: selected?.slug || "",
                class_room_ids: [],
                subject_ids: [],
                }));
            }}
            >

            <option value="">Select Role</option>
            {roles.map(r => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        {/* FIRST NAME */}
        <div>
          <label className="text-sm text-gray-600">First Name</label>
          <input
            className="soft-input"
            value={form.first_name}
            onChange={e =>
              setForm({ ...form, first_name: e.target.value })
            }
          />
        </div>

        {/* LAST NAME */}
        <div>
          <label className="text-sm text-gray-600">Last Name</label>
          <input
            className="soft-input"
            value={form.last_name}
            onChange={e =>
              setForm({ ...form, last_name: e.target.value })
            }
          />
        </div>

        {/* EMAIL */}
        <div>
          <label className="text-sm text-gray-600">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            className="soft-input"
            value={form.email}
            onChange={e =>
              setForm({ ...form, email: e.target.value })
            }
          />
        </div>

        {/* PHONE */}
        <div>
          <label className="text-sm text-gray-600">
            Phone <span className="text-red-500">*</span>
          </label>
          <input
            className="soft-input"
            value={form.phone}
            onChange={e =>
              setForm({ ...form, phone: e.target.value })
            }
          />
        </div>

        {/* DEPARTMENT */}
        <div>
          <label className="text-sm text-gray-600">
            Department
          </label>
          <input
            className="soft-input"
            value={form.department}
            onChange={e =>
              setForm({ ...form, department: e.target.value })
            }
          />
        </div>

        {/* ONLY FOR TEACHER */}
        {form.role === "teacher" && (
          <>
            <div>
              <label className="text-sm text-gray-600">
                Assign Standards
              </label>
              <MultiSelectDropdown
                options={classes}
                value={form.class_room_ids}
                onChange={vals =>
                  setForm(prev => ({
                    ...prev,
                    class_room_ids: vals,
                  }))
                }
                placeholder="Select Standard"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">
                Assign Subjects
              </label>
              <MultiSelectDropdown
                options={subjects}
                value={form.subject_ids}
                onChange={vals =>
                  setForm(prev => ({
                    ...prev,
                    subject_ids: vals,
                  }))
                }
                placeholder="Select Subject"
              />
            </div>
          </>
        )}
      </div>

      <div className="flex justify-end gap-3">
        <SecondaryButton  onClick={() => router.push("/admin/staff")} name={`Cancel`} />

        <PrimaryButton onClick={updateStaff} name={`Update Staff`} />
      </div>
    </div>
  );
}
