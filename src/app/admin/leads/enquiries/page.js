"use client";

import React, { useState } from "react";
import PrimaryButton from "@/components/ui/PrimaryButton";
import EnquiryTable from "@/components/admin/enquiry/EnquiryTable";
import AddEnquiryModal from "@/components/admin/enquiry/AddEnquiryModal";
import AdvanceEnquiryFilter from "@/components/admin/enquiry/AdvanceFilterDrawer";

export default function EnquiryPage() {
  const [showModal, setShowModal] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    follow_up_type: "",
    follow_up_date: "",

    enquiry_change_from: "",
    enquiry_change_to: "",

    enquiry_from_date: "",
    enquiry_to_date: "",

    institute_id: "",
    assigned_to: "",
    source_id: "",
    referred_by_id: "",

    country: "",
    state: "",
    city: "",

    category_id: "",
    batch_id: "",
    standard_id: "",
    subject_id: "",
  });

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Enquiries</h2>
          <p className="text-sm text-gray-500">
            Manage all enquiries and follow-ups
          </p>
        </div>

        <div className="flex gap-2">
          <PrimaryButton
            name="Advance Filter"
            variant="outline"
            onClick={() => setShowFilter(true)}
          />
          <PrimaryButton
            name="+ Add Enquiry"
            onClick={() => setShowModal(true)}
          />
        </div>
      </div>

      {/* LIST */}
      <EnquiryTable filters={filters} />

      {/* FILTER DRAWER */}
      {showFilter && (
        <AdvanceEnquiryFilter
          filters={filters}
          setFilters={setFilters}
          onClose={() => setShowFilter(false)}
        />
      )}

      {/* ADD MODAL */}
      {showModal && (
        <AddEnquiryModal onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
