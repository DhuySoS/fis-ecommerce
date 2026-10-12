export type ReportParamType = "date" | "integer" | "decimal" | "string" | "select";

export interface ReportParamOption {
  label: string;
  value: string | number;
}

export interface ReportParameterSchema {
  name: string;
  label: string;
  type: ReportParamType;
  required: boolean;
  options?: ReportParamOption[];
  defaultValue?: unknown;
}

export interface ExportReportInput {
  format: "pdf" | "xlsx";
  params: Record<string, unknown>;
}
