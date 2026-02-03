"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/utils/api";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecodaryButton";
import AlertModal from "@/components/ui/AlertModal";
import { useToast } from "@/components/ui/ToastProvider";

/* ================= VIEW FIELD ================= */
const ViewField = ({ label, value }) => (
  <div className="space-y-1">
    <div className="text-xs text-gray-500">{label}</div>
    <div className="text-sm font-medium text-gray-900">
      {value || "—"}
    </div>
  </div>
);

/* ================= NORMALIZE ================= */
const normalizeEnquiry = (data) => {
  const d = data.details || {};

  // 🔥 SORT FOLLOW UPS (LATEST FIRST)
  const sortedFollowUps = [...(data.follow_ups || [])].sort((a, b) => {
    const da = new Date(`${a.followup_date} ${a.followup_time || "00:00"}`);
    const db = new Date(`${b.followup_date} ${b.followup_time || "00:00"}`);
    return db - da; // DESC
  });

  const latestFollowUp = sortedFollowUps[0] || {};

  return {
    enquiry_code: data.enquiry_code,
    student_name: data.student_name,
    phone: data.phone,
    enquiry_date: data.enquiry_date,
    status: data.status,
    lead_temperature: data.lead_temperature,

    email: d.email,
    gender: d.gender,
    dob: d.dob?.slice(0, 10),
    state: d.state,
    city: d.city,
    area: d.area,
    pincode: d.pincode,

    current_address: d.current_address,
    residential_address: d.residential_address,

    nationality: d.nationality,
    birth_place: d.birth_place,
    mother_tongue: d.mother_tongue,
    category: d.category,
    religion: d.religion,
    blood_group: d.blood_group,
    aadhar_no: d.aadhar_no,

    parent_name: d.parent_name,
    parent_contact: d.parent_contact,
    parent_email: d.parent_email,
    parent_profession: d.parent_profession,
    parent_aadhar_no: d.parent_aadhar_no,
    guardian_name: d.guardian_name,

    // ✅ RIGHT PANEL = LATEST FOLLOW UP ONLY
    follow_up_type: latestFollowUp.follow_up_type || "—",
    followup_date: latestFollowUp.followup_date || "—",
    followup_time: latestFollowUp.followup_time || "—",
    comment: latestFollowUp.comment || "—",

    // ✅ HISTORY TAB = FULL LIST (DESC)
    follow_ups: sortedFollowUps,
custom_fields: data.custom_fields || [],

    custom_field_values: data.custom_field_values || [],
  };
};




