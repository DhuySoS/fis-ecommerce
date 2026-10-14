import React from "react";
import type { Metadata } from "next";
import CustomerManagement from "@/features/customers/components/CustomerManagement";

export const metadata: Metadata = {
  title: "Quản lý khách hàng | Admin",
};

export default function AdminCustomersPage() {
  return <CustomerManagement />;
}
