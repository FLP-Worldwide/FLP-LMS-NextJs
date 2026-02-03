"use client";

export default function EnquiryFilters({ filters, setFilters }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
      <div className="flex gap-3 items-end overflow-x-auto">
        <select
          className="soft-select min-w-[160px]"
          value={filters.status}
          onChange={e =>
            setFilters(prev => ({ ...prev, status: e.target.value }))
          }
        >
          <option value="">All Status</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>

        <select
          className="soft-select min-w-[160px]"
          value={filters.priority}
          onChange={e =>
            setFilters(prev => ({ ...prev, priority: e.target.value }))
          }
        >
          <option value="">All Priority</option>
          <option value="Hot">Hot</option>
          <option value="Warm">Warm</option>
          <option value="Cold">Cold</option>
        </select>

        <input
          className="soft-input min-w-[220px]"
          placeholder="Search name / phone / enquiry no"
          value={filters.search}
          onChange={e =>
            setFilters(prev => ({ ...prev, search: e.target.value }))
          }
        />
      </div>
    </div>
  );
}
