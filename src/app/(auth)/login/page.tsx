import React from "react";
import type { Metadata } from "next";
import { AuthForm } from "@/features/auth";

export const metadata: Metadata = {
  title: "Đăng nhập | eCommerce",
  description: "Trang đăng nhập hệ thống eCommerce",
};

export default function LoginPage() {
  return <AuthForm initialMode="login" />;
}
