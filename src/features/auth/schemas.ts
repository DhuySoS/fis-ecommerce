import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "Tên đăng nhập là bắt buộc")
    .min(4, "Tên đăng nhập phải có ít nhất 4 ký tự")
    .max(50, "Tên đăng nhập không được quá 50 ký tự"),
  password: z
    .string()
    .min(1, "Mật khẩu là bắt buộc")
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .max(255, "Mật khẩu không được quá 255 ký tự"),
});

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Họ và tên là bắt buộc")
    .max(100, "Họ và tên không được vượt quá 100 ký tự"),
  username: z
    .string()
    .trim()
    .min(1, "Tên đăng nhập là bắt buộc")
    .min(4, "Tên đăng nhập phải từ 4 đến 50 ký tự")
    .max(50, "Tên đăng nhập phải từ 4 đến 50 ký tự"),
  email: z
    .string()
    .trim()
    .min(1, "Email là bắt buộc")
    .email("Email không đúng định dạng")
    .max(100, "Email không được vượt quá 100 ký tự"),
  password: z
    .string()
    .min(1, "Mật khẩu là bắt buộc")
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .max(255, "Mật khẩu không được quá 255 ký tự"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;

export const setPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, "Mật khẩu mới là bắt buộc")
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .max(50, "Mật khẩu không được quá 50 ký tự"),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận lại mật khẩu"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export type SetPasswordFormValues = z.infer<typeof setPasswordSchema>;
