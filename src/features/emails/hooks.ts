import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { emailsApi } from "./api";
import { EmailQueryParams } from "./types";

export const EMAIL_KEYS = {
  all: ["emails"] as const,
  lists: () => [...EMAIL_KEYS.all, "list"] as const,
  list: (params?: EmailQueryParams) => [...EMAIL_KEYS.lists(), params] as const,
};

export function useFailedEmails(params?: EmailQueryParams) {
  return useQuery({
    queryKey: EMAIL_KEYS.list(params),
    queryFn: () => emailsApi.getFailedEmails(params),
  });
}

export function useResendEmail() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => emailsApi.resendEmail(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EMAIL_KEYS.lists() });
    },
  });
}
