import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import {
  getAccessToken,
  getRefreshToken,
  saveAuthTokens,
  clearAuthTokens,
} from "./token";

export interface ApiErrorResponse {
  code?: string;
  message?: string;
  details?: Record<string, string>;
  errors?: Array<{ param: string; reason: string; expected?: string }>;
}

export class AppApiError extends Error {
  code?: string;
  status?: number;
  details?: Record<string, string>;
  errors?: Array<{ param: string; reason: string; expected?: string }>;

  constructor(
    message: string,
    status?: number,
    code?: string,
    details?: Record<string, string>,
    errors?: Array<{ param: string; reason: string; expected?: string }>
  ) {
    super(message);
    this.name = "AppApiError";
    this.status = status;
    this.code = code;
    this.details = details;
    this.errors = errors;
  }
}

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

/**
 * Axios instance dùng chung cho toàn bộ dự án
 */
export const apiClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// 1. Request Interceptor: Tự động đính kèm accessToken vào header
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Hàng đợi xử lý khi nhiều request gặp 401 cùng lúc
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// 2. Response Interceptor: Chuẩn hóa dữ liệu trả về và tự động Refresh Token
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Nếu request yêu cầu blob, trích xuất filename từ content-disposition
    if (response.config.responseType === "blob") {
      const disposition =
        response.headers["content-disposition"] ||
        response.headers["Content-Disposition"];
      let fileName = "";
      if (disposition) {
        const match = disposition.match(/filename=["']?([^"';]+)["']?/i);
        if (match && match[1]) {
          fileName = decodeURIComponent(match[1]);
        }
      }
      return {
        blob: response.data as Blob,
        fileName,
        contentType: response.headers["content-type"],
      };
    }
    return response.data;
  },
  async (error: AxiosError<ApiErrorResponse | Blob>) => {
    // Nếu responseType là blob nhưng response trả về lỗi (JSON), đọc text từ blob để parse JSON
    if (
      error.response &&
      typeof Blob !== "undefined" &&
      error.response.data instanceof Blob
    ) {
      try {
        const text = await error.response.data.text();
        const json = JSON.parse(text);
        error.response.data = json;
      } catch {
        // bỏ qua nếu không parse được json
      }
    }

    const originalRequest = error.config as CustomAxiosRequestConfig | undefined;

    if (error.response && originalRequest) {
      const status = error.response.status;
      const data = error.response.data as ApiErrorResponse | undefined;
      const url = originalRequest.url || "";

      // Tự động refresh token khi gặp 401 (ngoại trừ các endpoint xác thực /auth/)
      const isAuthUrl = url.includes("/auth/");
      if (status === 401 && !originalRequest._retry && !isAuthUrl) {
        if (isRefreshing) {
          return new Promise<string>((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((newToken) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
              }
              return apiClient(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          clearAuthTokens();
          return Promise.reject(
            new AppApiError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.", 401)
          );
        }

        try {
          const res = await axios.post(
            "/api/auth/refresh-token",
            {},
            {
              headers: {
                Authorization: `Bearer ${refreshToken}`,
              },
            }
          );

          const payload = res.data?.data || res.data;
          const newAccessToken = payload?.accessToken;
          const newRefreshToken = payload?.refreshToken || refreshToken;

          if (newAccessToken) {
            saveAuthTokens({
              accessToken: newAccessToken,
              refreshToken: newRefreshToken,
            });

            processQueue(null, newAccessToken);

            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            }

            return apiClient(originalRequest);
          } else {
            throw new Error("Không thể cấp lại token mới");
          }
        } catch (refreshErr) {
          processQueue(refreshErr, null);
          clearAuthTokens();
          return Promise.reject(
            new AppApiError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.", 401)
          );
        } finally {
          isRefreshing = false;
        }
      }

      // Ưu tiên thông báo từ backend trước (data?.message hoặc data?.error), nếu không có mới dùng thông báo mặc định
      const beMessage =
        data?.message ||
        (typeof (data as Record<string, unknown>)?.error === "string"
          ? ((data as Record<string, unknown>).error as string)
          : null);

      const message =
        beMessage ||
        (status === 400
          ? "Dữ liệu yêu cầu không hợp lệ."
          : status === 401
          ? "Tài khoản hoặc mật khẩu không chính xác."
          : status === 403
          ? "Bạn không có quyền thực hiện thao tác này."
          : status === 404
          ? "Không tìm thấy dữ liệu yêu cầu."
          : status === 409
          ? "Dữ liệu bị xung đột hoặc đã tồn tại."
          : status === 503
          ? "Hệ thống máy chủ đang bận. Vui lòng thử lại sau giây lát."
          : status >= 500
          ? "Lỗi hệ thống máy chủ. Vui lòng liên hệ quản trị viên."
          : "Đã có lỗi xảy ra, vui lòng thử lại.");

      return Promise.reject(
        new AppApiError(
          message,
          status,
          data?.code,
          data?.details,
          data?.errors
        )
      );
    }

    // Lỗi mạng hoặc không có phản hồi từ máy chủ
    if (error.request) {
      return Promise.reject(
        new AppApiError("Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại mạng.", 0)
      );
    }

    return Promise.reject(new AppApiError(error.message));
  }
);
