// File: src/components/Header.jsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function HeaderPage() {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-zinc-200">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <div
          className="text-2xl font-extrabold tracking-tight cursor-pointer"
          onClick={() => router.push("/")}
        >
          <span className="text-blue-600">FLP</span> Smart School
        </div>

        {/* Navigation */}
        <nav className="hidden sm:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => router.push("/pricing")}
            className="text-zinc-700 hover:text-blue-600"
          >
            Pricing
          </button>

          <button
            onClick={() => router.push("/demo")}
            className="text-zinc-700 hover:text-blue-600"
          >
            Request Demo
          </button>

          <button
            onClick={() => router.push("/login")}
            className="text-zinc-700 hover:text-blue-600"
          >
            Login
          </button>

          <button
            onClick={() => router.push("/signup")}
            className="rounded-md bg-blue-600 px-4 py-2 text-white text-sm hover:bg-blue-700"
          >
            Sign Up
          </button>
        </nav>

        {/* Mobile Menu Icon */}
        <div className="sm:hidden">
          <button
            aria-label="Open menu"
            className="rounded-md p-2 hover:bg-zinc-100"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
