"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/utils/api";
import Modal from "@/components/ui/Modal";
import PrimaryButton from "@/components/ui/PrimaryButton";
import MultiSelectDropdown from "@/components/ui/MultiSelectDropdown";
import { Pencil, Trash } from "lucide-react";

/* ================= CONSTANTS ================= */

const ASSIGN_DATE_OPTIONS = [
  { label: "Trigger Date", value: "TRIGGER" },
  { label: "Batch Assign Date (BAD)", value: "BAD" },
  { label: "No of days after BAD", value: "DAYS_AFTER_BAD" },
  { label: "No of Month after BAD", value: "MONTH_AFTER_BAD" },
];

export default function FeeStructurePage() {

  const [structures,setStructures] = useState([]);
  const [courses,setCourses] = useState([]);
  const [feeTypes,setFeeTypes] = useState([]);

  const [showModal,setShowModal] = useState(false);

  const [feeStructureName,setFeeStructureName] = useState("");
  const [selectedCourseId,setSelectedCourseId] = useState("");
  const [selectedBatchIds,setSelectedBatchIds] = useState([]);

  const [installments,setInstallments] = useState([
    { fee_type_id:"", assign_type:"TRIGGER", offset:0, amount:0 }
  ]);

  const [editingStructure,setEditingStructure] = useState(null);

  /* ================= FETCH ================= */

  useEffect(()=>{
    fetchStructures();
    fetchCourses();
    fetchFeeTypes();
  },[]);

  const fetchStructures = async ()=>{
    const res = await api.get("/fees/structures");
    setStructures(res.data?.data || []);
  };

  const fetchCourses = async ()=>{
    const res = await api.get("/courses-with-batches");
    setCourses(res.data?.data || []);
  };

  const fetchFeeTypes = async ()=>{
    const res = await api.get("/fees/types");
    setFeeTypes(res.data?.data || []);
  };

  /* ================= HELPERS ================= */

  const batchOptions =
    courses.find(c=>c.id === Number(selectedCourseId))?.batches || [];

  const totalAmount = installments.reduce(
    (sum,i)=> sum + Number(i.amount || 0),
    0
  );

  const addInstallmentRow = ()=>{
    setInstallments(p=>[
      ...p,
      { fee_type_id:"", assign_type:"TRIGGER", offset:0, amount:0 }
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

  /* ================= SAVE ================= */

  const saveStructure = async ()=>{

    const payload = {

      name:feeStructureName,

      course_id:Number(selectedCourseId),
      batch_ids:selectedBatchIds,

      total_amount:totalAmount,

      installments:installments.map(i=>({
        fee_type_id:Number(i.fee_type_id),
        assign_type:i.assign_type,
        offset:Number(i.offset),
        amount:Number(i.amount)
      }))
    };

    if(editingStructure){
      await api.put(`/fees/structures/${editingStructure.id}`,payload);
    }
    else{
      await api.post("/fees/structures",payload);
    }

    setShowModal(false);
    resetForm();
    fetchStructures();
  };

  const deleteStructure = async (id)=>{
    if(!confirm("Delete this structure?")) return;

    await api.delete(`/fees/structures/${id}`);

    fetchStructures();
  };

  /* ================= FORM ================= */

  const resetForm = ()=>{
    setFeeStructureName("");
    setSelectedCourseId("");
    setSelectedBatchIds([]);
    setInstallments([
      { fee_type_id:"", assign_type:"TRIGGER", offset:0, amount:0 }
    ]);
    setEditingStructure(null);
  };

  const openCreateModal = ()=>{
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (structure)=>{

    setEditingStructure(structure);

    setFeeStructureName(structure.name);
    setSelectedCourseId(structure.course_id);
    setSelectedBatchIds(structure.batches.map(b=>b.id));

    setInstallments(
      structure.installments.map(i=>({
        fee_type_id:i.fee_type_id,
        assign_type:i.assign_type,
        offset:i.offset,
        amount:i.amount
      }))
    );

    setShowModal(true);
  };

  /* ================= UI ================= */

  return (
<div className="space-y-4 px-6 py-2">

{/* ================= HEADER ================= */}

<div className="flex justify-between items-center">
<div>
<input
className="soft-input w-64"
placeholder="Search"
/>
</div>
<PrimaryButton
name="+ Add New Structure"
onClick={openCreateModal}
/>

</div>

{/* ================= TABLE ================= */}

<div className="bg-white border border-gray-200 rounded-xl">

<table className="w-full text-sm">

<thead className="bg-blue-50">

<tr>
<th className="p-3 text-left">Fee Structure</th>
<th className="p-3 text-left">Category/Course</th>
<th className="p-3 text-left">Batch</th>
<th className="p-3 text-left">Total Fees(Rs)</th>
<th className="p-3 text-left">Action</th>
</tr>

</thead>

<tbody className="divide-y">

{structures.map(s=>(
<tr key={s.id}>

<td className="p-3">{s.name}</td>

<td className="p-3">{s.course?.name}</td>

<td className="p-3">
{s.batches?.map(b=>b.name).join(", ")}
</td>

<td className="p-3">
{s.total_amount}
</td>

<td className="p-3 flex gap-3">

<button
onClick={()=>openEditModal(s)}
className="text-blue-600"
>
<Pencil size={16}/>
</button>

<button
onClick={()=>deleteStructure(s.id)}
className="text-red-600"
>
<Trash size={16}/>
</button>

</td>

</tr>
))}

</tbody>

</table>

</div>

{/* ================= MODAL ================= */}

{showModal && (

<Modal
title="Add Fee Structure"
onClose={()=>setShowModal(false)}
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
Fee Structure Name*
</label>

<input
className="soft-input mt-1"
value={feeStructureName}
onChange={(e)=>setFeeStructureName(e.target.value)}
/>
</div>

<div>
<label className="text-xs font-medium">
Category/Course*
</label>

<select
className="soft-select mt-1"
value={selectedCourseId}
onChange={(e)=>setSelectedCourseId(e.target.value)}
>
<option value="">Select Course</option>

{courses.map(c=>(
<option key={c.id} value={c.id}>
{c.name}
</option>
))}

</select>
</div>

<div>
<label className="text-xs font-medium">
Batch(es)*
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
<div className="col-span-2">Amount</div>
<div className="col-span-1"></div>

</div>

{/* INSTALLMENTS */}

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
value={row.fee_type_id}
onChange={(e)=>updateInstallment(i,"fee_type_id",e.target.value)}
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
onChange={(e)=>updateInstallment(i,"assign_type",e.target.value)}
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
onChange={(e)=>updateInstallment(i,"offset",e.target.value)}
/>

</div>

<div className="col-span-2">

<input
type="number"
className="soft-input"
value={row.amount}
onChange={(e)=>updateInstallment(i,"amount",e.target.value)}
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
onClick={()=>setShowModal(false)}
className="soft-btn-outline"
>
Cancel
</button>

<PrimaryButton
name="Save"
onClick={saveStructure}
/>

</div>

</Modal>

)}

</div>
  );
}