import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_ROUTES = ["/login", "/register", "/auth"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Kiểm tra refreshToken và role trong Cookie để xác thực phiên đăng nhập
  const token = request.cookies.get("refreshToken")?.value;
  const role = request.cookies.get("role")?.value;

  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // 1. Đã đăng nhập (có token) mà truy cập vào các trang đăng nhập / đăng ký
  if (isAuthRoute && token) {
    const from = request.nextUrl.searchParams.get("from");
    if (
      from &&
      from.startsWith("/") &&
      !AUTH_ROUTES.some((r) => from.startsWith(r))
    ) {
      return NextResponse.redirect(new URL(from, request.url));
    }

    const destination =
      role === "ADMIN" || role === "PRODUCT_OWNER"
        ? "/admin/orders"
        : "/orders/new";
    return NextResponse.redirect(new URL(destination, request.url));
  }

  // 2. Bảo vệ khu vực Admin
  if (pathname.startsWith("/admin")) {
    // Chưa đăng nhập mà truy cập /admin/* thì chuyển về /login
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Đã đăng nhập nhưng không có quyền Admin/Product Owner thì chuyển về trang khách hàng
    if (role && role !== "ADMIN" && role !== "PRODUCT_OWNER") {
      return NextResponse.redirect(new URL("/orders/new", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/login",
    "/login/:path*",
    "/register",
    "/register/:path*",
    "/auth",
    "/auth/:path*",
  ],
};
