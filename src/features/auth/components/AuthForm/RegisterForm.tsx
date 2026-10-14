"use client";

import React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { App, Input } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import ActionButton from "@/components/shared/ActionButton";
import { useRegister } from "../../hooks";
import { registerSchema, type RegisterFormValues } from "../../schemas";
import styles from "./AuthForm.module.scss";

interface RegisterFormProps {
  onSwitchToLogin: () => void;
  onRegisterSuccess: (username: string) => void;
}

export default function RegisterForm({
  onSwitchToLogin,
  onRegisterSuccess,
}: RegisterFormProps) {
  const { message } = App.useApp();
  const registerMutation = useRegister();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: RegisterFormValues) => {
    registerMutation.mutate(
      {
        ...values,
      },
      {
        onSuccess: (data: unknown) => {
          message.success(
            (data as { message?: string })?.message ||
              "Đăng ký tài khoản thành công! Vui lòng đăng nhập."
          );
          reset();
          onRegisterSuccess(values.username);
        },
        onError: (err: unknown) => {
          const errorMsg =
            err instanceof Error
              ? err.message
              : "Đăng ký không thành công, vui lòng thử lại!";
          message.error(errorMsg);
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      {/* Họ và tên */}
      <div className={styles.formField}>
        <label className={styles.label}>
          Họ và tên<span className={styles.required}>*</span>
        </label>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              prefix={<IdcardOutlined />}
              placeholder="Ví dụ: Nguyễn Văn An"
              size="large"
              status={errors.name ? "error" : undefined}
            />
          )}
        />
        <span className={styles.errorText}>{errors.name?.message || ""}</span>
      </div>

      {/* Tên đăng nhập */}
      <div className={styles.formField}>
        <label className={styles.label}>
          Tên đăng nhập<span className={styles.required}>*</span>
        </label>
        <Controller
          name="username"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              prefix={<UserOutlined />}
              placeholder="Tên đăng nhập (4-50 ký tự)"
              size="large"
              status={errors.username ? "error" : undefined}
            />
          )}
        />
        <span className={styles.errorText}>
          {errors.username?.message || ""}
        </span>
      </div>

      {/* Email */}
      <div className={styles.formField}>
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
              prefix={<MailOutlined />}
              placeholder="email@example.com"
              size="large"
              status={errors.email ? "error" : undefined}
            />
          )}
        />
        <span className={styles.errorText}>{errors.email?.message || ""}</span>
      </div>

      {/* Mật khẩu */}
      <div className={styles.formField}>
        <label className={styles.label}>
          Mật khẩu<span className={styles.required}>*</span>
        </label>
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <Input.Password
              {...field}
              prefix={<LockOutlined />}
              placeholder="Mật khẩu tối thiểu 8 ký tự"
              size="large"
              status={errors.password ? "error" : undefined}
            />
          )}
        />
        <span className={styles.errorText}>
          {errors.password?.message || ""}
        </span>
      </div>

      <ActionButton
        type="primary"
        htmlType="submit"
        size="large"
        className={styles.submitBtn}
        loading={registerMutation.isPending}
      >
        Đăng ký tài khoản
      </ActionButton>

      <div className={styles.switchText}>
        Đã có tài khoản?{" "}
        <button type="button" onClick={onSwitchToLogin}>
          Đăng nhập ngay
        </button>
      </div>
    </form>
  );
}
