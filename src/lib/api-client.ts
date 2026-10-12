import axios, { AxiosError, AxiosResponse } from "axios";

export interface ApiErrorResponse {
  code?: string;
  message?: string;
  details?: Record<string, string>;
}

export class AppApiError extends Error {
  code?: string;
  status?: number;
  details?: Record<string, string>;

  constructor(
    message: string,
    status?: number,
    code?: string,
    details?: Record<string, string>
  ) {
    super(message);
    this.name = "AppApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

/**
 * 1 Axios instance dùng chung cho toàn bộ dự án
 */
export const apiClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error: AxiosError<ApiErrorResponse>) => {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      // Chuẩn hoá thông báo lỗi tiếng Việt thân thiện
      let message = data?.message || "Đã có lỗi xảy ra, vui lòng thử lại.";

      if (status === 400) {
        message = data?.message || "Dữ liệu yêu cầu không hợp lệ.";
      } else if (status === 404) {
        message = data?.message || "Không tìm thấy dữ liệu yêu cầu.";
      } else if (status === 409) {
        message = data?.message || "Dữ liệu bị xung đột hoặc đã tồn tại.";
      } else if (status === 503) {
        message = "Hệ thống máy chủ đang bận. Vui lòng thử lại sau giây lát.";
      } else if (status >= 500) {
        message = "Lỗi hệ thống máy chủ. Vui lòng liên hệ quản trị viên.";
      }

      return Promise.reject(
        new AppApiError(message, status, data?.code, data?.details)
      );
    }

    if (error.request) {
      return Promise.reject(
        new AppApiError(
          "Không thể kết nối đến máy chủ. Vui lòng kiểm tra đường truyền mạng.",
          0
        )
      );
    }

    return Promise.reject(
      new AppApiError(error.message || "Đã xảy ra lỗi không xác định.")
    );
  }
);
