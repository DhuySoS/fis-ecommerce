import React, { Suspense } from "react";
import type { Metadata } from "next";
import { Skeleton } from "antd";
import SetPasswordForm from "@/features/auth/components/SetPasswordForm/SetPasswordForm";

export const metadata: Metadata = {
  title: "Thiết lập mật khẩu | eCommerce",
  description: "Thiết lập mật khẩu và kích hoạt tài khoản lần đầu",
};

export default function SetPasswordPage() {
  return (
    <Suspense fallback={<Skeleton active paragraph={{ rows: 6 }} />}>
      <SetPasswordForm />
    </Suspense>
  );
}
