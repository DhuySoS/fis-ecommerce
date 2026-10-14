import React from "react";
import type { Metadata } from "next";
import DashboardManagement from "@/features/dashboard/components/DashboardManagement";

export const metadata: Metadata = {
  title: "Dashboard | Admin",
};

export default function AdminDashboardPage() {
  return <DashboardManagement />;
}
