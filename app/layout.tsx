import type { Metadata } from "next";
import "./globals.css";
import ToastProvider from "@/app/components/ToastProvider";
import { Inter, Encode_Sans,Cinzel } from "next/font/google";
export const metadata: Metadata = {
  title: "Merciful Tools | Precision Tools",
  description:
    "Precision tools designed for accuracy, durability and professional performance.",
};
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});
const encode = Encode_Sans({
  subsets: ["latin"],
  variable: "--font-encode",
});
const cinxel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ToastProvider />
        {children}
      </body>
    </html>
  );
}
