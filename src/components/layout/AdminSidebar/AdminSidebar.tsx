"use client";

import React, { useEffect, useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Skeleton } from "antd";
import type { MenuProps } from "antd";
import {
  AppstoreOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  DashboardOutlined,
  MailOutlined,
  BarChartOutlined,
  LogoutOutlined,
  SafetyCertificateOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import ActionButton from "@/components/shared/ActionButton";
import { useAuthStore } from "@/features/auth";
import styles from "./AdminSidebar.module.scss";

type MenuItem = Required<MenuProps>["items"][number];

interface NavItem {
  key: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  roles?: ("ADMIN" | "PRODUCT_OWNER" | string)[];
}

const NAV_ITEMS: NavItem[] = [
  {
    key: "/admin/categories",
    label: "Danh mục",
    href: "/admin/categories",
    icon: <TagsOutlined />,
    roles: ["ADMIN"],
  },
  {
    key: "/admin/products",
    label: "Sản phẩm",
    href: "/admin/products",
    icon: <AppstoreOutlined />,
    roles: ["ADMIN", "PRODUCT_OWNER"],
  },
  {
    key: "/admin/customers",
    label: "Khách hàng",
    href: "/admin/customers",
    icon: <UserOutlined />,
    roles: ["ADMIN"],
  },
  {
    key: "/admin/orders",
    label: "Đơn hàng",
    href: "/admin/orders",
    icon: <ShoppingCartOutlined />,
    roles: ["ADMIN"],
  },
  {
    key: "/admin/dashboard",
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: <DashboardOutlined />,
    roles: ["ADMIN", "PRODUCT_OWNER"],
  },
  {
    key: "/admin/emails",
    label: "Mail lỗi",
    href: "/admin/emails",
    icon: <MailOutlined />,
    roles: ["ADMIN"],
  },
  {
    key: "/admin/reports",
    label: "Báo cáo",
    href: "/admin/reports",
    icon: <BarChartOutlined />,
    roles: ["ADMIN"],
  },
  {
    key: "/admin/users",
    label: "Phân quyền",
    href: "/admin/users",
    icon: <SafetyCertificateOutlined />,
    roles: ["ADMIN"],
  },
];

const emptySubscribe = () => () => {};

export default function AdminSidebar() {
  const pathname = usePathname();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const logout = useAuthStore((state) => state.logout);

  // Kích hoạt xác thực thông tin và quyền người dùng từ useAuthStore khi component mounted
  useEffect(() => {
    if (mounted) {
      checkAuth();
    }
  }, [mounted, checkAuth]);

  const userRole = user?.role;

  // Hiển thị hiệu ứng loading khi chưa mount hoặc store auth đang kiểm tra role
  const isCheckingRole = !mounted || isLoading;

  // Lọc menu item theo role của người dùng (Admin thấy tất cả, Product Owner chỉ thấy Dashboard và Báo cáo)
  const visibleNavItems = useMemo(() => {
    if (isCheckingRole || !userRole) {
      return [];
    }
    return NAV_ITEMS.filter((item) => {
      if (!item.roles) return true;
      return item.roles.includes(userRole);
    });
  }, [isCheckingRole, userRole]);

  // Xác định menu item đang được active dựa trên pathname hiện tại
  const selectedKey = useMemo(() => {
    const matched = visibleNavItems.find((item) =>
      pathname.startsWith(item.key),
    );
    return matched ? matched.key : "";
  }, [pathname, visibleNavItems]);

  const menuItems: MenuItem[] = useMemo(() => {
    return visibleNavItems.map((item) => ({
      key: item.key,
      icon: item.icon,
      label: <Link href={item.href}>{item.label}</Link>,
    }));
  }, [visibleNavItems]);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.menuContainer}>
        {isCheckingRole ? (
          <div className={styles.skeletonWrapper}>
            <Skeleton active paragraph={{ rows: 6 }} />
          </div>
        ) : (
          <Menu
            mode="inline"
            selectedKeys={selectedKey ? [selectedKey] : []}
            items={menuItems}
          />
        )}
      </div>
      {isCheckingRole ? (
        <Skeleton avatar active paragraph={{ rows: 1 }} />
      ) : (
        user && (
          <div className={styles.footerSection}>
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

            <ActionButton
              icon={<LogoutOutlined />}
              className={styles.logoutBtn}
              onClick={handleLogout}
            >
              Đăng xuất
            </ActionButton>
          </div>
        )
      )}
    </aside>
  );
}
