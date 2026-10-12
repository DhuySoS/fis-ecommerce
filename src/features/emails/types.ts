export type EmailStatus = "FAILED" | "PENDING" | "SENT";

export interface FailedEmail {
  id: number;
  recipient: string;
  emailType: string; // e.g. "ORDER_PAID"
  retryCount: number;
  lastError: string;
  createdAt: string;
  status: EmailStatus;
}

export interface EmailQueryParams {
  page?: number;
  pageSize?: number;
  status?: EmailStatus;
}

export interface EmailListResponse {
  items: FailedEmail[];
  total: number;
  page: number;
  pageSize: number;
}
