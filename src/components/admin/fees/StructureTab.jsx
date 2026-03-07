"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/utils/api";
import Modal from "@/components/ui/Modal";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecodaryButton";
import MultiSelectDropdown from "@/components/ui/MultiSelectDropdown";

/* ================= CONSTANTS ================= */

const ASSIGN_DATE_OPTIONS = [
  { label: "Trigger Date", value: "TRIGGER" },
  { label: "Batch Assign Date (BAD)", value: "BAD" },
  { label: "No of days after BAD", value: "DAYS_AFTER_BAD" },
  { label: "No of Month after BAD", value: "MONTH_AFTER_BAD" },
];

export default function ClassFeeStructurePage() {

  const [feeTypes,setFeeTypes] = useState([]);
  const [selectedFeeId,setSelectedFeeId] = useState(null);

  const [classes,setClasses] = useState([]);
  const [courses,setCourses] = useState([]);

  const [selectedCourseId,setSelectedCourseId] = useState("");
  const [selectedBatchIds,setSelectedBatchIds] = useState([]);

  const [showClassModal,setShowClassModal] = useState(false);
  const [showInstallmentModal,setShowInstallmentModal] = useState(false);

  const [activeStructure,setActiveStructure] = useState(null);

  const [classForm,setClassForm] = useState({
    class_id:"",
    amount:""
  });

  const [structureInstallments,setStructureInstallments] = useState([]);
  const [loadingInstallments,setLoadingInstallments] = useState(false);

  const [feeStructureName,setFeeStructureName] = useState("");

  const [installments,setInstallments] = useState([
    { fee_type_id:null, assign_type:"TRIGGER", offset:0, amount:0 }
  ]);

  const selectedFee = feeTypes.find(f => f.id === selectedFeeId);

  /* ================= FETCH ================= */

  useEffect(()=>{
    fetchFeeTypes();
    fetchClasses();
  },[]);

  useEffect(()=>{
    if(selectedFeeId) fetchStructures(selectedFeeId);
  },[selectedFeeId]);

  const fetchFeeTypes = async ()=>{
    const res = await api.get("/fees/types");

    const list = res.data?.data || [];

    setFeeTypes(list);
    setSelectedFeeId(list[0]?.id || null);
  };

  const fetchStructures = async (feeTypeId)=>{
    const res = await api.get(`/fees/structures/${feeTypeId}`);

    setFeeTypes(prev =>
      prev.map(f =>
        f.id === feeTypeId
          ? { ...f, structures: res.data.data }
          : f
      )
    );
  };

  const fetchClasses = async ()=>{
    const res = await api.get("/classes");
    setClasses(res.data?.data || []);
  };

  const fetchCourses = async (classId)=>{
    if(!classId) return;

    const res = await api.get(`/courses?standard_id=${classId}`);

    const list = res.data?.data || [];

    const coursesWithBatches = await Promise.all(
      list.map(async (course)=>{
        try{
          const batchRes = await api.get(`/batches?course_id=${course.id}`);

          return {
            ...course,
            batches: batchRes.data?.data || []
          };
        }catch{
          return { ...course, batches:[] };
        }
      })
    );

    setCourses(coursesWithBatches);
  };

  const fetchStructureInstallments = async (classId)=>{
    if(!classId) return;

    setLoadingInstallments(true);

    try{

      const res = await api.get("/fees/structure/installments",{
        params:{
          class_id:classId,
          fees_type_id:selectedFeeId
        }
      });

      setStructureInstallments(res.data?.data || []);

    }catch{
      setStructureInstallments([]);
    }
    finally{
      setLoadingInstallments(false);
    }
  };

  /* ================= INSTALLMENT HELPERS ================= */

  const addInstallmentRow = ()=>{
    setInstallments(p=>[
      ...p,
      { fee_type_id:null, assign_type:"TRIGGER", offset:0, amount:0 }
    ]);
  };

  const removeInstallmentRow = (index)=>{
    setInstallments(p=>p.filter((_,i)=>i !== index));
  };

  const updateInstallment = (index,key,value)=>{
    setInstallments(p=>{
      const copy = [...p];
      copy[index][key] = value;
      return copy;
    });
  };

  const totalAmount = installments.reduce(
    (sum,i)=> sum + Number(i.amount || 0),
    0
  );

  const batchOptions =
    courses.find(c=>c.id === Number(selectedCourseId))?.batches || [];

  /* ================= SAVE ================= */

  const saveInstallments = async ()=>{

    const payload = {

      fees_type_id:selectedFeeId,
      class_id:activeStructure.class_id,
      fee_structure_name:feeStructureName,

      course_id:Number(selectedCourseId),
      batch_ids:selectedBatchIds,

      total_amount:totalAmount,

      installments:installments.map(i=>({

        id:i.id || null,
        fee_type_id:i.fee_type_id,
        assign_type:i.assign_type,
        offset:Number(i.offset),
        amount:Number(i.amount)

      }))
    };

    await api.post("/fees/structure/installments",payload);

    setShowInstallmentModal(false);

    fetchStructures(selectedFeeId);
    fetchStructureInstallments(activeStructure.class_id);
  };

  /* ================= ADD CLASS ================= */

  const addClassStructure = async ()=>{

    await api.post("/fees/structures",{
      fees_type_id:selectedFeeId,
      class_id:classForm.class_id,
      amount:classForm.amount
    });

    fetchStructures(selectedFeeId);

    setClassForm({
      class_id:"",
      amount:""
    });

    setShowClassModal(false);
  };

  /* ================= UI ================= */

  return (

<div className="space-y-4 px-6 py-2">

{/* ================= FEES TYPES ================= */}

<div className="bg-white rounded-xl border border-gray-200">

<div className="px-4 py-3 border-b border-gray-200">

<h2 className="text-sm font-semibold">
Fees Type
</h2>

</div>

<div className="p-3 flex flex-wrap gap-2">

{feeTypes.map(f=>(
<button
key={f.id}
onClick={()=>setSelectedFeeId(f.id)}
className={`px-3 py-1 rounded-md border text-xs
${selectedFeeId === f.id
? "bg-blue-50 border-blue-300"
: "border-gray-200 hover:bg-gray-50"}`}
>
{f.name}
</button>
))}

</div>

</div>


{/* ================= CLASS STRUCTURES ================= */}

{selectedFee && (

<div className="bg-white rounded-xl border border-gray-200">

<div className="px-4 py-3 flex justify-between border-b border-gray-200">

<div>

<h2 className="text-sm font-semibold">
{selectedFee.name}
</h2>

<p className="text-xs text-gray-500">
Class-wise fee structure
</p>

</div>

<PrimaryButton
name="+ Add Class"
onClick={()=>setShowClassModal(true)}
/>

</div>

<div className="p-3 space-y-3">

{selectedFee.structures?.map(s=>(
<div
key={s.id}
className="border border-gray-200 rounded-lg p-3 flex justify-between"
>

<div>

<div className="text-sm font-semibold">
{s.class?.name}
</div>

<div className="text-xs text-gray-500">
Total ₹{s.amount}
</div>

</div>

<div className="flex gap-2">

<SecondaryButton
name="View"
onClick={()=>{
setActiveStructure(s);
fetchStructureInstallments(s.class_id);
}}
/>

<PrimaryButton
  name="Add / Edit Installment"
  onClick={async () => {

    setActiveStructure(s);

    await fetchStructureInstallments(s.class_id);

    fetchCourses(s.class_id);

    const existing = structureInstallments.find(
      si => si.class_id === s.class_id
    );

    if (existing) {

      setFeeStructureName(existing.fee_structure_name || "");
      setSelectedCourseId(existing.course_id || "");
      setSelectedBatchIds(existing.batches?.map(b => b.id) || []);

      setInstallments(
        existing.installments.map(inst => ({
          id: inst.id,
          fee_type_id: inst.fee_type_id,
          assign_type: inst.assign_type,
          offset: inst.offset,
          amount: inst.amount
        }))
      );

    }

    setShowInstallmentModal(true);

  }}
/>

</div>

</div>
))}

</div>

</div>
)}
{showClassModal && (
  <Modal
    title="Add Class Fees"
    onClose={() => setShowClassModal(false)}
  >
    <div>
      <label className="text-xs font-medium">
        Class<span className="text-red-500">*</span>
      </label>

      <select
        className="soft-select mt-1"
        value={classForm.class_id}
        onChange={(e) =>
          setClassForm({ ...classForm, class_id: e.target.value })
        }
      >
        <option value="">Select Class</option>

        {classes.map((cls) => (
          <option key={cls.id} value={cls.id}>
            {cls.name}
          </option>
        ))}
      </select>
    </div>

    <div className="mt-4">
      <label className="text-xs font-medium">
        Total Amount<span className="text-red-500">*</span>
      </label>

      <input
        type="number"
        className="soft-input mt-1"
        placeholder="Enter total fees"
        value={classForm.amount}
        onChange={(e) =>
          setClassForm({ ...classForm, amount: e.target.value })
        }
      />
    </div>

    <div className="flex justify-end gap-3 mt-6">
      <SecondaryButton
        name="Cancel"
        onClick={() => setShowClassModal(false)}
      />

      <PrimaryButton
        name="Save"
        onClick={addClassStructure}
      />
    </div>
  </Modal>
)}


{activeStructure && (
  <div className="mt-4 bg-white rounded-xl border border-gray-200">

    <div className="px-4 py-3 border-b border-gray-200">
      <h3 className="text-sm font-semibold">
        Existing Installments – {activeStructure.class?.name}
      </h3>
    </div>

    {loadingInstallments ? (
      <div className="p-4 text-xs text-gray-500">
        Loading...
      </div>
    ) : structureInstallments.length === 0 ? (
      <div className="p-4 text-xs text-gray-500 text-center">
        No installments added yet
      </div>
    ) : (

      <table className="w-full text-xs border-collapse">

        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-3 py-2 text-left">#</th>
            <th className="px-3 py-2 text-left">Fee Type</th>
            <th className="px-3 py-2 text-left">Assign Date</th>
            <th className="px-3 py-2 text-left">Offset</th>
            <th className="px-3 py-2 text-left">Amount</th>
            <th className="px-3 py-2 text-left">Batches</th>
          </tr>
        </thead>

        <tbody className="divide-y">

          {structureInstallments.map((structure, sIndex) =>
            structure.installments.map((inst, iIndex) => (

              <tr key={`${structure.id}-${inst.id}`}>

                <td className="px-3 py-2">
                  {sIndex + 1}.{iIndex + 1}
                </td>

                <td className="px-3 py-2">
                  {
                    feeTypes.find(f => f.id === inst.fee_type_id)?.name || "—"
                  }
                </td>

                <td className="px-3 py-2">
                  {inst.assign_type}
                </td>

                <td className="px-3 py-2">
                  {inst.offset}
                </td>

                <td className="px-3 py-2">
                  ₹{inst.amount}
                </td>

                <td className="px-3 py-2">
                  {structure.batches.map(b => b.name).join(", ")}
                </td>

              </tr>

            ))
          )}

        </tbody>

      </table>

    )}

  </div>
)}


{showInstallmentModal && (
  <Modal
    title="Add Fee Structure"
    onClose={() => setShowInstallmentModal(false)}
    rightSlot={
      <div className="bg-blue-50 px-3 py-1 rounded-md text-sm font-medium">
        Total Amount: {totalAmount}
      </div>
    }
  >
    {/* TOP FORM */}
    <div className="grid grid-cols-3 gap-4 mb-4">

      <div>
        <label className="text-xs font-medium">
          Fee Structure Name<span className="text-red-500">*</span>
        </label>

        <input
          className="soft-input mt-1"
          placeholder="Please Enter Fee Structure"
          value={feeStructureName}
          onChange={(e)=>setFeeStructureName(e.target.value)}
        />
      </div>

      <div>
        <label className="text-xs font-medium">
          Category / Course<span className="text-red-500">*</span>
        </label>

        <select
          className="soft-select mt-1"
          value={selectedCourseId}
          onChange={(e)=>setSelectedCourseId(e.target.value)}
        >
          <option value="">Select Course</option>

          {courses.map(course => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs font-medium">
          Batch(es)<span className="text-red-500">*</span>
        </label>

        <MultiSelectDropdown
          options={batchOptions}
          value={selectedBatchIds}
          onChange={setSelectedBatchIds}
          placeholder="Select"
        />
      </div>

    </div>


    {/* TABLE HEADER */}

    <div className="grid grid-cols-12 bg-gray-50 px-3 py-2 text-xs font-medium border border-gray-200">
      <div className="col-span-1">#</div>
      <div className="col-span-3">Fee Type</div>
      <div className="col-span-3">Assign Date</div>
      <div className="col-span-2">Day/Month</div>
      <div className="col-span-2">Total Fees</div>
      <div className="col-span-1"></div>
    </div>


    {/* ROWS */}

    {installments.map((row,i)=>(
      <div
        key={i}
        className="grid grid-cols-12 gap-2 px-3 py-2 items-center border border-t-0 border-gray-200"
      >

        <div className="col-span-1 text-xs">
          {i+1}
        </div>

        <div className="col-span-3">
          <select
            className="soft-select"
            value={row.fee_type_id || ""}
            onChange={(e)=>
              updateInstallment(i,"fee_type_id",Number(e.target.value))
            }
          >
            <option value="">Select Fee Type</option>

            {feeTypes.map(f=>(
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-span-3">
          <select
            className="soft-select"
            value={row.assign_type}
            onChange={(e)=>
              updateInstallment(i,"assign_type",e.target.value)
            }
          >
            {ASSIGN_DATE_OPTIONS.map(o=>(
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div className="col-span-2">
          <input
            type="number"
            className="soft-input"
            value={row.offset}
            onChange={(e)=>
              updateInstallment(i,"offset",e.target.value)
            }
          />
        </div>

        <div className="col-span-2">
          <input
            type="number"
            className="soft-input"
            value={row.amount}
            onChange={(e)=>
              updateInstallment(i,"amount",e.target.value)
            }
          />
        </div>

        <div className="col-span-1">
          {installments.length > 1 && (
            <button
              onClick={()=>removeInstallmentRow(i)}
              className="text-red-500 text-lg"
            >
              −
            </button>
          )}
        </div>

      </div>
    ))}


    {/* ADD ROW */}

    <div className="flex justify-end mt-4">
      <button
        onClick={addInstallmentRow}
        className="soft-btn-outline text-blue-600"
      >
        + Add Installments
      </button>
    </div>


    {/* FOOTER */}

    <div className="flex justify-end gap-3 mt-6">

      <button
        onClick={()=>setShowInstallmentModal(false)}
        className="soft-btn-outline"
      >
        Cancel
      </button>

      <PrimaryButton
        name="Save"
        onClick={saveInstallments}
      />

    </div>

  </Modal>
)}
</div>
  );
}