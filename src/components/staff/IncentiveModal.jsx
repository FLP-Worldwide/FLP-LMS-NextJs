
"use client";
import Modal from "@/components/ui/Modal";

export default function IncentiveModal({ onClose }) {
  return (
    <Modal title="Add Incentive" onClose={onClose}>
      <input placeholder="Title" className="soft-input" />
      <input placeholder="Amount" className="soft-input mt-2" />

      <div className="flex justify-end gap-2 mt-4">
        <button onClick={onClose} className="soft-btn-outline">
          Cancel
        </button>
        <button className="soft-btn">Add</button>
      </div>
    </Modal>
  );
}
