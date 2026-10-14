"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "antd";
import type { MenuProps } from "antd";
import {
  AppstoreOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  DashboardOutlined,
  MailOutlined,
  BarChartOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import ActionButton from "@/components/shared/ActionButton";
import { useAuthStore } from "@/features/auth";
import styles from "./AdminSidebar.module.scss";

type MenuItem = Required<MenuProps>["items"][number];

const NAV_ITEMS: {
  key: string;
  label: string;
  href: string;
  icon: React.ReactNode;
}[] = [
  {
    key: "/admin/products",
    label: "Sản phẩm",
    href: "/admin/products",
    icon: <AppstoreOutlined />,
  },
  {
    key: "/admin/customers",
    label: "Khách hàng",
    href: "/admin/customers",
    icon: <UserOutlined />,
  },
  {
    key: "/admin/orders",
    label: "Đơn hàng",
    href: "/admin/orders",
    icon: <ShoppingCartOutlined />,
  },
  {
    key: "/admin/dashboard",
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: <DashboardOutlined />,
  },
  {
    key: "/admin/emails",
    label: "Mail lỗi",
    href: "/admin/emails",
    icon: <MailOutlined />,
  },
  {
    key: "/admin/reports",
    label: "Báo cáo",
    href: "/admin/reports",
    icon: <BarChartOutlined />,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Xác định menu item đang được active dựa trên pathname hiện tại
  const selectedKey = useMemo(() => {
    const matched = NAV_ITEMS.find((item) => pathname.startsWith(item.key));
    return matched ? matched.key : "";
  }, [pathname]);

  const menuItems: MenuItem[] = useMemo(() => {
    return NAV_ITEMS.map((item) => ({
      key: item.key,
      icon: item.icon,
      label: <Link href={item.href}>{item.label}</Link>,
    }));
  }, []);

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.menuContainer}>
        <Menu
          mode="inline"
          selectedKeys={selectedKey ? [selectedKey] : []}
          items={menuItems}
        />
      </div>

      <div className={styles.footerSection}>
        {mounted && user && (
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              <UserOutlined />
            </div>
            <div className={styles.userDetails}>
              <div className={styles.username}>{user.username}</div>
              <div className={styles.userRole}>
                <span className={styles.roleTag}>{user.role}</span>
              </div>
            </div>
          </div>
        )}

        <ActionButton
          icon={<LogoutOutlined />}
          className={styles.logoutBtn}
          onClick={handleLogout}
        >
          Đăng xuất
        </ActionButton>
      </div>
    </aside>
  );
}
