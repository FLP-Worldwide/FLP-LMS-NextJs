"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/utils/api";

export default function LeavePermissionPage() {
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/staff-leaves?date=${date}`);
      setLeaves(res?.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch leaves", error);
      setLeaves([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [date]);

  return (
    <div className="space-y-4 p-6">
      {/* ================= DATE FILTER ================= */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-700">
          Staff On Leave
        </h2>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-4 py-2 text-left">#</th>
              <th className="px-4 py-2 text-left">Name</th>

              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-left">Department</th>
              <th className="px-4 py-2 text-left">Type</th>
              <th className="px-4 py-2 text-left">Applied on</th>
              <th className="px-4 py-2 text-left">For Date</th>
              <th className="px-4 py-2 text-left">Remark</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td colSpan="7" className="px-4 py-12 text-center text-gray-400 text-base">
                  Loading...
                </td>
              </tr>
            ) : leaves.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-4 py-12 text-center text-gray-400 text-base">
                  No Data Found !
                </td>
              </tr>
            ) : (
              leaves.map((item, index) => (
                <tr key={item.attendance_id}>
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{item.name || "-"}</td>

                  <td className="px-4 py-2">{item.designation || "-"}</td>
                  <td className="px-4 py-2">{item.department || "-"}</td>
                  <td className="px-4 py-2 capitalize">
                    <span className="px-2 py-1 text-xs rounded bg-blue-50 text-blue-600">
                      {item.type}
                    </span>
                  </td>
                  <td className="px-4 py-2 "> <span className="bg-gray-100 px-1 py-0.5 font-semibold rounded text-gray-600 text-xs">{item.applied_on}</span></td>
                  <td className="px-4 py-2 "> <span className="bg-gray-100 px-1 py-0.5 font-semibold rounded text-gray-600 text-xs">{item.for_date }</span></td>
                  <td className="px-4 py-2 "> <span className="bg-red-100 px-1 py-0.5 capitalize rounded text-red-600 text-xs">{item.remark || item.leave_status}</span></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
