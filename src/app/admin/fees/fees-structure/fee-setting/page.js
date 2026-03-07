"use client";

import { useState, useEffect } from "react";
import { api } from "@/utils/api";
import PrimaryButton from "@/components/ui/PrimaryButton";

export default function FeesSettingsPage() {

const [loading,setLoading] = useState(false);
const [fetching,setFetching] = useState(true);

const [form,setForm] = useState({

/* ================= GENERAL ================= */

link_fee_structure_with_batch:false,
auto_apply_default_fee:false,

/* ================= EMAIL SETTINGS ================= */

accounts_email_sender:"",
custom_fee_header:"",

/* ================= FEES NOTIFICATION ================= */

reminder_due_student:false,
reminder_due_parent:false,
reminder_due_guardian:false,

reminder_post_student:false,
reminder_post_parent:false,
reminder_post_guardian:false,

reminder_pre_student:false,
reminder_pre_parent:false,
reminder_pre_guardian:false,

payment_confirmation_student:false,
payment_confirmation_parent:false,
payment_confirmation_guardian:false,
payment_confirmation_admin:false,

cheque_dishonoured_student:false,
cheque_dishonoured_parent:false,
cheque_dishonoured_guardian:false,
cheque_dishonoured_admin:false,

fee_report_emails:"",

pdc_reminder:false,

/* ================= PUSH ================= */

push_pre_student:false,
push_pre_parent:false,

push_due_student:false,
push_due_parent:false,

push_post_student:false,
push_post_parent:false,

push_payment_student:false,
push_payment_parent:false,

/* ================= TAX ================= */

enable_gst:false,

/* ================= ONLINE PAYMENT ================= */

restrict_chronological_payment:false,

online_fee_email:false,
online_fee_email_ids:"",

online_fee_sms:false,
online_fee_sms_numbers:"",

/* ================= OFFLINE ================= */

offline_fee_email:false,
offline_fee_sms:false,
restrict_backdated_payment:false,

/* ================= RECEIPT ================= */

invoice_prefix:"",
refund_prefix:"",
enable_financial_year_invoice:false,

show_receipt_student_app:false,
enable_receipt_invoice:false,

cin_number:"",
pan_number:"",
service_code:"",
accounting_code:"",
state_code:"",
receipt_start_number:0,

receipt_contact_numbers:"",

show_fee_details_student_app:false,
show_balance_in_receipt:false,
show_concession:false,
show_due_amount_sms:false,
show_counsellor_name:false,
show_fee_remark:false,
show_category:false,
show_batch:false,
show_parent_name:false,
show_datewise_breakdown:false,
show_total_fees:false,
show_next_installment:false,
show_next_installment_date:false,
show_next_month_due:false,
show_billing_period:false,
show_affiliation_number:false,
show_affiliation_name:false,
show_academic_year:false,
show_admission_number:false,

download_receipt_student:false,
download_receipt_institute:false,

show_parent_signature:false,
show_previous_balance_paid:false,
show_previous_balance_installment:false,
show_remaining_fees:false,

auto_accept_installment:false,

print_same_page:true,

});

useEffect(()=>{
const load = async()=>{

try{

const res = await api.get("settings/content/fees-setting");

if(res.data?.data){

setForm(prev=>({
...prev,
...res.data.data
}));

}

}catch(e){

console.error(e)

}
finally{
setFetching(false)
}

}

load()

},[])

const toggle = (key) =>{
setForm(prev=>({
...prev,
[key]:!prev[key]
}))
}

const handleChange = (e)=>{
setForm({
...form,
[e.target.name]:e.target.value
})
}

const save = async()=>{

try{

setLoading(true)

await api.post("settings/content",{
key:"fees-setting",
value:form
})

alert("Settings saved successfully")

}catch(e){

console.error(e)
alert("Save failed")

}finally{

setLoading(false)

}

}


return (
        <>
<div className="p-6 space-y-8">

{/* ================= GENERAL ================= */}

<div className="bg-white p-6 border rounded-xl space-y-4">

<h2 className="font-semibold text-lg">General</h2>

<label className="flex justify-between items-center">
<span>Link Fee Structure with Batch</span>
<input
type="checkbox"
checked={form.link_fee_structure_with_batch}
onChange={()=>toggle("link_fee_structure_with_batch")}
/>
</label>

<label className="flex justify-between items-center">
<span>Auto apply default fee structures</span>
<input
type="checkbox"
checked={form.auto_apply_default_fee}
onChange={()=>toggle("auto_apply_default_fee")}
/>
</label>

</div>


{/* ================= EMAIL SETTINGS ================= */}

<div className="bg-white p-6 border rounded-xl space-y-4">

<h2 className="font-semibold text-lg">Email Settings</h2>

<div>
<label>Email Sender ID</label>
<input
className="soft-input"
name="accounts_email_sender"
value={form.accounts_email_sender}
onChange={handleChange}
/>
</div>

<div>
<label>Custom Header for Fee Receipt</label>
<input
className="soft-input"
name="custom_fee_header"
value={form.custom_fee_header}
onChange={handleChange}
/>
</div>

</div>


{/* ================= FEES NOTIFICATION ================= */}

<div className="bg-white p-6 border rounded-xl space-y-6">

<h2 className="font-semibold text-lg">Fees Notification</h2>

{/* PRE DUE */}

<div>
<h4 className="font-medium">Fee Reminder - Pre Due Date</h4>

<label><input type="checkbox" checked={form.reminder_pre_student} onChange={()=>toggle("reminder_pre_student")}/> Student</label>
<label><input type="checkbox" checked={form.reminder_pre_parent} onChange={()=>toggle("reminder_pre_parent")}/> Parent</label>
<label><input type="checkbox" checked={form.reminder_pre_guardian} onChange={()=>toggle("reminder_pre_guardian")}/> Guardian</label>

</div>

{/* DUE */}

<div>
<h4 className="font-medium">Fee Reminder - On Due Date</h4>

<label><input type="checkbox" checked={form.reminder_due_student} onChange={()=>toggle("reminder_due_student")}/> Student</label>
<label><input type="checkbox" checked={form.reminder_due_parent} onChange={()=>toggle("reminder_due_parent")}/> Parent</label>
<label><input type="checkbox" checked={form.reminder_due_guardian} onChange={()=>toggle("reminder_due_guardian")}/> Guardian</label>

</div>

{/* POST */}

<div>
<h4 className="font-medium">Fee Reminder - Post Due Date</h4>

<label><input type="checkbox" checked={form.reminder_post_student} onChange={()=>toggle("reminder_post_student")}/> Student</label>
<label><input type="checkbox" checked={form.reminder_post_parent} onChange={()=>toggle("reminder_post_parent")}/> Parent</label>
<label><input type="checkbox" checked={form.reminder_post_guardian} onChange={()=>toggle("reminder_post_guardian")}/> Guardian</label>

</div>


{/* PAYMENT CONFIRMATION */}

<div>

<h4 className="font-medium">Fee Payment Confirmation</h4>

<label><input type="checkbox" checked={form.payment_confirmation_student} onChange={()=>toggle("payment_confirmation_student")}/> Student</label>
<label><input type="checkbox" checked={form.payment_confirmation_parent} onChange={()=>toggle("payment_confirmation_parent")}/> Parent</label>
<label><input type="checkbox" checked={form.payment_confirmation_guardian} onChange={()=>toggle("payment_confirmation_guardian")}/> Guardian</label>
<label><input type="checkbox" checked={form.payment_confirmation_admin} onChange={()=>toggle("payment_confirmation_admin")}/> Admin</label>

</div>


{/* CHEQUE */}

<div>

<h4 className="font-medium">Cheque Dishonoured Notification</h4>

<label><input type="checkbox" checked={form.cheque_dishonoured_student} onChange={()=>toggle("cheque_dishonoured_student")}/> Student</label>
<label><input type="checkbox" checked={form.cheque_dishonoured_parent} onChange={()=>toggle("cheque_dishonoured_parent")}/> Parent</label>
<label><input type="checkbox" checked={form.cheque_dishonoured_guardian} onChange={()=>toggle("cheque_dishonoured_guardian")}/> Guardian</label>
<label><input type="checkbox" checked={form.cheque_dishonoured_admin} onChange={()=>toggle("cheque_dishonoured_admin")}/> Admin</label>

</div>

<div>
<label>Email Ids for Fee Reports</label>
<input
className="soft-input"
name="fee_report_emails"
value={form.fee_report_emails}
onChange={handleChange}
/>
</div>

<label className="flex justify-between">
<span>PDC Reminder</span>
<input
type="checkbox"
checked={form.pdc_reminder}
onChange={()=>toggle("pdc_reminder")}
/>
</label>

</div>


{/* ================= PUSH ================= */}

<div className="bg-white p-6 border rounded-xl space-y-6">

<h2 className="font-semibold text-lg">Fees Notification (Push)</h2>

<label><input type="checkbox" checked={form.push_pre_student} onChange={()=>toggle("push_pre_student")}/> Pre Due Student</label>
<label><input type="checkbox" checked={form.push_pre_parent} onChange={()=>toggle("push_pre_parent")}/> Pre Due Parent</label>

<label><input type="checkbox" checked={form.push_due_student} onChange={()=>toggle("push_due_student")}/> Due Student</label>
<label><input type="checkbox" checked={form.push_due_parent} onChange={()=>toggle("push_due_parent")}/> Due Parent</label>

<label><input type="checkbox" checked={form.push_post_student} onChange={()=>toggle("push_post_student")}/> Post Due Student</label>
<label><input type="checkbox" checked={form.push_post_parent} onChange={()=>toggle("push_post_parent")}/> Post Due Parent</label>

<label><input type="checkbox" checked={form.push_payment_student} onChange={()=>toggle("push_payment_student")}/> Payment Student</label>
<label><input type="checkbox" checked={form.push_payment_parent} onChange={()=>toggle("push_payment_parent")}/> Payment Parent</label>

</div>


{/* ================= TAX ================= */}

<div className="bg-white p-6 border rounded-xl">

<label className="flex justify-between">
<span>Enable GST</span>
<input
type="checkbox"
checked={form.enable_gst}
onChange={()=>toggle("enable_gst")}
/>
</label>

</div>


{/* ================= ONLINE PAYMENT ================= */}

<div className="bg-white p-6 border rounded-xl space-y-4">

<h2 className="font-semibold text-lg">Online Payment</h2>

<label className="flex justify-between">
<span>Restrict Payment Chronological Order</span>
<input
type="checkbox"
checked={form.restrict_chronological_payment}
onChange={()=>toggle("restrict_chronological_payment")}
/>
</label>

<label>
<input type="checkbox" checked={form.online_fee_email} onChange={()=>toggle("online_fee_email")}/>
Online Fee Email
</label>

<input
className="soft-input"
name="online_fee_email_ids"
value={form.online_fee_email_ids}
onChange={handleChange}
/>

<label>
<input type="checkbox" checked={form.online_fee_sms} onChange={()=>toggle("online_fee_sms")}/>
Online Fee SMS
</label>

<input
className="soft-input"
name="online_fee_sms_numbers"
value={form.online_fee_sms_numbers}
onChange={handleChange}
/>

</div>


{/* ================= OFFLINE ================= */}

<div className="bg-white p-6 border rounded-xl space-y-4">

<h2 className="font-semibold text-lg">Offline Payment</h2>

<label>
<input type="checkbox" checked={form.offline_fee_email} onChange={()=>toggle("offline_fee_email")}/>
Offline Fee Email
</label>

<label>
<input type="checkbox" checked={form.offline_fee_sms} onChange={()=>toggle("offline_fee_sms")}/>
Offline Fee SMS
</label>

<label>
<input type="checkbox" checked={form.restrict_backdated_payment} onChange={()=>toggle("restrict_backdated_payment")}/>
Restrict Backdated Payments
</label>

</div>


{/* ================= RECEIPT ================= */}

<div className="bg-white p-6 border rounded-xl space-y-4">

<h2 className="font-semibold text-lg">Receipt Settings</h2>

<input className="soft-input" placeholder="Invoice Prefix" name="invoice_prefix" value={form.invoice_prefix} onChange={handleChange}/>
<input className="soft-input" placeholder="Refund Prefix" name="refund_prefix" value={form.refund_prefix} onChange={handleChange}/>

<label>
<input type="checkbox" checked={form.enable_financial_year_invoice} onChange={()=>toggle("enable_financial_year_invoice")}/>
Financial Year Invoice
</label>

<input className="soft-input" placeholder="CIN Number" name="cin_number" value={form.cin_number} onChange={handleChange}/>
<input className="soft-input" placeholder="PAN Number" name="pan_number" value={form.pan_number} onChange={handleChange}/>
<input className="soft-input" placeholder="Service Code" name="service_code" value={form.service_code} onChange={handleChange}/>
<input className="soft-input" placeholder="Accounting Code" name="accounting_code" value={form.accounting_code} onChange={handleChange}/>
<input className="soft-input" placeholder="State Code" name="state_code" value={form.state_code} onChange={handleChange}/>

<input className="soft-input" placeholder="Receipt Starting Number" name="receipt_start_number" value={form.receipt_start_number} onChange={handleChange}/>

<input className="soft-input" placeholder="Contact Numbers" name="receipt_contact_numbers" value={form.receipt_contact_numbers} onChange={handleChange}/>

</div>


{/* ================= SAVE BUTTON ================= */}

<div className="flex justify-end">

<PrimaryButton
onClick={save}
loading={loading}
name="Save Settings"
/>

</div>

</div>

</>
)}