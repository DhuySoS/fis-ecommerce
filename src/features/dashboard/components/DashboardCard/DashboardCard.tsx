"use client";

import React, { useState } from "react";
import { Skeleton } from "antd";
import ActionButton from "@/components/shared/ActionButton";
import styles from "./DashboardCard.module.scss";

export interface DashboardCardProps {
  title: React.ReactNode;
  extra?: React.ReactNode;
  loading?: boolean;
  error?: boolean | Error | string | null;
  errorMessage?: string;
  onRetry?: () => void | Promise<unknown>;
  retryText?: string;
  className?: string;
  children?: React.ReactNode;
}

export function DashboardCard({
  title,
  extra,
  loading = false,
  error = false,
  errorMessage = "Không tải được dữ liệu",
  onRetry,
  retryText = "Thử lại",
  className,
  children,
}: DashboardCardProps) {
  const isError = Boolean(error);
  const [retrying, setRetrying] = useState<boolean>(false);

  const handleRetry = async () => {
    if (!onRetry) return;
    setRetrying(true);
    try {
      await onRetry();
    } finally {
      setRetrying(false);
    }
  };

  const renderContent = () => {
    // Nếu đang ở trạng thái lỗi, giữ nguyên giao diện lỗi và hiển thị loading trực tiếp trên ActionButton
    // Tránh việc render lại Skeleton làm thay đổi chiều cao đẩy nhảy layout
    if (isError) {
      return (
        <div className={styles.errorContainer}>
          <span className={styles.errorText}>
            {typeof error === "string" ? error : errorMessage}
          </span>
          {onRetry && (
            <ActionButton onClick={handleRetry} loading={retrying}>
              {retryText}
            </ActionButton>
          )}
        </div>
      );
    }

    if (loading) {
      return (
        <div className={styles.loadingContainer}>
          <Skeleton active title={false} paragraph={{ rows: 3 }} />
        </div>
      );
    }

    return children;
  };

  return (
    <div
      className={`${styles.card} ${isError ? styles.isError : ""} ${className || ""}`.trim()}
    >
      <div className={styles.header}>
        <div className={styles.title}>{title}</div>
        {extra && <div className={styles.extra}>{extra}</div>}
      </div>
      <div className={styles.body}>{renderContent()}</div>
    </div>
  );
}

export default DashboardCard;
