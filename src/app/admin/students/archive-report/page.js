"use client";

import { useEffect, useState } from "react";
import { api } from "@/utils/api";

export default function ArchivedStatusStudentListPage() {

const [students,setStudents] = useState([]);
const [search,setSearch] = useState("");
const [loading,setLoading] = useState(false);

/* ================= FETCH ================= */

const fetchStudents = async () => {

try{

setLoading(true);

const res = await api.get("/reports/students/archived/list",{
params:{ search }
});

setStudents(res.data?.data || []);

}catch(err){
console.error(err);
}
finally{
setLoading(false);
}

};

/* ================= LOAD ================= */

useEffect(()=>{
fetchStudents();
},[]);

/* ================= SEARCH ================= */

const handleSearch = (e)=>{

if(e.key === "Enter"){
fetchStudents();
}

};

return (

<div className="p-6 space-y-4">

{/* BREADCRUMB */}

<div className="text-sm text-gray-500">

<span className="text-blue-600 cursor-pointer">
Students
</span>

<span className="mx-2">›</span>

<span className="text-gray-700">
Archived Status Student List
</span>

</div>


{/* SEARCH */}

<div className="flex justify-end">

<input
className="soft-input w-64"
placeholder="Search"
value={search}
onChange={(e)=>setSearch(e.target.value)}
onKeyDown={handleSearch}
/>

</div>


{/* TABLE */}

<div className="bg-white border border-gray-200 rounded-xl overflow-hidden">

<div className="overflow-x-auto">

<table className="w-full text-sm">

<thead className="bg-gray-100">

<tr>

<th className="px-4 py-3 text-left">
Student ID
</th>

<th className="px-4 py-3 text-left">
Student Name
</th>

<th className="px-4 py-3 text-left">
Alumni
</th>

<th className="px-4 py-3 text-left">
Joining Date
</th>

<th className="px-4 py-3 text-left">
DOB
</th>

<th className="px-4 py-3 text-left">
Contact No.
</th>

<th className="px-4 py-3 text-left">
Parent Contact No.
</th>

<th className="px-4 py-3 text-left">
Status
</th>

<th className="px-4 py-3 text-left">
Archived Date Time
</th>

</tr>

</thead>


<tbody className="divide-y">

{/* EMPTY */}

{!loading && students.length === 0 && (

<tr>

<td colSpan="9" className="text-center py-10 text-gray-500">
No archived records found
</td>

</tr>

)}


{/* DATA */}

{students.map((s,i)=> (

<tr key={i}>

<td className="px-4 py-3">
{s.student_id}
</td>

<td className="px-4 py-3 font-medium">
{s.name}
</td>

<td className="px-4 py-3">
{s.alumni || "-"}
</td>

<td className="px-4 py-3">
{s.joining_date}
</td>

<td className="px-4 py-3">
{s.dob || "-"}
</td>

<td className="px-4 py-3">
{s.contact_no}
</td>

<td className="px-4 py-3">
{s.parent_contact_no || "-"}
</td>

<td className="px-4 py-3">

<span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700">
{s.status ? "Active" : "Completed"}
</span>

</td>

<td className="px-4 py-3 text-gray-600">
{s.deleted_at}
</td>

</tr>

))}

</tbody>

</table>

</div>

</div>

</div>

);
}