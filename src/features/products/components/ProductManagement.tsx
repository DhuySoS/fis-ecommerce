"use client";

import React, { useMemo, useState } from "react";
import { App } from "antd";
import AdminPageContainer from "@/components/shared/AdminPageContainer";
import ActionButton from "@/components/shared/ActionButton";
import DataTable, { TableActions } from "@/components/shared/DataTable";
import TableFilterBar, {
  DebouncedSearchInput,
  FilterSelect,
} from "@/components/shared/TableFilterBar";
import type { ColumnsType } from "antd/es/table";
import StatusTag from "@/components/shared/StatusTag";
import { formatCurrency } from "@/lib/format";
import { useTableQuery } from "@/hooks/useTableQuery";
import { useMyManagedCategories } from "@/features/categories";
import type { Product, ProductStatus } from "../types";
import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "../hooks";
import ProductFormModal, { ProductFormValues } from "./ProductFormModal";

export default function ProductManagement() {
  const { message, modal } = App.useApp();
  const { query, updateQuery, handleTableChange } = useTableQuery<Product>();

  const {
    data: productData,
    isLoading,
    isFetching,
  } = useProducts({
    page: query.page,
    pageSize: query.pageSize,
    search: query.search,
    status: query.status as ProductStatus | undefined,
    categoryId: query.categoryId ? Number(query.categoryId) : undefined,
    sortBy: query.sortBy as "name" | "price" | undefined,
    sortOrder: query.sortOrder,
  });

  const { data: categories = [] } = useMyManagedCategories();
  const categoryFilterOptions = useMemo(() => {
    const base = [{ value: "all", label: "Tất cả danh mục" }];
    const items = categories.map((c) => ({
      value: String(c.id),
      label: c.name,
    }));
    return [...base, ...items];
  }, [categories]);

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  const products = productData?.items || [];
  const total = productData?.total || 0;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleFormSubmit = async (data: ProductFormValues) => {
    try {
      if (editingProduct) {
        const res = await updateMutation.mutateAsync({
          id: editingProduct.id,
          data,
        });
        message.success(res?.message || "Cập nhật sản phẩm thành công");
      } else {
        const res = await createMutation.mutateAsync(data);
        message.success(res?.message || "Thêm mới sản phẩm thành công");
      }
      handleCloseModal();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Thao tác thất bại";
      message.error(msg);
    }
  };

  const handleDelete = (product: Product) => {
    modal.confirm({
      title: "Xác nhận xóa sản phẩm",
      content: `Bạn có chắc chắn muốn xóa sản phẩm "${product.name}"?`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          const res = await deleteMutation.mutateAsync(product.id);
          message.success(
            (res as { message?: string })?.message || "Xóa sản phẩm thành công",
          );
        } catch (err: unknown) {
          const msg =
            err instanceof Error ? err.message : "Xóa sản phẩm thất bại";
          message.error(msg);
        }
      },
    });
  };

  const columns: ColumnsType<Product> = [
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Danh mục",
      dataIndex: "categoryName",
      key: "categoryName",
      render: (_: unknown, record: Product) =>
        record.categoryName ? record.categoryName : "-",
    },
    {
      title: "Giá (₫)",
      dataIndex: "price",
      key: "price",
      render: (price: number) => formatCurrency(price),
    },
    {
      title: "Tồn kho",
      dataIndex: "stock",
      key: "stock",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: ProductStatus) => <StatusTag status={status} />,
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_: unknown, record: Product) => (
        <TableActions
          onEdit={() => handleOpenEditModal(record)}
          onDelete={() => handleDelete(record)}
        />
      ),
    },
  ];

  const sortValue =
    query.sortBy && query.sortOrder
      ? `${query.sortBy}_${query.sortOrder === "ascend" ? "asc" : "desc"}`
      : "price_asc";

  const handleSortChange = (val: unknown) => {
    const sortStr = String(val);
    const [sortBy, order] = sortStr.split("_");
    updateQuery({
      sortBy,
      sortOrder: order === "asc" ? "ascend" : "descend",
    });
  };

  return (
    <AdminPageContainer
      title="Quản lý sản phẩm"
      extra={
        <ActionButton onClick={handleOpenAddModal}>
          + Thêm sản phẩm
        </ActionButton>
      }
    >
      <TableFilterBar>
        <DebouncedSearchInput
          placeholder="Tìm theo tên sản phẩm"
          value={query.search || ""}
          onChange={(search) => updateQuery({ search })}
        />

        <FilterSelect
          prefixLabel="Danh mục:"
          value={(query.categoryId as string) || "all"}
          onChange={(val) =>
            updateQuery({ categoryId: val === "all" ? undefined : val })
          }
          options={categoryFilterOptions}
        />

        <FilterSelect
          prefixLabel="Trạng thái:"
          value={(query.status as string) || "all"}
          onChange={(val) =>
            updateQuery({ status: val === "all" ? undefined : val })
          }
          options={[
            { value: "all", label: "Tất cả" },
            { value: "ACTIVE", label: "ACTIVE" },
            { value: "INACTIVE", label: "INACTIVE" },
          ]}
        />

        <FilterSelect
          prefixLabel="Sắp xếp:"
          value={sortValue}
          onChange={handleSortChange}
          options={[
            { value: "price_asc", label: "Giá tăng" },
            { value: "price_desc", label: "Giá giảm" },
            { value: "name_asc", label: "Tên A-Z" },
            { value: "name_desc", label: "Tên Z-A" },
          ]}
        />
      </TableFilterBar>

      <DataTable<Product>
        columns={columns}
        dataSource={products}
        loading={isLoading || isFetching}
        rowKey="id"
        total={total}
        resourceName="sản phẩm"
        pagination={{
          current: query.page,
          pageSize: query.pageSize,
          total: total,
          onChange: (page, pageSize) => updateQuery({ page, pageSize }),
        }}
        onChange={handleTableChange}
      />

      <ProductFormModal
        open={isModalOpen}
        product={editingProduct}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
      />
    </AdminPageContainer>
  );
}
