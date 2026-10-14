"use client";

import React from "react";
import { Modal } from "antd";
import styles from "./FormModal.module.scss";

export interface FormModalProps {
  open: boolean;
  title: React.ReactNode;
  onCancel: () => void;

  confirmLoading?: boolean;
  loading?: boolean;
  width?: number | string;
  destroyOnHidden?: boolean;
  maskClosable?: boolean;
  children: React.ReactNode;
  footer?: React.ReactNode | null;
  className?: string;
}

export function FormModal({
  open,
  title,
  onCancel,

  confirmLoading = false,
  loading = false,
  width = 560,
  destroyOnHidden = true,
  maskClosable = false,
  children,
  footer,
  className,
}: FormModalProps) {
  const isLoading = confirmLoading || loading;

  return (
    <Modal
      open={open}
      title={
        typeof title === "string" ? (
          <span className={styles.modalTitle}>{title}</span>
        ) : (
          title
        )
      }
      onCancel={onCancel}
      confirmLoading={isLoading}
      width={width}
      destroyOnHidden={destroyOnHidden}
      mask={{ closable: maskClosable }}
      footer={footer}
      className={`${styles.formModal} ${className || ""}`.trim()}
      okButtonProps={{ loading: isLoading }}
    >
      <div className={styles.modalBody}>{children}</div>
    </Modal>
  );
}

export default FormModal;
