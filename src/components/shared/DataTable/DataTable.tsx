"use client";

import React from "react";
import { Table, Pagination, Empty } from "antd";
import type { TableProps } from "antd";
import styles from "./DataTable.module.scss";

export interface DataTablePaginationConfig {
  current?: number;
  pageSize?: number;
  total?: number;
  onChange?: (page: number, pageSize: number) => void;
  pageSizeOptions?: (string | number)[];
  showSizeChanger?: boolean;
}

export interface DataTableProps<
  RecordType = Record<string, unknown>,
> extends Omit<TableProps<RecordType>, "pagination"> {
  /** Cấu hình phân trang hoặc truyền false nếu muốn tắt */
  pagination?: false | DataTablePaginationConfig;
  /** Tổng số lượng bản ghi (tiện dùng khi không bọc trong pagination object) */
  total?: number;
  /** Tên thực thể để sinh nhãn tự động 'Tổng {total} {resourceName}' (ví dụ: 'khách hàng', 'sản phẩm') */
  resourceName?: string;
}

export function DataTable<RecordType = Record<string, unknown>>({
  pagination,
  total,
  resourceName,
  className,
  locale,
  ...tableProps
}: DataTableProps<RecordType>) {
  const showPagination = pagination !== false;
  const paginationConfig = typeof pagination === "object" ? pagination : {};

  const current = paginationConfig.current ?? 1;
  const pageSize = paginationConfig.pageSize ?? 20;
  const effectiveTotal = paginationConfig.total ?? total;
  const showSizeChanger = paginationConfig.showSizeChanger ?? true;
  const pageSizeOptions = paginationConfig.pageSizeOptions ?? [
    "10",
    "20",
    "50",
    "100",
  ];

  const handlePageChange = (page: number, newPageSize: number) => {
    if (paginationConfig.onChange) {
      paginationConfig.onChange(page, newPageSize);
    } else if (tableProps.onChange) {
      tableProps.onChange(
        { current: page, pageSize: newPageSize, total: effectiveTotal ?? 0 },
        {},
        {},
        {
          currentDataSource: (tableProps.dataSource as RecordType[]) || [],
          action: "paginate",
        },
      );
    }
  };

  const renderTotalText = () => {
    if (effectiveTotal !== undefined) {
      return (
        <span>
          Tổng {effectiveTotal} {resourceName ? `${resourceName}` : ""}
        </span>
      );
    }
    return null;
  };

  const hasFooterContent =
    effectiveTotal !== undefined || (showPagination && (effectiveTotal ?? 0) > 0);

  return (
    <div className={styles.tableContainer}>
      <Table<RecordType>
        {...tableProps}
        pagination={false}
        className={`${styles.customTable} ${className || ""}`.trim()}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Không có dữ liệu"
            />
          ),
          ...locale,
        }}
      />

      {hasFooterContent && (
        <div className={styles.footerBar}>
          <div className={styles.footerLeft}>{renderTotalText()}</div>
          {showPagination && (effectiveTotal ?? 0) > 0 && (
            <div className={styles.footerRight}>
              <Pagination
                size="small"
                current={current}
                pageSize={pageSize}
                total={effectiveTotal}
                onChange={handlePageChange}
                showSizeChanger={showSizeChanger}
                pageSizeOptions={pageSizeOptions}
                locale={{
                  items_per_page: "/ trang",
                  jump_to: "Đến",
                  jump_to_confirm: "Xác nhận",
                  page: "Trang",
                  prev_page: "Trang trước",
                  next_page: "Trang sau",
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function TableActions({
  onEdit,
  onDelete,
  editText = "Sửa",
  deleteText = "Xoá",
  extra,
}: {
  onEdit?: () => void;
  onDelete?: () => void;
  editText?: React.ReactNode;
  deleteText?: React.ReactNode;
  extra?: React.ReactNode;
}) {
  return (
    <div className={styles.actionGroup}>
      {onEdit && (
        <button type="button" className={styles.actionLink} onClick={onEdit}>
          {editText}
        </button>
      )}
      {onEdit && onDelete && <span className={styles.actionDot}>·</span>}
      {onDelete && (
        <button
          type="button"
          className={`${styles.actionLink} ${styles.actionDelete}`}
          onClick={onDelete}
        >
          {deleteText}
        </button>
      )}
      {extra}
    </div>
  );
}

export default DataTable;
