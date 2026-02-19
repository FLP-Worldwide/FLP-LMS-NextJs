"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import SubMenu from "@/components/ui/SubMenu";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { api } from "@/utils/api";

import DraftAssignmentsTab from "@/components/admin/assignment/DraftAssignmentsTab";
import PublishedAssignmentsTab from "@/components/admin/assignment/PublishedAssignmentsTab";
import PastAssignmentsTab from "@/components/admin/assignment/PastAssignmentsTab";
import AssignmentFilters from "@/components/admin/assignment/AssignmentFilters";
import CreateAssignmentModal from "@/components/admin/assignment/CreateAssignmentModal";

const assignmentMenus = [
  { label: "Draft", href: "/admin/assignments" },
  { label: "Published", href: "/admin/assignments?type=published" },
  { label: "Past", href: "/admin/assignments?type=past" },
];

export default function AssignmentsPage() {
  const searchParams = useSearchParams();
  const status = searchParams.get("type") || "draft";

  const [loading, setLoading] = useState(false);
  const [grouped, setGrouped] = useState({
    draft: [],
    active: [],
    past: [],
  });


  const [modalAssignment, setModalAssignment] = useState(null); // null = create

  /* ================= LOAD ================= */
  const fetchAssignments = async (filters = {}) => {
    try {
      setLoading(true);
      const res = await api.get("/assignments/grouped", { params: filters });
      setGrouped(res.data?.data || {});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  return (
    <div className="space-y-4 p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Assignments</h2>
          <p className="text-sm text-gray-500">
            Manage draft, published & past assignments
          </p>
        </div>

        <PrimaryButton
          name="Create Assignment"
          onClick={() => setModalAssignment({})}
        />
      </div>

      <SubMenu items={assignmentMenus} />
      <AssignmentFilters onApply={fetchAssignments} />

      {loading ? (
        <div className="text-sm text-gray-500">Loading...</div>
      ) : (
        <>
          {status === "draft" && (
            <DraftAssignmentsTab
              assignments={grouped.draft}
              onEdit={(a) => setModalAssignment(a)}
            />
          )}

          {status === "published" && (
            <PublishedAssignmentsTab assignments={grouped.active} />
          )}

          {status === "past" && (
            <PastAssignmentsTab assignments={grouped.past} />
          )}
        </>
      )}

      {/* CREATE / EDIT MODAL */}
      {modalAssignment !== null && (
        <CreateAssignmentModal
          assignment={modalAssignment}
          onClose={() => setModalAssignment(null)}
          onSaved={() => {
            setModalAssignment(null);
            fetchAssignments();
          }}
        />
      )}
    </div>
  );
}
