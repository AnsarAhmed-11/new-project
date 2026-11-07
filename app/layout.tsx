import type { Metadata } from "next";
import "./globals.css";
import ToastProvider from "@/app/components/ToastProvider";
// import {Toaster} from "react-hot-toast"
import { Toaster } from "@/components/ui/sonner";
import {
  Inter,
  Encode_Sans,
  Cinzel,
  Noto_Sans,
  Playfair_Display,
} from "next/font/google";
import { cn } from "@/lib/utils";

const playfairDisplayHeading = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
});

const notoSans = Noto_Sans({ subsets: ["latin"], variable: "--font-sans" });

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
const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        inter.variable,
        encode.variable,
        cinzel.variable,
        "font-sans",
        notoSans.variable,
        playfairDisplayHeading.variable,
      )}
    >
      <body>
        <ToastProvider />
        <Toaster position="top-center" richColors />
        {children}
      </body>
    </html>
  );
}
