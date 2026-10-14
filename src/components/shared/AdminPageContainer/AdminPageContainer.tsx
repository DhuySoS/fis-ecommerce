import React from "react";
import styles from "./AdminPageContainer.module.scss";

export interface AdminPageContainerProps {
  /** Tiêu đề của trang (ví dụ "Quản lý sản phẩm", "Quản lý khách hàng") */
  title: React.ReactNode;
  /** Nút bấm, dropdown lọc hoặc công cụ hành động đi kèm */
  extra?: React.ReactNode;
  /** Nội dung chi tiết của trang (bảng, form, thống kê...) */
  children?: React.ReactNode;
  /** Đảo ngược vị trí giữa title và extra nếu cần */
  reverse?: boolean;
}

export default function AdminPageContainer({
  title,
  extra,
  children,
}: AdminPageContainerProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          {typeof title === "string" ? (
            <h1 className={styles.title}>{title}</h1>
          ) : (
            title
          )}
        </div>

        {extra && <div className={styles.extraWrapper}>{extra}</div>}
      </div>

      {children && <div className={styles.content}>{children}</div>}
    </div>
  );
}
