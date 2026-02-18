"use client";

import React, { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { api } from "@/utils/api";
import { STATES } from "@/constants/locations";
import PrimaryButton from "@/components/ui/PrimaryButton";

export default function CityAreaTab() {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);

  /* FILTERS */
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [isActive, setIsActive] = useState(true);

  /* MODAL */
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    state: "",
    city: "",
    area: "",
  });

  /* FETCH */
  const fetchAreas = async () => {
    try {
      setLoading(true);

      const res = await api.get("/areas", {
        params: {
          state,
          city,
          is_active: isActive ? 1 : 0,
        },
      });

      if (res.data?.status === "success") {
        setAreas(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch areas", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  /* HANDLERS */
  const openCreate = () => {
    setEditing(null);
    setForm({ state, city, area: "" });
    setShowModal(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setForm({
      state: row.state,
      city: row.city,
      area: row.area,
    });
    setShowModal(true);
  };

  const saveArea = async () => {
    if (!form.state || !form.city || !form.area) return;

    try {
      if (editing) {
        await api.put(`/areas/${editing.id}`, {
          state: form.state,
          city: form.city,
          area: form.area,
        });
      } else {
        await api.post("/areas", {
          state: form.state,
          city: form.city,
          area: form.area,
        });
      }

      setShowModal(false);
      fetchAreas();
    } catch (err) {
      console.error("Save area failed", err);
    }
  };

  const deleteArea = async (id) => {
    if (!confirm("Delete this area?")) return;

    try {
      await api.delete(`/areas/${id}`);
      fetchAreas();
    } catch (err) {
      console.error("Delete area failed", err);
    }
  };

  /* DERIVED */
  const cities =
    STATES.find((s) => s.name === state)?.districts || [];

  const modalCities =
    STATES.find((s) => s.name === form.state)?.districts || [];

  /* UI */
  return (
    <div className="space-y-4 p-6">
      {/* FILTER BAR */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap gap-3 items-end">
        <div>
          <label className="text-xs text-gray-500">State</label>
          <select
            className="soft-select mt-1"
            value={state}
            onChange={(e) => {
              setState(e.target.value);
              setCity("");
            }}
          >
              <option value="">ALL</option>
            {STATES.map((s) => (
              <option key={s.name}>{s.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs text-gray-500">City</label>
          <select
            className="soft-select mt-1"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            <option value="">All</option>
            {cities.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 pt-5">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          <span className="text-sm">Is Active</span>
        </div>

        <PrimaryButton name="Search" onClick={fetchAreas} />

        <div className="flex-1" />

        <PrimaryButton
          name="+ Add Area"
          variant="outline"
          onClick={openCreate}
        />
      </div>

      {/* TABLE */}
      {loading ? (
        <div className="text-sm text-gray-500">Loading...</div>
      ) : areas.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-sm text-gray-500 text-center">
          No areas found
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-4 py-2 text-left">State</th>
                <th className="px-4 py-2 text-left">City</th>
                <th className="px-4 py-2 text-left">Area</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {areas.map((a) => (
                <tr key={a.id} className="border-gray-200">
                  <td className="px-4 py-2">{a.state}</td>
                  <td className="px-4 py-2">{a.city}</td>
                  <td className="px-4 py-2 font-medium">{a.area}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        a.is_active
                          ? "bg-blue-50 text-blue-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {a.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <div className="inline-flex gap-3">
                      <button
                        onClick={() => openEdit(a)}
                        className="text-blue-600"
                      >
                        <EditOutlined />
                      </button>
                      <button
                        onClick={() => deleteArea(a.id)}
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
          title={editing ? "Edit Area" : "Create Area"}
          onClose={() => setShowModal(false)}
        >
          <div className="space-y-3">
            <select
              className="soft-select"
              value={form.state}
              onChange={(e) =>
                setForm({
                  ...form,
                  state: e.target.value,
                  city: "",
                })
              }
            >
              <option value="">Select State</option>
              {STATES.map((s) => (
                <option key={s.name}>{s.name}</option>
              ))}
            </select>

            <select
              className="soft-select"
              value={form.city}
              disabled={!form.state}
              onChange={(e) =>
                setForm({ ...form, city: e.target.value })
              }
            >
              <option value="">Select City</option>
              {modalCities.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>

            <input
              className="soft-input"
              placeholder="Area name"
              value={form.area}
              onChange={(e) =>
                setForm({ ...form, area: e.target.value })
              }
            />

            <div className="flex justify-end gap-2 pt-3">
              <PrimaryButton
                variant="outline"
                name="Cancel"
                onClick={() => setShowModal(false)}
              />
              <PrimaryButton name="Save" onClick={saveArea} />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
