import React from "react";
import type { Metadata } from "next";
import CreateOrder from "@/features/orders/components/CreateOrder/CreateOrder";

export const metadata: Metadata = {
  title: "Tạo đơn hàng",
};

export default function CreateOrderPage() {
  return <CreateOrder />;
}
