"use client";

import { useState } from "react";
import { UploadOutlined, DownloadOutlined } from "@ant-design/icons";
import { api } from "@/utils/api";
import PrimaryButton from "@/components/ui/PrimaryButton";
import MultiSelectDropdown from "@/components/ui/MultiSelectDropdown";
import { useEffect } from "react";

export default function StudentBulkUpdate() {

const [file, setFile] = useState(null);
const [openModal, setOpenModal] = useState(false);

const [mode, setMode] = useState("without_batch");

const [selectedCourses, setSelectedCourses] = useState([]);
const [selectedBatches, setSelectedBatches] = useState([]);

const [courses, setCourses] = useState([]);
const [batches, setBatches] = useState([]);

useEffect(() => {
  fetchInitial();
}, []);

const fetchInitial = async () => {
  try {
    const res = await api.get("/courses");

    setCourses(res.data?.data || []);
  } catch (err) {
    console.log(err);
  }
};
const fetchBatches = async (courseIds) => {

  if (!courseIds.length) {
    setBatches([]);
    return;
  }

  try {

    const ids = courseIds.join(",");

    const res = await api.get(`/batches?course_ids=${ids}`);

    setBatches(res.data?.data || []);

  } catch (err) {
    console.log(err);
  }

};

useEffect(() => {

  if (selectedCourses.length) {
    fetchBatches(selectedCourses);
  } else {
    setBatches([]);
  }

}, [selectedCourses]);

const downloadQuickTemplate = async () => {

    const payload = {
        fields: selectedFields
    };

    // WITHOUT BATCH
    if (mode === "without_batch") {
        payload.without_batch = true;
    }

    // WITH BATCH
    if (mode === "with_batch") {
        payload.course_ids = selectedCourses;
        payload.batch_ids = selectedBatches;
    }

    console.log("FINAL PAYLOAD →", payload);

    try {

        const response = await api.post(
        "/reports/students/export-update-template",
        payload,
        { responseType: "blob" }
        );

        const url = window.URL.createObjectURL(new Blob([response.data]));

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "students-template.xlsx");

        document.body.appendChild(link);
        link.click();

        link.remove();
        window.URL.revokeObjectURL(url);

        setOpenModal(false);

    } catch (err) {
        console.error(err);
    }

};

  const [selectedFields, setSelectedFields] = useState([
    "Student Name",
    "Student Phone"
    ]);

    const toggleField = (field) => {

    if (selectedFields.includes(field)) {
        setSelectedFields(selectedFields.filter(f => f !== field));
    } else {
        setSelectedFields([...selectedFields, field]);
    }

    };

  const fieldsList = [
    "Student Name",
    "Student Phone",
    "Student Email",
    "Gender",
    "Date of Birth",
    "Nationality",
    "Birth Place",
    "Mother Tongue",
    "Category",
    "Religion",
    "Blood Group",
    "Student Aadhar No",
    "Educational Group",
    "Parent Name",
    "Parent Phone",
    "Parent Email",
    "Parent Aadhar No",
    "Parent Profession",
    "Mother Name",
    "Mother Contact",
    "Mother Email",
    "Guardian Name",
    "Guardian Contact",
    "Guardian Email",
    "State",
    "City",
    "Area",
    "Pin Code",
    "Student Current Address",
    "Student Residential Address",
    "Remarks",
    "Institute/School Name",
    "Batch",
    "Date of Admission",
    "Batch Joining Date",
    "Standard",
    "Extra Curricular Activities"
    ];

  /* ================= FILE SELECT ================= */

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  /* ================= UPLOAD ================= */

  const uploadStudents = async () => {

    if (!file) return alert("Please choose file");

    const formData = new FormData();
    formData.append("file", file);

    try {

      await api.post("/reports/students/import-update", formData);

      alert("Students Uploaded Successfully");

    } catch (err) {
      console.error(err);
    }
  };

