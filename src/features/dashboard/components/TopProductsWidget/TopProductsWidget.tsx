"use client";

import React from "react";
import DashboardCard from "../DashboardCard";
import { useDashboardTopProducts } from "../../hooks";
import styles from "./TopProductsWidget.module.scss";

export interface TopProductsWidgetProps {
  date: string;
}

export function TopProductsWidget({ date }: TopProductsWidgetProps) {
  const { data, isLoading, isError, refetch } = useDashboardTopProducts(date);

  const topProducts = data ?? [];

  return (
    <DashboardCard
      title="Top 5 bán chạy (30 ngày)"
      extra="Đã bán"
      loading={isLoading}
      error={isError}
      onRetry={() => refetch()}
    >
      {topProducts.length > 0 ? (
        <div className={styles.rankedList}>
          {topProducts.slice(0, 5).map((item, index) => (
            <div key={item.productId} className={styles.rankedItem}>
              <span className={styles.rankName}>
                {index + 1}. {item.name}
              </span>
              <span className={styles.rankCount}>{item.quantitySold}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyText}>Chưa có dữ liệu bán hàng</div>
      )}
    </DashboardCard>
  );
}

export default TopProductsWidget;
