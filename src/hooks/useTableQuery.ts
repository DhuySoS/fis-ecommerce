"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import type { TableProps } from "antd";
import type { SorterResult } from "antd/es/table/interface";

export interface TableQueryParams {
  page: number;
  pageSize: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "ascend" | "descend";
  [key: string]: unknown;
}

export function useTableQuery<RecordType = Record<string, unknown>>(
  defaultPageSize = 20
) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = useMemo<TableQueryParams>(() => {
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(
      searchParams.get("pageSize") || String(defaultPageSize),
      10
    );
    const search = searchParams.get("search") || undefined;
    const sortBy = searchParams.get("sortBy") || undefined;
    const sortOrder = (searchParams.get("sortOrder") as
      | "ascend"
      | "descend"
      | undefined) || undefined;

    const extra: Record<string, unknown> = {};
    searchParams.forEach((value, key) => {
      if (!["page", "pageSize", "search", "sortBy", "sortOrder"].includes(key)) {
        extra[key] = value;
      }
    });

    return {
      page: isNaN(page) || page < 1 ? 1 : page,
      pageSize: isNaN(pageSize) || pageSize < 1 ? defaultPageSize : pageSize,
      search,
      sortBy,
      sortOrder,
      ...extra,
    };
  }, [searchParams, defaultPageSize]);

  const updateQuery = useCallback(
    (newParams: Partial<TableQueryParams>) => {
      const current = new URLSearchParams(searchParams.toString());

      // Tự động reset page về 1 nếu thay đổi bộ lọc hoặc tìm kiếm mà không truyền page
      const hasFilterOrSearchChange = Object.keys(newParams).some(
        (key) => key !== "page"
      );

      const paramsToApply: Partial<TableQueryParams> = {
        ...(newParams.page === undefined && hasFilterOrSearchChange
          ? { page: 1 }
          : {}),
        ...newParams,
      };

      Object.entries(paramsToApply).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") {
          current.delete(key);
        } else {
          current.set(key, String(value));
        }
      });

      router.replace(`${pathname}?${current.toString()}`);
    },
    [pathname, router, searchParams]
  );

  const handleTableChange: NonNullable<TableProps<RecordType>["onChange"]> =
    useCallback(
      (pagination, _filters, sorter) => {
        const newParams: Partial<TableQueryParams> = {
          page: pagination.current || 1,
          pageSize: pagination.pageSize || defaultPageSize,
        };

        const singleSorter = Array.isArray(sorter) ? sorter[0] : sorter;
        if (singleSorter && (singleSorter as SorterResult<RecordType>).field) {
          newParams.sortBy = String(
            (singleSorter as SorterResult<RecordType>).field
          );
          newParams.sortOrder = singleSorter.order || undefined;
        }

        updateQuery(newParams);
      },
      [defaultPageSize, updateQuery]
    );

  return {
    query,
    updateQuery,
    handleTableChange,
    pagination: {
      current: query.page,
      pageSize: query.pageSize,
      showSizeChanger: false,
    },
  };
}
