import React from "react";

interface AdminOrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({
  params,
}: AdminOrderDetailPageProps) {
  const { id } = await params;
  return (
    <div>
      <h1>Chi tiết đơn hàng #{id} (Admin)</h1>
    </div>
  );
}
