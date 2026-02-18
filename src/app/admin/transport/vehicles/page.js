"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/utils/api";

/* ---------------- STATUS PILL ---------------- */
function StatusPill({ status }) {
  const map = {
    assigned: "bg-emerald-50 text-emerald-700",
    available: "bg-blue-50 text-blue-700",
    maintenance: "bg-rose-50 text-rose-700",
  };

  return (
    <span
      className={`text-xs font-medium px-2 py-1 rounded ${
        map[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}

/* ---------------- PAGE ---------------- */
export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [drivers, setDrivers] = useState([]);

  const [loading, setLoading] = useState(false);

  /* MODALS */
  const [showCreate, setShowCreate] = useState(false);
  const [viewVehicle, setViewVehicle] = useState(null);
  const [assignVehicle, setAssignVehicle] = useState(null);

  /* CREATE FORM */
  const [form, setForm] = useState({
    vehicle_number: "",
    type: "",
    capacity: "",
    driver_id: "",
    bus_route_id: "",
  });

  /* ================= FETCH ================= */
  useEffect(() => {
    fetchVehicles();
    fetchRoutes();
    fetchDrivers();
  }, []);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const res = await api.get("/transport/vehicles");
      setVehicles(res.data?.data || []);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoutes = async () => {
    const res = await api.get("/transport/routes");
    setRoutes(res.data?.data || []);
  };

  const fetchDrivers = async () => {
    const res = await api.get("/staff/drivers");
    setDrivers(res.data?.data || []);
  };

  /* ================= CREATE ================= */
  const createVehicle = async () => {
    if (!form.vehicle_number || !form.type || !form.capacity) {
      alert("Vehicle number, type and capacity are required");
      return;
    }

    try {
      await api.post("/transport/vehicles", {
        vehicle_number: form.vehicle_number,
        type: form.type,
        capacity: Number(form.capacity),
        driver_id: form.driver_id || null,
        bus_route_id: form.bus_route_id || null,
      });

      setShowCreate(false);
      setForm({
        vehicle_number: "",
        type: "",
        capacity: "",
        driver_id: "",
        bus_route_id: "",
      });
      fetchVehicles();
    } catch {
      alert("Failed to create vehicle");
    }
  };

  /* ================= ASSIGN ROUTE ================= */
  const assignRoute = async () => {
    try {
      await api.post(
        `/transport/vehicles/${assignVehicle.id}/assign-route`,
        {
          bus_route_id: assignVehicle.bus_route_id,
        }
      );
      setAssignVehicle(null);
      fetchVehicles();
    } catch {
      alert("Failed to assign route");
    }
  };

  return (
    <div className="space-y-4 p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Vehicles</h2>
          <p className="text-sm text-gray-500">
            Manage school vehicles, drivers and routes
          </p>
        </div>

        <button onClick={() => setShowCreate(true)} className="soft-btn">
          + Add Vehicle
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2 text-left">Vehicle No</th>
              <th className="p-2 text-left">Type</th>
              <th className="p-2 text-left">Capacity</th>
              <th className="p-2 text-left">Driver</th>
              <th className="p-2 text-left">Route</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {vehicles.map((v) => (
              <tr key={v.id} className="border-t">
                <td className="p-2 font-medium">{v.vehicle_number}</td>
                <td className="p-2">{v.type}</td>
                <td className="p-2">{v.capacity}</td>
                <td className="p-2">
                  {v.driver?.name || "—"}
                </td>
                <td className="p-2">
                  {v.route || "—"}
                </td>
                <td className="p-2">
                  <StatusPill status={v.status || "available"} />
                </td>
                <td className="p-2 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setViewVehicle(v)}
                      className="soft-btn-outline"
                    >
                      View
                    </button>
                    <button
                      onClick={() =>
                        setAssignVehicle({
                          ...v,
                          bus_route_id: v.route?.id || "",
                        })
                      }
                      className="soft-btn-outline"
                    >
                      Assign
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= CREATE MODAL ================= */}
      {showCreate && (
        <Modal onClose={() => setShowCreate(false)} title="Add Vehicle">
          <div className="grid grid-cols-2 gap-3">
            <input
              className="soft-input"
              placeholder="Vehicle Number"
              value={form.vehicle_number}
              onChange={(e) =>
                setForm({ ...form, vehicle_number: e.target.value })
              }
            />
            <input
              className="soft-input"
              placeholder="Type (Bus / Van)"
              value={form.type}
              onChange={(e) =>
                setForm({ ...form, type: e.target.value })
              }
            />
            <input
              type="number"
              className="soft-input"
              placeholder="Capacity"
              value={form.capacity}
              onChange={(e) =>
                setForm({ ...form, capacity: e.target.value })
              }
            />

            <select
              className="soft-select"
              value={form.bus_route_id}
              onChange={(e) =>
                setForm({ ...form, bus_route_id: e.target.value })
              }
            >
              <option value="">Assign Route (Optional)</option>
              {routes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.route_name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setShowCreate(false)}
              className="soft-btn-outline"
            >
              Cancel
            </button>
            <button onClick={createVehicle} className="soft-btn">
              Create
            </button>
          </div>
        </Modal>
      )}

      {/* ================= ASSIGN ROUTE MODAL ================= */}
      {assignVehicle && (
        <Modal
          onClose={() => setAssignVehicle(null)}
          title={`Assign Route – ${assignVehicle.vehicle_number}`}
        >
          <select
            className="soft-select w-full"
            value={assignVehicle.bus_route_id}
            onChange={(e) =>
              setAssignVehicle({
                ...assignVehicle,
                bus_route_id: e.target.value,
              })
            }
          >
            <option value="">Select Route</option>
            {routes.map((r) => (
              <option key={r.id} value={r.id}>
                {r.route_name} ({r.start_point} - {r.end_point})
              </option>
            ))}
          </select>

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setAssignVehicle(null)}
              className="soft-btn-outline"
            >
              Cancel
            </button>
            <button onClick={assignRoute} className="soft-btn">
              Assign
            </button>
          </div>
        </Modal>
      )}

      {/* ================= VIEW MODAL ================= */}
      {viewVehicle && (
        <Modal
          onClose={() => setViewVehicle(null)}
          title={`Vehicle ${viewVehicle.vehicle_number}`}
        >
          <div className="grid grid-cols-2 gap-4 text-sm">
            <Info label="Type" value={viewVehicle.type} />
            <Info label="Capacity" value={viewVehicle.capacity} />
            <Info label="Driver" value={viewVehicle.driver?.name || "—"} />
            <Info label="Route" value={viewVehicle.route?.route_name || "—"} />
            <Info label="Status" value={viewVehicle.status} />
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ---------------- HELPERS ---------------- */
function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-white rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        {children}
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <div className="text-gray-500 text-xs">{label}</div>
      <div>{value}</div>
    </div>
  );
}
