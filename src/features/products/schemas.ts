import { z } from "zod";

export const productSchema = z.object({
  name: z.string().trim().min(1, "Tên sản phẩm là bắt buộc"),
  price: z.number("Giá là bắt buộc").gt(0, "Giá phải lớn hơn 0"),
  stock: z
    .number("Tồn kho là bắt buộc")
    .int("Tồn kho phải là số nguyên")
    .min(0, "Tồn kho phải lớn hơn hoặc bằng 0"),
  status: z.enum(["ACTIVE", "INACTIVE"]),
  categoryId: z.number().nullable().optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
