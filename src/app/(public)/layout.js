"use client";
import "../globals.css";
import HeaderPage from "@/components/Header";
import FooterPage from "@/components/Footer";



export default function RootLayout({ children }) {
  return (
    <>
      <HeaderPage />
      {children}
      <FooterPage />
    </>
  );
}
