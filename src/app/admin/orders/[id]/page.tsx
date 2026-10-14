import React from "react";
import type { Metadata } from "next";
import OrderDetailManagement from "@/features/orders/components/OrderDetailManagement";

interface AdminOrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: AdminOrderDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Chi tiết đơn hàng #${id} | Admin`,
  };
}

export default async function AdminOrderDetailPage({
  params,
}: AdminOrderDetailPageProps) {
  const { id } = await params;
  return <OrderDetailManagement orderId={id} />;
}
