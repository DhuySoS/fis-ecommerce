import type { Metadata } from "next";
import { AppProviders } from "@/lib/providers";
import "./globals.scss";

export const metadata: Metadata = {
  title: "Hệ thống quản lý đơn hàng",
  description: "E-Commerce Order Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
