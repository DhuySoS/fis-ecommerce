"use client";

import React, { useMemo } from "react";
import DashboardCard from "../DashboardCard";
import { useDashboardOrderStatuses } from "../../hooks";
import styles from "./OrderStatusWidget.module.scss";

export interface OrderStatusWidgetProps {
  date: string;
}

export function OrderStatusWidget({ date }: OrderStatusWidgetProps) {
  const { data, isLoading, isError, refetch } = useDashboardOrderStatuses(date);

  const counts = useMemo(() => {
    // awaiting_payment lấy từ payment_pending trong response của BE
    const awaitingPayment =
      data?.PAYMENT_PENDING ?? data?.AWAITING_PAYMENT ?? 0;
    const pending = data?.PENDING ?? data?.PENDING_APPROVAL ?? 0;
    const paid = data?.PAID ?? 0;
    const confirmed = data?.CONFIRMED ?? 0;
    const completed = data?.COMPLETED ?? 0;
    const cancelled = data?.CANCELLED ?? 0;

    return {
      col1: [
        { label: "PENDING", value: pending },
        { label: "AWAITING_PAYMENT", value: awaitingPayment },
        { label: "PAID", value: paid },
      ],
      col2: [
        { label: "CONFIRMED", value: confirmed },
        { label: "COMPLETED", value: completed },
        { label: "CANCELLED", value: cancelled },
      ],
    };
  }, [data]);

  return (
    <DashboardCard
      title="Số đơn theo trạng thái"
      loading={isLoading}
      error={isError}
      onRetry={() => refetch()}
    >
      <div className={styles.statusGrid}>
        <div className={styles.statusCol}>
          {counts.col1.map((item) => (
            <div key={item.label} className={styles.statusItem}>
              <span>
                {item.label}: {item.value}
              </span>
            </div>
          ))}
        </div>
        <div className={styles.statusCol}>
          {counts.col2.map((item) => (
            <div key={item.label} className={styles.statusItem}>
              <span>
                {item.label}: {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </DashboardCard>
  );
}

export default OrderStatusWidget;
