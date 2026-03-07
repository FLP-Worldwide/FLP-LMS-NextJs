"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/utils/api";
import { useRouter } from "next/navigation";

export default function Page() {
const router = useRouter();
  const [loading,setLoading] = useState(false);

  const [settings,setSettings] = useState({
    inactive_student_report:false
  });


  /* ================= FETCH SETTINGS ================= */

  const fetchSettings = async () => {

    try{

      const res = await api.get("/settings/content/student-setting",{
        // params:{ key:"" }
      });

      if(res.data?.data){
        setSettings(res.data.data);
      }

    }catch(err){
      console.log(err);
    }

  };


  useEffect(()=>{
    fetchSettings();
  },[]);


  /* ================= SAVE SETTINGS ================= */

  const saveSettings = async (updated) => {

    try{

      setLoading(true);

      await api.post("/settings/content",{
        key:"student-setting",
        value:updated
      });

      setSettings(updated);

    }catch(err){
      console.log(err);
    }
    finally{
      setLoading(false);
    }

  };


  const toggleInactiveReport = () => {

    const updated = {
      ...settings,
      inactive_student_report:!settings.inactive_student_report
    };

    saveSettings(updated);

  };


  return (

<div className="flex h-full bg-gray-50">

{/* ================= LEFT MENU ================= */}

<div className="w-[260px] bg-white border-r border-gray-200">

<div className="px-4 py-4 font-semibold border-b border-gray-200">
⚙ Settings
</div>

<div className="flex flex-col">

<button className="text-left px-4 py-3 text-blue-600 bg-gray-50">
Email Settings
</button>

<button className="text-left px-4 py-3 text-gray-700 hover:bg-gray-50">
Offline Admission Form
</button>

</div>

</div>



{/* ================= RIGHT CONTENT ================= */}

<div className="flex-1 p-6 space-y-6">


{/* INACTIVE STUDENT REPORT */}

<div className="bg-white border rounded-md border-gray-200">

<div className="flex justify-between items-center px-6 py-5">

<div>

<h2 className="font-semibold text-gray-800">
Inactive Student Report
</h2>

<p className="text-sm text-gray-500 mt-1">
Daily report will be shared on the mentioned email(s) for inactive student(s).
</p>

</div>


<div className="flex items-center gap-2">

<span className="text-sm text-gray-500">
OFF
</span>

<label className="relative inline-flex items-center cursor-pointer">

<input
type="checkbox"
checked={settings.inactive_student_report}
onChange={toggleInactiveReport}
className="sr-only"
/>

<div className={`w-10 h-5 rounded-full transition 
${settings.inactive_student_report ? "bg-green-500" : "bg-gray-300"}`} />

</label>

<span className="text-sm text-green-600">
ON
</span>

</div>

</div>

</div>



{/* OFFLINE ADMISSION FORM */}

<div className="bg-white border rounded-md border-gray-200">

<div className="flex justify-between items-center px-6 py-6">

<div>

<h2 className="font-semibold text-gray-800">
Offline Admission Form
</h2>

<p className="text-sm text-gray-600 mt-1">
You can Enable/ Disable/ Add The fields in the form and additional information can be updated.
</p>

<p className="text-sm text-gray-500 mt-2">
Follow the path to access the form:
</p>

<p className="text-sm text-gray-600">
Students &gt;&gt; Search Student &gt;&gt; Select Student &gt;&gt; Click Selected Student
</p>

</div>


<button
onClick={() => router.push("/admin/students/student-setting/offline-admission-form")}
className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
>
Manage
</button>

</div>

</div>


</div>

</div>

  );
}