import { useMutation, useQuery } from "@tanstack/react-query";
import { reportsApi } from "./api";
import { ExportReportInput } from "./types";

export const REPORT_KEYS = {
  all: ["reports"] as const,
  parameters: () => [...REPORT_KEYS.all, "parameters"] as const,
};

export function useReportParameters() {
  return useQuery({
    queryKey: REPORT_KEYS.parameters(),
    queryFn: () => reportsApi.getParameters(),
  });
}

export function useExportReport() {
  return useMutation({
    mutationFn: (data: ExportReportInput) => reportsApi.exportReport(data),
  });
}
