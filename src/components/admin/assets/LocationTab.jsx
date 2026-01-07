
"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { api } from "@/utils/api";

const emptyForm = {
  name: "",
  code: "",
  description: "",
};

export default function LocationTab() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  /* ---------------- FETCH ---------------- */
  const fetchLocations = async () => {
    setLoading(true);
    try {
      const res = await api.get("/asset-locations");
      setList(res.data?.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  /* ---------------- SAVE ---------------- */
  const saveLocation = async () => {
    try {
      if (editingId) {
        await api.patch(`/asset-locations/${editingId}`, form);
      } else {
        await api.post("/asset-locations", form);
      }
      setShowModal(false);
      setForm(emptyForm);
      setEditingId(null);
      fetchLocations();
    } catch (e) {
      alert("Failed to save location");
    }
  };

  /* ---------------- DELETE ---------------- */
  const deleteLocation = async (id) => {
    if (!confirm("Delete location?")) return;
    await api.delete(`/asset-locations/${id}`);
    fetchLocations();
  };

  /* ---------------- EDIT ---------------- */
  const openEdit = (l) => {
    setForm({
      name: l.name || "",
      code: l.code || "",
      description: l.description || "",
    });
    setEditingId(l.id);
    setShowModal(true);
  };

  return (
    <>
      {/* ADD BUTTON */}
      <div className="flex justify-end">
        <PrimaryButton
          name="+ Add Location"
          onClick={() => {
            setForm(emptyForm);
            setEditingId(null);
            setShowModal(true);
          }}
        />
      </div>

      {/* TABLE / EMPTY */}
      {loading ? (
        <div className="text-sm text-gray-500">Loading...</div>
      ) : list.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-sm text-gray-500 text-center">
          No location data available
        </div>
      ) : (
        <table className="w-full text-sm bg-white border border-gray-200 rounded-xl">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Code</th>
              <th className="px-4 py-2 text-left">Description</th>
              <th className="px-4 py-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {list.map((l) => (
              <tr key={l.id}>
                <td className="px-4 py-2">{l.name}</td>
                <td className="px-4 py-2">{l.code}</td>
                <td className="px-4 py-2">{l.description}</td>
                <td className="px-4 py-2 text-right">
                  <EditOutlined
                    className="mr-3 text-blue-600 cursor-pointer"
                    onClick={() => openEdit(l)}
                  />
                  <DeleteOutlined
                    className="text-rose-600 cursor-pointer"
                    onClick={() => deleteLocation(l.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* MODAL */}
      {showModal && (
        <Modal title="Add Location" onClose={() => setShowModal(false)}>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="soft-label">
                Location Name <span className="text-red-500">*</span>
              </label>
              <input
                className="soft-input"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="soft-label">Code</label>
              <input
                className="soft-input"
                value={form.code}
                onChange={(e) =>
                  setForm({ ...form, code: e.target.value })
                }
              />
            </div>

            <div className="col-span-3">
              <label className="soft-label">Description</label>
              <input
                className="soft-input"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              className="soft-btn-outline"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
            <PrimaryButton name="Save" onClick={saveLocation} />
          </div>
        </Modal>
      )}
    </>
  );
}
