import React from "react";
import type { Metadata } from "next";
import { UserRoleManagement } from "@/features/users";

export const metadata: Metadata = {
  title: "Phân quyền tài khoản | eCommerce Admin",
  description: "Quản lý vai trò và phân quyền tài khoản người dùng",
};

export default function UsersRolePage() {
  return <UserRoleManagement />;
}
