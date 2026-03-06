"use client";

import { useState } from "react";
import { SearchOutlined, FileExcelOutlined } from "@ant-design/icons";

export default function InactiveStudentsReportPage() {

const [search,setSearch] = useState("");

return (

<div className="p-6 space-y-4">

{/* BREADCRUMB */}

<div className="text-sm text-gray-500">

<span className="text-gray-600">Students</span>

<span className="mx-2">›</span>

<span className="text-blue-600 font-medium">
Inactive Students Report
</span>

</div>


{/* HEADER ROW */}

<div className="flex items-center justify-between">

{/* SEARCH */}

<div className="relative">

<input
className="soft-input w-72 pr-8"
placeholder="Search"
value={search}
onChange={(e)=>setSearch(e.target.value)}
/>

<SearchOutlined className="absolute right-3 top-2.5 text-gray-400"/>

</div>


{/* NOTE */}

<div className="border border-orange-300 bg-orange-50 text-orange-700 text-sm px-4 py-2 rounded-lg">

<b>Note :</b> Student data will be shown after 24 hours from the Inactivation time

</div>


{/* EXPORT */}

<button className="text-green-600 text-xl">
<FileExcelOutlined/>
</button>

</div>



{/* TABLE */}

<div className="bg-white border border-gray-200 rounded-xl overflow-hidden">

<div className="overflow-x-auto">

<table className="w-full text-sm">

<thead className="bg-gray-100">

<tr>

<th className="px-4 py-3 text-left">
Inactive Date and Time
</th>

<th className="px-4 py-3 text-left">
Student ID
</th>

<th className="px-4 py-3 text-left">
Student Name
</th>

<th className="px-4 py-3 text-left">
Contact Number
</th>

<th className="px-4 py-3 text-left">
Parent Contact Number
</th>

<th className="px-4 py-3 text-left">
Joining Date
</th>

<th className="px-4 py-3 text-left">
Updated By
</th>

<th className="px-4 py-3 text-left">
Reason
</th>

</tr>

</thead>


<tbody>

{/* EMPTY STATE */}

<tr>

<td colSpan="8">

<div className="flex flex-col items-center py-20 text-gray-400">

<p className="text-lg">
No Data Found!
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