"use client";

import React from "react";
import { InputNumber, Select } from "antd";
import { CaretDownOutlined } from "@ant-design/icons";
import ActionButton from "@/components/shared/ActionButton";
import type { ProductOptionItem } from "./types";
import styles from "./CreateOrder.module.scss";

interface OrderProductPickerProps {
  products: ProductOptionItem[];
  selectedProductId?: number;
  quantity: number;
  isLoading?: boolean;
  onProductChange: (id?: number) => void;
  onQuantityChange: (qty: number) => void;
  onAddItem: () => void;
}

export default function OrderProductPicker({
  products,
  selectedProductId,
  quantity,
  isLoading,
  onProductChange,
  onQuantityChange,
  onAddItem,
}: OrderProductPickerProps) {
  return (
    <>
      {/* Chọn sản phẩm */}
      <div className={styles.productField}>
        <label className={styles.label}>Sản phẩm</label>
        <Select
          className={styles.productSelect}
          placeholder="Chọn sản phẩm"
          suffixIcon={<CaretDownOutlined />}
          value={selectedProductId}
          onChange={onProductChange}
          options={products}
          loading={isLoading}
          optionRender={(option) => {
            const data = option.data;
            return (
              <div className={styles.productOption}>
                <span className={styles.productOptionName}>{data.name}</span>
                <span
                  className={`${styles.productOptionStock} ${
                    data.disabled ? styles.disabled : ""
                  }`}
                >
                  {data.subLabel}
                </span>
              </div>
            );
          }}
        />
      </div>

      {/* Số lượng */}
      <div className={styles.quantityField}>
        <label className={styles.label}>Số lượng (1–99)</label>
        <InputNumber
          className={styles.quantityInput}
          min={1}
          max={99}
          value={quantity}
          onChange={(val) => onQuantityChange(val || 1)}
        />
      </div>

      {/* Nút Thêm dòng */}
      <div className={styles.actionField}>
        <ActionButton
          className={styles.addBtn}
          onClick={onAddItem}
          disabled={!selectedProductId}
        >
          Thêm dòng
        </ActionButton>
      </div>
    </>
  );
}
