"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { App, Input, Skeleton } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  LockOutlined,
  MailOutlined,
  UserOutlined,
} from "@ant-design/icons";
import ActionButton from "@/components/shared/ActionButton";
import {
  useSetPasswordAndActivate,
  useVerifyActivationToken,
} from "../../hooks";
import {
  setPasswordSchema,
  type SetPasswordFormValues,
} from "../../schemas";
import styles from "./SetPasswordForm.module.scss";

export default function SetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { message } = App.useApp();

  const [isDone, setIsDone] = useState(false);

  // 1. Kiểm tra tính hợp lệ của token kích hoạt từ URL
  const {
    data: verifyData,
    isLoading: isLoadingVerify,
    isError: isVerifyError,
  } = useVerifyActivationToken(token);

  // 2. Mutation gửi mật khẩu mới lên server
  const setPasswordMutation = useSetPasswordAndActivate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SetPasswordFormValues>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: SetPasswordFormValues) => {
    if (!token) {
      message.error("Thiếu mã token kích hoạt!");
      return;
    }

    setPasswordMutation.mutate(
      {
        token,
        newPassword: values.password,
      },
      {
        onSuccess: () => {
          message.success("Thiết lập mật khẩu thành công!");
          setIsDone(true);
        },
        onError: (err: unknown) => {
          const errorMsg =
            err instanceof Error
              ? err.message
              : "Không thể thiết lập mật khẩu, vui lòng thử lại!";
          message.error(errorMsg);
        },
      },
    );
  };

  // Trường hợp thiếu token trên URL
  if (!token) {
    return (
      <div className={styles.authCard}>
        <div className={styles.resultBox}>
          <CloseCircleOutlined
            className={`${styles.resultIcon} ${styles.error}`}
          />
          <h2 className={styles.resultTitle}>Thiếu liên kết kích hoạt</h2>
          <p className={styles.resultDesc}>
            Không tìm thấy mã kích hoạt trong đường dẫn. Vui lòng mở lại liên kết
            chính xác từ email mà quản trị viên đã gửi cho bạn.
          </p>
          <div className={styles.actionRow}>
            <ActionButton
              type="primary"
              className={styles.submitBtn}
              onClick={() => router.push("/login")}
            >
              Về trang đăng nhập
            </ActionButton>
          </div>
        </div>
      </div>
    );
  }

  // Đang kiểm tra token
  if (isLoadingVerify) {
    return (
      <div className={styles.authCard}>
        <div className={styles.brandHeader}>
          <h1 className={styles.brandTitle}>eCommerce</h1>
          <p className={styles.brandSubtitle}>
            Đang kiểm tra liên kết kích hoạt...
          </p>
        </div>
        <Skeleton active paragraph={{ rows: 5 }} />
      </div>
    );
  }

  // Token không hợp lệ hoặc đã hết hạn
  if (isVerifyError || !verifyData?.valid) {
    return (
      <div className={styles.authCard}>
        <div className={styles.resultBox}>
          <CloseCircleOutlined
            className={`${styles.resultIcon} ${styles.error}`}
          />
          <h2 className={styles.resultTitle}>
            Liên kết kích hoạt không hợp lệ
          </h2>
          <p className={styles.resultDesc}>
            {verifyData?.message ||
              "Liên kết kích hoạt đã hết hạn hoặc không tồn tại. Vui lòng liên hệ quản trị viên để nhận liên kết mới."}
          </p>
          <div className={styles.actionRow}>
            <ActionButton
              type="primary"
              className={styles.submitBtn}
              onClick={() => router.push("/login")}
            >
              Về trang đăng nhập
            </ActionButton>
          </div>
        </div>
      </div>
    );
  }

  // Kích hoạt thành công
  if (isDone) {
    return (
      <div className={styles.authCard}>
        <div className={styles.resultBox}>
          <CheckCircleOutlined
            className={`${styles.resultIcon} ${styles.success}`}
          />
          <h2 className={styles.resultTitle}>
            Kích hoạt tài khoản thành công!
          </h2>
          <p className={styles.resultDesc}>
            Mật khẩu mới của bạn đã được thiết lập. Hãy đăng nhập bằng tên đăng
            nhập <strong>{verifyData.username}</strong> và mật khẩu mới để bắt
            đầu mua sắm.
          </p>
          <div className={styles.actionRow}>
            <ActionButton
              type="primary"
              className={styles.submitBtn}
              onClick={() => router.push("/login")}
            >
              Đăng nhập ngay
            </ActionButton>
          </div>
        </div>
      </div>
    );
  }

  // Form đặt mật khẩu lần đầu
  return (
    <div className={styles.authCard}>
      <div className={styles.brandHeader}>
        <h1 className={styles.brandTitle}>Thiết lập mật khẩu</h1>
        <p className={styles.brandSubtitle}>
          Kích hoạt tài khoản và đặt mật khẩu lần đầu
        </p>
      </div>

      <div className={styles.userInfoCard}>
        <div className={styles.userRow}>
          <span className={styles.userLabel}>
            <UserOutlined /> Tên tài khoản:
          </span>
          <span className={styles.userVal}>{verifyData.username}</span>
        </div>
        {verifyData.email && (
          <div className={styles.userRow}>
            <span className={styles.userLabel}>
              <MailOutlined /> Email:
            </span>
            <span className={styles.userVal}>{verifyData.email}</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.formField}>
          <label className={styles.label}>
            Mật khẩu mới <span className={styles.required}>*</span>
          </label>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input.Password
                {...field}
                prefix={<LockOutlined />}
                placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                size="large"
                status={errors.password ? "error" : undefined}
              />
            )}
          />
          <span className={styles.errorText}>
            {errors.password?.message || ""}
          </span>
        </div>

        <div className={styles.formField}>
          <label className={styles.label}>
            Xác nhận mật khẩu mới <span className={styles.required}>*</span>
          </label>
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <Input.Password
                {...field}
                prefix={<LockOutlined />}
                placeholder="Nhập lại mật khẩu mới"
                size="large"
                status={errors.confirmPassword ? "error" : undefined}
              />
            )}
          />
          <span className={styles.errorText}>
            {errors.confirmPassword?.message || ""}
          </span>
        </div>

        <ActionButton
          type="primary"
          htmlType="submit"
          loading={setPasswordMutation.isPending}
          className={styles.submitBtn}
        >
          Kích hoạt & Đổi mật khẩu
        </ActionButton>
      </form>

      <div className={styles.switchText}>
        Đã có mật khẩu? <Link href="/login">Đăng nhập ngay</Link>
      </div>
    </div>
  );
}
