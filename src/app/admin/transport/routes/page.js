"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/utils/api";

export default function TransportRoutePage() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  /* FORM STATE */
  const [routeName, setRouteName] = useState("");

  const [startPoint, setStartPoint] = useState("");
  const [endPoint, setEndPoint] = useState("");
  const [stops, setStops] = useState([]);
  const [newStop, setNewStop] = useState("");

  /* ================= FETCH ROUTES ================= */
  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    setLoading(true);
    try {
      const res = await api.get("/transport/routes");
      setRoutes(res.data?.data || []);
    } finally {
      setLoading(false);
    }
  };

  /* ================= MODAL HELPERS ================= */
  const resetForm = () => {
    setRouteName("");

    setStartPoint("");
    setEndPoint("");
    setStops([]);
    setNewStop("");
    setEditing(null);
  };

  const openCreate = () => {
    resetForm();
    setShowModal(true);
  };

  const openEdit = (route) => {
    setEditing(route);
    setRouteName(route.route_name);

    setStartPoint(route.start_point);
    setEndPoint(route.end_point);
    setStops(route.stops?.map((s) => s.stop_name) || []);
    setShowModal(true);
  };

  /* ================= SAVE ================= */
  const saveRoute = async () => {
    if (!routeName || !startPoint || !endPoint) {
      alert("Route name, start and end point are required");
      return;
    }

    const payload = {
      route_name: routeName,

      start_point: startPoint,
      end_point: endPoint,
      stops: stops.map((s) => ({ stop_name: s })),
    };

    try {
      if (editing) {
        await api.put(`/transport/routes/${editing.id}`, payload);
      } else {
        await api.post("/transport/routes", payload);
      }

      setShowModal(false);
      resetForm();
      fetchRoutes();
    } catch (e) {
      alert("Failed to save route");
    }
  };

  /* ================= DELETE ================= */
  const deleteRoute = async (id) => {
    if (!confirm("Delete this route?")) return;
    try {
      await api.delete(`/transport/routes/${id}`);
      fetchRoutes();
    } catch {
      alert("Failed to delete route");
    }
  };

  /* ================= STOPS ================= */
  const addStop = () => {
    if (!newStop.trim()) return;
    setStops((prev) => [...prev, newStop.trim()]);
    setNewStop("");
  };

  const removeStop = (index) => {
    setStops((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4 p-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Transport Routes</h2>
          <p className="text-sm text-gray-500">
            Manage bus routes, pickup points and school transportation
          </p>
        </div>

        <button onClick={openCreate} className="soft-btn">
          + Add Route
        </button>
      </div>

      {/* ROUTE LIST */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold">Routes</h3>
          <div className="text-sm text-gray-500">
            {routes.length} total
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-xs">Route</th>
                <th className="px-4 py-2 text-xs">Vehicle</th>
                <th className="px-4 py-2 text-xs">Start</th>
                <th className="px-4 py-2 text-xs">End</th>
                <th className="px-4 py-2 text-xs">Stops</th>
                <th className="px-4 py-2 text-xs">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {loading && (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-gray-400">
                    Loading...
                  </td>
                </tr>
              )}

              {!loading &&
                routes.map((r) => (
                  <tr key={r.id}>
                    <td className="px-4 py-2 font-medium">
                      {r.route_name}
                    </td>
                    <td className="px-4 py-2">
                      {r.vehicle_number || "—"}
                    </td>
                    <td className="px-4 py-2">{r.start_point}</td>
                    <td className="px-4 py-2">{r.end_point}</td>
                    <td className="px-4 py-2 text-sm">
                      {r.stops?.length
                        ? r.stops.map((s) => s.stop_name).join(", ")
                        : "—"}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(r)}
                          className="soft-btn-outline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteRoute(r.id)}
                          className="px-3 py-1 rounded-md border border-red-200 text-red-600 text-sm hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setShowModal(false)}
          />

          <div className="relative w-full max-w-2xl bg-white rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-3">
              {editing ? "Edit Route" : "Add Route"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                className="soft-input"
                placeholder="Route Name"
                value={routeName}
                onChange={(e) => setRouteName(e.target.value)}
              />



              <input
                className="soft-input"
                placeholder="Start Point"
                value={startPoint}
                onChange={(e) => setStartPoint(e.target.value)}
              />

              <input
                className="soft-input"
                placeholder="End Point"
                value={endPoint}
                onChange={(e) => setEndPoint(e.target.value)}
              />
            </div>

            {/* STOPS */}
            <div className="mt-4">
              <label className="text-sm text-gray-600">
                Pickup Stops
              </label>

              <div className="space-y-2 mt-1">
                {stops.map((s, i) => (
                  <div key={i} className="flex gap-2">
                    <div className="flex-1 soft-input bg-gray-50">
                      {i + 1}. {s}
                    </div>
                    <button
                      onClick={() => removeStop(i)}
                      className="text-sm text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ))}

                <div className="flex gap-2">
                  <input
                    className="soft-input"
                    placeholder="Add new stop"
                    value={newStop}
                    onChange={(e) => setNewStop(e.target.value)}
                  />
                  <button onClick={addStop} className="soft-btn-outline">
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="soft-btn-outline"
              >
                Cancel
              </button>
              <button onClick={saveRoute} className="soft-btn">
                {editing ? "Save" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
