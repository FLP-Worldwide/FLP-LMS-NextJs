"use client";

import React, { useEffect, useState } from "react";
import PrimaryButton from "@/components/ui/PrimaryButton";
import Modal from "@/components/ui/Modal";
import { api } from "@/utils/api";
import {
  Folder,
  FileText,
  Link2,
  Trash2,
  UploadCloud,
  Plus,
  ChevronRight,
} from "lucide-react";
import UploadFilesModal from "./UploadFilesModal";

export default function FileManager() {
  const [items, setItems] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [folderName, setFolderName] = useState("");

  useEffect(() => {
    loadItems(null);
  }, []);

  const loadItems = async (parentId) => {
    setLoading(true);
    const res = await api.get("/admin/resources", {
      params: { parent_id: parentId },
    });
    setItems(res.data?.data || []);
    setLoading(false);
  };

  const openFolder = (folder) => {
    setCurrentFolder(folder);
    setBreadcrumbs((p) => [...p, folder]);
    loadItems(folder.id);
  };

  const goToCrumb = (index) => {
    const newCrumbs = breadcrumbs.slice(0, index + 1);
    setBreadcrumbs(newCrumbs);
    setCurrentFolder(newCrumbs[index] || null);
    loadItems(newCrumbs[index]?.id || null);
  };

  const createFolder = async () => {
    if (!folderName.trim()) return;

    await api.post("/admin/resources/folder", {
      name: folderName,
      parent_id: currentFolder?.id || null,
    });

    setFolderName("");
    setShowCreateFolder(false);
    loadItems(currentFolder?.id || null);
  };

  const deleteItem = async (item) => {
    if (!confirm("Delete this item?")) return;
    await api.delete(`/admin/resources/${item.type}/${item.id}`);
    loadItems(currentFolder?.id || null);
  };

  const folders = items.filter((i) => i.type === "folder");
  const files = items.filter((i) => i.type !== "folder");

  return (
    <div className="p-6 space-y-4 bg-white">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-sm">
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => {
              setBreadcrumbs([]);
              setCurrentFolder(null);
              loadItems(null);
            }}
          >
            Root
          </span>

          {breadcrumbs.map((b, i) => (
            <React.Fragment key={b.id}>
              <ChevronRight size={14} />
              <span
                className="text-blue-600 cursor-pointer"
                onClick={() => goToCrumb(i)}
              >
                {b.name}
              </span>
            </React.Fragment>
          ))}
        </div>

        <div className="flex gap-2">
          <PrimaryButton
            name="Upload Files"
            icon={<UploadCloud size={16} />}
            onClick={() => setShowUpload(true)}
          />
          <PrimaryButton
            name="Create Folder"
            icon={<Plus size={16} />}
            onClick={() => setShowCreateFolder(true)}
          />
        </div>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="text-sm text-gray-500">Loading...</div>
      ) : (
        <div className="space-y-6 p-6">

          {/* FOLDERS */}
          {folders.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {folders.map((f) => (
                <div
                  key={f.id}
                  onClick={() => openFolder(f)}
                  className="border border-gray-200 rounded-xl p-4 cursor-pointer hover:shadow-sm"
                >
                  <div className="flex justify-between">
                    <Folder className="text-yellow-500" />
                    <Trash2
                      size={14}
                      className="text-rose-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteItem(f);
                      }}
                    />
                  </div>
                  <div className="mt-2 text-sm font-medium truncate">
                    {f.name}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* FILES */}
          {files.length > 0 && (
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex justify-between items-center px-4 py-3 border-b border-gray-200 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    {file.type === "link" ? (
                      <Link2 className="text-green-600" />
                    ) : (
                      <FileText className="text-blue-600" />
                    )}

                    <div>
                      <div className="text-sm font-medium">
                        {file.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {file.file_size || "—"}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 items-center">
                    {file.type === "link" && (
                      <a
                        href={file.url}
                        target="_blank"
                        className="text-blue-600 text-sm"
                      >
                        Open
                      </a>
                    )}
                    <Trash2
                      size={16}
                      className="text-rose-600 cursor-pointer"
                      onClick={() => deleteItem(file)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {folders.length === 0 && files.length === 0 && (
            <div className="text-sm text-gray-400 text-center">
              This folder is empty
            </div>
          )}
        </div>
      )}

      {/* CREATE FOLDER MODAL */}
      {showCreateFolder && (
        <Modal title="Create Folder" onClose={() => setShowCreateFolder(false)}>
          <div className="space-y-4 p-6">
            <input
              className="soft-input"
              placeholder="Folder name"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                className="soft-btn-outline"
                onClick={() => setShowCreateFolder(false)}
              >
                Cancel
              </button>
              <PrimaryButton name="Create" onClick={createFolder} />
            </div>
          </div>
        </Modal>
      )}

      {/* UPLOAD MODAL */}
      {showUpload && (
        <UploadFilesModal
          parentId={currentFolder?.id || null}
          onClose={() => {
            setShowUpload(false);
            loadItems(currentFolder?.id || null);
          }}
        />
      )}
    </div>
  );
}
