import React from "react";

interface MockPaymentPageProps {
  params: Promise<{ id: string }>;
}

export default async function MockPaymentPage({
  params,
}: MockPaymentPageProps) {
  const { id } = await params;
  return (
    <div>
      <h1>Trang thanh toán giả lập #{id}</h1>
    </div>
  );
}
