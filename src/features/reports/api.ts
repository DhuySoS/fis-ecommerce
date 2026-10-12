import { apiClient } from "@/lib/api-client";
import { ExportReportInput, ReportParameterSchema } from "./types";

export const reportsApi = {
  getParameters: (): Promise<ReportParameterSchema[]> => {
    return apiClient.get("/admin/reports/parameters");
  },

  exportReport: async (data: ExportReportInput): Promise<Blob> => {
    // Gọi tải file với responseType là blob
    const response = await apiClient.post("/admin/reports/export", data, {
      responseType: "blob",
    });
    return response as unknown as Blob;
  },
};
