"use client";

import React, { useMemo } from "react";
import AdminPageContainer from "@/components/shared/AdminPageContainer";
import DataTable from "@/components/shared/DataTable";
import StatusTag from "@/components/shared/StatusTag";
import { Select, Tabs } from "antd";
import type { ColumnsType } from "antd/es/table";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { useTableQuery } from "@/hooks/useTableQuery";
import type { OrderStatus } from "@/lib/order-state-machine";
import type { Order } from "../types";
import { useOrders } from "../hooks";
import { useCustomers } from "@/features/customers/hooks";
import styles from "./OrderManagement.module.scss";
import { CaretDownOutlined } from "@ant-design/icons";

const ORDER_STATUS_TABS = [
  { key: "ALL", label: "Tất cả" },
  { key: "PENDING", label: "PENDING" },
  { key: "AWAITING_PAYMENT", label: "AWAITING_PAYMENT" },
  { key: "PAID", label: "PAID" },
  { key: "CONFIRMED", label: "CONFIRMED" },
  { key: "COMPLETED", label: "COMPLETED" },
  { key: "CANCELLED", label: "CANCELLED" },
];

export default function OrderManagement() {
  const { query, updateQuery, handleTableChange } = useTableQuery<Order>();

  const { data: orderData, isLoading } = useOrders(query);
  const { data: customerData } = useCustomers();

  const customerOptions = useMemo(() => {
    const list = [{ value: "all", label: "Tất cả" }];
    if (customerData?.items) {
      customerData.items.forEach((c) => {
        list.push({ value: String(c.id), label: c.name });
      });
    }
    return list;
  }, [customerData]);

  const activeTabKey = (query.status as string) || "ALL";

  const handleTabChange = (key: string) => {
    updateQuery({
      status: key === "ALL" ? undefined : (key as OrderStatus),
      page: 1,
    });
  };

  const handleCustomerChange = (val: string) => {
    updateQuery({
      customerId: val === "all" ? undefined : Number(val),
      page: 1,
    });
  };

  const columns: ColumnsType<Order> = [
    {
      title: "Mã đơn",
      dataIndex: "id",
      key: "id",
      render: (id: number) => `#${id}`,
    },
    {
      title: "Khách hàng",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Tổng tiền (₫)",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount: number) => formatCurrency(amount),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: OrderStatus) => <StatusTag status={status} />,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt: string) => formatDateTime(createdAt),
    },
  ];

  const orders = orderData?.items || [];
  const total = orderData?.total ?? 0;

  return (
    <AdminPageContainer
      title="Quản lý đơn hàng"
      extra={
        <div>
          <Select
            className={styles.customerSelect}
            value={query.customerId ? String(query.customerId) : "all"}
            onChange={handleCustomerChange}
            prefix={<span className={styles.customerPrefix}>Khách hàng:</span>}
            options={customerOptions}
            suffixIcon={<CaretDownOutlined />}
          />
        </div>
      }
    >
      <Tabs
        activeKey={activeTabKey}
        onChange={handleTabChange}
        items={ORDER_STATUS_TABS}
        className={styles.orderTabs}
      />

      <DataTable<Order>
        columns={columns}
        dataSource={orders}
        rowKey="id"
        total={total}
        loading={isLoading}
        resourceName="đơn hàng"
        pagination={{
          current: query.page,
          pageSize: query.pageSize,
          total: total,
          onChange: (page, pageSize) => updateQuery({ page, pageSize }),
        }}
        onChange={handleTableChange}
      />
    </AdminPageContainer>
  );
}
