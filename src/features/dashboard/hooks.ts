import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "./api";

export const DASHBOARD_KEYS = {
  all: ["dashboard"] as const,
  detail: (date: string) => [...DASHBOARD_KEYS.all, date] as const,
};

export function useDashboard(date: string) {
  return useQuery({
    queryKey: DASHBOARD_KEYS.detail(date),
    queryFn: async () => {
      // Đảm bảo có độ trễ tối thiểu ~450ms để hiệu ứng Skeleton loading hiển thị rõ ràng, mượt mà
      const [res] = await Promise.all([
        dashboardApi.getDashboard({ date, mode: "parallel" }),
        new Promise((resolve) => setTimeout(resolve, 450)),
      ]);
      return res;
    },
  });
}

export function useDashboardRevenue(date: string) {
  const query = useDashboard(date);
  const isFailed =
    query.isError ||
    Boolean(query.data?.failedParts?.includes("revenueToday")) ||
    (query.isSuccess && query.data?.revenueToday === null);

  return {
    data: query.data?.revenueToday ?? null,
    isLoading: query.isLoading || query.isFetching,
    isError: !query.isFetching && isFailed,
    refetch: query.refetch,
  };
}

export function useDashboardOrderStatuses(date: string) {
  const query = useDashboard(date);
  const isFailed =
    query.isError ||
    Boolean(query.data?.failedParts?.includes("orderCountByStatus")) ||
    (query.isSuccess && query.data?.orderCountByStatus === null);

  return {
    data: query.data?.orderCountByStatus ?? null,
    isLoading: query.isLoading || query.isFetching,
    isError: !query.isFetching && isFailed,
    refetch: query.refetch,
  };
}

export function useDashboardTopProducts(date: string) {
  const query = useDashboard(date);
  const isFailed =
    query.isError ||
    Boolean(query.data?.failedParts?.includes("top5Products")) ||
    (query.isSuccess && query.data?.top5Products === null);

  return {
    data: query.data?.top5Products ?? null,
    isLoading: query.isLoading || query.isFetching,
    isError: !query.isFetching && isFailed,
    refetch: query.refetch,
  };
}

export function useDashboardLowStock(date: string) {
  const query = useDashboard(date);
  const isFailed =
    query.isError ||
    Boolean(query.data?.failedParts?.includes("lowStockProducts")) ||
    (query.isSuccess && query.data?.lowStockProducts === null);

  return {
    data: query.data?.lowStockProducts ?? null,
    isLoading: query.isLoading || query.isFetching,
    isError: !query.isFetching && isFailed,
    refetch: query.refetch,
  };
}
