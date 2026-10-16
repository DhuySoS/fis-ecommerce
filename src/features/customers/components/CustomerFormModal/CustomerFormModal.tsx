"use client";

import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Select } from "antd";
import ActionButton from "@/components/shared/ActionButton";
import FormModal from "@/components/shared/FormModal";
import type { Customer, CustomerStatus } from "../../types";
import { customerSchema, type CustomerFormValues } from "../../schemas";
import styles from "./CustomerFormModal.module.scss";

export type { CustomerFormValues } from "../../schemas";

export interface CustomerFormModalProps {
  open: boolean;
  customer?: Customer | null;
  onClose: () => void;
  onSubmit: (data: CustomerFormValues) => void | Promise<void>;
  loading?: boolean;
}

export function CustomerFormModal({
  open,
  customer,
  onClose,
  onSubmit,
  loading = false,
}: CustomerFormModalProps) {
  const isEdit = Boolean(customer);

  const {
    control,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      status: "ACTIVE",
    },
  });

  useEffect(() => {
    if (open) {
      if (customer) {
        reset({
          name: customer.name,
          email: customer.email,
          phone: customer.phone || "",
          status: customer.status,
        });
      } else {
        reset({
          name: "",
          email: "",
          phone: "",
          status: "ACTIVE",
        });
      }
    }
  }, [open, customer, reset]);

  const handleFormSubmit = handleSubmit(async (data) => {
    try {
      await onSubmit(data);
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "DUPLICATE_RESOURCE") {
        setError("email", {
          type: "server",
          message: "Email đã được sử dụng",
        });
      }
    }
  });

  return (
    <FormModal
      open={open}
      title={isEdit ? "Sửa khách hàng" : "Thêm khách hàng"}
      onCancel={onClose}
      footer={null}
    >
      <form onSubmit={handleFormSubmit} className={styles.form}>
        <div className={styles.formRow}>
          <div className={`${styles.formCol} ${styles.colFlex2}`}>
            <label className={styles.label}>
              Họ tên<span className={styles.required}>*</span>
            </label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Nhập họ tên"
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
              Email<span className={styles.required}>*</span>
            </label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="email"
                  placeholder="Nhập email"
                  status={errors.email ? "error" : undefined}
                  onChange={(e) => {
                    if (errors.email) {
                      clearErrors("email");
                    }
                    field.onChange(e);
                  }}
                />
              )}
            />
            <span className={styles.errorText}>
              {errors.email?.message || ""}
            </span>
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={`${styles.formCol} ${styles.colFlex1}`}>
            <label className={styles.label}>Số điện thoại</label>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Nhập số điện thoại"
                  status={errors.phone ? "error" : undefined}
                />
              )}
            />
            <span className={styles.errorText}>
              {errors.phone?.message || ""}
            </span>
          </div>
          <div className={`${styles.formCol} ${styles.colFlex1}`}>
            <label className={styles.label}>Trạng thái</label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select<CustomerStatus>
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

        <div className={styles.footerRow}>
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

export default CustomerFormModal;
