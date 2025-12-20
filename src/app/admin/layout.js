
"use client";

import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";


export default function AdminLayout({ children }) {

  return (

    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar fixed column */}
      <div className="flex-shrink-0">
        <AdminSidebar />
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-full mx-auto">{children}</div>
        </main>
      </div>
    </div>

  );
}
