import { useMutation, useQuery } from "@tanstack/react-query";
import { reportsApi } from "./api";
import type { ExportReportInput } from "./types";

export const REPORT_KEYS = {
  all: ["reports"] as const,
  definition: (code: string) => [...REPORT_KEYS.all, "definition", code] as const,
};

export function useReportDefinition(code: string = "RPT_REVENUE_DAILY") {
  return useQuery({
    queryKey: REPORT_KEYS.definition(code),
    queryFn: () => reportsApi.getReportDefinition(code),
    staleTime: 5 * 60 * 1000,
  });
}

export function useExportReport() {
  return useMutation({
    mutationFn: (data: ExportReportInput) => reportsApi.exportReport(data),
  });
}
