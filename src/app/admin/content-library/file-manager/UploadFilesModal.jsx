"use client";

import React, { useState } from "react";
import Modal from "@/components/ui/Modal";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { api } from "@/utils/api";
import {
  Youtube,
  FileText,
  Book,
  Image,
  MoreHorizontal,
  ClipboardList,
  Plus,
} from "lucide-react";

const TYPES = [
  { key: "Vimeo", label: "Vimeo", icon: <FileText /> },
  { key: "YouTube", label: "YouTube URL", icon: <Youtube /> },
  { key: "Assignments", label: "Assignments", icon: <ClipboardList /> },
  { key: "Exam", label: "Exam", icon: <FileText /> },
  { key: "E-Book", label: "E-Book", icon: <Book /> },
  { key: "Gallery", label: "Gallery", icon: <Image /> },
  { key: "Other", label: "Other", icon: <MoreHorizontal /> },
];

export default function UploadFilesModal({ onClose, parentId = null }) {
  const [type, setType] = useState("Vimeo");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ================= SUBMIT ================= */
  const submit = async () => {
    try {
      setLoading(true);

      // 🔗 LINK (Vimeo / YouTube)
      if (type === "Vimeo" || type === "YouTube") {
        if (!title || !url) {
          alert("Title and URL are required");
          return;
        }

        await api.post("/admin/resources/link", {
          parent_id: parentId,
          name: title,
          url: url,
        });
      }

      // 📁 FILE UPLOAD
      else {
        if (!file) {
          alert("Please choose a file");
          return;
        }

        const fd = new FormData();
        fd.append("parent_id", parentId);
        fd.append("file", file);

        await api.post("/admin/resources/upload", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      alert("Uploaded successfully");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Upload Files" onClose={onClose} className="max-w-6xl">
      <div className="space-y-6 p-6">

        {/* ================= TYPE SELECT ================= */}
        <div className="grid grid-cols-7 gap-4">
          {TYPES.map((t) => (
            <button
              key={t.key}
              onClick={() => setType(t.key)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border
                ${type === t.key
                  ? "border-blue-600 shadow-sm"
                  : "border-gray-200 hover:bg-gray-50"}
              `}
            >
              <div className="text-xl">{t.icon}</div>
              <div className="text-sm font-medium">{t.label}</div>
              {type === t.key && (
                <div className="h-1 w-full bg-blue-600 rounded-full mt-2" />
              )}
            </button>
          ))}
        </div>

        {/* ================= TITLE ================= */}
        <input
          className="soft-input h-12"
          placeholder="Please Enter Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* ================= FILE / LINK ================= */}
        {(type === "Vimeo" || type === "YouTube") ? (
          <input
            className="soft-input h-12"
            placeholder="Enter video URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        ) : (
          <label className="flex items-center justify-center gap-3 h-24 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50">
            <Plus className="text-blue-600" />
            <span className="text-blue-600 font-medium">
              Choose Files
            </span>
            <input
              type="file"
              hidden
              onChange={(e) => setFile(e.target.files[0])}
            />
          </label>
        )}

        {/* ================= FOOTER ================= */}
        <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
          <button className="soft-btn-outline" onClick={onClose}>
            Cancel
          </button>
          <PrimaryButton
            name={loading ? "Uploading..." : "Upload"}
            onClick={submit}
            disabled={loading}
          />
        </div>
      </div>
    </Modal>
  );
}
