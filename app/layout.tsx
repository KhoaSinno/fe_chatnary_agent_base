import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chatnary - Smart E-Library with RAG",
  description:
    "A modern knowledge management platform combining traditional document storage with AI-powered RAG (Retrieval-Augmented Generation) for intelligent learning and collaboration.",
  keywords: [
    "e-library",
    "RAG",
    "AI",
    "document management",
    "collaboration",
    "education",
  ],
  authors: [{ name: "Chatnary Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${inter.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
