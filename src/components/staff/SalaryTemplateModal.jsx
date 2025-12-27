"use client";
import Modal from "@/components/ui/Modal";

export default function SalaryTemplateModal({ onClose }) {
  return (
    <Modal title="Change Salary Template" onClose={onClose}>
      <select className="soft-select">
        <option>Teacher Monthly</option>
        <option>Staff Monthly</option>
        <option>Hourly Faculty</option>
      </select>

      <div className="flex justify-end gap-2 mt-4">
        <button onClick={onClose} className="soft-btn-outline">
          Cancel
        </button>
        <button className="soft-btn">Save</button>
      </div>
    </Modal>
  );
}
