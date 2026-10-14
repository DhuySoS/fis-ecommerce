"use client";

import React from "react";
import { InputNumber, Select } from "antd";
import { CaretDownOutlined } from "@ant-design/icons";
import ActionButton from "@/components/shared/ActionButton";
import styles from "./ShopOrderDetail.module.scss";

export interface ProductSelectOption {
  value: number;
  label: string;
  name: string;
  price: number;
  stock: number;
  disabled: boolean;
}

interface AddItemBarProps {
  products: ProductSelectOption[];
  selectedProductId?: number;
  quantity: number;
  isLoading?: boolean;
  disabled?: boolean;
  onProductChange: (id?: number) => void;
  onQuantityChange: (qty: number) => void;
  onAddItem: () => void;
}

export default function AddItemBar({
  products,
  selectedProductId,
  quantity,
  isLoading,
  disabled = false,
  onProductChange,
  onQuantityChange,
  onAddItem,
}: AddItemBarProps) {
  return (
    <div className={styles.addItemRow}>
      <Select
        className={styles.productSelect}
        placeholder="Thêm sản phẩm"
        suffixIcon={<CaretDownOutlined />}
        value={selectedProductId}
        onChange={onProductChange}
        options={products}
        loading={isLoading}
        disabled={disabled}
        allowClear
      />

      <InputNumber
        className={styles.quantityInput}
        min={1}
        max={99}
        value={quantity}
        onChange={(val) => onQuantityChange(val || 1)}
        disabled={disabled}
      />

      <ActionButton
        onClick={onAddItem}
        disabled={disabled || !selectedProductId}
      >
        Thêm
      </ActionButton>
    </div>
  );
}
