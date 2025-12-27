"use client";

export default function EnquiryFilters() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
      {/* TABS */}
      <div className="flex gap-2">
        <button className="px-6 py-1 rounded-full bg-blue-50 text-blue-700 text-xs uderline">
          List
        </button>
        <button className="px-6 py-1 rounded-full text-sm text-gray-600 text-xs uderline">
          Status
        </button>
        <button className="px-6 py-1 rounded-full text-sm text-gray-600 text-xs uderline">
          Priority
        </button>
      </div>

      {/* FILTER ROW – SINGLE LINE */}
      <div className="flex gap-3 items-end overflow-x-auto whitespace-nowrap">
        <select className="soft-select min-w-[160px]">
          <option>All Status</option>
          <option>Open</option>
          <option>Closed</option>
        </select>

        <select className="soft-select min-w-[160px]">
          <option>All Priority</option>
          <option>Hot</option>
          <option>Warm</option>
          <option>Cold</option>
        </select>

        <select className="soft-select min-w-[160px]">
          <option>All Source</option>
        </select>

        <input
          className="soft-input min-w-[220px]"
          placeholder="Search name / phone"
        />
      </div>
    </div>
  );
}
