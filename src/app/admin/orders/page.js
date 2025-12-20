// src/app/admin/orders/page.jsx
"use client";

import React, { useState } from "react";

const initialData = [
  {
    key: 1,
    orderNo: "ORD-20251202-001",
    product: "Handmade Wooden Bowl",
    customer: "Amit Kumar",
    amount: 1499,
    currency: "INR",
    paymentMethod: "UPI",
    status: "paid", // paid | pending | refunded
    shipped: false,
    invoiceCreated: false,
    address: "123 MG Road, Jaipur, Rajasthan",
    createdAt: "2025-12-02",
  },
  {
    key: 2,
    orderNo: "ORD-20251120-042",
    product: "Embroidered Cushion",
    customer: "Rekha Sharma",
    amount: 799,
    currency: "INR",
    paymentMethod: "Card",
    status: "paid",
    shipped: true,
    invoiceCreated: true,
    address: "45 Nehru Nagar, Delhi",
    createdAt: "2025-11-20",
  },
];

function StatusPill({ status }) {
  const map = {
    paid: "bg-emerald-50 text-emerald-700",
    pending: "bg-yellow-50 text-yellow-700",
    refunded: "bg-red-50 text-red-700",
  };
  return <span className={`text-xs font-medium px-2 py-1 rounded ${map[status] || "bg-gray-50 text-gray-700"}`}>{status}</span>;
}

export default function OrderPage() {
  const [orders, setOrders] = useState(initialData);
  const [viewOrder, setViewOrder] = useState(null);

  const toggleShipped = (key) => {
    setOrders((prev) => prev.map(o => o.key === key ? { ...o, shipped: !o.shipped } : o));
  };

  const createInvoice = (key) => {
    setOrders((prev) => prev.map(o => o.key === key ? { ...o, invoiceCreated: true } : o));
  };

  const handleView = (order) => {
    setViewOrder(order);
    // small demo: scroll to modal area or simply open detail area
  };

  const closeView = () => setViewOrder(null);

  return (
    <div className="space-y-4">
      {/* header row */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Orders</h2>
          <p className="text-sm text-gray-500">Manage recent orders, shipping and invoices</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="px-3 py-2 rounded-md bg-emerald-600 text-white text-sm hover:bg-emerald-700 transition"
            onClick={() => alert("Create order flow")}
          >
            + Create Order
          </button>
        </div>
      </div>

      {/* orders card */}
      <div className="bg-white rounded-xl p-4 shadow-xs border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold">All Orders</h3>
          <div className="text-sm text-gray-500">{orders.length} total</div>
        </div>

        <div className="overflow-x-auto rounded-md">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-2 px-4 text-xs font-medium text-gray-600">Order #</th>
                <th className="py-2 px-4 text-xs font-medium text-gray-600">Product</th>
                <th className="py-2 px-4 text-xs font-medium text-gray-600">Customer</th>
                <th className="py-2 px-4 text-xs font-medium text-gray-600">Amount</th>
                <th className="py-2 px-4 text-xs font-medium text-gray-600">Status</th>
                <th className="py-2 px-4 text-xs font-medium text-gray-600">Actions</th>
              </tr>
            </thead>

            <tbody className="border-t border-gray-300 divide-y divide-gray-200">
              {orders.map((o) => (
                <tr key={o.key} className="">
                  <td className="py-2 px-2 text-sm font-medium">{o.orderNo}</td>
                  <td className="py-2 px-2 text-sm text-gray-700">{o.product}</td>
                  <td className="py-2 px-2 text-sm">{o.customer}</td>
                  <td className="py-2 px-2 text-sm">{o.currency} {o.amount.toLocaleString()}</td>
                  <td className="py-2 px-2">
                    <div className="flex items-center gap-2">
                      <StatusPill status={o.status} />
                      <div className="text-xs text-gray-500">{o.shipped ? "Shipped" : "Not shipped"}</div>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleView(o)}
                        className="px-3 py-1 rounded-md border border-gray-200 text-sm hover:bg-gray-50 transition"
                      >
                        View
                      </button>

                      <button
                        onClick={() => toggleShipped(o.key)}
                        className={`px-3 py-1 rounded-md text-sm border ${o.shipped ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-gray-200 hover:bg-gray-50" }`}
                      >
                        {o.shipped ? "Mark Undelivered" : "Mark Shipped"}
                      </button>

                      <button
                        onClick={() => createInvoice(o.key)}
                        className={`px-3 py-1 rounded-md text-sm ${o.invoiceCreated ? "bg-gray-100 text-gray-600 border border-gray-200" : "bg-emerald-600 text-white hover:bg-emerald-700" }`}
                      >
                        {o.invoiceCreated ? "Invoice Created" : "Create Invoice"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* pagination / footer */}
        <div className="mt-4 flex items-center justify-end">
          <div className="text-sm text-gray-500">1</div>
        </div>
      </div>

      {/* simple view panel/modal area (inline) */}
      {viewOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/30" onClick={closeView} />
          <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-xl p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold">Order {viewOrder.orderNo}</h3>
                <div className="text-sm text-gray-500 mt-1">{viewOrder.createdAt} • {viewOrder.paymentMethod}</div>
              </div>
              <div>
                <button onClick={closeView} className="px-3 py-1 rounded-md border border-gray-200">Close</button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-500">Product</div>
                <div className="text-sm font-medium">{viewOrder.product}</div>

                <div className="mt-3 text-xs text-gray-500">Customer</div>
                <div className="text-sm font-medium">{viewOrder.customer}</div>

                <div className="mt-3 text-xs text-gray-500">Address</div>
                <div className="text-sm">{viewOrder.address}</div>
              </div>

              <div>
                <div className="text-xs text-gray-500">Amount</div>
                <div className="text-sm font-medium">{viewOrder.currency} {viewOrder.amount.toLocaleString()}</div>

                <div className="mt-3 text-xs text-gray-500">Status</div>
                <div className="text-sm">
                  <StatusPill status={viewOrder.status} /> &nbsp;
                  <span className="text-sm text-gray-600">{viewOrder.shipped ? "Shipped" : "Not shipped"}</span>
                </div>

                <div className="mt-4 flex gap-2">
                  <button onClick={() => toggleShipped(viewOrder.key)} className="px-3 py-1 rounded-md border border-gray-200">Toggle Shipped</button>
                  <button onClick={() => { createInvoice(viewOrder.key); alert('Invoice created (demo)'); }} className="px-3 py-1 rounded-md bg-emerald-600 text-white">Create Invoice</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
