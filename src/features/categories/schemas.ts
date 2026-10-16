import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Tên loại hàng là bắt buộc")
    .max(255, "Tên không quá 255 ký tự"),
  code: z
    .string()
    .trim()
    .min(1, "Mã loại hàng là bắt buộc")
    .max(100, "Mã không quá 100 ký tự")
    .regex(
      /^[A-Za-z0-9_-]+$/,
      "Mã chỉ chứa chữ cái, số, dấu gạch dưới hoặc gạch ngang",
    ),
  description: z.string().trim().optional(),
  managedByUserId: z.number().nullable().optional(),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
