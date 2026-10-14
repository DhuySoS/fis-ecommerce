"use client";

import React, { useState } from "react";
import AdminPageContainer from "@/components/shared/AdminPageContainer";
import ActionButton from "@/components/shared/ActionButton";
import DataTable, { TableActions } from "@/components/shared/DataTable";
import { App } from "antd";
import type { ColumnsType } from "antd/es/table";
import StatusTag from "@/components/shared/StatusTag";
import { useTableQuery } from "@/hooks/useTableQuery";
import type { Customer, CustomerStatus } from "../types";
import CustomerFormModal, {
  type CustomerFormValues,
} from "./CustomerFormModal";

const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 1,
    name: "Nguyễn Văn An",
    email: "an.nguyen@example.com",
    phone: "",
    status: "ACTIVE",
  },
  {
    id: 2,
    name: "Trần Thị Bình",
    email: "binh.tran@example.com",
    phone: "",
    status: "INACTIVE",
  },
];

export default function CustomerManagement() {
  const { modal } = App.useApp();
  const { query, updateQuery, handleTableChange } = useTableQuery<Customer>();

  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

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
    if (editingCustomer) {
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === editingCustomer.id
            ? { ...c, ...data, phone: data.phone || "" }
            : c,
        ),
      );
    } else {
      const newCustomer: Customer = {
        id: Date.now(),
        name: data.name,
        email: data.email,
        phone: data.phone || "",
        status: data.status,
      };
      setCustomers((prev) => [newCustomer, ...prev]);
    }
    handleCloseModal();
  };

  const handleDeleteCustomer = (id: number) => {
    modal.confirm({
      title: "Xác nhận xoá khách hàng",
      content: "Bạn có chắc chắn muốn xoá khách hàng này không?",
      okText: "Xoá",
      okType: "danger",
      cancelText: "Huỷ",
      onOk: () => {
        setCustomers((prev) => prev.filter((c) => c.id !== id));
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
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: CustomerStatus) => <StatusTag status={status} />,
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_: unknown, record: Customer) => (
        <TableActions
          onEdit={() => handleOpenEditModal(record)}
          onDelete={() => handleDeleteCustomer(record.id)}
        />
      ),
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
        dataSource={customers}
        rowKey="id"
        total={customers.length}
        resourceName="khách hàng"
        pagination={{
          current: query.page,
          pageSize: query.pageSize,
          total: customers.length,
          onChange: (page, pageSize) => updateQuery({ page, pageSize }),
        }}
        onChange={handleTableChange}
      />

      <CustomerFormModal
        open={isModalOpen}
        customer={editingCustomer}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
      />
    </AdminPageContainer>
  );
}
