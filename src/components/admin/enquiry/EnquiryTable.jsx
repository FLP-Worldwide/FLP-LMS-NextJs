"use client";

import { useEffect, useState } from "react";
import {api} from "@/utils/api";

export default function EnquiryTable() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/enquiries")
      .then(res => {
        setEnquiries(res.data?.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-blue-50">
          <tr>
            <th className="px-4 py-2 text-left">Enq. No.</th>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Contact No</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Priority</th>
            <th className="px-4 py-2 text-left">Source</th>
            <th className="px-4 py-2 text-left">Follow Up</th>
            <th className="px-4 py-2 text-left">Last Updated</th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {loading && (
            <tr>
              <td colSpan="9" className="px-4 py-6 text-center text-gray-400">
                Loading enquiries...
              </td>
            </tr>
          )}

          {!loading && enquiries.length === 0 && (
            <tr>
              <td colSpan="9" className="px-4 py-6 text-center text-gray-400">
                No enquiries found
              </td>
            </tr>
          )}

          {!loading &&
            enquiries.map(item => (
              <tr key={item.id}>
                <td className="px-4 py-2">{item.enquiry_code}</td>
                <td className="px-4 py-2 font-medium">
                  {item.student_name}
                </td>
                <td className="px-4 py-2">{item.phone}</td>
                <td className="px-4 py-2">—</td>

                <td
                  className={`px-4 py-2 font-medium ${
                    item.status === "closed"
                      ? "text-red-600"
                      : "text-blue-600"
                  }`}
                >
                  {item.status}
                </td>

                <td className="px-4 py-2">
                  {item.lead_temperature}
                </td>

                <td className="px-4 py-2">—</td>

                <td className="px-4 py-2">
                  {item.enquiry_date
                    ? new Date(item.enquiry_date).toLocaleDateString("en-GB")
                    : "—"}
                </td>

                <td className="px-4 py-2 text-gray-500">
                  {item.enquiry_date
                    ? getDaysAgo(item.enquiry_date)
                    : "—"}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

/* ================= HELPER ================= */
function getDaysAgo(date) {
  const diff = Math.floor(
    (new Date() - new Date(date)) / (1000 * 60 * 60 * 24)
  );

  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return `${diff} days ago`;
}
