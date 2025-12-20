import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";

import Providers from "./providers";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "FLP Smart School - Manage Your School Easily",
  description: "A safe, modern space for communities to come together: share events, buy products made by members, invite friends, and discover matrimonial matches tailored to your community preferences.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
