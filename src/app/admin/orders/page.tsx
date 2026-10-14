import React from "react";
import type { Metadata } from "next";
import OrderManagement from "@/features/orders/components/OrderManagement";

export const metadata: Metadata = {
  title: "Quản lý đơn hàng | Admin",
};

export default function AdminOrdersPage() {
  return <OrderManagement />;
}
