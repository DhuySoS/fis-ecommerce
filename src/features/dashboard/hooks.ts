import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "./api";

export const DASHBOARD_KEYS = {
  all: ["dashboard"] as const,
  revenue: (date: string) => [...DASHBOARD_KEYS.all, "revenue", date] as const,
  orderStatuses: (date: string) =>
    [...DASHBOARD_KEYS.all, "orderStatuses", date] as const,
  topProducts: (date: string) =>
    [...DASHBOARD_KEYS.all, "topProducts", date] as const,
  lowStock: () => [...DASHBOARD_KEYS.all, "lowStock"] as const,
};

export function useDashboardRevenue(date: string) {
  return useQuery({
    queryKey: DASHBOARD_KEYS.revenue(date),
    queryFn: () => dashboardApi.getRevenue(date),
  });
}

export function useDashboardOrderStatuses(date: string) {
  return useQuery({
    queryKey: DASHBOARD_KEYS.orderStatuses(date),
    queryFn: () => dashboardApi.getOrderStatuses(date),
  });
}

export function useDashboardTopProducts(date: string) {
  return useQuery({
    queryKey: DASHBOARD_KEYS.topProducts(date),
    queryFn: () => dashboardApi.getTopProducts(date),
  });
}

export function useDashboardLowStock() {
  return useQuery({
    queryKey: DASHBOARD_KEYS.lowStock(),
    queryFn: () => dashboardApi.getLowStockProducts(),
  });
}
