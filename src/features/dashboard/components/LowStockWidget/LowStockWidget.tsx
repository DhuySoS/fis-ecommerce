"use client";

import React from "react";
import DashboardCard from "../DashboardCard";
import { useDashboardLowStock } from "../../hooks";
import styles from "./LowStockWidget.module.scss";

export interface LowStockWidgetProps {
  date: string;
}

export function LowStockWidget({ date }: LowStockWidgetProps) {
  const { data, isLoading, isError, refetch } = useDashboardLowStock(date);

  const lowStockProducts = data ?? [];

  return (
    <DashboardCard
      title="Sắp hết hàng (tồn ≤ 5)"
      loading={isLoading}
      error={isError ? "Không tải được dữ liệu" : null}
      onRetry={() => refetch()}
    >
      {lowStockProducts.length > 0 ? (
        <div className={styles.lowStockList}>
          {lowStockProducts.map((item) => (
            <div key={item.productId} className={styles.lowStockItem}>
              <span>{item.name}</span>
              <span className={styles.lowStockCount}>Tồn: {item.stock}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyText}>
          Không có sản phẩm nào sắp hết hàng
        </div>
      )}
    </DashboardCard>
  );
}

export default LowStockWidget;
