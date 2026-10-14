"use client";

import React, { useState } from "react";
import { Tabs } from "antd";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import styles from "./AuthForm.module.scss";

export interface AuthFormProps {
  initialMode?: "login" | "register";
}

export default function AuthForm({ initialMode = "login" }: AuthFormProps) {
  const [activeTab, setActiveTab] = useState<string>(initialMode);
  const [prefillUsername, setPrefillUsername] = useState<string>("");

  return (
    <div className={styles.authCard}>
      <div className={styles.brandHeader}>
        <h1 className={styles.brandTitle}>eCommerce</h1>
        <p className={styles.brandSubtitle}>
          {activeTab === "login"
            ? "Đăng nhập để tiếp tục"
            : "Tạo tài khoản mua hàng mới"}
        </p>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key)}
        className={styles.authTabs}
        items={[
          {
            key: "login",
            label: "Đăng nhập",
            children: (
              <LoginForm
                defaultUsername={prefillUsername}
                onSwitchToRegister={() => setActiveTab("register")}
              />
            ),
          },
          {
            key: "register",
            label: "Đăng ký",
            children: (
              <RegisterForm
                onSwitchToLogin={() => setActiveTab("login")}
                onRegisterSuccess={(username) => {
                  setPrefillUsername(username);
                  setActiveTab("login");
                }}
              />
            ),
          },
        ]}
      />
    </div>
  );
}
