import React from "react";

interface ShopOrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ShopOrderDetailPage({
  params,
}: ShopOrderDetailPageProps) {
  const { id } = await params;
  return (
    <div>
      <h1>Chi tiết đơn hàng #{id}</h1>
    </div>
  );
}
