"use client";

import React, { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, InputNumber, Select } from "antd";
import {
  formatNumberInput,
  parseNumberInput,
  preventNonNumericInput,
} from "@/lib/format";
import ActionButton from "@/components/shared/ActionButton";
import FormModal from "@/components/shared/FormModal";
import { useAuthStore } from "@/features/auth";
import { useMyManagedCategories } from "@/features/categories";
import type { Product, ProductStatus } from "../../types";
import { productSchema, type ProductFormValues } from "../../schemas";
import styles from "./ProductFormModal.module.scss";

export type { ProductFormValues } from "../../schemas";

export interface ProductFormModalProps {
  open: boolean;
  product?: Product | null;
  onClose: () => void;
  onSubmit: (data: ProductFormValues) => void | Promise<void>;
  loading?: boolean;
}

export function ProductFormModal({
  open,
  product,
  onClose,
  onSubmit,
  loading = false,
}: ProductFormModalProps) {
  const isEdit = Boolean(product);

  const currentUser = useAuthStore((state) => state.user);
  const isPo = currentUser?.role === "PRODUCT_OWNER";

  const { data: categories = [], isLoading: isLoadingCategories } =
    useMyManagedCategories();

  const categoryOptions = useMemo(() => {
    const items = categories.map((c) => ({
      value: c.id,
      label: `${c.name} (${c.code})`,
    }));
    return [
      { value: 0, label: "-- Chọn danh mục --" },
      ...items,
    ];
  }, [categories]);

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      price: 0,
      stock: 0,
      status: "ACTIVE",
      categoryId: null,
    },
  });

  useEffect(() => {
    if (open) {
      if (product) {
        reset({
          name: product.name,
          price: product.price,
          stock: product.stock,
          status: product.status,
          categoryId: product.categoryId ?? null,
        });
      } else {
        reset({
          name: "",
          price: 0,
          stock: 0,
          status: "ACTIVE",
          categoryId: null,
        });
      }
    }
  }, [open, product, reset]);

  const handleFormSubmit = handleSubmit(async (data) => {
    if (isPo && (!data.categoryId || data.categoryId === 0)) {
      setError("categoryId", {
        type: "manual",
        message: "Vui lòng chọn danh mục bạn được phân công quản lý",
      });
      return;
    }

    const payload: ProductFormValues = {
      ...data,
      categoryId:
        data.categoryId && data.categoryId > 0 ? data.categoryId : null,
    };
    await onSubmit(payload);
  });

  return (
    <FormModal
      open={open}
      title={isEdit ? "Sửa sản phẩm" : "Thêm sản phẩm"}
      onCancel={onClose}
      footer={null}
      width={720}
    >
      <form onSubmit={handleFormSubmit} className={styles.form}>
        <div className={styles.formRow}>
          <div className={`${styles.formCol} ${styles.colFlex2}`}>
            <label className={styles.label}>
              Tên sản phẩm<span className={styles.required}>*</span>
            </label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Nhập tên sản phẩm"
                  status={errors.name ? "error" : undefined}
                />
              )}
            />
            <span className={styles.errorText}>
              {errors.name?.message || ""}
            </span>
          </div>

          <div className={`${styles.formCol} ${styles.colFlex2}`}>
            <label className={styles.label}>
              Danh mục
              {isPo && <span className={styles.required}>*</span>}
            </label>
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  value={field.value ?? 0}
                  onChange={(val) => field.onChange(val === 0 ? null : val)}
                  className={styles.fullWidth}
                  options={categoryOptions}
                  loading={isLoadingCategories}
                  status={errors.categoryId ? "error" : undefined}
                />
              )}
            />
            <span className={styles.errorText}>
              {errors.categoryId?.message || ""}
            </span>
            {isPo && categories.length === 0 && !isLoadingCategories && (
              <span className={styles.warningText}>
                Bạn chưa được phân công loại hàng nào. Vui lòng liên hệ Admin.
              </span>
            )}
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={`${styles.formCol} ${styles.colFlex1}`}>
            <label className={styles.label}>
              Giá (₫)<span className={styles.required}>*</span>
            </label>
            <Controller
              name="price"
              control={control}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  className={styles.fullWidth}
                  placeholder="Nhập giá"
                  min={0}
                  precision={0}
                  onKeyDown={preventNonNumericInput}
                  formatter={formatNumberInput}
                  parser={parseNumberInput}
                  status={errors.price ? "error" : undefined}
                />
              )}
            />
            <span className={styles.errorText}>
              {errors.price?.message || ""}
            </span>
          </div>

          <div className={`${styles.formCol} ${styles.colFlex1}`}>
            <label className={styles.label}>
              Tồn kho<span className={styles.required}>*</span>
            </label>
            <Controller
              name="stock"
              control={control}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  className={styles.fullWidth}
                  precision={0}
                  min={0}
                  onKeyDown={preventNonNumericInput}
                  parser={parseNumberInput}
                  status={errors.stock ? "error" : undefined}
                />
              )}
            />
            <span className={styles.errorText}>
              {errors.stock?.message || ""}
            </span>
          </div>

          <div className={`${styles.formCol} ${styles.colFlex1}`}>
            <label className={styles.label}>Trạng thái</label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select<ProductStatus>
                  {...field}
                  className={styles.fullWidth}
                  options={[
                    { value: "ACTIVE", label: "ACTIVE" },
                    { value: "INACTIVE", label: "INACTIVE" },
                  ]}
                />
              )}
            />
            <span className={styles.errorText}>
              {errors.status?.message || ""}
            </span>
          </div>

          <div className={styles.actionCol}>
            <div className={styles.labelSpacer} />
            <div className={styles.actionBtnGroup}>
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
            <span className={styles.errorText} />
          </div>
        </div>
      </form>
    </FormModal>
  );
}

export default ProductFormModal;
