import { apiClient } from "@/lib/api-client";
import { EmailListResponse, EmailQueryParams } from "./types";

export const emailsApi = {
  getFailedEmails: (params?: EmailQueryParams): Promise<EmailListResponse> => {
    return apiClient.get("/admin/emails", { params });
  },

  resendEmail: (id: number): Promise<{ success: boolean; message?: string }> => {
    return apiClient.post(`/admin/emails/${id}/resend`);
  },
};
