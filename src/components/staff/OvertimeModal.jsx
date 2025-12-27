"use client";

import Modal from "@/components/ui/Modal";

export default function OvertimeModal({ onClose }) {
  return (
    <Modal title="Add Overtime" onClose={onClose}>
      <input
        placeholder="Hours"
        className="soft-input"
      />

      <input
        placeholder="Reason"
        className="soft-input mt-2"
      />

      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={onClose}
          className="soft-btn-outline"
        >
          Cancel
        </button>
        <button className="soft-btn">
          Add
        </button>
      </div>
    </Modal>
  );
}
