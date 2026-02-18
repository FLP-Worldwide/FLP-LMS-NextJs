
"use client";

import React from "react";

const sampleData = [
  { key: 1, name: "Amit Kumar", email: "amit1@example.com", phone: "9998887771", createdAt: "2025-12-02" },
  { key: 2, name: "Rekha Sharma", email: "rekha@example.com", phone: "9876543210", createdAt: "2025-11-20" },
];

export default function AdminUsers() {
  return (
    <div className="space-y-2 p-6">

      <div className="bg-white rounded-xl p-4 shadow-xs border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold">All Users</h3>
          <div className="text-sm text-gray-500">Showing latest signups</div>
        </div>

        <div className="overflow-x-auto rounded-md">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-2 px-4 text-xs font-medium text-gray-600">Name</th>
                <th className="py-2 px-4 text-xs font-medium text-gray-600">Email</th>
                <th className="py-2 px-4 text-xs font-medium text-gray-600">Phone</th>
                <th className="py-2 px-4 text-xs font-medium text-gray-600">Created</th>
              </tr>
            </thead>

            <tbody className=" border-t border-gray-300 divide-y divide-gray-200">
              {sampleData.map((row) => (
                <tr key={row.key} className="">
                  <td className="py-2 px-4 text-sm">{row.name}</td>
                  <td className="py-2 px-4 text-sm text-gray-700">{row.email}</td>
                  <td className="py-2 px-4 text-sm">{row.phone}</td>
                  <td className="py-2 px-4 text-sm">{row.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-end">
          <div className="text-sm text-gray-500">1</div>
        </div>
      </div>
    </div>
  );
}
