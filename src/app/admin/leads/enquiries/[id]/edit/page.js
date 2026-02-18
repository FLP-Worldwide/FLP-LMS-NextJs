"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/utils/api";
import PrimaryButton from "@/components/ui/PrimaryButton";

/* ================= FIELD ================= */
const Field = ({ label, children }) => (
  <div className="space-y-1">
    <label className="text-xs text-gray-500">{label}</label>
    {children}
  </div>
);

/* ================= NORMALIZE ================= */
const normalizeEnquiry = (data) => {
  const d = data.details || {};

  const sortedFollowUps = [...(data.follow_ups || [])].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  const latest = sortedFollowUps[0] || {};

  return {
    // ===== MAIN =====
    enquiry_code: data.enquiry_code || "",
    student_name: data.student_name || "",
    phone: data.phone || "",
    enquiry_date: data.enquiry_date || "",
    status: data.status || "open",
    lead_temperature: data.lead_temperature || "Cold",

    referred_by: data.referred_by_id
      ? String(data.referred_by_id)
      : "",

    // ===== DETAILS =====
    email: d.email || "",
    gender: d.gender || "",
    dob: d.dob ? d.dob.slice(0, 10) : "",

    state: d.state || "",
    city: d.city || "",
    area: d.area || "",
    pincode: d.pincode || "",

    current_address: d.current_address || "",
    residential_address: d.residential_address || "",

    nationality: d.nationality || "",
    birth_place: d.birth_place || "",
    mother_tongue: d.mother_tongue || "",
    category: d.category || "",
    religion: d.religion || "",
    blood_group: d.blood_group || "",
    aadhar_no: d.aadhar_no || "",

    parent_name: d.parent_name || "",
    parent_contact: d.parent_contact || "",
    parent_email: d.parent_email || "",
    parent_profession: d.parent_profession || "",
    parent_aadhar_no: d.parent_aadhar_no || "",
    guardian_name: d.guardian_name || "",

    // ===== FOLLOW UP =====
    follow_up_type: latest.follow_up_type || "",
    followup_date: latest.followup_date || "",
    followup_hh: latest.followup_time?.split(":")[0] || "",
    followup_mm: latest.followup_time?.split(":")[1] || "",
    comment: latest.comment || "",

    follow_ups: sortedFollowUps,
  };
};




export default function EditEnquiryPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(normalizeEnquiry({}));

  const [customFieldValues, setCustomFieldValues] = useState([]);
const [customFields, setCustomFields] = useState([]);
const [referredBy, setReferredBy] = useState([]);

useEffect(() => {
  api.get("/lead-referredby").then(res => setReferredBy(res.data?.data || []));
}, []);

useEffect(() => {
  api.get("/custom-fields?module=enquiry").then(res => {
    const fields = res.data?.data || [];

    const normalized = fields.map(f => ({
      custom_field_id: f.id,
      field: f,          // 🔥 IMPORTANT
      value: "",         // empty initially
    }));

    setCustomFieldValues(normalized);
  });
}, []);


  /* ================= LOAD DATA ================= */
useEffect(() => {
  api.get(`/enquiries/${id}`).then(res => {
    const data = res.data?.data || {};
    setForm(normalizeEnquiry(data));

    const existing = data.custom_field_values || [];

    setCustomFieldValues(prev =>
      prev.map(cf => {
        const found = existing.find(
          v => v.custom_field_id === cf.custom_field_id
        );
        return {
          ...cf,
          value: found?.value || "",
        };
      })
    );
  }).finally(() => setLoading(false));
}, [id]);


  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const followup_time =
  form.followup_hh && form.followup_mm
    ? `${form.followup_hh}:${form.followup_mm}`
    : null;


  /* ================= UPDATE ================= */
const handleUpdate = async () => {
  try {
    const followup_time =
      form.followup_hh && form.followup_mm
        ? `${form.followup_hh}:${form.followup_mm}`
        : null;

    const payload = {
      // ================= MAIN ENQUIRY =================
      student_name: form.student_name,
      phone: form.phone,
      enquiry_date: form.enquiry_date,
      status: form.status,
      lead_temperature: form.lead_temperature,

      // ✅ IMPORTANT
      referred_by_id: form.referred_by
        ? Number(form.referred_by)
        : null,

      // ================= DETAILS =================
      details: {
        email: form.email,
        gender: form.gender,
        dob: form.dob,
        state: form.state,
        city: form.city,
        area: form.area,
        pincode: form.pincode,
        current_address: form.current_address,
        residential_address: form.residential_address,
        nationality: form.nationality,
        birth_place: form.birth_place,
        mother_tongue: form.mother_tongue,
        category: form.category,
        religion: form.religion,
        blood_group: form.blood_group,
        aadhar_no: form.aadhar_no,

        parent_name: form.parent_name,
        parent_contact: form.parent_contact,
        parent_email: form.parent_email,
        parent_profession: form.parent_profession,
        parent_aadhar_no: form.parent_aadhar_no,
        guardian_name: form.guardian_name,
      },

      // ================= FOLLOW UPS =================
      follow_ups: [
        {
          follow_up_type: form.follow_up_type || null,
          followup_date: form.followup_date || null,
          followup_time,
          comment: form.comment || null,
        },
      ],

      // ================= CUSTOM FIELDS =================
      custom_fields: customFieldValues.map(cf => ({
        custom_field_id: cf.custom_field_id,
        value: cf.value,
      })),
    };

    console.log("UPDATE PAYLOAD 👉", payload);

    await api.put(`/enquiries/${id}`, payload);
    router.push(`/admin/leads/enquiries/${id}/view`);
  } catch (e) {
    console.error(e);
    alert("Failed to update enquiry");
  }
};


  if (loading) {
    return <div className="text-sm text-gray-500">Loading…</div>;
  }
