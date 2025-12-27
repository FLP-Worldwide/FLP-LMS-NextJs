"use client";

import React, { useState } from "react";
import PrimaryButton from "@/components/ui/PrimaryButton";
import EnquiryFilters from "@/components/admin/enquiry/EnquiryFilters";
import EnquiryTable from "@/components/admin/enquiry/EnquiryTable";
import AddEnquiryModal from "@/components/admin/enquiry/AddEnquiryModal";

export default function EnquiryPage() {
  const [showModal, setShowModal] = useState(false);

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

        <PrimaryButton
          name="+ Add Enquiry"
          onClick={() => setShowModal(true)}
        />
      </div>

      {/* FILTERS */}
      <EnquiryFilters />

      {/* LIST */}
      <EnquiryTable />

      {/* ADD ENQUIRY MODAL */}
      {showModal && (
        <AddEnquiryModal onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
