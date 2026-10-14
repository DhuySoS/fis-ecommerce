import { apiClient } from "@/lib/api-client";
import type { DashboardResponse, DashboardQueryParams } from "./types";

export const dashboardApi = {
  getDashboard: (params?: DashboardQueryParams): Promise<DashboardResponse> => {
    return apiClient.get("/admin/dashboard", { params });
  },
};
