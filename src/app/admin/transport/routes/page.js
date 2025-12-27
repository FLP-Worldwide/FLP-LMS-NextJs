"use client";

import React, { useState } from "react";

/* ---------------- SAMPLE DATA ---------------- */

const initialRoutes = [
  {
    id: 1,
    name: "Route 1 – North City",
    vehicleNo: "RJ14 AB 1234",
    startPoint: "North City",
    endPoint: "ABC Public School",
    stops: ["Shastri Nagar", "Civil Lines", "Station Road"],
  },
];

export default function TransportRoutePage() {
  const [routes, setRoutes] = useState(initialRoutes);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  /* FORM STATE */
  const [name, setName] = useState("");
  const [vehicleNo, setVehicleNo] = useState("");
  const [startPoint, setStartPoint] = useState("");
  const [endPoint, setEndPoint] = useState("");
  const [stops, setStops] = useState([]);
  const [newStop, setNewStop] = useState("");

  const resetForm = () => {
    setName("");
    setVehicleNo("");
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
    setName(route.name);
    setVehicleNo(route.vehicleNo);
    setStartPoint(route.startPoint);
    setEndPoint(route.endPoint);
    setStops(route.stops);
    setShowModal(true);
  };

  const saveRoute = () => {
    if (!name || !startPoint || !endPoint) {
      alert("Route name, start and end point are required");
      return;
    }

    if (editing) {
      setRoutes((prev) =>
        prev.map((r) =>
          r.id === editing.id
            ? {
                ...r,
                name,
                vehicleNo,
                startPoint,
                endPoint,
                stops,
              }
            : r
        )
      );
    } else {
      setRoutes((prev) => [
        {
          id: Date.now(),
          name,
          vehicleNo,
          startPoint,
          endPoint,
          stops,
        },
        ...prev,
      ]);
    }

    setShowModal(false);
    resetForm();
  };

  const deleteRoute = (id) => {
    if (!confirm("Delete this route?")) return;
    setRoutes((prev) => prev.filter((r) => r.id !== id));
  };

  const addStop = () => {
    if (!newStop.trim()) return;
    setStops((prev) => [...prev, newStop.trim()]);
    setNewStop("");
  };

  const removeStop = (index) => {
    setStops((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
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
                <th className="px-4 py-2 text-xs text-gray-600">
                  Route Name
                </th>
                <th className="px-4 py-2 text-xs text-gray-600">
                  Vehicle
                </th>
                <th className="px-4 py-2 text-xs text-gray-600">
                  Start
                </th>
                <th className="px-4 py-2 text-xs text-gray-600">
                  End
                </th>
                <th className="px-4 py-2 text-xs text-gray-600">
                  Stops
                </th>
                <th className="px-4 py-2 text-xs text-gray-600">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {routes.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-2 text-sm font-medium">
                    {r.name}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    {r.vehicleNo || "—"}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    {r.startPoint}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    {r.endPoint}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    {r.stops.length
                      ? r.stops.join(", ")
                      : "—"}
                  </td>
                  <td className="px-4 py-2 text-sm">
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
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <input
                className="soft-input"
                placeholder="Vehicle Number"
                value={vehicleNo}
                onChange={(e) => setVehicleNo(e.target.value)}
              />

              <input
                className="soft-input"
                placeholder="Start Point (City / Area)"
                value={startPoint}
                onChange={(e) => setStartPoint(e.target.value)}
              />

              <input
                className="soft-input"
                placeholder="End Point (School)"
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
                  <div
                    key={i}
                    className="flex items-center gap-2"
                  >
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
                  <button
                    onClick={addStop}
                    className="soft-btn-outline"
                  >
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
