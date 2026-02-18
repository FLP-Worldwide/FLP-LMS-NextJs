"use client";

import { useEffect, useState } from "react";
import {api} from "@/utils/api";
import { useRouter } from "next/navigation";

const Badge = ({ children, color = "gray" }) => {
  const map = {
    gray: "bg-gray-100 text-gray-600",
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    amber: "bg-amber-100 text-amber-700",
    red: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`inline-block px-2 py-[2px] text-[11px] rounded-full ${map[color]}`}
    >
      {children}
    </span>
  );
};

export default function EnquiryTable({ filters }) {

  const [enquiries, setEnquiries] = useState([]);
const [pagination, setPagination] = useState(null);
const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const router = useRouter();


  useEffect(() => {
    setLoading(true);

    api
      .get("/enquiries", {
        params: {
          ...filters,
          page, // 👈 pagination
        },
      })
      .then(res => {
        const payload = res.data?.data;

        setEnquiries(payload?.data || []);
        setPagination(payload);
      })
      .finally(() => setLoading(false));
  }, [filters, page]);

  useEffect(() => {
    setPage(1);
  }, [filters]);


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
             <tr
                key={item.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() =>
                    router.push(`/admin/leads/enquiries/${item.id}/view`)
                  }
              >

                <td className="px-4 py-2">{item.enquiry_code}</td>
               <td className="px-4 py-2">
                <div className="font-medium">{item.student_name}</div>

                {item.details?.parent_name && (
                  <div className="text-xs text-gray-500">
                    Parent: {item.details.parent_name}
                  </div>
                )}
              </td>

                <td className="px-4 py-2">{item.phone}</td>
               <td className="px-4 py-2">
                {item.details?.email ? (
                  <span className="text-xs text-gray-700">
                    {item.details.email}
                  </span>
                ) : (
                  "—"
                )}
              </td>


                <td className="px-4 py-2">
                  <Badge color={item.status === "closed" ? "red" : "blue"}>
                    {item.status}
                  </Badge>
                </td>


                <td className="px-4 py-2">
                <Badge
                  color={
                    item.lead_temperature === "Hot"
                      ? "red"
                      : item.lead_temperature === "Warm"
                      ? "amber"
                      : "green"
                  }
                >
                  {item.lead_temperature}
                </Badge>
              </td>


                <td className="px-4 py-2">
                {item.lead_source_type_id ? (
                  <Badge color="gray">{item?.lead_source?.name || item.lead_source_type_id}</Badge>
                ) : (
                  "—"
                )}
              </td>

                <td className="px-4 py-2">
                  {item.follow_ups?.[0] ? (
                    <>
                      {/* <Badge color="blue">
                        {item.follow_ups[0].follow_up_type}
                      </Badge> */}

                      <div className="text-xs text-gray-500 mt-1">
                        {item.follow_ups[0].followup_date}
                      </div>
                    </>
                  ) : (
                    "—"
                  )}
                </td>


                <td className="px-4 py-2 text-gray-500 text-xs">
                  {getDaysAgo(
                    item.follow_ups?.[0]?.created_at || item.enquiry_date
                  )}
                </td>

              </tr>
            ))}
        </tbody>
      </table>
    
 
      {pagination && pagination.last_page > 1 && (
        <div className="flex justify-between items-center px-4 py-3 border-t text-sm">
          
          {/* INFO */}
          <div className="text-gray-500">
            Showing {pagination.from}–{pagination.to} of {pagination.total}
          </div>

          {/* BUTTONS */}
          <div className="flex gap-1">
            <button
              disabled={!pagination.prev_page_url}
              onClick={() => setPage(p => Math.max(p - 1, 1))}
              className="px-3 py-1 border rounded disabled:opacity-40"
            >
              Prev
            </button>

            {pagination.links
              .filter(l => l.url && !l.label.includes("Previous") && !l.label.includes("Next"))
              .map(link => (
                <button
                  key={link.label}
                  onClick={() => setPage(Number(link.label))}
                  className={`px-3 py-1 border rounded ${
                    link.active
                      ? "bg-blue-600 text-white border-blue-600"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {link.label}
                </button>
              ))}

            <button
              disabled={!pagination.next_page_url}
              onClick={() =>
                setPage(p => Math.min(p + 1, pagination.last_page))
              }
              className="px-3 py-1 border rounded disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}


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
