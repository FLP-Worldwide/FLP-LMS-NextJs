"use client";

import { Layout, Button, Input } from "antd";
import React from "react";
const { Footer } = Layout;

export default function FooterPage() {
  return (
    <>
      <Footer
        className="bg-white/60 dark:bg-zinc-900/60 border-t border-transparent"
        style={{ padding: 2 }}
      >

        <div className="bg-white/60  border-t border-transparent">
          <div className="max-w-7xl mx-auto px-6 py-2 text-sm text-zinc-600">
            © {new Date().getFullYear()} FLP Smart School Management System. All rights reserved.
          </div>
        </div>
      </Footer>
    </>
  );
}
