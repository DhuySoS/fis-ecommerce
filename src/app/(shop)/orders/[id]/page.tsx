import React from "react";
import type { Metadata } from "next";
import ShopOrderDetail from "@/features/orders/components/ShopOrderDetail";

interface ShopOrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ShopOrderDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Đơn hàng #${id} | eCommerce`,
  };
}

export default async function ShopOrderDetailPage({
  params,
}: ShopOrderDetailPageProps) {
  const { id } = await params;
  return <ShopOrderDetail orderId={id} />;
}
