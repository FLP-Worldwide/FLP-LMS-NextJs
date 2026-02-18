"use client";

import React, { useEffect, useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import { Clock, CalendarDays } from "lucide-react";

/* ======================================================
   ADMIN DASHBOARD HOME
====================================================== */

export default function HomePage() {
  const { dashboard } = useAdmin();// assuming admin name here

  const [time, setTime] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTime(new Date());

    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);


  if (!mounted || !time) return null;
  /* ================= GREETING ================= */
  const hours = time.getHours();

  const greeting =
    hours < 12
      ? "Good Morning"
      : hours < 17
      ? "Good Afternoon"
      : "Good Evening";

  /* ================= FORMAT DATE ================= */
  const formattedDate = time.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  /* ================= FORMAT TIME ================= */
  const formattedTime = time.toLocaleTimeString();

  /* ================= CALENDAR ================= */
  const month = time.toLocaleString("default", { month: "long" });
  const year = time.getFullYear();
  const today = time.getDate();

  const firstDay = new Date(year, time.getMonth(), 1).getDay();
  const daysInMonth = new Date(year, time.getMonth() + 1, 0).getDate();

  const daysArray = [];

  for (let i = 0; i < firstDay; i++) {
    daysArray.push(null);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    daysArray.push(d);
  }

  return (
    <>
    <div
      className="min-h-[90vh] bg-contain bg-right bg-no-repeat"
      style={{
        backgroundImage: "url('/home-img.png')",
      }}
    >
    <div className="h-full">
      <div className="p-8">
      <div className="flex justify-between items-start">

        {/* ================= LEFT SIDE ================= */}
        <div className="space-y-6 p-6">

          {/* GREETING */}
          <h1 className="text-3xl font-semibold text-blue-600">
            {greeting}, {dashboard?.user?.name || "Admin User"}
          </h1>

          {/* TIME */}
          <div className="flex items-center gap-4 text-lg text-gray-700">
            <Clock className="text-blue-500" />
            <span className="font-medium">{formattedTime}</span>
          </div>

          {/* DATE */}
          <div className="flex items-center gap-4 text-lg text-gray-700">
            <CalendarDays className="text-blue-500" />
            <span className="font-medium">{formattedDate}</span>
          </div>
        </div>

        {/* ================= RIGHT SIDE CALENDAR ================= */}
        <div className="bg-white shadow-xl rounded-lg p-6 w-80">

          {/* HEADER */}
          <div className="flex items-center gap-3 mb-4">
            <div className="text-5xl font-light text-indigo-400">
              {today}
            </div>
            <div>
              <div className="text-lg font-medium text-gray-700">
                {month}
              </div>
              <div className="text-gray-400">
                {year}
              </div>
            </div>
          </div>

          {/* WEEK HEADER */}
          <div className="grid grid-cols-7 text-xs text-gray-500 mb-2">
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
              <div key={i} className="text-center">
                {d}
              </div>
            ))}

          </div>

          {/* DAYS GRID */}
          <div className="grid grid-cols-7 gap-1 text-sm">
            {daysArray.map((day, index) => (
              <div
                key={index}
                className={`text-center py-1 rounded
                  ${
                    day === today
                      ? "bg-gray-300 text-black font-medium"
                      : "text-gray-600"
                  }
                `}
              >
                {day || ""}
              </div>
            ))}
          </div>
        </div>

      </div>
        </div>
      </div>
    </div>
    </>
  );
}
