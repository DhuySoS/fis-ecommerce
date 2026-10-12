"use client";

import React from "react";
import { Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  content: React.ReactNode;
  okText?: string;
  cancelText?: string;
  okDanger?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  content,
  okText = "Xác nhận",
  cancelText = "Huỷ bỏ",
  okDanger = false,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      title={
        <span>
          <ExclamationCircleOutlined /> {title}
        </span>
      }
      onOk={onConfirm}
      onCancel={onCancel}
      okText={okText}
      cancelText={cancelText}
      okButtonProps={{ danger: okDanger, loading }}
      confirmLoading={loading}
    >
      <div>{content}</div>
    </Modal>
  );
}

export default ConfirmDialog;
