import React from "react";
import type { Metadata } from "next";
import { AuthForm } from "@/features/auth";

export const metadata: Metadata = {
  title: "Đăng ký tài khoản | eCommerce",
  description: "Trang đăng ký tài khoản khách hàng mới",
};

export default function RegisterPage() {
  return <AuthForm initialMode="register" />;
}
