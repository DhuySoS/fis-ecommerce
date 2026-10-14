"use client";

import React from "react";
import type { ProductOptionItem } from "./types";
import styles from "./CreateOrder.module.scss";

interface ProductSelectionListProps {
  products: ProductOptionItem[];
}

export default function ProductSelectionList({
  products,
}: ProductSelectionListProps) {
  return (
    <div className={styles.productListBox}>
      <div className={styles.productListTitle}>Danh sách chọn</div>
      <div className={styles.productListItems}>
        {products.map((p) => (
          <div
            key={p.value}
            className={`${styles.productListItem} ${
              p.disabled ? styles.disabledItem : ""
            }`}
          >
            <div className={styles.productListItemName}>{p.name}</div>
            <div className={styles.productListItemStock}>{p.subLabel}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
