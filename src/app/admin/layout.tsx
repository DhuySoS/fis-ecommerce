import React from "react";
import AdminSidebar from "@/components/layout/AdminSidebar";
import styles from "./admin-layout.module.scss";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.adminLayout}>
      <AdminSidebar />
      <div className={styles.adminContent}>
        <main>{children}</main>
      </div>
    </div>
  );
}
