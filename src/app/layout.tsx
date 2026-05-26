import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SakramentoHub - Church Sacrament Management System",
  description: "Comprehensive church sacrament management system for Baptism, Wedding, Funeral Mass, Anointing of the Sick, House Blessing and more.",
  keywords: ["SakramentoHub", "Church", "Sacrament", "Baptism", "Wedding", "Funeral Mass", "Management"],
  authors: [{ name: "SakramentoHub" }],
  openGraph: {
    title: "SakramentoHub",
    description: "Church Sacrament Management System",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
