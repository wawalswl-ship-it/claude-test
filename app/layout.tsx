import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "전화번호부",
  description: "전화번호를 저장하고 검색하는 간단한 주소록",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-zinc-50 text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-100">
        {children}
      </body>
    </html>
  );
}
