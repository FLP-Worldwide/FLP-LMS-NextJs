"use client";

import { useState, useRef, useEffect } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { api } from "@/utils/api";
import PrimaryButton from "@/components/ui/PrimaryButton";

export default function StudentUploadPage() {
const fileInputRef = useRef(null);
const [file,setFile] = useState(null);
const [loading,setLoading] = useState(false);
const [reports,setReports] = useState([]);

const [showErrors,setShowErrors] = useState(false);
const [errorRows,setErrorRows] = useState([]);
const [loadingErrors,setLoadingErrors] = useState(false);

useEffect(()=>{
fetchReports();
},[]);
// DOWNLOAD TEMPLATE

const downloadTemplate = async () => {

try{

const res = await api.get(
"/reports/students/import/new/template",
{responseType:"blob"}
);

const url = window.URL.createObjectURL(new Blob([res.data]));

const link = document.createElement("a");
link.href = url;
link.setAttribute("download","student-import-template.xlsx");

document.body.appendChild(link);
link.click();

link.remove();
window.URL.revokeObjectURL(url);

}catch(err){
console.log(err);
}

};


// FILE SELECT

const handleFileChange = (e)=>{
const selectedFile = e.target.files?.[0];

if(selectedFile){
setFile(selectedFile);
}
};


// UPLOAD FILE

const uploadStudents = async ()=>{

if(!file){
alert("Please choose file");
return;
}

const fd = new FormData();
fd.append("file",file);

try{

setLoading(true);

await api.post(
"/reports/students/import/new",
fd,
{
headers:{
"Content-Type":"multipart/form-data"
}
}
);

alert("Upload Successful");

setFile(null);
fileInputRef.current.value = "";
fetchReports();
}catch(err){
console.log(err);
}
finally{
setLoading(false);
}

};

const fetchReports = async () => {

try{

const res = await api.get("/reports/import-report");

const list = res.data?.data?.data || [];

const mapped = list.map(r=>({

id:r.id,

created_at:r.created_at,

status:r.failed_rows > 0 ? "Error" : "Completed",

total:r.total_rows,

success:r.success_rows,

failed:r.failed_rows

}));

setReports(mapped);

}catch(err){
console.log(err);
}

};

const fetchErrors = async (fileId)=>{

try{

setLoadingErrors(true);

const res = await api.get(`/reports/students/import-report/${fileId}`);

setErrorRows(res.data?.data?.data || []);

setShowErrors(true);

}catch(err){
console.log(err);
}
finally{
setLoadingErrors(false);
}

};

return (

<div className="p-6">

{/* HEADER */}

<div className="flex justify-between items-center mb-6">

<h1 className="text-xl font-semibold text-gray-700">
Upload Student
</h1>

<PrimaryButton
name="Download Template"
onClick={downloadTemplate}
/>

</div>


{/* MAIN GRID */}

<div className="grid grid-cols-2 gap-6">


{/* LEFT UPLOAD */}

<div className="bg-white border border-gray-200 rounded-lg p-6">

<h2 className="text-gray-600 mb-4 font-medium">
Select a file to upload
</h2>

<div className="border-2 border-dashed border-gray-200 rounded-lg p-10 text-center">

<UploadOutlined className="text-4xl text-gray-400 mb-4"/>

<p className="text-lg mb-2">
Upload Student Details
</p>

<p className="text-gray-400 mb-4">
Drag files to upload
</p>

{/* SHOW SELECTED FILE */}

{file && (
<p className="text-sm text-green-600 mb-4">
Selected: {file.name}
</p>
)}

<div className="flex justify-center gap-3">

<label className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">

+ Choose

<input
type="file"
ref={fileInputRef}
onChange={handleFileChange}
className="hidden"
/>

</label>


<button
onClick={uploadStudents}
disabled={loading}
className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
>

{loading ? "Uploading..." : "Upload"}

</button>

</div>

</div>

</div>



{/* RIGHT INSTRUCTION */}

<div className="bg-white border border-gray-200 rounded-lg p-6">

<h2 className="font-semibold mb-4">
Note : Instructions to be followed
</h2>

<ol className="text-sm text-gray-600 space-y-2 list-decimal pl-4">

<li>
Please click on the <b>Download Template</b> button for uploading student data.
</li>

<li>
Upload the same file which was downloaded.
</li>

<li>
First read the instructions mentioned on the downloaded file (Sheet 1).
</li>

<li>
Before adding any data please change cell format to <b>Text</b>.
</li>

<li>
Check mandatory fields should be filled properly.
</li>

<li>
Check uploaded file status report from <b>Student Upload Report</b>.
</li>

<li>
If upload fails download failure report from <b>Failure Count</b>.
</li>

</ol>

</div>

</div>



{/* REPORT */}

<div className="mt-6 bg-white border border-gray-200 rounded-lg p-6">

<div className="flex justify-between items-center mb-4">

<h2 className="font-semibold text-gray-700">
Student Upload Report
</h2>

<button
onClick={fetchReports}
className="bg-blue-500 text-white px-4 py-1 rounded"
>
Refresh
</button>
</div>


<table className="w-full text-sm">

<thead className="bg-gray-100">

<tr>

<th className="p-2 text-left">Created Date</th>
<th className="p-2 text-left">Status</th>
<th className="p-2 text-left">Total Count</th>
<th className="p-2 text-left">Success Count</th>
<th className="p-2 text-left">Failure Count</th>

</tr>

</thead>


<tbody>

{reports.length === 0 && (

<tr className="border-t">
<td className="p-2" colSpan="5">
No records
</td>
</tr>

)}


{reports.map((r,i)=>(

<tr key={i} className="border-t">

<td className="p-2">
{r.created_at}
</td>

<td className="p-2">
<span className={
r.status === "Completed"
? "text-green-600"
: "text-red-500"
}>
{r.status}
</span>
</td>

<td className="p-2">
{r.total}
</td>

<td className="p-2">
{r.success}
</td>

<td
onClick={()=> r.failed > 0 && fetchErrors(r.id)}
className="p-2 text-blue-600 cursor-pointer"
>
{r.failed}
</td>

</tr>

))}

</tbody>

</table>

</div>


{showErrors && (

<div className="fixed inset-0 bg-black/30 flex items-center justify-center p-6 z-50">

<div className="bg-white w-[800px] max-h-[90vh] rounded-lg border border-gray-200 flex flex-col">


{/* HEADER */}

<div className="flex justify-between items-center p-4 border-b border-gray-200">

<h3 className="font-semibold">
Import Error Report
</h3>

<button
onClick={()=>setShowErrors(false)}
>
✕
</button>

</div>


{/* BODY */}

<div className="p-6 overflow-y-auto flex-1">

{loadingErrors && (
<p className="text-sm text-gray-500">Loading...</p>
)}

{!loadingErrors && errorRows.length === 0 && (
<p className="text-sm text-gray-500">
No errors found
</p>
)}

{errorRows.map((row,i)=>{

const data = row.raw_data?.data || {};
const error = row.raw_data?.error;

return(

<div
key={i}
className="border border-red-200 bg-red-50 rounded-md p-4 mb-4"
>

<p className="text-sm text-red-600 mb-2">
{error}
</p>

<div className="text-sm text-gray-700 space-y-1">

{Object.entries(data).map(([key,val])=>(
<div key={key}>
<b>{key}</b>: {val}
</div>
))}

</div>

</div>

);

})}

</div>


{/* FOOTER */}

<div className="flex justify-end gap-3 p-4 border-t border-gray-200">

<button
onClick={()=>setShowErrors(false)}
className="border border-gray-200 px-4 py-2 rounded"
>
Close
</button>

</div>

</div>

</div>

)}

</div>

);
}