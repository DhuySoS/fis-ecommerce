"use client";

import React from "react";
import ActionButton from "@/components/shared/ActionButton";
import { formatCurrency } from "@/lib/format";
import styles from "./ShopOrderDetail.module.scss";

interface PaymentCardProps {
  totalAmount: number;
  onCheckout: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export default function PaymentCard({
  totalAmount,
  onCheckout,
  isLoading = false,
  disabled = false,
}: PaymentCardProps) {
  return (
    <div className={styles.paymentCard}>
      <div className={styles.paymentTitle}>Thanh toán</div>

      <div className={styles.paymentAmountLabel}>Số tiền</div>
      <div className={styles.paymentAmountValue}>
        {formatCurrency(totalAmount)}
      </div>

      <ActionButton
        type="primary"
        onClick={onCheckout}
        loading={isLoading}
        disabled={disabled || totalAmount <= 0}
      >
        Thanh toán
      </ActionButton>
    </div>
  );
}
