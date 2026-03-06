"use client";

import { useEffect, useState } from "react";
import { api } from "@/utils/api";
import { SearchOutlined } from "@ant-design/icons";

export default function RegisteredStudentsPage() {

const [students,setStudents] = useState([]);
const [loading,setLoading] = useState(false);
const [search,setSearch] = useState("");


/* ================= FETCH ================= */

const fetchStudents = async () => {

try{

setLoading(true);

const res = await api.get("/students/registered",{
params:{
search:search
}
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

const handleSearch = ()=>{
fetchStudents();
};


return (

<div className="p-6 space-y-4">

{/* BREADCRUMB */}

<div className="text-sm text-gray-500">
<span className="text-blue-600 cursor-pointer">Students</span>
<span className="mx-2">›</span>
<span className="text-gray-700">Registered Students</span>
</div>


{/* SEARCH BAR */}

<div className="flex justify-end">

<div className="flex gap-2">

<input
className="soft-input w-60"
placeholder="Search student..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
/>

<button
onClick={handleSearch}
className="bg-blue-600 text-white px-4 py-1 rounded-lg flex items-center gap-1"
>
<SearchOutlined/>
Search
</button>

</div>

</div>


{/* TABLE */}

<div className="bg-white border border-gray-200 rounded-xl overflow-hidden">

<table className="w-full text-sm">

<thead className="bg-blue-50">

<tr>

<th className="px-4 py-3 text-left">Name</th>
<th className="px-4 py-3 text-left">Contact No</th>
<th className="px-4 py-3 text-left">Email Id</th>
<th className="px-4 py-3 text-left">Registered Date</th>

</tr>

</thead>

<tbody>


{/* EMPTY STATE */}

{!loading && students.length === 0 && (

<tr>

<td colSpan="4">

<div className="flex flex-col items-center py-16">

<img
src="/images/empty-search.svg"
className="w-64 opacity-80"
/>

<p className="text-gray-500 mt-4 text-sm">
Looking for something...
</p>

<p className="text-gray-400 text-xs">
Please search here
</p>

</div>

</td>

</tr>

)}



{/* DATA */}

{students.map((s,i)=>(

<tr key={i} className="border-t">

<td className="px-4 py-3 font-medium">
{s.name}
</td>

<td className="px-4 py-3">
{s.phone}
</td>

<td className="px-4 py-3">
{s.email}
</td>

<td className="px-4 py-3">
{s.registered_at}
</td>

</tr>

))}

</tbody>

</table>

</div>

</div>

);
}