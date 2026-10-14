import React from "react";
import type { Metadata } from "next";
import { AuthForm } from "@/features/auth";

export const metadata: Metadata = {
  title: "Tài khoản | eCommerce",
  description: "Trang xác thực người dùng eCommerce",
};

export default function AuthPage() {
  return <AuthForm initialMode="login" />;
}
