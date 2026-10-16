import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_ROUTES = ["/login", "/register", "/auth", "/set-password"];

// Danh sách các route trong khu vực Admin mà Product Owner (PO) được phép truy cập
const PRODUCT_OWNER_ALLOWED_ROUTES = [
  "/admin/dashboard",
  "/admin/products",
  "/admin/categories",
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Lấy refreshToken và role từ Cookie để xác thực phiên đăng nhập
  const token = request.cookies.get("refreshToken")?.value;
  const role = request.cookies.get("role")?.value;

  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  const isAdminRole = role === "ADMIN" || role === "PRODUCT_OWNER";

  // 1. Khi chưa có token: Mặc định đá ra /login (ngoại trừ các trang login/register/auth/set-password)
  if (!token) {
    if (isAuthRoute) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 2. Khi đã đăng nhập:
  // Nếu truy cập vào các trang auth (/login, /register, /auth) hoặc trang chủ "/"
  // Không tự động redirect nếu đang truy cập /set-password
  const isAuthRedirectRoute = ["/login", "/register", "/auth"].some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (isAuthRedirectRoute || pathname === "/") {
    const destination = isAdminRole ? "/admin/dashboard" : "/orders/new";
    return NextResponse.redirect(new URL(destination, request.url));
  }

  // Nếu là Customer mà truy cập vào khu vực Admin (/admin/*) thì đẩy sang shop
  if (pathname.startsWith("/admin") && !isAdminRole) {
    return NextResponse.redirect(new URL("/orders/new", request.url));
  }

  // Product Owner chỉ được truy cập các route được cho phép trong khu vực Admin
  if (role === "PRODUCT_OWNER") {
    if (pathname === "/orders/new") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    const isAllowedForPO = PRODUCT_OWNER_ALLOWED_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`),
    );
    if (pathname.startsWith("/admin") && !isAllowedForPO) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
