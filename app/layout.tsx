import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Merciful Tools | Precision Tools",
  description:
    "Precision tools designed for accuracy, durability and professional performance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}