export default function ViewEnquiryPage() {
  const { id } = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("summary");
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [converting, setConverting] = useState(false);



  const handleConvert = async () => {
    try {
      setConverting(true);

      const res = await api.post(
        `/enquiries/${id}/convert-to-student`
      );
      toast.success("Enquiry converted to admission");
      
      const studentId = res.data?.data?.student_id;

      // setShowAlert(false);

      if (studentId) {
        router.push(`/admin/students/${studentId}/view`);
      }
    } catch (e) {
      console.error(e);
      toast.error(e.response?.data?.message || "Failed to convert enquiry");
    } finally {
      setConverting(false);
    }
  };


  useEffect(() => {
    api
      .get(`/enquiries/${id}`)
      .then((res) => {
        setData(normalizeEnquiry(res.data?.data || {}));
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="text-sm text-gray-500">
        Loading enquiry details…
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-sm text-red-500">
        Failed to load enquiry
      </div>
    );
  }

  return (
    <>
  <div className="space-y-6">
    {/* ================= HEADER ================= */}
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-xl font-semibold">
          Enquiry: {data.enquiry_code} – {data.student_name}
        </h2>
      </div>

      <div className="flex gap-2">
        <SecondaryButton
          name="Convert to Admission"
          onClick={() => setShowAlert(true)}

        />
            
      <PrimaryButton
        name="Edit Enquiry"
        onClick={() =>
          router.push(`/admin/leads/enquiries/${id}/edit`)
        }
      />

      </div>
    </div>

    {/* ================= TABS ================= */}
    <div className="flex gap-6 border-b border-gray-200 text-sm">
      <button
        onClick={() => setActiveTab("summary")}
        className={`pb-2 font-medium ${
          activeTab === "summary"
            ? "text-blue-600 border-b-2 border-blue-600"
            : "text-gray-500"
        }`}
      >
        Summary
      </button>

      <button
        onClick={() => setActiveTab("history")}
        className={`pb-2 font-medium ${
          activeTab === "history"
            ? "text-blue-600 border-b-2 border-blue-600"
            : "text-gray-500"
        }`}
      >
        History
      </button>
    </div>

    {/* ================= MAIN GRID ================= */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

      {/* ================= LEFT SIDE ================= */}
      <div className="lg:col-span-2 space-y-6">

        {/* ===== SUMMARY TAB ===== */}
        {activeTab === "summary" && (
          <>
            {/* BASIC DETAILS */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h4 className="font-semibold text-sm mb-4">Basic Details</h4>

              <div className="grid grid-cols-3 gap-4">
                <ViewField label="Student Name" value={data.student_name} />
                <ViewField label="Phone" value={data.phone} />
                <ViewField label="Email" value={data.email} />

                <ViewField label="Gender" value={data.gender} />
                <ViewField label="Date of Birth" value={data.dob} />
                <ViewField label="Blood Group" value={data.blood_group} />

                <ViewField label="State" value={data.state} />
                <ViewField label="City" value={data.city} />
                <ViewField label="Area" value={data.area} />

                <ViewField label="Pin Code" value={data.pincode} />
              </div>
            </div>

            {/* ADDRESS */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h4 className="font-semibold text-sm mb-4">Address</h4>

              <div className="grid grid-cols-2 gap-4">
                <ViewField label="Current Address" value={data.current_address} />
                <ViewField
                  label="Residential Address"
                  value={data.residential_address}
                />
              </div>
            </div>

            {/* OTHER DETAILS */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h4 className="font-semibold text-sm mb-4">Other Details</h4>

              <div className="grid grid-cols-3 gap-4">
                <ViewField label="Nationality" value={data.nationality} />
                <ViewField label="Birth Place" value={data.birth_place} />
                <ViewField label="Mother Tongue" value={data.mother_tongue} />
                <ViewField label="Category" value={data.category} />
                <ViewField label="Religion" value={data.religion} />
                <ViewField label="Aadhar No" value={data.aadhar_no} />
              </div>
            </div>

            {/* PARENT DETAILS */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h4 className="font-semibold text-sm mb-4">
                Parent / Guardian Details
              </h4>

              <div className="grid grid-cols-3 gap-4">
                <ViewField label="Parent Name" value={data.parent_name} />
                <ViewField label="Parent Contact" value={data.parent_contact} />
                <ViewField label="Parent Email" value={data.parent_email} />
                <ViewField
                  label="Parent Profession"
                  value={data.parent_profession}
                />
                <ViewField
                  label="Parent Aadhar No"
                  value={data.parent_aadhar_no}
                />
                <ViewField label="Guardian Name" value={data.guardian_name} />
              </div>
            </div>

            {/* CUSTOM FIELDS */}
            {data.custom_fields.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <h4 className="font-semibold text-sm mb-4">Custom Fields</h4>

                <div className="grid grid-cols-3 gap-4">
                  {data.custom_fields.map((f) => (
                    <ViewField
                      key={f.field_id}
                      label={f.name}
                      value={f.value}
                    />
                  ))}
                </div>
              </div>
            )}

            {data.custom_field_values?.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <h4 className="font-semibold text-sm mb-4">
                  Custom Fields Detail
                </h4>

                <div className="grid grid-cols-3 gap-4">
                  {data.custom_field_values.map((cf) => (
                    <ViewField
                      key={cf.id}
                      label={cf.field?.name}
                      value={cf.value}
                    />
                  ))}
                </div>
              </div>
            )}


          </>
        )}

        {/* ===== HISTORY TAB ===== */}
        {activeTab === "history" && (
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <h4 className="font-semibold text-sm mb-3">Follow-up History</h4>

            {data.follow_ups.length === 0 ? (
              <div className="text-sm text-gray-500">
                No follow-ups added
              </div>
            ) : (
              <div className="space-y-3">
                {data.follow_ups.map((f, idx) => (
                  <div
                    key={f.id || idx}
                    className="border border-gray-200 rounded-lg p-3"
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
            )}
          </div>
        )}
      </div>

      {/* ================= RIGHT SIDE (ALWAYS VISIBLE) ================= */}
      <div className="space-y-4 bg-amber-50 border border-amber-200 p-4 rounded-xl h-fit sticky top-4">
        <h4 className="font-semibold text-sm">Enquiry Summary</h4>

        <div className="grid grid-cols-2 gap-3">
          <ViewField label="Enquiry Date" value={data.enquiry_date} />
          <ViewField label="Status" value={data.status} />
          <ViewField label="Priority" value={data.lead_temperature} />
          <ViewField label="Follow-up Type" value={data.follow_up_type} />
          <ViewField label="Follow-up Date" value={data.followup_date} />
          <ViewField label="Follow-up Time" value={data.followup_time} />
        </div>

        <ViewField label="Comment" value={data.comment} />
      </div>
    </div>
  </div>

  <AlertModal
    open={showAlert}
    type="danger"
    title="Convert to Admission?"
    message="Once this enquiry is converted to an admission,"
    subMessage="this action cannot be reversed."
    confirmText="Confirm & Convert"
    cancelText="Cancel"
    loading={converting}
    onClose={() => setShowAlert(false)}
    onConfirm={handleConvert}
  />


</>
);}

