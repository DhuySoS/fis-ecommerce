"use client";

import React from "react";
import AdminPageContainer from "@/components/shared/AdminPageContainer";

export interface OrderDetailManagementProps {
  orderId: string;
}

export default function OrderDetailManagement({
  orderId,
}: OrderDetailManagementProps) {
  return (
    <AdminPageContainer title={`Đơn hàng #${orderId}`}>
      <div>Phần nội dung (thông tin đơn hàng, lịch sử, các bước chuyển trạng thái...) truyền vào sau</div>
    </AdminPageContainer>
  );
}
