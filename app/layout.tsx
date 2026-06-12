import type { Metadata } from "next";
import { Amiri, Tajawal } from "next/font/google";
import "./globals.css";

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
  preload: true,
});

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-tajawal",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "تراث جهة سوس ماسة",
  description:
    "تراث جهة سوس ماسة — دراسة في الموروث الحضاري والثقافي والطبيعي للمملكة المغربية",
  openGraph: {
    title: "تراث جهة سوس ماسة",
    description:
      "دراسة في الموروث الحضاري والثقافي والطبيعي — جهة سوس ماسة",
    locale: "ar_MA",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${amiri.variable} ${tajawal.variable}`}>
        {children}
      </body>
    </html>
  );
}
