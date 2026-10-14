import React from "react";
import type { Metadata } from "next";
import EmailManagement from "@/features/emails/components/EmailManagement";

export const metadata: Metadata = {
  title: "Mail gửi lỗi | Admin",
};

export default function AdminEmailsPage() {
  return <EmailManagement />;
}