return (
  <div className="space-y-6 p-6">
    {/* ================= HEADER ================= */}
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-semibold">
        Edit Enquiry: {form.enquiry_code} – {form.student_name}
      </h2>

      <div className="flex gap-2">
        <PrimaryButton
          variant="outline"
          name="Cancel"
          onClick={() =>
            router.push(`/admin/leads/enquiries/${id}/view`)
          }
        />
        <PrimaryButton name="Save Changes" onClick={handleUpdate} />
      </div>
    </div>

    {/* ================= TABS ================= */}
    <div className="flex gap-6 border-b border-gray-200 text-sm">
      {["summary"].map(tab => (
        <button
          key={tab}
          
          className={`pb-2 font-medium `}
        >
          {tab === "summary" }
        </button>
      ))}
    </div>

    {/* ================= MAIN GRID ================= */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

      {/* ================= LEFT ================= */}
      <div className="lg:col-span-2 space-y-6">

        {/* ===== SUMMARY TAB ===== */}
       
          <>
            {/* BASIC DETAILS */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h4 className="font-semibold text-sm mb-4">Basic Details</h4>

              <div className="grid grid-cols-3 gap-4">
                <Field label="Student Name">
                  <input
                    className="soft-input"
                    name="student_name"
                    value={form.student_name}
                    onChange={handleChange}
                    placeholder="Enter student name"
                  />
                </Field>

                <Field label="Phone">
                  <input
                    className="soft-input"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                  />
                </Field>

                <Field label="Email">
                  <input
                    className="soft-input"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                  />
                </Field>

                <Field label="Gender">
                  <select
                    className="soft-input"
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </Field>

                <Field label="Date of Birth">
                  <input
                    type="date"
                    className="soft-input"
                    name="dob"
                    value={form.dob}
                    onChange={handleChange}
                    placeholder="Enter date of birth"
                  />
                </Field>

                <Field label="Blood Group">
                  <input
                    className="soft-input"
                    name="blood_group"
                    value={form.blood_group}
                    onChange={handleChange}
                    placeholder="Enter blood group"
                  />
                </Field>
              </div>
            </div>

            {/* ADDRESS */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
            <h4 className="font-semibold text-sm mb-4">Address</h4>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Current Address">
                <textarea
                  name="current_address"
                  value={form.current_address}
                  onChange={handleChange}
                  placeholder="Enter current address"
                  className="w-full min-h-[90px] rounded-md
                            border border-gray-200
                            px-3 py-2 text-sm
                            focus:outline-none
                            focus:ring-1 focus:ring-blue-500
                            focus:border-blue-500
                            resize-none"
                />
              </Field>

              <Field label="Residential Address">
                <textarea
                  name="residential_address"
                  value={form.residential_address}
                  onChange={handleChange}
                  placeholder="Enter residential address"
                  className="w-full min-h-[90px] rounded-md
                            border border-gray-200
                            px-3 py-2 text-sm
                            focus:outline-none
                            focus:ring-1 focus:ring-blue-500
                            focus:border-blue-500
                            resize-none"
                />
              </Field>
            </div>
          </div>


            {/* OTHER DETAILS */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h4 className="font-semibold text-sm mb-4">Other Details</h4>

              <div className="grid grid-cols-3 gap-4">
                <Field label="Nationality">
                  <input
                    className="soft-input"
                    name="nationality"
                    value={form.nationality}
                    onChange={handleChange}
                    placeholder="Enter nationality"
                  />
                </Field>

                <Field label="Birth Place">
                  <input
                    className="soft-input"
                    name="birth_place"
                    value={form.birth_place}
                    onChange={handleChange}
                    placeholder="Enter birth place"
                  />
                </Field>

                <Field label="Mother Tongue">
                  <input
                    className="soft-input"
                    name="mother_tongue"
                    value={form.mother_tongue}
                    onChange={handleChange}
                    placeholder="Enter mother tongue"
                  />
                </Field>

                <Field label="Category">
                  <input
                    className="soft-input"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    placeholder="Enter category"
                  />
                </Field>

                <Field label="Religion">
                  <input
                    className="soft-input"
                    name="religion"
                    value={form.religion}
                    onChange={handleChange}
                    placeholder="Enter religion"
                  />
                </Field>

                <Field label="Aadhar No">
                  <input
                    className="soft-input"
                    name="aadhar_no"
                    value={form.aadhar_no}
                    onChange={handleChange}
                    placeholder="Enter Aadhar number"
                  />
                </Field>
              </div>
            </div>

            {/* CUSTOM FIELDS */}
            {/* EXTRA DETAILS (CUSTOM FIELDS) */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h4 className="font-semibold text-sm mb-4">
            Custom Fields Detail
          </h4>

          <div className="grid grid-cols-3 gap-4">
            {customFieldValues.map((cf, index) => (
              <Field key={cf.custom_field_id} label={cf.field?.name}>
                <input
                  className="soft-input"
                  value={cf.value}
                  maxLength={cf.field?.max_length || undefined}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCustomFieldValues(prev => {
                      const copy = [...prev];
                      copy[index] = { ...copy[index], value };
                      return copy;
                    });
                  }}
                />
              </Field>
            ))}
          </div>
        </div>

          </>


      </div>

      {/* ================= RIGHT SIDE ================= */}
      <div className="space-y-3 bg-amber-50 border border-gray-200 p-4 rounded-xl h-fit sticky top-4">
        <h4 className="font-semibold text-sm">Enquiry Details</h4>

        <div className="grid grid-cols-2 gap-2">
          <Field label="Enquiry Date">
            <input
              type="date"
              className="soft-input soft-input-sm"
              value={form.enquiry_date}
              onChange={handleChange}
              name="enquiry_date"
            />
          </Field>

          <Field label="Status">
            <select
              className="soft-select soft-input-sm"
              value={form.status}
              name="status"
              onChange={handleChange}
            >
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="on-hold">On Hold</option>
            </select>
          </Field>

          <Field label="Enquiry Priority">
            <select
              className="soft-select soft-input-sm"
              value={form.lead_temperature}
              name="lead_temperature"
              onChange={handleChange}
            >
              <option>Cold</option>
              <option>Warm</option>
              <option>Hot</option>
            </select>
          </Field>

          <Field label="Follow-up Type">
            <select
              className="soft-select soft-input-sm"
              value={form.follow_up_type}
              name="follow_up_type"
              onChange={handleChange}
            >
              <option>Call</option>
              <option>SMS</option>
              <option>Demo Class</option>
              <option>Visit</option>
              <option>Walk-in</option>
            </select>
          </Field>

          <Field label="Follow-up Date">
            <input
              type="date"
              className="soft-input soft-input-sm"
              value={form.followup_date}
              name="followup_date"
              onChange={handleChange}
            />
          </Field>

          <div className="grid grid-cols-2 gap-2">
            <Field label="HH">
              <select
                className="soft-select soft-input-sm"
                value={form.followup_hh}
                name="followup_hh"
                onChange={handleChange}
              >
                <option>HH</option>
                <option>08</option>
                <option>09</option>
                <option>10</option>
                <option>11</option>
                <option>12</option>
                <option>01</option>
                <option>02</option>
                <option>03</option>
                <option>04</option>
                <option>05</option>
                <option>06</option>
                <option>07</option>
              </select>
            </Field>

            <Field label="MM">
              <select
                className="soft-select soft-input-sm"
                value={form.followup_mm}
                name="followup_mm"
                onChange={handleChange}
              >
                <option>MM</option>
                <option>00</option>
              </select>
            </Field>
          </div>
        </div>

        <Field label="Referred By">
          <select
            className="soft-select soft-input-sm"
            name="referred_by"
            value={form.referred_by}
            onChange={handleChange}
          >
            <option value="">Select</option>
            {referredBy.map(item => (
             <option key={item.id} value={String(item.id)}>

                {item.name}
                {item.phone ? ` (${item.phone})` : ""}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Comment">
          <textarea
            className="w-full min-h-[90px] rounded-md
                      border border-gray-200
                      px-3 py-2 text-sm
                      focus:outline-none
                      focus:ring-1 focus:ring-blue-500
                      resize-none"
            value={form.comment}
            onChange={handleChange}
            name="comment"
          />
        </Field>

        {/* ================= FOLLOW-UP HISTORY ================= */}
          {form.follow_ups?.length > 0 && (
            <div className="mt-4 bg-white border border-gray-200 rounded-xl p-3">
              <h4 className="font-semibold text-sm mb-3">
                Follow-up History
              </h4>

              <div className="space-y-2 max-h-[260px] overflow-y-auto">
                {form.follow_ups.map((f, idx) => (
                  <div
                    key={f.id || idx}
                    className="border border-gray-200 rounded-lg p-2"
                  >
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>
                        {f.followup_date || "—"}
                        {f.followup_time && ` • ${f.followup_time}`}
                      </span>
                      <span className="capitalize">
                        {f.follow_up_type || "Follow-up"}
                      </span>
                    </div>

                    <div className="text-sm text-gray-700">
                      {f.comment || "No comment"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

      </div>

    </div>
  </div>
);

}
