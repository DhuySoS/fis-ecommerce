export interface ReportParamResponse {
  name: string;
  dataType: "DATE" | "LONG" | "INTEGER" | "DECIMAL" | "STRING" | string;
  required: boolean;
  formatPattern?: string;
  validationRules?: string;
}

export interface ReportDefinitionResponse {
  code: string;
  name: string;
  params: ReportParamResponse[];
}

export interface ExportReportInput {
  reportCode?: string;
  format: "PDF" | "XLSX";
  params: Record<string, unknown>;
}

export interface ExportReportResult {
  blob: Blob;
  fileName: string;
  contentType: string;
}

export interface ReportParamError {
  param: string;
  reason:
    | "REQUIRED"
    | "RANGE_INVALID"
    | "RANGE_TOO_LONG"
    | "INVALID_FORMAT"
    | "INVALID_TYPE"
    | "NOT_FOUND"
    | string;
  expected?: string;
}
