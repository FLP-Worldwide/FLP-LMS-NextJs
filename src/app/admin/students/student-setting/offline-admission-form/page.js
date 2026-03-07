"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/utils/api";

export default function Page() {

/* ---------------- DEFAULT SETTINGS ---------------- */

const defaultSettings = {
sections:{
personal:true,
parent:true,
sibling:true,
footer:true,
undertaking:true,
office:true
},

fields:{
personal:[
"Student Name","Standard","Assign Batches","Gender","Contact No",
"Date of Birth","Date of Admission","Student ID","Aadhar No",
"Blood Group","Category","Minority","Nationality","Religion",
"Email ID","Current Address"
],

parent:[
"Parent Name","Parent Profession","Parent Contact No",
"Parent Email ID","Mother Name","Mother Email Id","Mother Contact No"
],

sibling:[],

footer:[
"Date","Principal Remark","Signature of the Parent","Admn. Incharge","Principal"
],

undertaking:["Date","Signature of the Parent"],

office:["Date","Admission Clerk","Principal"]
},

content:{
footer:"I Declare that the information I given is correct.",
undertaking:`1. I undertake the responsibility for the payment of fee bills of my ward as per schedule.
2. I accept that the decision of the principal with regards to school discipline will be final and binding on me and my ward.
3. The date of birth mentioned in the form is correct to the best of my knowledge.
4. I declare that all the above entries made by me are correct.`
}
};


/* ---------------- ALL EXTRA FIELDS ---------------- */

const allFields = {

personal:[
"Educational Group",
"Extra Curricular Activity",
"Birth Place",
"Mother Tongue"
],

parent:[
"Parent Aadhar No.",
"Guardian Name",
"Guardian Contact No.",
"Guardian Email ID"
],

sibling:[
"Sibling Name",
"Sibling Class",
"Sibling Admission No"
],

footer:[],
undertaking:[],
office:[]
};


/* ---------------- STATES ---------------- */

const [settings,setSettings] = useState(defaultSettings);
const [modalSection,setModalSection] = useState(null);
const [showModal,setShowModal] = useState(false);


/* ---------------- LOAD SETTINGS ---------------- */

useEffect(()=>{

const load = async()=>{

try{

const res = await api.get("/settings/content/offline-admission-form");

if(res.data?.data){
setSettings({
...defaultSettings,
...res.data.data
});
}

}catch(e){}

};

load();

},[]);


/* ---------------- TOGGLE SECTION ---------------- */

const toggleSection = (key)=>{

setSettings(prev=>({

...prev,

sections:{
...prev.sections,
[key]:!prev.sections[key]
}

}));

};


/* ---------------- ADD FIELD ---------------- */

const addField = (field)=>{

setSettings(prev=>{

if(prev.fields[modalSection].includes(field)) return prev;

return{
...prev,
fields:{
...prev.fields,
[modalSection]:[...prev.fields[modalSection],field]
}
};

});

};


/* ---------------- REMOVE FIELD ---------------- */

const removeField = (field)=>{

setSettings(prev=>({

...prev,

fields:{
...prev.fields,
[modalSection]:prev.fields[modalSection].filter(f=>f!==field)
}

}));

};


/* ---------------- SAVE SETTINGS ---------------- */

const saveSettings = async()=>{

await api.post("/settings/content",{
key:"offline-admission-form",
value:settings
});

};


/* ---------------- HELPER ---------------- */

const getAvailableFields = () => {

const defaultFields = defaultSettings.fields[modalSection] || [];
const extraFields = allFields[modalSection] || [];
const selectedFields = settings.fields[modalSection] || [];

/* all possible fields */

const allPossibleFields = [...new Set([
...defaultFields,
...extraFields
])];

/* remove selected */

return allPossibleFields.filter(f => !selectedFields.includes(f));

};

/* ---------------- UI ---------------- */

return(

<div className="flex bg-gray-50 p-6 gap-4">


{/* LEFT PANEL */}

<div className="w-[280px] bg-white border border-gray-200 rounded-lg p-4">

<p className="text-sm text-gray-600 mb-4">
Optimize your admission form by including important field
</p>

{Object.entries(settings.sections).map(([key,val])=>(
<div
key={key}
className="flex items-center justify-between border border-gray-200 rounded-md px-3 py-2 mb-2"
>

<span className="text-sm capitalize">
{key} Details
</span>

<input
type="checkbox"
checked={val}
onChange={()=>toggleSection(key)}
/>

</div>
))}

</div>


{/* RIGHT BUILDER */}

<div className="flex-1 space-y-4">


{/* HEADER */}

<div className="flex justify-end gap-3">

<button className="border px-4 py-2 rounded text-sm border-gray-200">
Preview
</button>

<button
onClick={saveSettings}
className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
>
Save
</button>

</div>


{/* PERSONAL */}

{settings.sections.personal && (

<div className="bg-white border border-gray-200 rounded-lg p-4">

<h3 className="font-semibold mb-3">
Personal Details
</h3>

<div className="flex flex-wrap gap-2 mb-3">

{settings.fields.personal.map(f=>(
<span key={f} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
{f}
</span>
))}

</div>

<button
onClick={()=>{setModalSection("personal");setShowModal(true)}}
className="w-full border border-gray-200 rounded-md py-2 text-blue-600 text-sm"
>
+ Choose Fields
</button>

</div>

)}


{/* PARENT */}

{settings.sections.parent && (

<div className="bg-white border border-gray-200 rounded-lg p-4">

<h3 className="font-semibold mb-3">
Parent Details
</h3>

<div className="flex flex-wrap gap-2 mb-3">

{settings.fields.parent.map(f=>(
<span key={f} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
{f}
</span>
))}

</div>

<button
onClick={()=>{setModalSection("parent");setShowModal(true)}}
className="w-full border border-gray-200 rounded-md py-2 text-blue-600 text-sm"
>
+ Choose Fields
</button>

</div>

)}


{/* SIBLING */}

{settings.sections.sibling && (

<div className="bg-white border border-gray-200 rounded-lg p-4">

<h3 className="font-semibold mb-3">
Sibling Details
</h3>

<button
onClick={()=>{setModalSection("sibling");setShowModal(true)}}
className="w-full border border-gray-200 rounded-md py-2 text-blue-600 text-sm"
>
+ Choose Fields
</button>

</div>

)}


/* FOOTER */

{settings.sections.footer && (

<div className="bg-white border border-gray-200 rounded-lg p-4">

<h3 className="font-semibold mb-3">
Footer
</h3>

<textarea
value={settings.content.footer}
onChange={(e)=>setSettings(prev=>({
...prev,
content:{...prev.content,footer:e.target.value}
}))}
className="border border-gray-200 rounded-md p-3 w-full text-sm mb-3"
/>

<div className="flex flex-wrap gap-2 mb-3">

{settings.fields.footer.map(f=>(
<span key={f} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
{f}
</span>
))}

</div>

<button
onClick={()=>{setModalSection("footer");setShowModal(true)}}
className="w-full border border-gray-200 rounded-md py-2 text-blue-600 text-sm"
>
+ Choose Fields
</button>

</div>

)}


/* UNDERTAKING */

{settings.sections.undertaking && (

<div className="bg-white border border-gray-200 rounded-lg p-4">

<h3 className="font-semibold mb-3">
Undertaking
</h3>

<textarea
value={settings.content.undertaking}
onChange={(e)=>setSettings(prev=>({
...prev,
content:{...prev.content,undertaking:e.target.value}
}))}
className="border border-gray-200 rounded-md p-3 w-full text-sm mb-3"
/>

<div className="flex gap-2">

{settings.fields.undertaking.map(f=>(
<span key={f} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
{f}
</span>
))}

</div>

</div>

)}


/* OFFICE */

{settings.sections.office && (

<div className="bg-white border border-gray-200 rounded-lg p-4">

<h3 className="font-semibold mb-3">
For Office use Only
</h3>

<div className="flex gap-2 mb-3">

{settings.fields.office.map(f=>(
<span key={f} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
{f}
</span>
))}

</div>

<button
onClick={()=>{setModalSection("office");setShowModal(true)}}
className="w-full border border-gray-200 rounded-md py-2 text-blue-600 text-sm"
>
+ Choose Fields
</button>

</div>

)}

</div>


{/* MODAL */}

{showModal && (

<div className="fixed inset-0 bg-black/30 flex items-center justify-center p-6 z-50">

<div className="bg-white w-[700px] max-h-[90vh] rounded-lg border border-gray-200 flex flex-col">


{/* HEADER */}

<div className="flex justify-between items-center p-4 border-b border-gray-200">

<h3 className="font-semibold">
Choose Fields
</h3>

<button
onClick={()=>setShowModal(false)}
>
✕
</button>

</div>


{/* BODY (SCROLL AREA) */}

<div className="grid grid-cols-2 gap-4 p-6 overflow-y-auto flex-1">


{/* AVAILABLE */}

<div>

<h4 className="font-medium mb-2">
Available
</h4>

{getAvailableFields().map(f=>(
<div
key={f}
onClick={()=>addField(f)}
className="border border-gray-200 p-2 rounded mb-2 cursor-pointer hover:bg-gray-50"
>
{f}
</div>
))}

</div>


{/* SELECTED */}

<div>

<h4 className="font-medium mb-2">
Selected
</h4>

{settings.fields[modalSection].map(f=>(
<div
key={f}
className="border border-gray-200 p-2 rounded flex justify-between mb-2"
>

<span>{f}</span>

<button
onClick={()=>removeField(f)}
className="text-red-500"
>
Remove
</button>

</div>
))}

</div>

</div>


{/* FOOTER */}

<div className="flex justify-end gap-3 p-4 border-t border-gray-200">

<button
onClick={()=>setShowModal(false)}
className="border border-gray-200 px-4 py-2 rounded"
>
Cancel
</button>

<button
onClick={()=>setShowModal(false)}
className="bg-blue-600 text-white px-4 py-2 rounded"
>
Save
</button>

</div>


</div>

</div>

)}

</div>

);

}