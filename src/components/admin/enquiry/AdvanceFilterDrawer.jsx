"use client";

import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecodaryButton";

const Field = ({ label, children }) => (
  <div className="space-y-1">
    <label className="text-sm text-gray-700">{label}</label>
    {children}
  </div>
);

export default function AdvanceEnquiryFilter({
  filters,
  setFilters,
  onClose,
}) {
  const update = (name, value) =>
    setFilters(prev => ({ ...prev, [name]: value }));

  const clearField = name => update(name, "");

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
      <div className="w-full max-w-xl bg-white h-full overflow-y-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">Advance Filter</h3>
          <button onClick={onClose} className="text-xl">×</button>
        </div>

        {/* BODY */}
        <div className="p-4 grid grid-cols-2 gap-4">
          <Field label="Status">
            <select
              className="soft-select"
              value={filters.status}
              onChange={e => update("status", e.target.value)}
            >
              <option value="">Select Status</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="on-hold">On Hold</option>
            </select>
          </Field>

          <Field label="Enquiry Priority">
            <select
              className="soft-select"
              value={filters.priority}
              onChange={e => update("priority", e.target.value)}
            >
              <option value="">Select Priority</option>
              <option>Hot</option>
              <option>Warm</option>
              <option>Cold</option>
            </select>
          </Field>

          <Field label="Follow up Type">
            <select
              className="soft-select"
              value={filters.follow_up_type}
              onChange={e => update("follow_up_type", e.target.value)}
            >
              <option value="">Select Follow up Type</option>
              <option>Call</option>
              <option>Visit</option>
              <option>Demo</option>
            </select>
          </Field>

          <Field label="Follow-up Date">
            <input
              type="date"
              className="soft-input"
              value={filters.follow_up_date}
              onChange={e => update("follow_up_date", e.target.value)}
            />
          </Field>

          <Field label="Enquiry Changes From">
            <input
              type="date"
              className="soft-input"
              value={filters.enquiry_change_from}
              onChange={e => update("enquiry_change_from", e.target.value)}
            />
            {filters.enquiry_change_from && (
              <button
                onClick={() => clearField("enquiry_change_from")}
                className="text-xs text-blue-600"
              >
                Clear
              </button>
            )}
          </Field>

          <Field label="Enquiry Changes To">
            <input
              type="date"
              className="soft-input"
              value={filters.enquiry_change_to}
              onChange={e => update("enquiry_change_to", e.target.value)}
            />
          </Field>

          <Field label="Enquiry From Date">
            <input
              type="date"
              className="soft-input"
              value={filters.enquiry_from_date}
              onChange={e => update("enquiry_from_date", e.target.value)}
            />
          </Field>

          <Field label="Enquiry To Date">
            <input
              type="date"
              className="soft-input"
              value={filters.enquiry_to_date}
              onChange={e => update("enquiry_to_date", e.target.value)}
            />
          </Field>

          <Field label="Institute / School Name">
            <select className="soft-select">
              <option>Select Institute/School Name</option>
            </select>
          </Field>

          <Field label="Assign To">
            <select className="soft-select">
              <option>Select Assignee</option>
            </select>
          </Field>

          <Field label="Source">
            <select className="soft-select">
              <option>Select Source</option>
            </select>
          </Field>

          <Field label="Referred By">
            <select className="soft-select">
              <option>Select Referred</option>
            </select>
          </Field>

          <Field label="Country">
            <select className="soft-select">
              <option>Select Country</option>
            </select>
          </Field>

          <Field label="State">
            <select className="soft-select">
              <option>Select State</option>
            </select>
          </Field>

          <Field label="City">
            <select className="soft-select">
              <option>Select City</option>
            </select>
          </Field>

          <Field label="Category / Course">
            <select className="soft-select">
              <option>Select Category/Course</option>
            </select>
          </Field>

          <Field label="Batch">
            <select className="soft-select">
              <option>Select Batch</option>
            </select>
          </Field>

          <Field label="Standard">
            <select className="soft-select">
              <option>Select Standard</option>
            </select>
          </Field>

          <Field label="Subject">
            <select className="soft-select">
              <option>Select Subject</option>
            </select>
          </Field>
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t flex justify-end gap-2">
          <SecondaryButton
            name="Cancel"
            onClick={onClose}
          />
          <PrimaryButton
            name="Apply"
            onClick={onClose}
          />
        </div>
      </div>
    </div>
  );
}
