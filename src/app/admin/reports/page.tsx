import React from "react";
import type { Metadata } from "next";
import ReportManagement from "@/features/reports/components/ReportManagement";

export const metadata: Metadata = {
  title: "Báo cáo doanh thu | Admin",
};

export default function AdminReportsPage() {
  return <ReportManagement />;
}