const openTemplateModal = () => {

    if (mode === "with_batch" && selectedBatches.length === 0) {
    alert("Please select batch");
    return;
    }

    setOpenModal(true);

};

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">

        <h1 className="text-xl font-semibold text-gray-700">
          Update Student
        </h1>

        <PrimaryButton
            onClick={openTemplateModal}

            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md"
            name="Download Template"
        />

      </div>

      <div className="flex gap-6 mb-6">

        <label className="flex items-center gap-2 cursor-pointer">

        <input
        type="radio"
        checked={mode === "without_batch"}
        onChange={() => setMode("without_batch")}
        />

        Student Without Batches

        </label>


        <label className="flex items-center gap-2 cursor-pointer">

        <input
        type="radio"
        checked={mode === "with_batch"}
        onChange={() => setMode("with_batch")}
        />

        Student With Batches

        </label>

    </div>
    {mode === "with_batch" && (

        <div className="grid grid-cols-2 gap-4 mb-6">

        <div>

        <label className="text-sm">
            Category/Course *
        </label>

        <MultiSelectDropdown
            options={courses}
            value={selectedCourses}
            onChange={setSelectedCourses}
            placeholder="Select Category/Course"
        />

        </div>

        <div>

        <label className="text-sm">
            Batch *
        </label>

        <MultiSelectDropdown
            options={batches}
            value={selectedBatches}
            onChange={setSelectedBatches}
            placeholder="Select batch"
        />

        </div>

        </div>

    )}

      {/* MAIN GRID */}

      <div className="grid grid-cols-2 gap-6">

        {/* LEFT UPLOAD BOX */}

        <div className="bg-white border border-gray-200 rounded-lg p-6">

          <h2 className="text-gray-600 mb-4 font-medium">
            Select a file to upload
          </h2>

          <div className="border-2 border-dashed border-gray-200 rounded-lg p-10 text-center">

            <UploadOutlined className="text-4xl text-gray-400 mb-4" />

            <p className="text-gray-500 mb-4">
              Upload Template
            </p>

            <p className="text-gray-400 mb-4">Or</p>

            <div className="flex justify-center gap-3">

              <label className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">
                Choose
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              <button
                onClick={uploadStudents}
                className="bg-blue-300 text-white px-4 py-2 rounded"
              >
                Upload
              </button>

            </div>

          </div>

        </div>

        {/* RIGHT NOTE PANEL */}

        <div className="bg-white border border-gray-200 rounded-lg p-6 h-[420px] overflow-y-auto">

          <h2 className="font-semibold text-gray-700 mb-4">
            Note :
          </h2>

          <p className="font-semibold mb-2">
            Student Update Instructions
          </p>

          <ol className="text-sm text-gray-600 space-y-2 list-decimal pl-4">

            <li>
              Select the fields for Update of students by clicking on Download Template.
            </li>

            <li>
              At one time, the user can upload 1000 records of students.
            </li>

            <li>
              For Coaching - Student Name and Student Phone are the mandatory fields.
            </li>

            <li>
              For School - Student Name, Student Phone, Standard ID and Registration Number are mandatory fields.
            </li>

            <li>
              If biometric feature is enabled, institute can upload biometric IDs during bulk upload.
            </li>

            <li>
              Joining Date / Birth Date must be formatted as MM/DD/YYYY.
            </li>

            <li>
              Email format must be abc@xyz.com.
            </li>

            <li>
              Phone number must contain exactly 10 digits (India).
            </li>

            <li>
              Aadhaar format: 3829-4948-9393.
            </li>

            <li>
              Gender must contain M/F/NA/O.
            </li>

          </ol>

        </div>

      </div>

      {/* NOTE BAR */}

      <div className="mt-6 bg-yellow-50 border border-gray-200 text-sm px-4 py-2 rounded">
        Note : At one time, the user can upload 1000 records of students
      </div>

      {/* REPORT TABLE */}

      <div className="mt-6 bg-white border border-gray-200 rounded-lg p-6">

        <h2 className="font-semibold text-gray-700 mb-4">
          Student Update Report
        </h2>

        <table className="w-full text-sm">

          <thead className="bg-gray-100">

            <tr>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Total Count</th>
              <th className="p-2 text-left">Success Count</th>
              <th className="p-2 text-left">Failure Count</th>
            </tr>

          </thead>

          <tbody>

            <tr className="border-t border-gray-200">
              <td className="p-2">--</td>
              <td className="p-2">--</td>
              <td className="p-2">--</td>
              <td className="p-2">--</td>
              <td className="p-2">--</td>
            </tr>

          </tbody>

        </table>

      </div>


        {openModal && (

        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">

        <div className="bg-white w-[900px] rounded-lg shadow-lg">

            {/* HEADER */}

            <div className="flex justify-between items-center p-4 border-b">

            <h2 className="font-semibold text-lg">
                Select Fields for Student Update
            </h2>

            <button onClick={() => setOpenModal(false)}>✕</button>

            </div>


            {/* BODY */}

            <div className="p-6 grid grid-cols-4 gap-4 max-h-[400px] overflow-y-auto">

            {fieldsList.map((field) => (

                <label
                key={field}
                className="flex items-center gap-2 text-sm"
                >

                <input
                    type="checkbox"
                    checked={selectedFields.includes(field)}
                    onChange={() => toggleField(field)}
                />

                {field}

                </label>

            ))}

            </div>


            {/* FOOTER */}

            <div className="flex justify-end gap-3 p-4 border-t">

            <button
                onClick={() => setOpenModal(false)}
                className="px-4 py-2 border rounded"
            >
                Cancel
            </button>

            <button
                onClick={downloadQuickTemplate}
                className="px-4 py-2 bg-blue-500 text-white rounded"
            >
                Download
            </button>

            </div>

        </div>

        </div>

        )}

    </div>
  );
}