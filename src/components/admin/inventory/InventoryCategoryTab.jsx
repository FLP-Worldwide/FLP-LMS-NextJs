"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { api } from "@/utils/api";
import { FileExcelOutlined } from "@ant-design/icons";

export default function InventoryCategoryTab() {
  const [list, setList] = useState([]);
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    category_name: "",
    description: "",
  });

  const handleDownloadExcel = async () => {
  try {
    const response = await api.get("/reports/inventory/category/export", {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(
      new Blob([response.data])
    );

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "inventory-categories.xlsx");

    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Category export failed", error);
    alert("Failed to download Excel");
  }
};


  /* ================= FETCH LIST ================= */
  const fetchCategories = async () => {
    try {
      const res = await api.get("/inventory/category");
      setList(Array.isArray(res.data?.data) ? res.data?.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  /* ================= SAVE ================= */
  const saveCategory = async () => {
    if (!form.category_name) return alert("Category name required");

    setLoading(true);
    try {
      if (editing) {
        await api.patch(`/inventory/category/${editing}`, form);
      } else {
        await api.post("/inventory/category", form);
      }

      fetchCategories();
      setShow(false);
      setEditing(null);
      setForm({ category_name: "", description: "" });
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ================= EDIT ================= */
  const edit = (c) => {
    setEditing(c.id);
    setForm({
      category_name: c.category_name || "",
      description: c.description || "",
    });
    setShow(true);
  };

  /* ================= DELETE ================= */
  const remove = async (id) => {
    if (!confirm("Delete category?")) return;

    try {
      await api.delete(`/inventory/category/${id}`);
      fetchCategories();
    } catch (err) {
      console.error(err);
      alert("Failed to delete");
    }
  };

  return (
    <>
      {/* ADD BUTTON */}
        <div className="flex justify-end gap-3">

        {/* Excel Hover Expand Button */}
        <button
          onClick={handleDownloadExcel}
          className="group flex items-center gap-2 
                    border border-gray-200 rounded-lg 
                    px-3 py-2 overflow-hidden
                    transition-all duration-300
                    hover:bg-green-50 hover:shadow-sm"
        >
          <FileExcelOutlined className="text-green-600 text-lg" />

          <span
            className="max-w-0 opacity-0 overflow-hidden whitespace-nowrap
                      group-hover:max-w-xs group-hover:opacity-100
                      transition-all duration-300 text-sm text-green-700"
          >
            Download Excel
          </span>
        </button>

        <PrimaryButton name="+ Add Category" onClick={() => setShow(true)} />

      </div>


      {/* TABLE */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Description</th>
              <th className="px-4 py-2 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {list.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-6 text-gray-500">
                  No category found
                </td>
              </tr>
            ) : (
              list.map((c) => (
                <tr key={c.id}>
                  <td className="px-4 py-2">{c.category_name}</td>
                  <td className="px-4 py-2">{c.description || "—"}</td>
                  <td className="px-4 py-2 text-right">
                    <EditOutlined
                      className="mr-3 text-blue-600 cursor-pointer"
                      onClick={() => edit(c)}
                    />
                    <DeleteOutlined
                      className="text-rose-600 cursor-pointer"
                      onClick={() => remove(c.id)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {show && (
        <Modal title="Add Category" onClose={() => setShow(false)}>
          <div className="space-y-4 p-6">
            <div>
              <label className="soft-label">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                className="soft-input"
                placeholder="Enter Category Name"
                value={form.category_name}
                onChange={(e) =>
                  setForm({ ...form, category_name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="soft-label">Description</label>
              <textarea
                className="soft-input"
                placeholder="Enter description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <PrimaryButton
              name={editing ? "Update Category" : "Add Category"}
              onClick={saveCategory}
              disabled={loading}
            />
          </div>
        </Modal>
      )}
    </>
  );
}
