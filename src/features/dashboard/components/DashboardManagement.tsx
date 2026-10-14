"use client";

import React, { useState } from "react";
import { DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useQueryClient } from "@tanstack/react-query";
import { CaretDownOutlined } from "@ant-design/icons";
import ActionButton from "@/components/shared/ActionButton";
import AdminPageContainer from "@/components/shared/AdminPageContainer";
import { DASHBOARD_KEYS } from "../hooks";
import RevenueWidget from "./RevenueWidget";
import OrderStatusWidget from "./OrderStatusWidget";
import TopProductsWidget from "./TopProductsWidget";
import LowStockWidget from "./LowStockWidget";
import styles from "./DashboardManagement.module.scss";

export default function DashboardManagement() {
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [isReloading, setIsReloading] = useState<boolean>(false);

  const dateStr = selectedDate.format("YYYY-MM-DD");

  const handleReload = async () => {
    setIsReloading(true);
    try {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: DASHBOARD_KEYS.all }),
        new Promise((resolve) => setTimeout(resolve, 500)),
      ]);
    } finally {
      setIsReloading(false);
    }
  };

  return (
    <AdminPageContainer
      title="Dashboard"
      extra={
        <div className={styles.extraActions}>
          <DatePicker
            prefix={<span className={styles.datePrefix}>Ngày:</span>}
            value={selectedDate}
            onChange={(date) => {
              if (date) setSelectedDate(date);
            }}
            format="DD/MM/YYYY"
            allowClear={false}
            suffixIcon={<CaretDownOutlined />}
          />
          <ActionButton onClick={handleReload} loading={isReloading}>
            Tải lại
          </ActionButton>
        </div>
      }
    >
      <div className={styles.dashboardGrid}>
        <RevenueWidget date={dateStr} />
        <OrderStatusWidget date={dateStr} />
        <TopProductsWidget date={dateStr} />
        <LowStockWidget date={dateStr} />
      </div>
    </AdminPageContainer>
  );
}
