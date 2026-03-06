"use client";

import { useState } from "react";
import { SearchOutlined } from "@ant-design/icons";

export default function SiblingMappingPage() {

const [search,setSearch] = useState("");

return (

<div className="p-6 space-y-4">

{/* BREADCRUMB */}

<div className="text-sm text-gray-500">
<span className="text-gray-600">Students</span>
<span className="mx-2">›</span>
<span className="text-blue-600 font-medium">
Sibling Mapping
</span>
</div>


{/* HEADER */}

<div className="flex items-center justify-between">

{/* NOTE */}

<div className="border border-orange-300 bg-orange-50 text-orange-700 text-sm px-4 py-2 rounded-lg">

<b>Note:</b> The student would be marked as a sibling if their parents/Students contact details are the same.

</div>


{/* SEARCH */}

<div className="relative">

<input
className="soft-input w-72 pr-8"
placeholder="Search Student ID"
value={search}
onChange={(e)=>setSearch(e.target.value)}
/>

<SearchOutlined className="absolute right-3 top-2.5 text-gray-400"/>

</div>

</div>



{/* TABLE */}

<div className="bg-white border border-gray-200 rounded-xl overflow-hidden">

<div className="overflow-x-auto">

<table className="w-full text-sm">

<thead className="bg-gray-100">

<tr>

<th className="px-4 py-3 text-left">
Student Name
</th>

<th className="px-4 py-3 text-left">
Student ID
</th>

<th className="px-4 py-3 text-left">
Batch
</th>

<th className="px-4 py-3 text-left">
Action
</th>

</tr>

</thead>


<tbody>

{/* EMPTY STATE */}

<tr>

<td colSpan="4">

<div className="flex flex-col items-center py-20">

<img
src="/images/empty-student.svg"
className="w-64 opacity-80"
/>

<p className="text-gray-500 mt-4 text-sm">
No sibling records found
</p>

</div>

</td>

</tr>

</tbody>

</table>

</div>

</div>

</div>

);
}