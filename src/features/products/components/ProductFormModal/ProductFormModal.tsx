"use client";

import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, InputNumber, Select } from "antd";
import {
  formatNumberInput,
  parseNumberInput,
  preventNonNumericInput,
} from "@/lib/format";
import FormModal from "@/components/shared/FormModal";
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

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      price: 0,
      stock: 0,
      status: "ACTIVE",
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
        });
      } else {
        reset({
          name: "",
          price: 0,
          stock: 0,
          status: "ACTIVE",
        });
      }
    }
  }, [open, product, reset]);

  const handleFormSubmit = handleSubmit(async (data) => {
    await onSubmit(data);
  });

  return (
    <FormModal
      open={open}
      title={isEdit ? "Sửa sản phẩm" : "Thêm sản phẩm"}
      onCancel={onClose}
      footer={null}
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
        </div>

        <div className={styles.formRow}>
          <div className={styles.formCol}>
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

          <div className={styles.formCol}>
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

          <div className={styles.actionCol}>
            <div className={styles.labelSpacer} />
            <div className={styles.actionBtnGroup}>
              <Button onClick={onClose} className={styles.cancelBtn}>
                Huỷ
              </Button>
              <Button
                htmlType="submit"
                loading={loading}
                className={styles.submitBtn}
              >
                Lưu
              </Button>
            </div>
            <span className={styles.errorText} />
          </div>
        </div>
      </form>
    </FormModal>
  );
}

export default ProductFormModal;
