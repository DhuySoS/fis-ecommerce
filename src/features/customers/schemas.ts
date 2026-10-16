import { z } from "zod";

export const customerSchema = z.object({
  name: z.string().trim().min(1, "Họ tên là bắt buộc"),
  email: z
    .string()
    .trim()
    .min(1, "Email là bắt buộc")
    .email("Email không đúng định dạng"),
  phone: z
    .string()
    .trim()
    .optional()
    .refine(
      (val) =>
        !val ||
        val.length === 0 ||
        /^(0|\+84)[35789][0-9]{8}$/.test(val.replace(/[\s.-]/g, "")),
      "Số điện thoại không hợp lệ",
    ),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;
