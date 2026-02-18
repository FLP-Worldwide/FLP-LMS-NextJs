import Card from "@/components/admin/students/common/Card";

export default function ProfileTab({ student }) {
  const s = student || {}; 
  const d = student.details || {};
  const cls = student.class || {};

  const Row = ({ label, value }) => (
    <div className="flex-1 gap-2 text-sm">
      <div className="w-56 text-gray-500">{label} :</div>
      <div className="font-medium">{value ?? "--"}</div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* ================= BASIC STUDENT INFO ================= */}
      <Card title="Basic Student Information">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">

          <Row label="Admission No" value={s.admission_no} />
          <Row label="Roll No" value={s.roll_no} />
          <Row label="Status" value={s.status} />
          <Row label="Admission Date" value={s.admission_date} />
          <Row label="Class" value={cls.name} />
          <Row label="Class Code" value={cls.class_code} />
        </div>
      </Card>

      {/* ================= PERSONAL DETAILS ================= */}
      <Card title="Personal Details">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <Row label="Gender" value={d.gender} />
          <Row label="Date of Birth" value={d.dob} />
          <Row label="Blood Group" value={d.blood_group} />
          <Row label="Medical Info" value={d.medical_info} />
        </div>
      </Card>

      {/* ================= CONTACT DETAILS ================= */}
      <Card title="Contact Details">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <Row label="Email" value={d.email} />
          <Row label="Phone" value={d.phone} />
          <Row label="Parent Phone" value={d.parent_phone} />
        </div>
      </Card>

      {/* ================= ADDRESS DETAILS ================= */}
        <Card title="Address Details">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">

            <Row label="Residential Address" value={d.address} />
            <Row label="Current Address" value={d.address} />

            <Row label="Country" value={d.country || "India"} />
            <Row label="State" value={d.state} />

            <Row label="City" value={d.city} />
            <Row label="Area" value="--" />

            <Row label="Pin Code" value="--" />
            <Row label="Comment" value="--" />

        </div>
        </Card>

      {/* ================= PARENT DETAILS ================= */}
     <Card title="Parent Details">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-4 gap-x-10">

            {/* PARENT */}
            <div className="space-y-2 p-6">
            <Row label="Parent Name" value={d.father_name} />
            <Row label="Parent Email" value="--" />
            <Row label="Parent Profession" value="--" />
            </div>

            <div className="space-y-2 p-6">
            <Row label="Parent Contact No." value={d.parent_phone} />
            <Row label="Parent Aadhar No." value="--" />
            </div>

            <div className="col-span-full border-t border-gray-200 pt-3" />

            {/* MOTHER */}
            <div className="space-y-2 p-6">
            <Row label="Mother Name" value={d.mother_name} />
            <Row label="Mother Email" value="--" />
            </div>

            <div className="space-y-2 p-6">
            <Row label="Mother Contact No." value="--" />
            </div>

            <div className="col-span-full border-t border-gray-200 pt-3" />

            {/* GUARDIAN */}
            <div className="space-y-2 p-6">
            <Row label="Guardian Name" value="--" />
            <Row label="Guardian Email" value="--" />
            </div>

            <div className="space-y-2 p-6">
            <Row label="Guardian Contact No." value="--" />
            </div>

        </div>
        </Card>


    </div>
  );
}
