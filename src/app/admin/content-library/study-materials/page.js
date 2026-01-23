"use client";

import React, { useEffect, useState } from "react";
import PrimaryButton from "@/components/ui/PrimaryButton";
import UploadMaterialModal from "./UploadMaterialModal";
import { api } from "@/utils/api";
import { CloudUpload } from "lucide-react";

export default function StudyMaterialPage() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [materials, setMaterials] = useState([]); // subject-grouped
  const [loading, setLoading] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);

  /* ================= LOAD CLASSES ================= */
  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await api.get("/classes");
      setClasses(res.data?.data || []);
    } catch (err) {
      console.error("Failed to load classes", err);
    }
  };

  /* ================= LOAD MATERIALS ================= */
  useEffect(() => {
    if (!selectedClass) return;
    fetchMaterials(selectedClass.id);
  }, [selectedClass]);

  const fetchMaterials = async (classId) => {
    try {
      setLoading(true);
      const res = await api.get("/admin/study-materials", {
        params: { class_id: classId },
      });

      setMaterials(res.data?.data || []);
    } catch (err) {
      console.error("Failed to load study materials", err);
      setMaterials([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-white">

      {/* ================= LEFT CLASSES ================= */}
      <div className="w-72 border-r border-gray-200 bg-gray-50 p-2 space-y-1">
        {classes.map((c) => (
          <div
            key={c.id}
            onClick={() => setSelectedClass(c)}
            className={`p-2 rounded-lg border cursor-pointer ${
              selectedClass?.id === c.id
                ? "border-blue-600 bg-blue-50"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="text-sm">{c.name}</div>
          </div>
        ))}
      </div>

      {/* ================= RIGHT CONTENT ================= */}
      <div className="flex-1 p-6 space-y-4 overflow-y-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            {selectedClass ? selectedClass.name : "Select Class"}
          </h2>

          {selectedClass && (
            <PrimaryButton
              name="Upload Material"
              icon={<CloudUpload size={16} />}
              onClick={() => setOpenUpload(true)}
            />
          )}
        </div>

        {/* CONTENT */}
        {!selectedClass ? (
          <div className="text-gray-400 text-sm">
            Select a class to view study materials
          </div>
        ) : loading ? (
          <div className="text-sm text-gray-500">Loading...</div>
        ) : materials.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-6 text-sm text-gray-500 text-center">
            No study material uploaded
          </div>
        ) : (
          <div className="space-y-8">
            {materials.map((group) => (
              <div key={group.subject.id} className="space-y-3">

                {/* SUBJECT HEADER */}
                <h3 className="text-base font-semibold text-gray-800">
                  {group.subject.name}
                </h3>

                {/* MATERIAL GRID */}
                <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-3 gap-4">
                  {group.materials.map((m) => (
                    <div
                      key={m.id}
                      className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm"
                    >
                      {/* TYPE */}
                      <div className="text-xs text-blue-600 font-medium mb-1">
                        {m.type}
                      </div>

                      {/* TITLE / FILE */}
                      <div className="font-medium text-sm leading-snug line-clamp-2 break-words">
                        {m.title || m.file_name}
                      </div>

                      {/* TOPIC */}
                      <div className="text-xs text-gray-500 mt-1">
                        Topic: {m.topic?.name || "—"}
                      </div>

                      {/* ACTION */}
                     <div className="mt-3">
                        {m.video_url ? (
                            <a
                            href={m.video_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline"
                            >
                            Watch →
                            </a>
                        ) : m.file_name ? (
                            <a
                            href={`/storage/study-materials/${m.file_name}`}
                            target="_blank"
                            className="text-sm text-blue-600 hover:underline"
                            >
                            Download →
                            </a>
                        ) : (
                            <button
                            onClick={() => openPreview(m)}
                            className="text-sm text-blue-600 hover:underline"
                            >
                            Preview →
                            </button>
                        )}
                        </div>

                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= UPLOAD MODAL ================= */}
      {openUpload && (
        <UploadMaterialModal
          onClose={() => {
            setOpenUpload(false);
            if (selectedClass) fetchMaterials(selectedClass.id); // refresh
          }}
          defaultClass={selectedClass}
        />
      )}
    </div>
  );
}
