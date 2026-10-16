"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/features/auth";
import styles from "./auth-layout.module.scss";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (isAuthenticated && pathname !== "/set-password") {
      if (user?.role === "ADMIN" || user?.role === "PRODUCT_OWNER") {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/orders/new");
      }
    }
  }, [isAuthenticated, user, router, pathname]);

  return <div className={styles.authLayout}>{children}</div>;
}
