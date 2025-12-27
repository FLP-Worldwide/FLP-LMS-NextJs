"use client";

import React, { useMemo, useState } from "react";

/* ---------------- MOCK VEHICLES ---------------- */
const vehicles = [
  {
    id: 1,
    vehicleNo: "RJ14 AB 1234",
    type: "School Bus",
    capacity: 45,
    route: "Route 1 – North City",
  },
  {
    id: 2,
    vehicleNo: "RJ14 CD 5678",
    type: "Van",
    capacity: 18,
    route: "Route 2 – Ajmer Road",
  },
];

/* ---------------- MOCK STUDENTS ---------------- */
const students = [
  {
    id: 1,
    name: "Aarav Sharma",
    class: "5",
    section: "A",
    area: "Mansarovar",
    address: "Sector 9, Mansarovar",
  },
  {
    id: 2,
    name: "Isha Verma",
    class: "5",
    section: "B",
    area: "Ajmer Road",
    address: "Heerapura, Ajmer Rd",
  },
  {
    id: 3,
    name: "Rohan Mehta",
    class: "6",
    section: "A",
    area: "Civil Lines",
    address: "Near Collectorate",
  },
  {
    id: 4,
    name: "Sneha Gupta",
    class: "7",
    section: "C",
    area: "Vaishali Nagar",
    address: "Prince Road",
  },
  {
    id: 5,
    name: "Aditya Singh",
    class: "6",
    section: "B",
    area: "Mansarovar",
    address: "Sector 7",
  },
];

/* ---------------- PAGE ---------------- */
export default function AssignStudentsPage() {
  const [selectedVehicle, setSelectedVehicle] = useState(vehicles[0]);
  const [assigned, setAssigned] = useState([1, 3]); // student IDs
  const [classFilter, setClassFilter] = useState("");
const [areaFilter, setAreaFilter] = useState("");
  const assignedCount = assigned.length;
  const availableSeats =
    selectedVehicle.capacity - assignedCount;

const filteredStudents = useMemo(() => {
  return students.filter(
    (s) =>
      (!classFilter || s.class === classFilter) &&
      (!areaFilter || s.area === areaFilter) &&
      !assigned.includes(s.id)
  );
}, [classFilter, areaFilter, assigned]);


  const assignStudent = (id) => {
    if (availableSeats <= 0) {
      alert("No seats available in this vehicle");
      return;
    }
    setAssigned((prev) => [...prev, id]);
  };

  const unassignStudent = (id) => {
    setAssigned((prev) => prev.filter((s) => s !== id));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* LEFT – VEHICLE INFO */}
      <div className="lg:col-span-4 bg-white rounded-xl border border-gray-200 p-4 space-y-4">
        <h3 className="font-semibold">Vehicle</h3>

        <select
          className="soft-select"
          value={selectedVehicle.id}
          onChange={(e) =>
            setSelectedVehicle(
              vehicles.find(
                (v) => v.id === Number(e.target.value)
              )
            )
          }
        >
          {vehicles.map((v) => (
            <option key={v.id} value={v.id}>
              {v.vehicleNo} ({v.type})
            </option>
          ))}
        </select>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <Info label="Route" value={selectedVehicle.route} />
          <Info label="Capacity" value={selectedVehicle.capacity} />
          <Info label="Assigned" value={assignedCount} />
          <Info
            label="Available Seats"
            value={availableSeats}
            highlight={availableSeats <= 5}
          />
        </div>

        {/* ASSIGNED STUDENTS */}
        <div>
          <h4 className="text-sm font-semibold mb-2">
            Assigned Students
          </h4>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {assigned.length === 0 && (
              <div className="text-sm text-gray-500">
                No students assigned
              </div>
            )}

            {assigned.map((id) => {
              const s = students.find((st) => st.id === id);
              return (
                <div
                  key={id}
                  className="flex items-center justify-between px-3 py-2 rounded-md border border-gray-200 text-sm"
                >
                  <div>
                    <div className="font-medium">{s.name}</div>
                    <div className="text-xs text-gray-500">
                        Class {s.class}-{s.section} • {s.area}
                        </div>
                        <div className="text-[11px] text-gray-400">
                        {s.address}
                        </div>
                  </div>

                  <button
                    onClick={() => unassignStudent(id)}
                    className="text-xs text-red-600"
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* RIGHT – STUDENT LIST */}
      <div className="lg:col-span-8 bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3 gap-2">
          <h3 className="font-semibold">Students</h3>
            <select
                className="soft-select w-40"
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
            >
                <option value="">All Classes</option>
                <option value="5">Class 5</option>
                <option value="6">Class 6</option>
                <option value="7">Class 7</option>
            </select>

            <select
            className="soft-select w-44"
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
            >
            <option value="">All Areas</option>
            <option value="Mansarovar">Mansarovar</option>
            <option value="Ajmer Road">Ajmer Road</option>
            <option value="Civil Lines">Civil Lines</option>
            <option value="Vaishali Nagar">Vaishali Nagar</option>
            </select>
        </div>

        <div className="overflow-x-auto">


          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-4 py-2 text-xs text-gray-600">Student</th>
                    <th className="px-4 py-2 text-xs text-gray-600">Class</th>
                    <th className="px-4 py-2 text-xs text-gray-600">Area</th>
                    <th className="px-4 py-2 text-xs text-gray-600">Address</th>
                    <th className="px-4 py-2 text-xs text-gray-600">Action</th>
                </tr>
                </thead>


            <tbody className="divide-y">
                {filteredStudents.map((s) => (
                    <tr key={s.id}>
                    <td className="px-4 py-2 text-sm font-medium">
                        {s.name}
                        <div className="text-xs text-gray-500">
                        Class {s.class}-{s.section}
                        </div>
                    </td>

                    <td className="px-4 py-2 text-sm">
                        {s.class}-{s.section}
                    </td>

                    <td className="px-4 py-2 text-sm font-medium">
                        {s.area}
                    </td>

                    <td className="px-4 py-2 text-xs text-gray-500 max-w-xs truncate">
                        {s.address}
                    </td>

                    <td className="px-4 py-2">
                        <button
                        onClick={() => assignStudent(s.id)}
                        className="soft-btn-outline text-emerald-700"
                        >
                        Assign
                        </button>
                    </td>
                    </tr>
                ))}
                </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}

/* ---------------- SMALL UI ---------------- */

function Info({ label, value, highlight }) {
  return (
    <div>
      <div className="text-xs text-gray-500">{label}</div>
      <div
        className={`font-medium ${
          highlight ? "text-rose-600" : ""
        }`}
      >
        {value}
      </div>
    </div>
  );
}
