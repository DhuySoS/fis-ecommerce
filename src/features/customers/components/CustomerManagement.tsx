"use client";

import React, { useMemo, useState } from "react";
import { App, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import AdminPageContainer from "@/components/shared/AdminPageContainer";
import ActionButton from "@/components/shared/ActionButton";
import DataTable, { TableActions } from "@/components/shared/DataTable";
import StatusTag from "@/components/shared/StatusTag";
import { useTableQuery } from "@/hooks/useTableQuery";
import type { Customer, CustomerStatus } from "../types";
import {
  useCustomers,
  useCreateCustomer,
  useUpdateCustomer,
  useDeleteCustomer,
  useResendCustomerActivation,
} from "../hooks";
import CustomerFormModal, {
  type CustomerFormValues,
} from "./CustomerFormModal";
import styles from "./CustomerManagement.module.scss";

export default function CustomerManagement() {
  const { modal, message } = App.useApp();
  const { query, updateQuery, handleTableChange } = useTableQuery<Customer>();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  // Queries & Mutations
  const { data: customerData, isLoading, isFetching } = useCustomers();

  const customerList = useMemo(
    () => customerData?.items || [],
    [customerData?.items],
  );

  const createMutation = useCreateCustomer();
  const updateMutation = useUpdateCustomer();
  const deleteMutation = useDeleteCustomer();
  const resendActivationMutation = useResendCustomerActivation();

  // Phân trang phía Client
  const currentPage = query.page || 1;
  const pageSize = query.pageSize || 10;
  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return customerList.slice(start, start + pageSize);
  }, [customerList, currentPage, pageSize]);

  const handleOpenAddModal = () => {
    setEditingCustomer(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCustomer(null);
  };

  const handleFormSubmit = async (data: CustomerFormValues) => {
    try {
      if (editingCustomer) {
        const res = await updateMutation.mutateAsync({
          id: editingCustomer.id,
          data,
        });
        message.success(
          res?.message || "Cập nhật thông tin khách hàng thành công!",
        );
      } else {
        const res = await createMutation.mutateAsync(data);
        message.success(
          res?.message ||
            "Thêm khách hàng thành công! Email thiết lập mật khẩu đã được gửi tới khách hàng.",
        );
      }
      handleCloseModal();
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Thao tác thất bại, vui lòng thử lại!";
      message.error(errorMsg);
      throw err;
    }
  };

  const handleDeleteCustomer = (customer: Customer) => {
    modal.confirm({
      title: "Xác nhận xoá khách hàng",
      content: `Bạn có chắc chắn muốn xoá khách hàng "${customer.name}" không?`,
      okText: "Xoá",
      okType: "danger",
      cancelText: "Huỷ",
      onOk: async () => {
        try {
          const res = await deleteMutation.mutateAsync(customer.id);
          message.success(res?.message || "Xoá khách hàng thành công!");
        } catch (err: unknown) {
          const errorMsg =
            err instanceof Error ? err.message : "Xoá khách hàng thất bại!";
          message.error(errorMsg);
        }
      },
    });
  };

  const handleResendActivation = (customer: Customer) => {
    modal.confirm({
      title: "Gửi lại email kích hoạt",
      content: `Gửi lại liên kết kích hoạt và thiết lập mật khẩu tới email "${customer.email}" cho khách hàng ${customer.name}?`,
      okText: "Gửi email",
      cancelText: "Huỷ",
      onOk: async () => {
        try {
          const res = await resendActivationMutation.mutateAsync(customer.id);
          message.success(
            res?.message || "Đã gửi lại email kích hoạt tài khoản thành công!",
          );
        } catch (err: unknown) {
          const errorMsg =
            err instanceof Error
              ? err.message
              : "Không thể gửi lại email kích hoạt!";
          message.error(errorMsg);
        }
      },
    });
  };

  const columns: ColumnsType<Customer> = [
    {
      title: "Họ tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      render: (phone: string | undefined) => phone || "—",
    },
    {
      title: "Kích hoạt tài khoản",
      dataIndex: "userStatus",
      key: "userStatus",
      render: (userStatus: string | undefined) => {
        if (userStatus === "PENDING_ACTIVATION") {
          return (
            <span className={`${styles.activationBadge} ${styles.pending}`}>
              Chờ kích hoạt
            </span>
          );
        }
        if (userStatus === "ACTIVE") {
          return (
            <span className={`${styles.activationBadge} ${styles.active}`}>
              Đã kích hoạt
            </span>
          );
        }
        return (
          <span className={`${styles.activationBadge} ${styles.inactive}`}>
            {userStatus || "—"}
          </span>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: CustomerStatus) => <StatusTag status={status} />,
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_: unknown, record: Customer) => {
        const isPendingActivation = record.userStatus === "PENDING_ACTIVATION";

        return (
          <TableActions
            onEdit={() => handleOpenEditModal(record)}
            onDelete={() => handleDeleteCustomer(record)}
            extra={
              isPendingActivation ? (
                <>
                  <span className={styles.actionDivider}>·</span>
                  <Tooltip title="Gửi lại email chứa liên kết thiết lập mật khẩu">
                    <button
                      type="button"
                      className={styles.actionExtraBtn}
                      onClick={() => handleResendActivation(record)}
                      disabled={resendActivationMutation.isPending}
                    >
                      Gửi lại link
                    </button>
                  </Tooltip>
                </>
              ) : null
            }
          />
        );
      },
    },
  ];

  return (
    <AdminPageContainer
      title="Quản lý khách hàng"
      extra={
        <ActionButton onClick={handleOpenAddModal}>
          + Thêm khách hàng
        </ActionButton>
      }
    >
      <DataTable<Customer>
        columns={columns}
        dataSource={paginatedCustomers}
        rowKey="id"
        loading={isLoading || isFetching}
        total={customerList.length}
        resourceName="khách hàng"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: customerList.length,
          onChange: (page, newPageSize) =>
            updateQuery({ page, pageSize: newPageSize }),
        }}
        onChange={handleTableChange}
      />

      <CustomerFormModal
        open={isModalOpen}
        customer={editingCustomer}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        loading={createMutation.isPending || updateMutation.isPending}
      />
    </AdminPageContainer>
  );
}
