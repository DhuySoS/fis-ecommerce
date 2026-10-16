"use client";

import React, { useCallback, useMemo, useState } from "react";
import { App, Tag } from "antd";
import AdminPageContainer from "@/components/shared/AdminPageContainer";
import ActionButton from "@/components/shared/ActionButton";
import DataTable, { TableActions } from "@/components/shared/DataTable";
import TableFilterBar, {
  FilterSelect,
} from "@/components/shared/TableFilterBar";
import type { ColumnsType } from "antd/es/table";
import { formatDateTime } from "@/lib/format";
import { useTableQuery } from "@/hooks/useTableQuery";
import { useUsers } from "@/features/users/hooks";
import type { Category } from "../../types";
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "../../hooks";
import CategoryFormModal, {
  CategoryFormValues,
} from "../CategoryFormModal/CategoryFormModal";
import styles from "./CategoryManagement.module.scss";

export default function CategoryManagement() {
  const { message, modal } = App.useApp();
  const { query, updateQuery, handleTableChange } = useTableQuery<Category>();

  const {
    data: categoryData,
    isLoading,
    isFetching,
  } = useCategories({
    page: query.page,
    pageSize: query.pageSize,
    managedByUserId: query.managedByUserId
      ? Number(query.managedByUserId)
      : undefined,
    sortBy: query.sortBy as "id" | "name" | "code" | undefined,
    sortOrder: query.sortOrder,
  });

  const { data: users = [] } = useUsers();
  const poUsers = useMemo(() => {
    return users.filter(
      (u) => u.role === "PRODUCT_OWNER" || u.role === "ADMIN",
    );
  }, [users]);

  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const categories = categoryData?.items || [];
  const total = categoryData?.total || 0;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = useCallback((category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleFormSubmit = async (data: CategoryFormValues) => {
    try {
      if (editingCategory) {
        const res = await updateMutation.mutateAsync({
          id: editingCategory.id,
          data,
        });
        message.success(res?.message || "Cập nhật loại hàng thành công");
      } else {
        const res = await createMutation.mutateAsync(data);
        message.success(res?.message || "Thêm loại hàng mới thành công");
      }
      handleCloseModal();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Thao tác thất bại";
      message.error(msg);
    }
  };

  const handleDelete = useCallback(
    (category: Category) => {
      modal.confirm({
        title: "Xác nhận xoá loại hàng",
        content: `Bạn có chắc chắn muốn xoá loại hàng "${category.name}" (${category.code})? Hành động này không thể hoàn tác nếu danh mục đang chứa sản phẩm.`,
        okText: "Xoá",
        okType: "danger",
        cancelText: "Huỷ",
        onOk: async () => {
          try {
            const res = await deleteMutation.mutateAsync(category.id);
            message.success(
              (res as { message?: string })?.message ||
                "Xoá loại hàng thành công",
            );
          } catch (err: unknown) {
            const msg =
              err instanceof Error ? err.message : "Xoá loại hàng thất bại";
            message.error(msg);
          }
        },
      });
    },
    [deleteMutation, message, modal],
  );

  const columns: ColumnsType<Category> = useMemo(() => {
    const cols: ColumnsType<Category> = [
      {
        title: "ID",
        dataIndex: "id",
        key: "id",
        width: 70,
      },
      {
        title: "Mã loại hàng",
        dataIndex: "code",
        key: "code",
        width: 150,
        render: (code: string) => code,
      },
      {
        title: "Tên loại hàng",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Mô tả",
        dataIndex: "description",
        key: "description",
        render: (desc: string) =>
          desc ? desc : <span className={styles.emptyText}>Chưa có mô tả</span>,
      },
      {
        title: "PO phụ trách",
        key: "managedBy",
        render: (_: unknown, record: Category) => {
          if (record.managedBy) {
            return (
              <div className={styles.poCell}>
                <span className={styles.poName}>
                  {record.managedBy.fullName || record.managedBy.username}
                </span>
              </div>
            );
          }
          return "Chưa phân công";
        },
      },
      {
        title: "Số sản phẩm",
        dataIndex: "productCount",
        key: "productCount",
        width: 120,
        render: (count?: number) => count ?? 0,
      },
      {
        title: "Ngày tạo",
        dataIndex: "createdAt",
        key: "createdAt",
        width: 160,
        render: (date?: string) => formatDateTime(date),
      },
      {
        title: "Thao tác",
        key: "actions",
        width: 130,
        render: (_: unknown, record: Category) => (
          <TableActions
            onEdit={() => handleOpenEditModal(record)}
            onDelete={() => handleDelete(record)}
          />
        ),
      },
    ];

    return cols;
  }, [handleOpenEditModal, handleDelete]);

  const poFilterOptions = useMemo(() => {
    const base = [{ value: "all", label: "Tất cả PO" }];
    const items = poUsers.map((u) => ({
      value: String(u.id),
      label: `${u.username} (${u.role})`,
    }));
    return [...base, ...items];
  }, [poUsers]);

  return (
    <AdminPageContainer
      title="Quản lý danh mục"
      extra={
        <ActionButton onClick={handleOpenAddModal}>
          + Thêm danh mục
        </ActionButton>
      }
    >
      <TableFilterBar>
        <FilterSelect
          prefixLabel="PO phụ trách:"
          value={(query.managedByUserId as string) || "all"}
          onChange={(val) =>
            updateQuery({
              managedByUserId: val === "all" ? undefined : val,
            })
          }
          options={poFilterOptions}
        />
      </TableFilterBar>

      <DataTable<Category>
        columns={columns}
        dataSource={categories}
        loading={isLoading || isFetching}
        rowKey="id"
        total={total}
        resourceName="loại hàng"
        pagination={{
          current: query.page,
          pageSize: query.pageSize,
          total: total,
          onChange: (page, pageSize) => updateQuery({ page, pageSize }),
        }}
        onChange={handleTableChange}
      />

      <CategoryFormModal
        open={isModalOpen}
        category={editingCategory}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        loading={createMutation.isPending || updateMutation.isPending}
      />
    </AdminPageContainer>
  );
}
