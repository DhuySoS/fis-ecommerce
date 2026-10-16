"use client";

import React, { useSyncExternalStore } from "react";
import ActionButton from "@/components/shared/ActionButton";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { useAuthStore } from "@/features/auth";
import styles from "./shop-layout.module.scss";

const emptySubscribe = () => () => {};

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className={styles.shopLayout}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <p className={styles.brand}>eCommerce</p>

          <div className={styles.headerRight}>
            {mounted && user && (
              <div className={styles.userInfo}>
                <div className={styles.userAvatar}>
                  <UserOutlined />
                </div>
                <div className={styles.userDetails}>
                  <span className={styles.username}>{user.username}</span>
                  <span className={styles.roleTag}>{user.role}</span>
                </div>
              </div>
            )}

            <ActionButton icon={<LogoutOutlined />} onClick={() => logout()}>
              Đăng xuất
            </ActionButton>
          </div>
        </div>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.container}>{children}</div>
      </main>
    </div>
  );
}
