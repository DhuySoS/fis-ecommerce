"use client";

import React, { useMemo } from "react";
import type { ColumnsType } from "antd/es/table";
import DataTable from "@/components/shared/DataTable";
import { formatCurrency } from "@/lib/format";
import type { EditableOrderItem } from "./types";
import styles from "./ShopOrderDetail.module.scss";
import { Empty } from "antd";

interface OrderItemsEditorProps {
  items: EditableOrderItem[];
  onQuantityChange: (productId: number, newQty: number) => void;
  onDeleteItem: (productId: number) => void;
  disabled?: boolean;
}

export default function OrderItemsEditor({
  items,
  onQuantityChange,
  onDeleteItem,
  disabled = false,
}: OrderItemsEditorProps) {
  const columns: ColumnsType<EditableOrderItem> = useMemo(
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
        title: "Số lượng",
        dataIndex: "quantity",
        key: "quantity",
        align: "center",
        render: (quantity: number, record: EditableOrderItem) => (
          <div className={styles.quantityStepper}>
            <button
              type="button"
              className={styles.stepperBtn}
              onClick={() => onQuantityChange(record.productId, quantity - 1)}
              disabled={disabled || quantity <= 1}
              title="Giảm số lượng"
            >
              −
            </button>
            <span className={styles.stepperValue}>{quantity}</span>
            <button
              type="button"
              className={styles.stepperBtn}
              onClick={() => onQuantityChange(record.productId, quantity + 1)}
              disabled={disabled || quantity >= 99}
              title="Tăng số lượng"
            >
              +
            </button>
          </div>
        ),
      },
      {
        title: "Thành tiền",
        key: "totalPrice",
        align: "right",
        render: (_: unknown, record: EditableOrderItem) =>
          formatCurrency(record.unitPrice * record.quantity),
      },
      {
        title: "Xoá",
        key: "action",
        align: "center",
        render: (_: unknown, record: EditableOrderItem) => (
          <button
            type="button"
            className={styles.deleteBtn}
            onClick={() => onDeleteItem(record.productId)}
            disabled={disabled}
            title="Xoá dòng"
          >
            ×
          </button>
        ),
      },
    ],
    [disabled, onQuantityChange, onDeleteItem],
  );

  return (
    <div className={styles.tableWrapper}>
      <DataTable<EditableOrderItem>
        columns={columns}
        dataSource={items}
        rowKey="productId"
        pagination={false}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Đơn hàng chưa có sản phẩm nào"
            />
          ),
        }}
      />
    </div>
  );
}
