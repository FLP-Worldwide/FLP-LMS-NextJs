"use client";

import React, { useEffect, useMemo, useState } from "react";
import { api } from "@/utils/api";
import { SECTIONS } from "@/constants/sections";

/* ---------------- PAGE ---------------- */
export default function AssignStudentsPage() {
  const [vehicles, setVehicles] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [assignments, setAssignments] = useState([]);

  const [classFilter, setClassFilter] = useState("");
  const [sectionFilter, setSectionFilter] = useState("");

  const [availableSeats, setAvailableSeats] = useState(0);

  /* ================= FETCH INITIAL ================= */
useEffect(() => {
  fetchVehicles();
  fetchRoutes();
  fetchClasses();
}, []);

const fetchClasses = async () => {
  const res = await api.get("/classes"); // API: /classes
  setClasses(res.data?.data || []);
};

  const fetchVehicles = async () => {
    const res = await api.get("/transport/vehicles");
    setVehicles(res.data?.data || []);
    if (res.data?.data?.length) {

      setSelectedVehicle(res.data.data[0]);
    }
  };

  const fetchRoutes = async () => {
    const res = await api.get("/transport/routes");
    setRoutes(res.data?.data || []);
  };

  /* ================= FETCH ASSIGNMENTS ================= */
  useEffect(() => {
    if (!selectedVehicle) return;
    fetchAssignments();
  }, [selectedVehicle]);

  const fetchAssignments = async () => {
    const res = await api.get("/transport/assignments", {
      params: {
        vehicle_id: selectedVehicle.id,
        bus_route_id: selectedVehicle.route_id,
      },
    });

    setAssignments(res.data?.data.assignments || []);

    setAvailableSeats(res.data?.data.available_seats || 0);
  };

  /* ================= FETCH STUDENTS ================= */
  useEffect(() => {
    fetchStudents();
  }, [classFilter, sectionFilter]);

  const fetchStudents = async () => {
    const res = await api.get("/transport/students", {
      params: {
        class: classFilter || undefined,
        section: sectionFilter || undefined,
        status: "active",
      },
    });
    setStudents(res.data?.data || []);
  };

  /* ================= ASSIGN ================= */
  const assignStudent = async (student) => {

    if (availableSeats <= 0) {
      alert("No seats available");
      return;
    }

    try {
      await api.post("/transport/assign-student", {
        student_id: student.student_id,
        vehicle_id: selectedVehicle.id,
        bus_route_id: selectedVehicle.route_id,
      });

      fetchAssignments();
      fetchStudents();
    } catch (e) {
      alert("Failed to assign student");
    }
  };

  
  /* ================= UNASSIGN (OPTIONAL) ================= */
  const unassignStudent = async (student) => {
    try {
      await api.post("/transport/unassign-student", {
        student_id: student.id,
      });

      fetchAssignments();
      fetchStudents();
    } catch (e) {
      alert("Failed to unassign student");
    }
  };

  /* ================= FILTERED STUDENTS ================= */
  const availableStudents = useMemo(() => {
    return students.filter((s) => !s.transport_assigned);
  }, [students]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* ================= LEFT – VEHICLE ================= */}
      <div className="lg:col-span-4 bg-white rounded-xl border border-gray-200 p-4 space-y-4">
        <h3 className="font-semibold">Vehicle</h3>

        <select
          className="soft-select"
          value={selectedVehicle?.id || ""}
          onChange={(e) =>
            setSelectedVehicle(
              vehicles.find((v) => v.id === Number(e.target.value))
            )
          }
        >
          {vehicles.map((v) => (
            <option key={v.id} value={v.id}>
              {v.vehicle_number} - {v.route}
            </option>
          ))}
        </select>

        {selectedVehicle && (
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Info label="Route" value={selectedVehicle.route || "—"} />
            <Info label="Capacity" value={selectedVehicle.capacity} />
            <Info label="Assigned" value={assignments.length} />
            <Info
              label="Available Seats"
              value={availableSeats}
              highlight={availableSeats <= 5}
            />
          </div>
        )}

        {/* ASSIGNED */}
        <div>
          <h4 className="text-sm font-semibold mb-2">
            Assigned Students
          </h4>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {assignments.length === 0 && (
              <div className="text-sm text-gray-500">
                No students assigned
              </div>
            )}

            {assignments.map((a, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-3 py-2 rounded-md border border-gray-200 text-sm"
              >
                <div>
                  <div className="font-medium">
                    {a.student.first_name} {a.student.last_name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {a.student.admission_no}
                  </div>
                  <div className="text-xs text-gray-400">
                    Pickup: {a.pickup_point}
                  </div>
                </div>

                <button
                  onClick={() => unassignStudent(a.student)}
                  className="text-xs text-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= RIGHT – STUDENTS ================= */}
      <div className="lg:col-span-8 bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3 gap-2">
          <h3 className="font-semibold">Students</h3>

          <select
            className="soft-select w-36"
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
          >
            <option value="">All Classes</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>


          <select
            className="soft-select w-36"
            value={sectionFilter}
            onChange={(e) => setSectionFilter(e.target.value)}
          >
            <option value="">All Sections</option>
            {SECTIONS.map((sec) => (
              <option key={sec} value={sec}>
                {sec}
              </option>
            ))}
          </select>

        </div>

        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-xs">Student</th>
              <th className="px-4 py-2 text-xs">Class</th>
              <th className="px-4 py-2 text-xs">Address</th>
              <th className="px-4 py-2 text-xs">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {availableStudents.map((s) => (
              <tr key={s.student_id}>
                <td className="px-4 py-2 text-sm font-medium">
                  {s.name}
                  <div className="text-xs text-gray-500">
                    {s.admission_no}
                  </div>
                </td>

                <td className="px-4 py-2 text-sm">
                  {s.class}-{s.section}
                </td>

                <td className="px-4 py-2 text-xs text-gray-500">
                  {s.address}
                </td>

                <td className="px-4 py-2">
                  <button
                    onClick={() => assignStudent(s)}
                    className="soft-btn-outline text-emerald-700"
                  >
                    Assign
                  </button>
                </td>
              </tr>
            ))}

            {availableStudents.length === 0 && (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-400">
                  No available students
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------------- UI ---------------- */
function Info({ label, value, highlight }) {
  return (
    <div>
      <div className="text-xs text-gray-500">{label}</div>
      <div className={`font-medium ${highlight ? "text-rose-600" : ""}`}>
        {value}
      </div>
    </div>
  );
}
