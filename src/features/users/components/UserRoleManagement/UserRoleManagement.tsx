"use client";

import React, { useMemo, useState } from "react";
import { App, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import AdminPageContainer from "@/components/shared/AdminPageContainer";
import ActionButton from "@/components/shared/ActionButton";
import DataTable from "@/components/shared/DataTable";
import TableFilterBar, {
  DebouncedSearchInput,
  FilterSelect,
} from "@/components/shared/TableFilterBar";
import StatusTag from "@/components/shared/StatusTag";
import { formatDateTime } from "@/lib/format";
import { useTableQuery } from "@/hooks/useTableQuery";
import { useAuthStore } from "@/features/auth";
import type { UserItem, UserRole, UserStatus } from "../../types";
import { useUsers, useUpdateUserRole } from "../../hooks";
import ChangeRoleModal from "../ChangeRoleModal/ChangeRoleModal";
import styles from "./UserRoleManagement.module.scss";

export default function UserRoleManagement() {
  const { message } = App.useApp();
  const currentUser = useAuthStore((state) => state.user);
  const { query, updateQuery, handleTableChange } = useTableQuery<UserItem>();

  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: users = [], isLoading, isFetching } = useUsers();
  const updateRoleMutation = useUpdateUserRole();

  // Tìm kiếm và lọc phía Client
  const filteredUsers = useMemo(() => {
    let result = users;

    if (query.search) {
      const q = query.search.trim().toLowerCase();
      result = result.filter(
        (u) =>
          u.username.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          String(u.id).includes(q),
      );
    }

    if (query.role && query.role !== "ALL") {
      result = result.filter((u) => u.role === query.role);
    }

    if (query.status && query.status !== "ALL") {
      result = result.filter((u) => u.status === query.status);
    }

    return result;
  }, [users, query.search, query.role, query.status]);

  // Phân trang phía Client
  const currentPage = query.page || 1;
  const pageSize = query.pageSize || 10;
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  const handleOpenModal = (user: UserItem) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleChangeRole = async (newRole: UserRole) => {
    if (!selectedUser) return;
    try {
      const res = await updateRoleMutation.mutateAsync({
        id: selectedUser.id,
        role: newRole,
      });
      message.success(
        res?.message || "Cập nhật quyền vai trò người dùng thành công!",
      );
      handleCloseModal();
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Cập nhật quyền thất bại, vui lòng thử lại!";
      message.error(errorMsg);
    }
  };

  const columns: ColumnsType<UserItem> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 120,
      render: (id: number) => `#${id}`,
    },
    {
      title: "Tên tài khoản",
      dataIndex: "username",
      key: "username",
      render: (username: string) => (
        <span className={styles.usernameText}>{username}</span>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      width: 180,
      render: (role: UserRole) => <Tag>{role}</Tag>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 180,
      render: (status: UserStatus) => <StatusTag status={status} />,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 170,
      render: (date: string | undefined) => (date ? formatDateTime(date) : "—"),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 120,
      render: (_: unknown, record: UserItem) => (
        <ActionButton size="small" onClick={() => handleOpenModal(record)}>
          Đổi quyền
        </ActionButton>
      ),
    },
  ];

  return (
    <AdminPageContainer title="Phân quyền tài khoản">
      <TableFilterBar>
        <DebouncedSearchInput
          placeholder="Tìm theo tên tài khoản, email, ID..."
          value={query.search || ""}
          onChange={(search) => updateQuery({ search, page: 1 })}
        />
        <FilterSelect
          placeholder="Vai trò"
          value={(query.role as string) || undefined}
          onChange={(role) =>
            updateQuery({
              role: (role as UserRole | "ALL") || undefined,
              page: 1,
            })
          }
          options={[
            { label: "ALL", value: "ALL" },
            { label: "ADMIN", value: "ADMIN" },
            { label: "PRODUCT_OWNER", value: "PRODUCT_OWNER" },
            { label: "CUSTOMER", value: "CUSTOMER" },
          ]}
        />
        <FilterSelect
          placeholder="Trạng thái"
          value={(query.status as string) || undefined}
          onChange={(status) =>
            updateQuery({
              status: (status as UserStatus | "ALL") || undefined,
              page: 1,
            })
          }
          options={[
            { label: "ALL", value: "ALL" },
            { label: "ACTIVE", value: "ACTIVE" },
            { label: "INACTIVE", value: "INACTIVE" },
            { label: "PENDING_ACTIVATION", value: "PENDING_ACTIVATION" },
          ]}
        />
      </TableFilterBar>

      <DataTable<UserItem>
        columns={columns}
        dataSource={paginatedUsers}
        rowKey="id"
        loading={isLoading || isFetching}
        total={filteredUsers.length}
        resourceName="người dùng"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: filteredUsers.length,
          onChange: (page, newPageSize) =>
            updateQuery({ page, pageSize: newPageSize }),
        }}
        onChange={handleTableChange}
      />

      <ChangeRoleModal
        open={isModalOpen}
        user={selectedUser}
        currentUsername={currentUser?.username}
        onClose={handleCloseModal}
        onSubmit={handleChangeRole}
        loading={updateRoleMutation.isPending}
      />
    </AdminPageContainer>
  );
}
