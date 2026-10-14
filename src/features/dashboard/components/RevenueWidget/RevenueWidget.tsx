"use client";

import React from "react";
import { formatCurrency } from "@/lib/format";
import DashboardCard from "../DashboardCard";
import { useDashboardRevenue } from "../../hooks";
import styles from "./RevenueWidget.module.scss";

export interface RevenueWidgetProps {
  date: string;
}

export function RevenueWidget({ date }: RevenueWidgetProps) {
  const { data, isLoading, isError, refetch } = useDashboardRevenue(date);

  const totalRevenue = data ?? 0;

  return (
    <DashboardCard
      title="Doanh thu hôm nay"
      loading={isLoading}
      error={isError}
      onRetry={() => refetch()}
    >
      <div className={styles.revenueValue}>{formatCurrency(totalRevenue)}</div>
    </DashboardCard>
  );
}

export default RevenueWidget;
