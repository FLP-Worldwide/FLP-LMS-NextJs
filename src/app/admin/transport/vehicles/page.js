"use client";

import React, { useState } from "react";

/* ---------------- MOCK DATA ---------------- */
const initialVehicles = [
  {
    id: 1,
    vehicleNo: "RJ14 AB 1234",
    type: "School Bus",
    capacity: 45,
    driver: "Ramesh Kumar",
    driverMobile: "9876543210",
    route: "Ajmer Road – Mansarovar",
    status: "assigned", // assigned | available | maintenance
    lastService: "2025-11-20",
  },
  {
    id: 2,
    vehicleNo: "RJ14 CD 5678",
    type: "Van",
    capacity: 18,
    driver: "Suresh Yadav",
    driverMobile: "9988776655",
    route: "-",
    status: "available",
    lastService: "2025-10-15",
  },
];

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
  const [vehicles] = useState(initialVehicles);
  const [selected, setSelected] = useState(null);

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Vehicles</h2>
          <p className="text-sm text-gray-500">
            Manage school vehicles, drivers and routes
          </p>
        </div>

        <button
          onClick={() => alert("Create vehicle (API later)")}
          className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm hover:bg-emerald-700 transition"
        >
          + Add Vehicle
        </button>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold">Vehicle List</h3>
          <span className="text-sm text-gray-500">
            {vehicles.length} total
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-2 px-3 text-xs font-medium text-gray-600">
                  Vehicle No
                </th>
                <th className="py-2 px-3 text-xs font-medium text-gray-600">
                  Type
                </th>
                <th className="py-2 px-3 text-xs font-medium text-gray-600">
                  Capacity
                </th>
                <th className="py-2 px-3 text-xs font-medium text-gray-600">
                  Driver
                </th>
                <th className="py-2 px-3 text-xs font-medium text-gray-600">
                  Route
                </th>
                <th className="py-2 px-3 text-xs font-medium text-gray-600">
                  Status
                </th>
                <th className="py-2 px-3 text-xs font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {vehicles.map((v) => (
                <tr key={v.id}>
                  <td className="py-2 px-3 text-sm font-medium">
                    {v.vehicleNo}
                  </td>
                  <td className="py-2 px-3 text-sm">{v.type}</td>
                  <td className="py-2 px-3 text-sm">{v.capacity}</td>
                  <td className="py-2 px-3 text-sm">
                    <div>
                      <div className="font-medium">{v.driver}</div>
                      <div className="text-xs text-gray-500">
                        {v.driverMobile}
                      </div>
                    </div>
                  </td>
                  <td className="py-2 px-3 text-sm">{v.route}</td>
                  <td className="py-2 px-3">
                    <StatusPill status={v.status} />
                  </td>
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelected(v)}
                        className="px-3 py-1 rounded-md border border-gray-200 text-sm hover:bg-gray-50"
                      >
                        View
                      </button>
                      <button
                        onClick={() =>
                          alert("Assign vehicle to route / students")
                        }
                        className="px-3 py-1 rounded-md bg-blue-50 text-blue-700 text-sm hover:bg-blue-100"
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
      </div>

      {/* VIEW MODAL */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setSelected(null)}
          />

          <div className="relative w-full max-w-xl bg-white rounded-xl shadow-xl p-6">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-semibold">
                Vehicle {selected.vehicleNo}
              </h3>
              <button
                onClick={() => setSelected(null)}
                className="px-3 py-1 rounded-md border"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-500">Vehicle Type</div>
                <div>{selected.type}</div>
              </div>
              <div>
                <div className="text-gray-500">Capacity</div>
                <div>{selected.capacity} Students</div>
              </div>
              <div>
                <div className="text-gray-500">Driver</div>
                <div>{selected.driver}</div>
              </div>
              <div>
                <div className="text-gray-500">Driver Mobile</div>
                <div>{selected.driverMobile}</div>
              </div>
              <div>
                <div className="text-gray-500">Route</div>
                <div>{selected.route}</div>
              </div>
              <div>
                <div className="text-gray-500">Last Service</div>
                <div>{selected.lastService}</div>
              </div>
              <div>
                <div className="text-gray-500">Status</div>
                <StatusPill status={selected.status} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
