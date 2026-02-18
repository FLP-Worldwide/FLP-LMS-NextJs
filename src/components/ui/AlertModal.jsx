"use client";

import Modal from "@/components/ui/Modal";
import PrimaryButton from "@/components/ui/PrimaryButton";

const TYPE_STYLES = {
  danger: {
    iconBg: "bg-red-100",
    iconText: "text-red-600",
    title: "text-red-600",
  },
  warning: {
    iconBg: "bg-yellow-100",
    iconText: "text-yellow-600",
    title: "text-yellow-600",
  },
  info: {
    iconBg: "bg-blue-100",
    iconText: "text-blue-600",
    title: "text-blue-600",
  },
  success: {
    iconBg: "bg-green-100",
    iconText: "text-green-600",
    title: "text-green-600",
  },
};

export default function AlertModal({
  open,
  onClose,
  onConfirm,

  title = "Are you sure?",
  message = "",
  subMessage = "",
  confirmText = "Confirm",
  cancelText = "Cancel",

  type = "danger", // danger | warning | info | success
  loading = false,
}) {
  if (!open) return null;

  const style = TYPE_STYLES[type] || TYPE_STYLES.danger;

  return (
    <Modal
      title={title}
      onClose={onClose}
      className="max-w-md"
    >
      {/* BODY */}
      <div className="space-y-3 p-6">
        <div className="flex items-start gap-3">
          {/* ICON */}
          <div
            className={`h-10 w-10 rounded-full
                        flex items-center justify-center
                        font-bold text-lg
                        ${style.iconBg} ${style.iconText}`}
          >
            !
          </div>

          <div className="space-y-1">
            <p className={`text-sm font-medium ${style.title}`}>
              {title}
            </p>

            {message && (
              <p className="text-sm text-gray-600">
                {message}
              </p>
            )}
          </div>
        </div>

        {subMessage && (
          <div className="text-sm text-gray-500 pt-1">
            {subMessage}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="flex justify-end gap-2 pt-6">
        <button
          className="soft-btn-outline"
          onClick={onClose}
          disabled={loading}
        >
          {cancelText}
        </button>

        <PrimaryButton
          name={loading ? "Please wait..." : confirmText}
          onClick={onConfirm}
          disabled={loading}
        />
      </div>
    </Modal>
  );
}
