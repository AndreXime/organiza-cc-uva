import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { DataProvider } from "@/context/DataContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Disciplinas do curso UVA",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <DataProvider>
        <body className={`${geistSans.variable} antialiased`}>{children}</body>
      </DataProvider>
    </html>
  );
}
