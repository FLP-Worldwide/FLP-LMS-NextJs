"use client";

import { useEffect, useState } from "react";
import { api } from "@/utils/api";
import { SearchOutlined, DeleteOutlined } from "@ant-design/icons";

export default function ArchivedStudentsPage() {

const [students,setStudents] = useState([]);
const [selected,setSelected] = useState([]);
const [search,setSearch] = useState("");
const [loading,setLoading] = useState(false);

/* ================= FETCH ================= */

const fetchStudents = async () => {

try{

setLoading(true);

const res = await api.get("/reports/students/archived",{
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

useEffect(()=>{
fetchStudents();
},[]);


/* ================= SELECT ================= */

const toggleSelect = (id)=>{

if(selected.includes(id)){
setSelected(selected.filter(i=>i !== id));
}else{
setSelected([...selected,id]);
}

};


const toggleSelectAll = ()=>{

if(selected.length === students.length){
setSelected([]);
}else{
setSelected(students.map(s=>s.id));
}

};


/* ================= SINGLE DELETE ================= */

const deleteStudent = async (id)=>{

if(!confirm("Archive this student?")) return;

try{

await api.delete(`/reports/students/archive/${id}`);

setStudents(prev => prev.filter(s=>s.id !== id));

}catch(err){
console.error(err);
}

};


/* ================= BULK DELETE ================= */

const bulkArchive = async ()=>{

if(selected.length === 0){
alert("Please select students");
return;
}

if(!confirm("Archive selected students?")) return;

try{

await api.post("/reports/students/archive/bulk",{
student_ids:selected
});

setStudents(prev => prev.filter(s=>!selected.includes(s.id)));

setSelected([]);

}catch(err){
console.error(err);
}

};


/* ================= SEARCH ================= */

const handleSearch = ()=>{
fetchStudents();
};



return (

<div className="p-6 space-y-4">

{/* HEADER */}

<div className="flex justify-between items-center">

<div>

<h2 className="text-xl font-semibold">
Archived Students
</h2>

<p className="text-sm text-gray-500">
Manage archived students list.
</p>

</div>


<div className="flex gap-2">

<input
className="soft-input w-60"
placeholder="Search student..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
/>

<button
onClick={handleSearch}
className="bg-blue-800 px-4 py-1 text-white text-sm rounded-lg border border-blue-900 hover:bg-blue-900 flex items-center gap-1"
>
<SearchOutlined/>
Search
</button>

</div>

</div>


{/* BULK ACTION */}

{selected.length > 0 && (

<div className="flex gap-2">

<button
onClick={bulkArchive}
className="bg-red-500 text-white px-4 py-1 rounded-lg text-sm flex items-center gap-1"
>

<DeleteOutlined/>
Archive Selected ({selected.length})

</button>

</div>

)}



{/* TABLE */}

<div className="bg-white rounded-xl border border-gray-200">

<div className="overflow-x-auto">

<table className="w-full text-sm">

<thead className="bg-gray-50">

<tr>

<th className="px-4 py-2">

<input
type="checkbox"
checked={selected.length === students.length && students.length > 0}
onChange={toggleSelectAll}
/>

</th>

<th className="px-4 py-2 text-left">Name</th>
<th className="px-4 py-2 text-left">Email</th>
<th className="px-4 py-2 text-left">Phone</th>
<th className="px-4 py-2 text-left">Course</th>
<th className="px-4 py-2 text-left">Archived Date</th>
<th className="px-4 py-2 text-right">Action</th>

</tr>

</thead>


<tbody className="divide-y">


{students.length === 0 && !loading && (

<tr>

<td colSpan="7" className="text-center py-10 text-gray-500">
No archived students found
</td>

</tr>

)}


{students.map((s)=> (

<tr key={s.id}>

<td className="px-4 py-2">

<input
type="checkbox"
checked={selected.includes(s.id)}
onChange={()=>toggleSelect(s.id)}
/>

</td>

<td className="px-4 py-2 font-medium">
{s.name}
</td>

<td className="px-4 py-2">
{s.email || "—"}
</td>

<td className="px-4 py-2">
{s.phone || "—"}
</td>

<td className="px-4 py-2">
{s.course || "—"}
</td>

<td className="px-4 py-2">
{s.archived_at}
</td>

<td className="px-4 py-2 text-right">

<button
onClick={()=>deleteStudent(s.id)}
className="text-red-500"
>
<DeleteOutlined/>
</button>

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