"use client";

import React from "react";
import { Tag } from "antd";
import {
  OrderStatus,
  ORDER_STATUS_MAP,
} from "@/lib/order-state-machine";

interface StatusTagProps {
  status: OrderStatus | string;
  showDescription?: boolean;
}

export function StatusTag({ status, showDescription = false }: StatusTagProps) {
  const config = ORDER_STATUS_MAP[status as OrderStatus];

  if (!config) {
    return <Tag>{status}</Tag>;
  }

  return (
    <Tag
      color={config.color}
      title={showDescription ? config.description : undefined}
    >
      {config.label}
    </Tag>
  );
}

export default StatusTag;
