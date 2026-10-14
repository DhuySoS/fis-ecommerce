"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth";
import styles from "./auth-layout.module.scss";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === "ADMIN" || user?.role === "PRODUCT_OWNER") {
        router.replace("/admin/orders");
      } else {
        router.replace("/orders/new");
      }
    }
  }, [isAuthenticated, user, router]);

  return <div className={styles.authLayout}>{children}</div>;
}
