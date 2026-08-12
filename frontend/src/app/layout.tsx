import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppLayout from "@/components/AppLayout";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NeuroBase | Verifiable AI Memory Layer",
  description: "Store, price, and recall AI knowledge through Shelby, Aptos, and MCP.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/neurobase_logo-removebg-preview.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen relative`}>
        <Providers>
          <div className="bg-mesh" />
          <AppLayout>
            {children}
          </AppLayout>
        </Providers>
      </body>
    </html>
  );
}
