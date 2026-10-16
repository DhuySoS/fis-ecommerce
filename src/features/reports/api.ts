import { apiClient } from "@/lib/api-client";
import type {
  ExportReportInput,
  ExportReportResult,
  ReportDefinitionResponse,
} from "./types";

export const reportsApi = {
  getReportDefinition: async (
    reportCode: string = "RPT_REVENUE_DAILY",
  ): Promise<ReportDefinitionResponse> => {
    const res = await apiClient.get<
      unknown,
      { data?: ReportDefinitionResponse } | ReportDefinitionResponse
    >(`/reports/${reportCode}`);

    if (res && typeof res === "object" && "data" in res && res.data) {
      return res.data;
    }
    return res as ReportDefinitionResponse;
  },

  exportReport: async (
    data: ExportReportInput,
  ): Promise<ExportReportResult> => {
    const reportCode = data.reportCode || "RPT_REVENUE_DAILY";
    const res = await apiClient.post<unknown, ExportReportResult>(
      `/reports/${reportCode}/export`,
      {
        format: data.format,
        params: data.params,
      },
      {
        responseType: "blob",
      },
    );
    return res;
  },
};
