"use client";

import React from "react";
import { Tag } from "antd";
import {
  OrderStatus,
  ORDER_STATUS_MAP,
} from "@/lib/order-state-machine";
import styles from "./StatusTag.module.scss";

export type SupportedStatus = OrderStatus | "ACTIVE" | "INACTIVE" | string;

export interface StatusTagProps {
  status: SupportedStatus;
  showDescription?: boolean;
  className?: string;
}

const STATUS_CLASS_MAP: Record<string, string> = {
  ACTIVE: styles.active,
  INACTIVE: styles.inactive,
  PENDING: styles.pending,
  PENDING_ACTIVATION: styles.pending,
  AWAITING_PAYMENT: styles.awaiting_payment,
  PAID: styles.paid,
  CONFIRMED: styles.confirmed,
  COMPLETED: styles.completed,
  CANCELLED: styles.cancelled,
};

export function StatusTag({
  status,
  showDescription = false,
  className,
}: StatusTagProps) {
  const statusKey = String(status).toUpperCase();
  const statusClass = STATUS_CLASS_MAP[statusKey] || styles.inactive;

  const orderConfig = ORDER_STATUS_MAP[statusKey as OrderStatus];
  const label = orderConfig?.label || status;
  const description = orderConfig?.description;

  return (
    <Tag
      className={`${styles.statusTag} ${statusClass} ${className || ""}`.trim()}
      title={showDescription ? description : undefined}
    >
      {label}
    </Tag>
  );
}

export default StatusTag;
