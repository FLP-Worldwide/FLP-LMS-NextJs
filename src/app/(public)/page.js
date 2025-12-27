"use client";

import React, { useState } from "react";
import { Layout, Card, Input, Button, message } from "antd";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const { Content } = Layout;

export default function Home() {
  const [mode, setMode] = useState("login"); // login | signup
  const router = useRouter();

  // 🔹 FORM STATE
  const [email, setEmail] = useState("school@dps.com");
  const [password, setPassword] = useState("School@123");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      message.warning("Please enter email and password");
      return;
    }

    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (!res?.ok) {
      setLoading(false);
      message.error("Invalid email or password");
      return;
    }

    // ✅ session is now created – fetch it
    const session = await fetch("/api/auth/session").then((r) => r.json());

    const { role } = session;

    // 🔒 ERP MODE – FIXED BY ROLE
    if (role === "school_admin") {
      localStorage.setItem("erp_mode", "school");
      router.replace("/admin");
    } else if (role === "coaching_admin") {
      localStorage.setItem("erp_mode", "coaching");
      router.replace("/admin");
    } else if (role === "super_admin") {
      localStorage.setItem("erp_mode", "super");
      router.replace("/admin");
    } else {
      message.error("Unauthorized account");
    }

    setLoading(false);
  }

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <Content className="flex-1 mx-auto max-w-7xl px-6 py-24">
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* LEFT CONTENT */}
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
              Smart School Management System
            </h1>
            <p className="text-lg text-zinc-600 max-w-xl">
              Manage students, fees, staff, hostel, and more — all in one secure
              platform designed for modern institutions.
            </p>
            <ul className="space-y-3 text-zinc-600">
              <li>• Student & Admission Management</li>
              <li>• Fees, Hostel & Staff Control</li>
              <li>• License-based & Secure Access</li>
            </ul>
          </div>

          {/* RIGHT FORM */}
          <div className="flex justify-center">
            <Card className="w-full max-w-md rounded-2xl shadow-lg p-6">
              {mode === "login" ? (
                <>
                  <h2 className="text-2xl font-semibold mb-2">Login</h2>
                  <p className="text-sm text-zinc-500 mb-6">
                    Access your dashboard
                  </p>

                  <div className="flex flex-col gap-5">
                    <Input
                      size="large"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />

                    <Input.Password
                      size="large"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onPressEnter={handleLogin}
                    />

                    <Button
                      type="primary"
                      size="large"
                      loading={loading}
                      onClick={handleLogin}
                      className="w-full rounded-xl bg-blue-600 hover:bg-blue-700"
                    >
                      Login
                    </Button>

                    <div className="text-center text-sm text-zinc-500">
                      Don’t have an account?
                    </div>

                    <Button
                      size="large"
                      className="w-full rounded-xl"
                      onClick={() => setMode("signup")}
                    >
                      Create School Account
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-semibold mb-2">
                    Create School Account
                  </h2>
                  <p className="text-sm text-zinc-500 mb-6">
                    Start your free trial
                  </p>

                  <div className="flex flex-col gap-4">
                    <Input size="large" placeholder="Your full name" />
                    <Input size="large" placeholder="Mobile number" />
                    <Input size="large" placeholder="School name" />
                    <Input size="large" placeholder="City" />
                    <Input size="large" placeholder="Email address" />

                    <Button
                      type="primary"
                      size="large"
                      className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 mt-2"
                    >
                      Create Account
                    </Button>

                    <div className="text-center text-sm text-zinc-500 mt-2">
                      Already have an account?
                    </div>

                    <Button
                      size="large"
                      className="w-full rounded-xl"
                      onClick={() => setMode("login")}
                    >
                      Back to Login
                    </Button>
                  </div>
                </>
              )}
            </Card>
          </div>
        </section>
      </Content>
    </div>
  );
}
