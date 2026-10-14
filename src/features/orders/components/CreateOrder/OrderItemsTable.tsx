"use client";

import React, { useMemo } from "react";
import type { ColumnsType } from "antd/es/table";
import DataTable from "@/components/shared/DataTable";
import { formatCurrency } from "@/lib/format";
import type { SelectedOrderItem } from "./types";
import styles from "./CreateOrder.module.scss";
import { Empty } from "antd";

interface OrderItemsTableProps {
  items: SelectedOrderItem[];
  onDeleteItem: (productId: number) => void;
}

export default function OrderItemsTable({
  items,
  onDeleteItem,
}: OrderItemsTableProps) {
  const columns: ColumnsType<SelectedOrderItem> = useMemo(
    () => [
      {
        title: "Sản phẩm",
        dataIndex: "productName",
        key: "productName",
      },
      {
        title: "Đơn giá",
        dataIndex: "unitPrice",
        key: "unitPrice",
        align: "right",
        render: (price: number) => formatCurrency(price),
      },
      {
        title: "SL",
        dataIndex: "quantity",
        key: "quantity",
        align: "center",
      },
      {
        title: "Thành tiền",
        key: "totalPrice",
        align: "right",
        render: (_: unknown, record: SelectedOrderItem) =>
          formatCurrency(record.unitPrice * record.quantity),
      },
      {
        title: "Xoá",
        key: "action",
        align: "center",
        render: (_: unknown, record: SelectedOrderItem) => (
          <button
            type="button"
            className={styles.deleteBtn}
            onClick={() => onDeleteItem(record.productId)}
            title="Xoá dòng"
          >
            ×
          </button>
        ),
      },
    ],
    [onDeleteItem],
  );

  return (
    <div className={styles.tableWrapper}>
      <DataTable<SelectedOrderItem>
        columns={columns}
        dataSource={items}
        rowKey="productId"
        pagination={false}
        scroll={items.length > 5 ? { y: 240 } : undefined}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Chưa có sản phẩm nào được chọn"
            />
          ),
        }}
      />
    </div>
  );
}
