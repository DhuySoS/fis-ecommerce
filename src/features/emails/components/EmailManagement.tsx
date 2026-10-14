"use client";

import React from "react";
import AdminPageContainer from "@/components/shared/AdminPageContainer";
import ActionButton from "@/components/shared/ActionButton";
import DataTable from "@/components/shared/DataTable";
import { Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { formatDateTime } from "@/lib/format";
import type { FailedEmail } from "../types";
import styles from "./EmailManagement.module.scss";

export default function EmailManagement() {
  const columns: ColumnsType<FailedEmail> = [
    {
      title: "Người nhận",
      dataIndex: "recipient",
      key: "recipient",
    },
    {
      title: "Loại mail",
      dataIndex: "emailType",
      key: "emailType",
    },
    {
      title: "Số lần thử",
      dataIndex: "retryCount",
      key: "retryCount",
    },
    {
      title: "Lỗi gần nhất",
      dataIndex: "lastError",
      key: "lastError",
      render: (error: string) => (
        <Tooltip title={error}>
          <span className={styles.errorText}>{error || "—"}</span>
        </Tooltip>
      ),
    },
    {
      title: "Tạo lúc",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt: string) => formatDateTime(createdAt),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: () => (
        <ActionButton size="small">
          Gửi lại
        </ActionButton>
      ),
    },
  ];

  return (
    <AdminPageContainer
      title="Mail gửi lỗi"
      extra={
        <div className={styles.extraActions}>
          <p>Trạng thái: FAILED</p>
        </div>
      }
    >
      <DataTable<FailedEmail>
        columns={columns}
        dataSource={[]}
        rowKey="id"
        total={0}
        resourceName="mail lỗi"
      />
    </AdminPageContainer>
  );
}
