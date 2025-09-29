import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BisaMe - Your Trusted Marketplace in Ghana",
  description:
    "Buy and sell products securely across Ghana. Connect with local buyers and sellers on BisaMe, your trusted marketplace platform.",
  keywords: "buy, sell, Ghana, marketplace, local, products, services",
  authors: [{ name: "BisaMe" }],
  openGraph: {
    title: "BisaMe - Your Trusted Marketplace in Ghana",
    description: "Buy and sell products securely across Ghana",
    type: "website",
    locale: "en_GH",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
