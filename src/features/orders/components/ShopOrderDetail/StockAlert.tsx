"use client";

import React from "react";
import type { StockAlertInfo } from "./types";
import styles from "./ShopOrderDetail.module.scss";

interface StockAlertProps {
  alert: StockAlertInfo | null;
}

export default function StockAlert({ alert }: StockAlertProps) {
  if (!alert) return null;

  return (
    <div className={styles.stockAlert}>
      Không đủ hàng: {alert.productName} chỉ còn {alert.availableStock}, yêu cầu{" "}
      {alert.requestedQty}
    </div>
  );
}
