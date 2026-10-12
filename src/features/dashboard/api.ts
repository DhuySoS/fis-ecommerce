import { apiClient } from "@/lib/api-client";
import {
  DashboardLowStockProduct,
  DashboardOrderStatusCount,
  DashboardRevenue,
  DashboardTopProduct,
} from "./types";

export const dashboardApi = {
  getRevenue: (date: string): Promise<DashboardRevenue> => {
    return apiClient.get("/dashboard/revenue", { params: { date } });
  },

  getOrderStatuses: (date: string): Promise<DashboardOrderStatusCount[]> => {
    return apiClient.get("/dashboard/order-statuses", { params: { date } });
  },

  getTopProducts: (date: string): Promise<DashboardTopProduct[]> => {
    return apiClient.get("/dashboard/top-products", { params: { date } });
  },

  getLowStockProducts: (): Promise<DashboardLowStockProduct[]> => {
    return apiClient.get("/dashboard/low-stock");
  },
};
