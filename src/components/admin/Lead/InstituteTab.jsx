"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/utils/api";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { SettingOutlined } from "@ant-design/icons";

export default function InstituteTab() {
  const [institutes, setInstitutes] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [moreOpen, setMoreOpen] = useState(false);

  const handleDownloadTemplate = async () => {
    try {
      const response = await api.get("/lead-institutes/template", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(
        new Blob([response.data])
      );

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "lead-institutes-template.xlsx");

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

      setMoreOpen(false);
    } catch (error) {
      console.error("Template download failed", error);
    }
  };

  const handleBulkUpload = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      await api.post("/lead-institutes/bulk-upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      fetchInstitutes();
      setMoreOpen(false);
    } catch (error) {
      console.error("Bulk upload failed", error);
    }
  };


  const handleDownload = async () => {
    try {
      const response = await api.get("/lead-institutes/export", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(
        new Blob([response.data])
      );

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "lead-institutes-list.xlsx");

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

      setMoreOpen(false);
    } catch (error) {
      console.error("Export failed", error);
    }
  };


  /* ---------------- FETCH ---------------- */
  const fetchInstitutes = async () => {
    try {
      setLoading(true);
      const res = await api.get("/lead-institutes");

      if (res.data?.status === "success") {
        setInstitutes(res.data.data);
      }
    } catch (err) {
      console.error("Fetch institutes failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstitutes();
  }, []);

  /* ---------------- SAVE ---------------- */
  const handleSave = async () => {
    if (!name.trim()) return;

    try {
      if (editingId) {
        await api.put(`/lead-institutes/${editingId}`, { name });
      } else {
        await api.post("/lead-institutes", { name });
      }

      setName("");
      setEditingId(null);
      fetchInstitutes();
    } catch (err) {
      console.error("Save institute failed", err);
    }
  };

  /* ---------------- EDIT ---------------- */
  const handleEdit = (item) => {
    setEditingId(item.id);
    setName(item.name);
  };

  /* ---------------- DELETE ---------------- */
  const handleDelete = async (id) => {
    if (!confirm("Delete this institute?")) return;

    try {
      await api.delete(`/lead-institutes/${id}`);
      fetchInstitutes();
    } catch (err) {
      console.error("Delete institute failed", err);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-4 p-6">

      {/* HEADER SECTION */}
      <div className="flex justify-between items-center relative">

        {/* LEFT - ADD */}
        <div className="flex gap-3">
          <input
            className="soft-input"
            placeholder="Add Institute/School*"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <PrimaryButton
            name={editingId ? "Update" : "Add"}
            onClick={handleSave}
          />
        </div>

        {/* RIGHT - MORE DROPDOWN */}
        <div className="relative">
          <button
            onClick={() => setMoreOpen((v) => !v)}
            className="px-4 py-1 rounded-lg border border-gray-200 text-sm gap-1.5 flex
                      hover:bg-gray-100 transition"
          >
            More
            <SettingOutlined className="text-xs text-gray-500" />
          </button>

          {moreOpen && (
            <div
              className="absolute right-0 top-10 w-56 bg-white border border-gray-200
                        rounded-lg shadow-lg z-30"
            >
              <button
                onClick={handleDownloadTemplate}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
              >
                Download Import Template
              </button>

              <label className="w-full block text-left px-4 py-2 text-sm hover:bg-gray-50 cursor-pointer">
                Bulk Upload Institute
                <input
                  type="file"
                  accept=".xlsx,.csv"
                  className="hidden"
                  onChange={(e) =>
                    handleBulkUpload(e.target.files[0])
                  }
                />
              </label>

              <button
                onClick={handleDownload}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
              >
                Download Institute List
              </button>
            </div>
          )}
        </div>
      </div>


      {/* TABLE */}
      {loading ? (
        <div className="text-sm text-gray-500">Loading...</div>
      ) : institutes.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-sm text-gray-500 text-center">
          No institutes added
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs text-gray-600">
                  Institute/School Name
                </th>
                <th className="px-4 py-2 text-right text-xs text-gray-600">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {institutes.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-2 font-medium">
                    {item.name}
                  </td>

                  <td className="px-4 py-2 text-right">
                    <div className="inline-flex gap-3">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <EditOutlined />
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-rose-600 hover:text-rose-800"
                      >
                        <DeleteOutlined />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
