"use client";

import { useEffect, useState } from "react";
import EnquiryModal from "@/components/ui/EnquiryModal";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { api } from "@/utils/api";
import { STATES } from "@/constants/locations";
import {
  MOTHER_TONGUES,
  CATEGORIES,
  RELIGIONS,
  BLOOD_GROUPS,PARENT_PROFESSIONS
} from "@/constants/studentMeta";


const Field = ({ label, children }) => (
  <div className="space-y-1">
    <label className="soft-label text-xs">{label}</label>
    {children}
  </div>
);


export default function AddEnquiryModal({ onClose }) {
  const [loading, setLoading] = useState(false);



  /* ================= FORM STATE ================= */
  const [form, setForm] = useState({
    source: "",
    student_name: "",
    phone: "",
    email: "",
    gender: "",
    dob: "",
    state: "Rajasthan",
    city: "",
    area: "",
    pincode: "",

    current_address: "",
    residential_address: "",
    same_address: false,

    alternate_contact: "",
    alternate_email: "",
    nationality: "",
    birth_place: "",
    mother_tongue: "",
    category: "",
    religion: "",
    blood_group: "",
    aadhar_no: "",

    parent_name: "",
    parent_contact: "",
    parent_email: "",
    parent_profession: "",
    parent_aadhar_no: "",
    guardian_name: "",

    enquiry_date: "",
    status: "Open",
    lead_temperature: "Cold",
    follow_up_type: "",
    followup_date: "",
    followup_hh: "",
    followup_mm: "",

    referred_by: "",


    comment: "",
  });

  /* ================= FILE STATE ================= */
  const [files, setFiles] = useState({
    student_photo: null,
    aadhar_card: null,
    previous_school_id: null,
  });

    const selectedState = STATES.find(
    s => s.name === form.state
    );

    const cities = selectedState?.districts || [];

  /* ================= DROPDOWNS ================= */
  const [sources, setSources] = useState([]);
  const [areas, setAreas] = useState([]);
  const [referredBy, setReferredBy] = useState([]);

  /* ================= LOAD MASTER DATA ================= */
  useEffect(() => {
    api.get("/lead-setup").then(res => setSources(res.data?.data || []));
    api.get("/lead-referredby").then(res => setReferredBy(res.data?.data || []));
  }, []);

  /* ================= LOAD AREA ================= */
 useEffect(() => {
  if (!form.state || !form.city) return;

  api.get("/areas", {
    params: {
      state: form.state,
      city: form.city,
      is_active: 1,
    },
  }).then(res => {
    setAreas(res.data?.data || res.data || []);
  });
}, [form.state, form.city]);


  /* ================= HANDLERS ================= */
  const handleChange = e => {
    const { name, value, type, checked } = e.target;

    if (name === "same_address") {
      setForm(prev => ({
        ...prev,
        same_address: checked,
        residential_address: checked ? prev.current_address : "",
      }));
      return;
    }

    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFile = e => {
    setFiles(prev => ({ ...prev, [e.target.name]: e.target.files[0] }));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const fd = new FormData();

      Object.entries(form).forEach(([key, val]) => {
        fd.append(key, val ?? "");
      });

      Object.entries(files).forEach(([key, file]) => {
        if (file) fd.append(key, file);
      });

      await api.post("/enquiries", fd);
      onClose();
    } catch (e) {
      console.error(e);
      alert("Failed to save enquiry");
    } finally {
      setLoading(false);
    }
  };


  return (
    <EnquiryModal title="Add Enquiry" onClose={onClose}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 ">

        {/* LEFT – BASIC DETAILS */}
        <div className="lg:col-span-2 space-y-4">
          <h4 className="font-semibold text-sm">Basic Details</h4>

          <div className="grid grid-cols-3 gap-3">
            <Field label="Source">
            <select
                className="soft-select soft-input-sm"
                name="source"
                value={form.source}
                onChange={handleChange}
            >
                <option value="">Select Source</option>

                {sources.map(item => (
                <option key={item.id} value={item.id}>
                    {item.name}
                </option>
                ))}
            </select>
            </Field>


            <Field label="Student Name">
            <input 
              className="soft-input soft-input-sm" 
              placeholder="Student Name" 
              name="student_name"
              value={form.student_name}
                onChange={handleChange} />
            </Field>

            <Field label="Phone Number">
              <input className="soft-input soft-input-sm" 
              placeholder="Phone"
              name="phone"
               onChange={handleChange} 
              value={form.phone}
              />
            </Field>

            <Field label="Email ID">
              <input className="soft-input soft-input-sm" placeholder="Email"
              name="email"
              onChange={handleChange}
              value={form.email}
            />
            </Field>

            <Field label="Gender">
              <select className="soft-select soft-input-sm" 
              onChange={handleChange}
              name="gender"
              >
                <option>Select Gender</option>
                <option value={`male`}>Male</option>
                <option value={`female`}>Female</option>
              </select>
            </Field>

            <Field label="Date of Birth">
              <input type="date" className="soft-input soft-input-sm"
              value={form.dob}
              name="dob"
            onChange={handleChange}
            />
            </Field>

            <Field label="State">
            <select
                className="soft-select soft-input-sm"
                name="state"
                value={form.state}
                onChange={e => {
                setForm(prev => ({
                    ...prev,
                    state: e.target.value,
                    city: "",
                    area: "",
                }));
                }}
            >
                <option value="">Select State</option>
                {STATES.map(state => (
                <option key={state.name} value={state.name}>
                    {state.name}
                </option>
                ))}
            </select>
            </Field>

            <Field label="City">
            <select
                className="soft-select soft-input-sm"
                name="city"
                value={form.city}
                onChange={e =>
                setForm(prev => ({
                    ...prev,
                    city: e.target.value,
                    area: "",
                }))
                }
                disabled={!form.state}
            >
                <option value="">Select City</option>
                {cities.map(city => (
                <option key={city} value={city}>
                    {city}
                </option>
                ))}
            </select>
            </Field>



          <Field label="Area">
            <select
                className="soft-select soft-input-sm"
                name="area"
                value={form.area}
                onChange={handleChange}
                disabled={!areas.length}
            >
                <option value="">Select Area</option>

                {areas.map(item => (
                <option key={item.id} value={item.area}>
                    {item.area}
                </option>
                ))}
            </select>
        </Field>


            <Field label="Pin Code">
              <input className="soft-input soft-input-sm" placeholder="Pin Code"
              name="pincode"
              value={form.pincode}
               onChange={handleChange}
            />
            </Field>
          </div>

          {/* ADDRESS */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Current Address">
              <textarea className="soft-input soft-textarea-sm" placeholder="Current Address"
              value={form.current_address}
               onChange={handleChange}
               name="current_address"
            />
            </Field>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="soft-label text-xs">Residential Address</label>
                <label className="flex items-center gap-1 text-[11px] text-gray-500">
                  <input type="checkbox" className="accent-blue-700" />
                  Same as current
                </label>
              </div>
              <textarea className="soft-input soft-textarea-sm"  placeholder="Residential Address"
              value={form.residential_address}
              name="residential_address"
               onChange={handleChange}
            />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Field label="Alternate Contact">
              <input className="soft-input soft-input-sm" placeholder="Alternate Contact"
              value={form.alternate_contact}
              name="alternate_contact"
               onChange={handleChange}
            />
            </Field>

            <Field label="Alternate Email">
              <input className="soft-input soft-input-sm" placeholder="Alternate Email" 
              value={form.alternate_email}
              name="alternate_email"
               onChange={handleChange}
            />
            </Field>

            <Field label="Nationality">
              <input className="soft-input soft-input-sm" placeholder="Nationality" value={`Indian`}
               onChange={handleChange}
               name="nationality"
            />
            </Field>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Field label="Birth Place">
              <input className="soft-input soft-input-sm" placeholder="Birth Place"
              value={form.birth_place}
               onChange={handleChange}
               name="birth_place"
            />
            </Field>

           <Field label="Mother Tongue">
            <select
                className="soft-select soft-input-sm"
                name="mother_tongue"
                value={form.mother_tongue}
                onChange={handleChange}
            >
                <option value="">Select Mother Tongue</option>

                {MOTHER_TONGUES.map(item => (
                <option key={item} value={item}>
                    {item}
                </option>
                ))}
            </select>
            </Field>

            <Field label="Category">
            <select
                className="soft-select soft-input-sm"
                name="category"
                value={form.category}
                onChange={handleChange}
            >
                <option value="">Select Category</option>

                {CATEGORIES.map(item => (
                <option key={item} value={item}>
                    {item}
                </option>
                ))}
            </select>
            </Field>

          </div>

          <div className="grid grid-cols-3 gap-3">
            <Field label="Religion">
            <select
                className="soft-select soft-input-sm"
                name="religion"
                value={form.religion}
                onChange={handleChange}
            >
                <option value="">Select Religion</option>

                {RELIGIONS.map(item => (
                <option key={item} value={item}>
                    {item}
                </option>
                ))}
            </select>
            </Field>


            <Field label="Blood Group">
            <select
                className="soft-select soft-input-sm"
                name="blood_group"
                value={form.blood_group}
                onChange={handleChange}
            >
                <option value="">Select Blood Group</option>

                {BLOOD_GROUPS.map(item => (
                <option key={item} value={item}>
                    {item}
                </option>
                ))}
            </select>
            </Field>


            <Field label="Aadhar No">
              <input className="soft-input soft-input-sm" placeholder="Aadhar No" 
              value={form.aadhar_no}
               onChange={handleChange}
               name="aadhar_no"
              />
            </Field>
          </div>

          {/* PARENT DETAILS */}
          <h4 className="font-semibold text-sm pt-3">Parent Details</h4>

          <div className="grid grid-cols-3 gap-3">
            <Field label="Parent Name">
              <input className="soft-input soft-input-sm"  placeholder="Parent Name" 
              value={form.parent_name}
               onChange={handleChange}
               name="parent_name"
              />
            </Field>

            <Field label="Parent Contact">
              <input className="soft-input soft-input-sm" placeholder="Parent Contact" 
              value={form.parent_contact}
               onChange={handleChange}
               name="parent_contact"
              />
            </Field>

            <Field label="Parent Email">
              <input className="soft-input soft-input-sm" placeholder="Parent Email"
              value={form.parent_email}
               onChange={handleChange}
               name="parent_email"
              />
            </Field>

            <Field label="Parent Profession">
            <select
                className="soft-select soft-input-sm"
                name="parent_profession"
                value={form.parent_profession}
                onChange={handleChange}
            >
                <option value="">Select Profession</option>

                {PARENT_PROFESSIONS.map(item => (
                <option key={item} value={item}>
                    {item}
                </option>
                ))}
            </select>
            </Field>


            <Field label="Parent Aadhar No">
              <input className="soft-input soft-input-sm" placeholder="Parent Aadhar No" 
              value={form.parent_aadhar_no}
               onChange={handleChange}
               name="parent_aadhar_no"
              />
            </Field>

            <Field label="Guardian Name">
              <input className="soft-input soft-input-sm" placeholder="Guardian Name" 
              value={form.guardian_name}
              name="guardian_name"
               onChange={handleChange}
              />
            </Field>
          </div>

          {/* DOCUMENTS */}
          <h4 className="font-semibold text-sm pt-3">Documents</h4>

          <div className="grid grid-cols-3 gap-3">
            <Field label="Student Photo">
              <input type="file" className="soft-input soft-input-sm" placeholder="Student Photo" 
              value={form.student_photo}
               onChange={handleChange}
               name="student_photo"
              />
            </Field>

            <Field label="Aadhar Card">
              <input type="file" className="soft-input soft-input-sm" placeholder="Aadhar Card" />
            </Field>

            <Field label="Previous School ID">
              <input type="file" className="soft-input soft-input-sm" placeholder="Previous School ID" />
            </Field>
          </div>
        </div>

        {/* RIGHT – ENQUIRY DETAILS */}
        <div className="space-y-3 bg-amber-50 p-4 rounded-xl ">
          <h4 className="font-semibold text-sm">Enquiry Details</h4>

            <div className="grid grid-cols-2 gap-2">
          <Field label="Enquiry Date">
            <input type="date" className="soft-input soft-input-sm" 
            value={form.enquiry_date}
               onChange={handleChange}
               name="enquiry_date"
            />
          </Field>

          <Field label="Status">
            <select className="soft-select soft-input-sm"
            value={form.status}
            name="status"
               onChange={handleChange}
            >
              <option value={`open`}>Open</option>
              <option value={`closed`}>Closed</option>
              <option value={`on-hold`}>On Hold</option>
            </select>
          </Field>

          <Field label="Enquiry Priority">
            <select className="soft-select soft-input-sm"
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
            <select className="soft-select soft-input-sm"
            value={form.follow_up_type}
               onChange={handleChange}
               name="follow_up_type"
            >
              <option>Call</option>
              <option>SMS</option>
              <option>Demo Class</option>
              <option>Visit</option>
              <option>Walk-in</option>
            </select>
          </Field>

          <Field label="Follow-up Date">
            <input type="date" className="soft-input soft-input-sm"
            value={form.followup_date}
               onChange={handleChange}
               name="followup_date"
            />
          </Field>

            <div className="grid grid-cols-2 gap-2">
            <Field label="HH">
              <select className="soft-select soft-input-sm"
              value={form.followup_hh}
               onChange={handleChange}
               name="followup_hh"
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
              <select className="soft-select soft-input-sm"
              value={form.followup_mm}
               onChange={handleChange}
               name="followup_mm"
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
                <option key={item.id} value={item.id}>
                    {item.name}
                    {item.phone ? ` (${item.phone})` : ""}
                </option>
                ))}
            </select>
            </Field>


          <Field label="Comment">
            <textarea className="soft-input soft-textarea-sm" placeholder="Comment"
            value={form.comment}
               onChange={handleChange}
               name="comment"
            />
          </Field>
        </div>
      </div>

      {/* FOOTER */}
      <div className="flex justify-end gap-2 pt-4">
        <PrimaryButton variant="outline" name="Cancel" onClick={onClose} />
        <PrimaryButton name="Save Enquiry" onClick={handleSubmit} />
      </div>
    </EnquiryModal>
  );
}
