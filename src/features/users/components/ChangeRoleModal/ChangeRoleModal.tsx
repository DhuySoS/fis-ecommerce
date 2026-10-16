"use client";

import React, { useState } from "react";
import { Select, Tag } from "antd";
import ActionButton from "@/components/shared/ActionButton";
import FormModal from "@/components/shared/FormModal";
import type { UserItem, UserRole } from "../../types";
import styles from "./ChangeRoleModal.module.scss";

export interface ChangeRoleModalProps {
  open: boolean;
  user: UserItem | null;
  currentUsername?: string;
  onClose: () => void;
  onSubmit: (role: UserRole) => Promise<void>;
  loading?: boolean;
}

const ROLE_OPTIONS: {
  value: UserRole;
  label: string;
}[] = [
  { value: "ADMIN", label: "ADMIN" },
  { value: "PRODUCT_OWNER", label: "PRODUCT_OWNER" },
  { value: "CUSTOMER", label: "CUSTOMER" },
];

export function ChangeRoleModal({
  open,
  user,
  currentUsername,
  onClose,
  onSubmit,
  loading = false,
}: ChangeRoleModalProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  if (!user) return null;

  const currentRole = selectedRole ?? user.role;
  const isSelf = Boolean(currentUsername && user.username === currentUsername);
  const isChangingSelfRole = isSelf && currentRole !== user.role;

  const handleClose = () => {
    setSelectedRole(null);
    onClose();
  };

  const handleConfirm = async () => {
    await onSubmit(currentRole);
  };

  return (
    <FormModal
      open={open}
      title="Đổi quyền tài khoản"
      onCancel={handleClose}
      footer={null}
      width={480}
    >
      <div className={styles.modalContent}>
        <div className={styles.userInfoCard}>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Tên tài khoản:</span>
            <span className={styles.infoValue}>{user.username}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Email:</span>
            <span className={styles.infoValue}>{user.email}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Vai trò hiện tại:</span>
            <Tag>{user.role}</Tag>
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>Chọn vai trò mới:</label>
          <Select<UserRole>
            value={currentRole}
            onChange={(val) => setSelectedRole(val)}
            className={styles.select}
            size="large"
            options={ROLE_OPTIONS}
          />
        </div>

        {isChangingSelfRole && (
          <div className={styles.warningBox}>
            <strong>Lưu ý:</strong> Bạn đang thay đổi vai trò của chính tài
            khoản bạn đang đăng nhập. Nếu chuyển sang vai trò khác, bạn có thể
            mất quyền truy cập trang quản trị này.
          </div>
        )}

        <div className={styles.footerActions}>
          <ActionButton
            variant="cancel"
            onClick={handleClose}
            disabled={loading}
          >
            Huỷ
          </ActionButton>
          <ActionButton
            onClick={handleConfirm}
            loading={loading}
            disabled={currentRole === user.role}
          >
            Lưu thay đổi
          </ActionButton>
        </div>
      </div>
    </FormModal>
  );
}

export default ChangeRoleModal;
