"use client";

import React, { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { api } from "@/utils/api";
import PrimaryButton from "@/components/ui/PrimaryButton";

export default function CustomFieldTab() {
  const [reasons, setReasons] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

const [form, setForm] = useState({
  name: "",
  type: "textbox",
  description: "",
  show_on_student: "Y",
  is_required: "N",
  is_searchable: "N",
  sequence: "",
  max_length: "200",
  default_value: "",
  is_external: "N",
  prefilled_data: "",
});


  /* ---------------- FETCH ---------------- */
  const fetchReasons = async () => {
    try {
      setLoading(true);
      const res = await api.get("/custom-fields");

      if (res.data?.status === "success") {
        setReasons(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch closing reasons", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReasons();
  }, []);

  /* ---------------- ACTIONS ---------------- */

  const openCreate = () => {
    setEditing(null);
    setForm({
      name: "",
      type: "textbox",
      description: "",
      show_on_student: "Y",
      is_required: "N",
      is_searchable: "N",
      sequence: "1",
      max_length: "200",
      default_value: "",
      is_external: "N",
      prefilled_data: "",
    });
    setShowModal(true);
  };

const openEdit = (item) => {
  setEditing(item);
  setForm({
    name: item.name,
    description: item.description || "",
    type: item.type || "textbox",
    show_on_student: item.show_on_student || "N",
    is_required: item.is_required || "N",
    is_searchable: item.is_searchable || "N",
    sequence: item.sequence || "",
    max_length: item.max_length || "",
    default_value: item.default_value || "",
    is_external: item.is_external || "N",
    prefilled_data: (item.prefilled_data || []).join(", "),
  });
  setShowModal(true);
};


const saveReason = async () => {
  if (!form.name || !form.type) return;

  const payload = {
    name: form.name,
    description: form.description,

    type: form.type,
    show_on_student: form.show_on_student,
    is_required: form.is_required,
    is_searchable: form.is_searchable,
    is_external: form.is_external,

    sequence: form.sequence
      ? Number(form.sequence)
      : 0,

    max_length: form.max_length
      ? Number(form.max_length)
      : 0,

    default_value: form.default_value || null,

    prefilled_data: form.prefilled_data
      ? form.prefilled_data
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean)
      : [],
  };

  try {
    if (editing) {
      await api.put(
        `/custom-fields/${editing.id}`,
        payload
      );
    } else {
      await api.post(
        "/custom-fields",
        payload
      );
    }

    setShowModal(false);
    fetchReasons();
  } catch (err) {
    console.error("Save custom field failed", err);
  }
};


  const deleteReason = async (id) => {
    if (!confirm("Delete this closing reason?")) return;

    try {
      await api.delete(`/custom-fields/${id}`);
      fetchReasons();
    } catch (err) {
      console.error("Delete custom field failed", err);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-2 p-6">
      {/* HEADER ACTION */}
      <div className="flex justify-end">
        <PrimaryButton name={'+ Add Custom Field'} onClick={openCreate} />
      </div>

      {/* TABLE */}
      {loading ? (
        <div className="text-sm text-gray-500">Loading...</div>
      ) : reasons.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-sm text-gray-500 text-center">
          No Custom field defined
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
  <tr>
    {[
      "Field Name",
      "Type",
      "Show On Student",
      "Is Required",
      "Is Searchable",
      "Sequence",
      "Max Length",
      "Default Value",
      "Is External",
      "Action",
    ].map((h) => (
      <th
        key={h}
        className="px-4 py-2 text-left text-xs text-gray-600"
      >
        {h}
      </th>
    ))}
  </tr>
</thead>

<tbody className="divide-y">
  {reasons.map((r) => (
    <tr key={r.id}>
      <td className="px-4 py-2 font-medium">{r.name}</td>
      <td className="px-4 py-2">{r.type}</td>
      <td className="px-4 py-2">{r.show_on_student}</td>
      <td className="px-4 py-2">{r.is_required}</td>
      <td className="px-4 py-2">{r.is_searchable}</td>
      <td className="px-4 py-2">{r.sequence}</td>
      <td className="px-4 py-2">{r.max_length}</td>
      <td className="px-4 py-2">{r.default_value || "-"}</td>
      <td className="px-4 py-2">{r.is_external}</td>
      <td className="px-4 py-2 text-right">
        <div className="inline-flex gap-3">
          <button
            onClick={() => openEdit(r)}
            className="text-blue-600"
          >
            <EditOutlined />
          </button>
          <button
            onClick={() => deleteReason(r.id)}
            className="text-rose-600"
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

      {/* MODAL */}
      {showModal && (
        <Modal
          title={
            editing ? "Edit Custom Field" : "Create Custom Field"
          }
          onClose={() => setShowModal(false)}
        >
          <div className="grid grid-cols-3 gap-4">
            {/* LABEL */}
            <div>
              <label className="text-xs text-gray-500">Label *</label>
              <input
                className="soft-input mt-1"
                value={form.name}
                placeholder="Enter Label"
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />
            </div>

            {/* TYPE */}
            <div>
              <label className="text-xs text-gray-500">Type *</label>
              <select
                className="soft-input mt-1"
                value={form.type}
                onChange={(e) =>
                  setForm({ ...form, type: e.target.value })
                }
              >
                <option value="textbox">Textbox</option>
                <option value="dropdown">Select</option>
                <option value="checkbox">Checkbox</option>
                <option value="date">Date</option>
              </select>
            </div>

            {/* PREFILLED */}
            <div>
              <label className="text-xs text-gray-500">
                Prefilled Data (Non-Empty And Separated By ,)
              </label>
              <input
                className="soft-input mt-1"
                value={form.prefilled_data}
                placeholder="Enter Prefilled data"
                onChange={(e) =>
                  setForm({ ...form, prefilled_data: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Description</label>
              <input
                className="soft-input mt-1"
                value={form.description}
                placeholder="Enter Description"
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>
            {/* SHOW ON STUDENT */}
            <div>
              <label className="text-xs text-gray-500">
                Show On Student
              </label>
              <select
                className="soft-select mt-1"
                value={form.show_on_student}
                onChange={(e) =>
                  setForm({
                    ...form,
                    show_on_student: e.target.value,
                  })
                }
              >
                <option value="Y">Yes</option>
                <option value="N">No</option>
              </select>
            </div>

            {/* REQUIRED */}
            <div>
              <label className="text-xs text-gray-500">
                Is Required
              </label>
              <select
                className="soft-select mt-1"
                value={form.is_required}
                onChange={(e) =>
                  setForm({
                    ...form,
                    is_required: e.target.value,
                  })
                }
              >
                <option value="Y">Yes</option>
                <option value="N">No</option>
              </select>
            </div>

            {/* SEARCHABLE */}
            <div>
              <label className="text-xs text-gray-500">
                Is Searchable
              </label>
              <select
                className="soft-select mt-1"
                value={form.is_searchable}
                onChange={(e) =>
                  setForm({
                    ...form,
                    is_searchable: e.target.value,
                  })
                }
              >
                <option value="Y">Yes</option>
                <option value="N">No</option>
              </select>
            </div>

            {/* SEQUENCE */}
            <div>
              <label className="text-xs text-gray-500">
                Sequence (Numerals Only)
              </label>
              <input
                className="soft-input mt-1"
                value={form.sequence}
                placeholder="Enter Sequence Number"
                onChange={(e) =>
                  setForm({
                    ...form,
                    sequence: e.target.value,
                  })
                }
              />
            </div>

            {/* MAX LENGTH */}
            <div>
              <label className="text-xs text-gray-500">
                Max- Length (Numerals Only)
              </label>
              <input
                className="soft-input mt-1"
                value={form.max_length}
                readOnly="readonly"
                onChange={(e) =>
                  setForm({
                    ...form,
                    max_length: e.target.value,
                  })
                }
              />
            </div>

            {/* DEFAULT */}
            <div>
              <label className="text-xs text-gray-500">
                Default Value
              </label>
              <input
                className="soft-input mt-1"
                value={form.default_value}
                placeholder="Enter Default Value"
                onChange={(e) =>
                  setForm({
                    ...form,
                    default_value: e.target.value,
                  })
                }
              />
            </div>

            {/* EXTERNAL */}
            <div>
              <label className="text-xs text-gray-500">
                Is External
              </label>
              <select
                className="soft-input mt-1"
                value={form.is_external}
                onChange={(e) =>
                  setForm({
                    ...form,
                    is_external: e.target.value,
                  })
                }
              >
                <option value="Y">Yes</option>
                <option value="N">No</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button
              onClick={() => setShowModal(false)}
              className="soft-btn-outline"
            >
              Cancel
            </button>

            <PrimaryButton name={'Save'} onClick={saveReason} />
          </div>


        </Modal>
      )}
    </div>
  );
}
