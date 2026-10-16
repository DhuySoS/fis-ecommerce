"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { App, Input } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import ActionButton from "@/components/shared/ActionButton";
import { useLogin } from "../../hooks";
import { useAuthStore } from "../../store";
import { loginSchema, type LoginFormValues } from "../../schemas";
import styles from "./AuthForm.module.scss";

interface LoginFormProps {
  onSwitchToRegister: () => void;
  defaultUsername?: string;
}

export default function LoginForm({
  onSwitchToRegister,
  defaultUsername = "",
}: LoginFormProps) {
  const router = useRouter();
  const { message } = App.useApp();
  const loginMutation = useLogin();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: defaultUsername,
      password: "",
    },
  });

  useEffect(() => {
    if (defaultUsername) {
      setValue("username", defaultUsername);
    }
  }, [defaultUsername, setValue]);

  const onSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values, {
      onSuccess: (data) => {
        message.success(
          (data as { message?: string })?.message || "Đăng nhập thành công!",
        );

        // Lưu session vào store & cookies
        useAuthStore.getState().setAuth(data);

        // Điều hướng dựa vào vai trò người dùng
        if (data.role === "ADMIN" || data.role === "PRODUCT_OWNER") {
          router.push("/admin/dashboard");
        } else {
          router.push("/orders/new");
        }
      },
      onError: (err: unknown) => {
        const errorMsg =
          err instanceof Error
            ? err.message
            : "Đăng nhập thất bại, vui lòng kiểm tra lại tài khoản hoặc mật khẩu!";
        message.error(errorMsg);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
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
              placeholder="Nhập tên đăng nhập"
              size="large"
              status={errors.username ? "error" : undefined}
            />
          )}
        />
        <span className={styles.errorText}>
          {errors.username?.message || ""}
        </span>
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
              placeholder="Nhập mật khẩu"
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
        loading={loginMutation.isPending}
      >
        Đăng nhập
      </ActionButton>

      <div className={styles.switchText}>
        Chưa có tài khoản?{" "}
        <button type="button" onClick={onSwitchToRegister}>
          Đăng ký ngay
        </button>
      </div>
    </form>
  );
}
