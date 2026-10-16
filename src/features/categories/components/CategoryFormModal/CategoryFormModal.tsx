"use client";

import React, { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Select } from "antd";
import ActionButton from "@/components/shared/ActionButton";
import FormModal from "@/components/shared/FormModal";
import { useUsers } from "@/features/users/hooks";
import type { Category } from "../../types";
import { categorySchema, type CategoryFormValues } from "../../schemas";
import styles from "./CategoryFormModal.module.scss";

export type { CategoryFormValues } from "../../schemas";

export interface CategoryFormModalProps {
  open: boolean;
  category?: Category | null;
  onClose: () => void;
  onSubmit: (data: CategoryFormValues) => void | Promise<void>;
  loading?: boolean;
}

export function CategoryFormModal({
  open,
  category,
  onClose,
  onSubmit,
  loading = false,
}: CategoryFormModalProps) {
  const isEdit = Boolean(category);

  const { data: users = [], isLoading: isLoadingUsers } = useUsers({
    enabled: open,
  });

  const poOptions = useMemo(() => {
    const eligibleUsers = users.filter(
      (u) => u.role === "PRODUCT_OWNER" || u.role === "ADMIN",
    );
    const options = eligibleUsers.map((u) => ({
      value: u.id,
      label: `${u.username} (${u.role})`,
    }));
    return [
      { value: 0, label: "Chưa phân công" },
      ...options,
    ];
  }, [users]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
      managedByUserId: null,
    },
  });

  useEffect(() => {
    if (open) {
      if (category) {
        reset({
          name: category.name || "",
          code: category.code || "",
          description: category.description || "",
          managedByUserId: category.managedBy?.id ?? null,
        });
      } else {
        reset({
          name: "",
          code: "",
          description: "",
          managedByUserId: null,
        });
      }
    }
  }, [open, category, reset]);

  const handleFormSubmit = handleSubmit(async (data) => {
    const formattedData: CategoryFormValues = {
      ...data,
      code: data.code.trim().toUpperCase(),
      managedByUserId: data.managedByUserId && data.managedByUserId > 0 ? data.managedByUserId : null,
    };
    await onSubmit(formattedData);
  });

  return (
    <FormModal
      open={open}
      title={isEdit ? "Sửa loại hàng" : "Thêm loại hàng mới"}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <form onSubmit={handleFormSubmit} className={styles.form}>
        <div className={styles.formRow}>
          <div className={styles.formCol}>
            <label className={styles.label}>
              Tên loại hàng<span className={styles.required}>*</span>
            </label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Ví dụ: Điện thoại & Phụ kiện"
                  status={errors.name ? "error" : undefined}
                />
              )}
            />
            <span className={styles.errorText}>
              {errors.name?.message || ""}
            </span>
          </div>

          <div className={styles.formCol}>
            <label className={styles.label}>
              Mã loại hàng<span className={styles.required}>*</span>
            </label>
            <Controller
              name="code"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Ví dụ: SMARTPHONE"
                  status={errors.code ? "error" : undefined}
                  onChange={(e) =>
                    field.onChange(e.target.value.toUpperCase())
                  }
                />
              )}
            />
            <span className={styles.errorText}>
              {errors.code?.message || ""}
            </span>
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formCol}>
            <label className={styles.label}>Product Owner phụ trách</label>
            <Controller
              name="managedByUserId"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  value={field.value ?? 0}
                  onChange={(val) => field.onChange(val === 0 ? null : val)}
                  className={styles.fullWidth}
                  options={poOptions}
                  loading={isLoadingUsers}
                  placeholder="Chọn Product Owner"
                />
              )}
            />
            <span className={styles.errorText}>
              {errors.managedByUserId?.message || ""}
            </span>
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formCol}>
            <label className={styles.label}>Mô tả</label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Input.TextArea
                  {...field}
                  rows={3}
                  placeholder="Nhập mô tả chi tiết cho loại hàng"
                />
              )}
            />
            <span className={styles.errorText}>
              {errors.description?.message || ""}
            </span>
          </div>
        </div>

        <div className={styles.actionFooter}>
          <ActionButton variant="cancel" onClick={onClose}>
            Huỷ
          </ActionButton>
          <ActionButton
            htmlType="submit"
            loading={loading}
          >
            Lưu
          </ActionButton>
        </div>
      </form>
    </FormModal>
  );
}

export default CategoryFormModal;
