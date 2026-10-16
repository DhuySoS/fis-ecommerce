import dayjs from "dayjs";
import type { ReportParamError, ReportParamResponse } from "./types";

/**
 * Bảng ánh xạ nhãn hiển thị của các tham số báo cáo
 */
export const REPORT_PARAM_LABELS: Record<string, string> = {
  fromDate: "Từ ngày",
  toDate: "Đến ngày",
  customerId: "Khách hàng",
  minAmount: "Số tiền tối thiểu",
  maxAmount: "Số tiền tối đa",
  status: "Trạng thái",
};

/**
 * Lấy nhãn hiển thị tiếng Việt cho tham số báo cáo.
 * Nếu tham số mới chưa có trong từ điển thì tự động chuyển camelCase sang Title Case.
 */
export function getParamLabel(param: ReportParamResponse): string {
  if (REPORT_PARAM_LABELS[param.name]) {
    return REPORT_PARAM_LABELS[param.name];
  }
  return param.name
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
}

/**
 * Ánh xạ mã lỗi (reason) từ Backend sang câu thông báo tiếng Việt theo yêu cầu giao diện
 */
export function mapReportParamErrorReason(
  reason: string,
  expected?: string,
): string {
  switch (reason) {
    case "REQUIRED":
      return "Vui lòng nhập trường này";
    case "RANGE_INVALID":
      return "Đến ngày phải ≥ Từ ngày";
    case "RANGE_TOO_LONG":
      return "Khoảng ngày tối đa 92 ngày";
    case "INVALID_FORMAT":
      return `Định dạng không hợp lệ (${expected || "yyyy-MM-dd"})`;
    case "NOT_FOUND":
      return "Không tìm thấy dữ liệu tham chiếu";
    case "INVALID_TYPE":
      return "Kiểu dữ liệu không hợp lệ";
    default:
      return "Giá trị không hợp lệ";
  }
}

/**
 * Chuyển đổi danh sách lỗi tham số từ Backend thành dạng Record { [tên_tham_số]: thông_báo_lỗi }
 */
export function mapReportParamErrors(
  errors: ReportParamError[],
): Record<string, string> {
  const result: Record<string, string> = {};
  errors.forEach((err) => {
    result[err.param] = mapReportParamErrorReason(err.reason, err.expected);
  });
  return result;
}

/**
 * Validate form tham số báo cáo ở phía client trước khi gửi lên Backend
 */
export function validateReportForm(
  params: ReportParamResponse[],
  formValues: Record<string, unknown>,
): Record<string, string> {
  const newErrors: Record<string, string> = {};

  params.forEach((param) => {
    const val = formValues[param.name];
    if (param.required) {
      if (val === undefined || val === null || val === "") {
        newErrors[param.name] = "Vui lòng nhập trường này";
      }
    }
  });

  const fromVal = formValues["fromDate"];
  const toVal = formValues["toDate"];

  if (fromVal && toVal) {
    const from = dayjs(String(fromVal));
    const to = dayjs(String(toVal));

    if (to.isBefore(from, "day")) {
      newErrors["toDate"] = "Đến ngày phải ≥ Từ ngày";
    } else if (to.diff(from, "day") > 92) {
      newErrors["toDate"] = "Khoảng ngày tối đa 92 ngày";
    }
  }

  return newErrors;
}

/**
 * Chuẩn hóa giá trị từ form thành đối tượng params gửi lên API Backend
 */
export function buildReportExportPayload(
  params: ReportParamResponse[],
  formValues: Record<string, unknown>,
): Record<string, unknown> {
  const payloadParams: Record<string, unknown> = {};

  params.forEach((param) => {
    const val = formValues[param.name];
    if (val !== undefined && val !== null && val !== "" && val !== "all") {
      if (
        param.dataType === "LONG" ||
        param.dataType === "INTEGER" ||
        param.dataType === "DECIMAL"
      ) {
        payloadParams[param.name] = Number(val);
      } else {
        payloadParams[param.name] = val;
      }
    }
  });

  return payloadParams;
}
